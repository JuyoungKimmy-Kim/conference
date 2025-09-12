from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.hash import bcrypt
from models import Account, TeamMember, Aidea, Judge, Evaluation
from schemas import AccountRegister, TeamMemberCreate, AideaCreate, AideaUpdate

# Account CRUD
def get_account_by_knox_id(db: Session, knox_id: str):
    return db.query(Account).filter(Account.knox_id == knox_id).first()

def get_account_by_id(db: Session, account_id: int):
    return db.query(Account).filter(Account.id == account_id).first()

def create_or_update_account(db: Session, knox_id: str, password: str):
    hashed = bcrypt.hash(password)
    account = get_account_by_knox_id(db, knox_id)
    if account:
        account.hashed_password = hashed
        db.add(account)
        db.commit()
        db.refresh(account)
        return account
    
    try:
        account = Account(knox_id=knox_id, hashed_password=hashed)
        db.add(account)
        db.commit()
        db.refresh(account)
        return account
    except IntegrityError:
        # 동시에 같은 knox_id로 계정이 생성된 경우
        db.rollback()
        account = get_account_by_knox_id(db, knox_id)
        if account:
            if account.verify_password(password):
                return account
            else:
                raise ValueError("이미 존재하는 계정입니다. 비밀번호가 다릅니다.")
        else:
            raise Exception("계정 생성 중 예상치 못한 오류가 발생했습니다.")

def update_account_registration(db: Session, registration_data: AccountRegister):
    """
    계정 등록 정보를 업데이트합니다. 트랜잭션 안전성을 보장하기 위해
    원자적 연산을 사용합니다. 중간에 오류가 발생하면 모든 변경사항이 롤백됩니다.
    동일 계정으로 동시에 제출하는 경우 고려하지 않음. 
    """
    try:
        account = get_account_by_id(db, registration_data.id)
        if not account:
            raise ValueError(f"Account not found for knox_id: {registration_data.knox_id}")

        if getattr(registration_data, "knox_id", None) and account.knox_id != registration_data.knox_id:
            raise ValueError("요청의 knox_id가 계정 정보와 일치하지 않습니다.")
        
        # 입력 데이터 검증
        if not registration_data.name or not registration_data.name.strip():
            raise ValueError("이름은 필수입니다.")
        if not registration_data.team_name or not registration_data.team_name.strip():
            raise ValueError("팀명은 필수입니다.")
        if len(registration_data.team_members) >3:
            raise ValueError("팀원은 본인 포함 최대 4명까지 가능합니다.")
        knox_ids = [m.knox_id for m in registration_data.team_members]
        if registration_data.knox_id in knox_ids:
            raise ValueError("본인 Knox ID와 동일한 팀원을 추가할 수 없습니다.")
        if len(set(knox_ids)) != len(knox_ids):
            raise ValueError("동일한 Knox ID인 팀원이 2명이상 존재하여 중복됩니다.")
        
        # 계정 기본 정보 업데이트
        account.name = registration_data.name.strip()
        account.team_name = registration_data.team_name.strip()
        
        # 부서 정보 처리: 새로운 값이 있으면 업데이트, 없으면 기존 값 유지
        if hasattr(registration_data, 'department') and registration_data.department is not None:
            if registration_data.department.strip():
                account.department = registration_data.department.strip()
            # 빈 문자열이면 기존 값 유지 (변경하지 않음)
        # department가 없으면 기존 값 유지 (변경하지 않음)
        
        db.add(account)
        
        existing_members = db.query(TeamMember).filter(TeamMember.account_id == account.id).all()
        for member in existing_members:
            db.delete(member)

        for i, member_data in enumerate(registration_data.team_members):
            if not member_data.name or not member_data.name.strip():
                raise ValueError(f"팀원 {i+1}의 이름은 필수입니다.")
            if not member_data.knox_id or not member_data.knox_id.strip():
                raise ValueError(f"팀원 {i+1}의 knox_id는 필수입니다.")
            
            team_member = TeamMember(
                account_id=account.id,
                name=member_data.name.strip(),
                knox_id=member_data.knox_id.strip()
            )
            db.add(team_member)
        
        # 기존 Aidea 업데이트 또는 새로 생성
        existing_aidea = db.query(Aidea).filter(Aidea.account_id == account.id).first()
        
        if existing_aidea:
            # 기존 Aidea가 있으면 업데이트
            if registration_data.project and registration_data.project.strip():
                existing_aidea.project = registration_data.project.strip()
                existing_aidea.target_user = registration_data.target_user
                existing_aidea.problem = registration_data.problem
                existing_aidea.solution = registration_data.solution
                existing_aidea.data_sources = registration_data.data_sources
                existing_aidea.scenario = registration_data.scenario
                existing_aidea.workflow = registration_data.workflow
                existing_aidea.benefit = registration_data.benefit  # 기대효과 필드 추가
            else:
                # project가 비어있으면 기존 Aidea 삭제
                db.delete(existing_aidea)
        else:
            # 기존 Aidea가 없으면 새로 생성
            if registration_data.project and registration_data.project.strip():
                aidea = Aidea(
                    account_id=account.id,
                    project=registration_data.project.strip(),
                    target_user=registration_data.target_user,
                    problem=registration_data.problem,
                    solution=registration_data.solution,
                    data_sources=registration_data.data_sources,
                    scenario=registration_data.scenario,
                    workflow=registration_data.workflow,
                    benefit=registration_data.benefit  # 기대효과 필드 추가
                )
                db.add(aidea)

        db.commit()
        db.refresh(account)
        return account
        
    except ValueError as ve:
        db.rollback()
        raise ve
    except IntegrityError as ie:
        # 데이터베이스 무결성 오류 - 롤백 후 재발생
        db.rollback()
        raise ValueError(f"데이터 무결성 오류가 발생했습니다: {str(ie)}")
    except Exception as e:
        # 기타 예상치 못한 오류 - 롤백 후 재발생
        db.rollback()
        raise Exception(f"팀원 정보 업데이트 중 오류가 발생했습니다: {str(e)}")

