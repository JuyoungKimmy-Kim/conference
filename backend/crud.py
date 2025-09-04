from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.hash import bcrypt
from models import Account, TeamMember
from schemas import AccountRegister, TeamMemberCreate

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
        account.aidea = registration_data.aidea
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