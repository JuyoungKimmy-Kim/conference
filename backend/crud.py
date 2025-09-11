from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.hash import bcrypt
from models import Account, TeamMember, Aidea, Judge
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

# 관리자용 CRUD 함수들
def get_all_accounts(db: Session, skip: int = 0, limit: int = 100):
    """모든 계정을 조회합니다."""
    return db.query(Account).offset(skip).limit(limit).all()

def get_all_aideas(db: Session, skip: int = 0, limit: int = 100):
    """모든 Aidea를 계정 정보와 함께 조회합니다."""
    return db.query(Aidea).join(Account).offset(skip).limit(limit).all()

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

if __name__ == "__main__":
    add_benefit_column()