# Aidea CRUD
def create_aidea(db: Session, account_id: int, aidea_data: AideaCreate):
    aidea = Aidea(
        account_id=account_id,
        project=aidea_data.project,
        target_user=aidea_data.target_user,
        problem=aidea_data.problem,
        solution=aidea_data.solution,
        data_sources=aidea_data.data_sources,
        scenario=aidea_data.scenario,
        workflow=aidea_data.workflow,
        benefit=aidea_data.benefit  # 기대효과 필드 추가
    )
    db.add(aidea)
    db.commit()
    db.refresh(aidea)
    return aidea

def get_aidea_by_id(db: Session, aidea_id: int):
    return db.query(Aidea).filter(Aidea.id == aidea_id).first()

def get_aideas_by_account(db: Session, account_id: int):
    return db.query(Aidea).filter(Aidea.account_id == account_id).all()

def update_aidea(db: Session, aidea_id: int, aidea_data: AideaUpdate):
    aidea = get_aidea_by_id(db, aidea_id)
    if not aidea:
        return None
    
    update_data = aidea_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(aidea, field, value)
    
    db.commit()
    db.refresh(aidea)
    return aidea

def delete_aidea(db: Session, aidea_id: int):
    aidea = get_aidea_by_id(db, aidea_id)
    if not aidea:
        return False
    
    db.delete(aidea)
    db.commit()
    return True

# 마이그레이션 스크립트 (migrate.py)
from sqlalchemy import text
from database import engine

def add_benefit_column():
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE aideas ADD COLUMN benefit TEXT"))
        conn.commit()
        print("benefit 컬럼이 성공적으로 추가되었습니다.")

# Judge CRUD
def get_judge_by_judge_id(db: Session, judge_id: str):
    return db.query(Judge).filter(Judge.judge_id == judge_id).first()

def get_judge_by_id(db: Session, judge_id: int):
    return db.query(Judge).filter(Judge.id == judge_id).first()

def create_judge(db: Session, judge_id: str, password: str, name: str):
    hashed = bcrypt.hash(password)
    judge = Judge(
        judge_id=judge_id,
        hashed_password=hashed,
        name=name
    )
    db.add(judge)
    db.commit()
    db.refresh(judge)
    return judge

def verify_judge_login(db: Session, judge_id: str, password: str):
    judge = get_judge_by_judge_id(db, judge_id)
    if not judge:
        return None
    if judge.verify_password(password):
        return judge
    return None

def get_all_projects_with_accounts(db: Session):
    """제출된 모든 Aidea 프로젝트와 계정 정보를 함께 가져옵니다."""
    return db.query(Account).outerjoin(Aidea).all()

def get_projects_with_aideas_only(db: Session):
    """Aidea가 있는 Account만 가져옵니다."""
    return db.query(Account).join(Aidea).all()

# Evaluation CRUD
def create_evaluation(db: Session, account_id: int, judge_id: int, innovation_score: int, feasibility_score: int, effectiveness_score: int):
    """평가를 생성합니다."""
    total_score = innovation_score + feasibility_score + effectiveness_score
    
    # 이미 같은 심사위원이 같은 계정을 평가했는지 확인
    existing_evaluation = db.query(Evaluation).filter(
        Evaluation.account_id == account_id,
        Evaluation.judge_id == judge_id
    ).first()
    
    if existing_evaluation:
        existing_evaluation.innovation_score = innovation_score
        existing_evaluation.feasibility_score = feasibility_score
        existing_evaluation.effectiveness_score = effectiveness_score
        existing_evaluation.total_score = total_score
        db.commit()
        db.refresh(existing_evaluation)
        return existing_evaluation
    else:
        evaluation = Evaluation(
            account_id=account_id,
            judge_id=judge_id,
            innovation_score=innovation_score,
            feasibility_score=feasibility_score,
            effectiveness_score=effectiveness_score,
            total_score=total_score
        )
        db.add(evaluation)
        db.commit()
        db.refresh(evaluation)
        return evaluation

