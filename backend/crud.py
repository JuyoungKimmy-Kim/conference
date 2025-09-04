from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from models import Account, TeamMember
from schemas import AccountRegister, TeamMemberCreate

# Account CRUD
def get_account_by_knox_id(db: Session, knox_id: str):
    return db.query(Account).filter(Account.knox_id == knox_id).first()

def create_or_update_account(db: Session, knox_id: str, password: str):
    hashed = bcrypt.hash(password)
    account = get_account_by_knox_id(db, knox_id)
    if account:
        account.hashed_password = hashed
        db.add(account)
        db.commit()
        db.refresh(account)
        return account
    account = Account(knox_id=knox_id, hashed_password=hashed)
    db.add(account)
    db.commit()
    db.refresh(account)
    return account

def update_account_registration(db: Session, knox_id: str, registration_data: AccountRegister):
    account = get_account_by_knox_id(db, knox_id)
    if not account:
        raise ValueError("Account not found")
    
    account.name = registration_data.name
    account.team_name = registration_data.team_name
    account.aidea = registration_data.aidea
    
    # To-Do: 올바른 방식인지 고민 필요
    # 기존 팀원 삭제 및 추가
    db.query(TeamMember).filter(TeamMember.account_id == account.id).delete()
    for member_data in registration_data.team_members:
        team_member = TeamMember(
            account_id=account.id,
            name=member_data.name,
            knox_id=member_data.knox_id
        )
        db.add(team_member)
    
    db.commit()
    db.refresh(account)
    return account