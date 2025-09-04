from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from models import Account

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