def get_evaluations_by_account(db: Session, account_id: int):
    """특정 계정의 모든 평가를 가져옵니다."""
    return db.query(Evaluation).filter(Evaluation.account_id == account_id).all()

def get_evaluation_by_judge_and_account(db: Session, judge_id: int, account_id: int):
    """특정 심사위원이 특정 계정에 대해 한 평가를 가져옵니다."""
    return db.query(Evaluation).filter(
        Evaluation.judge_id == judge_id,
        Evaluation.account_id == account_id
    ).first()

def get_all_evaluations(db: Session):
    """모든 평가를 가져옵니다."""
    return db.query(Evaluation).all()

# Admin CRUD functions
def get_all_judges(db: Session):
    """모든 심사위원을 가져옵니다."""
    return db.query(Judge).all()

def create_judge_admin(db: Session, judge_data):
    """관리자가 심사위원을 생성합니다."""
    hashed = bcrypt.hash(judge_data.password)
    judge = Judge(
        judge_id=judge_data.judge_id,
        hashed_password=hashed,
        name=judge_data.name
    )
    db.add(judge)
    db.commit()
    db.refresh(judge)
    return judge

def update_judge_admin(db: Session, judge_id: int, judge_data):
    """관리자가 심사위원 정보를 수정합니다."""
    judge = get_judge_by_id(db, judge_id)
    if not judge:
        return None
    
    if judge_data.judge_id:
        judge.judge_id = judge_data.judge_id
    if judge_data.password:
        judge.hashed_password = bcrypt.hash(judge_data.password)
    if judge_data.name:
        judge.name = judge_data.name
    
    db.commit()
    db.refresh(judge)
    return judge

def delete_judge_admin(db: Session, judge_id: int):
    """관리자가 심사위원을 삭제합니다."""
    judge = get_judge_by_id(db, judge_id)
    if not judge:
        return False
    
    # 관련 평가도 함께 삭제
    db.query(Evaluation).filter(Evaluation.judge_id == judge_id).delete()
    db.delete(judge)
    db.commit()
    return True

def get_admin_stats(db: Session):
    """관리자 대시보드용 통계를 가져옵니다."""
    from sqlalchemy import func
    
    total_projects = db.query(Account).join(Aidea).count()
    total_judges = db.query(Judge).count()
    total_evaluations = db.query(Evaluation).count()
    
    # 평균 점수
    avg_score_result = db.query(func.avg(Evaluation.total_score)).scalar()
    average_score = round(avg_score_result, 2) if avg_score_result else 0
    
    # 부서별 프로젝트 수
    projects_by_department = {}
    department_stats = db.query(
        Account.department, 
        func.count(Aidea.id).label('count')
    ).join(Aidea).group_by(Account.department).all()
    
    for dept, count in department_stats:
        dept_name = dept if dept else "미입력"
        projects_by_department[dept_name] = count
    
    # 평가 상태별 통계
    evaluation_status = {
        "completed": 0,
        "pending": 0
    }
    
    # 각 프로젝트별로 평가 완료 여부 확인
    all_projects = db.query(Account).join(Aidea).all()
    for project in all_projects:
        has_evaluation = db.query(Evaluation).filter(
            Evaluation.account_id == project.id
        ).first()
        if has_evaluation:
            evaluation_status["completed"] += 1
        else:
            evaluation_status["pending"] += 1
    
    return {
        "total_projects": total_projects,
        "total_judges": total_judges,
        "total_evaluations": total_evaluations,
        "average_score": average_score,
        "projects_by_department": projects_by_department,
        "evaluation_status": evaluation_status
    }

def get_evaluations_with_project_info(db: Session):
    """평가 결과와 프로젝트 정보를 함께 가져옵니다."""
    evaluations = db.query(Evaluation).join(Account).join(Aidea).join(Judge).all()
    
    result = []
    for evaluation in evaluations:
        result.append({
            "id": evaluation.id,
            "account_id": evaluation.account_id,
            "judge_id": evaluation.judge_id,
            "innovation_score": evaluation.innovation_score,
            "feasibility_score": evaluation.feasibility_score,
            "effectiveness_score": evaluation.effectiveness_score,
            "total_score": evaluation.total_score,
            "created_at": evaluation.created_at,
            "updated_at": evaluation.updated_at,
            "project_name": evaluation.account.aideas[0].project if evaluation.account.aideas else "미입력",
            "team_name": evaluation.account.team_name or "미입력",
            "judge_name": evaluation.judge.name
        })
    
    return result

if __name__ == "__main__":
    add_benefit_column()
