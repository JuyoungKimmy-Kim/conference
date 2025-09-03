from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# SQLite 데이터베이스 URL (개발용)
SQLALCHEMY_DATABASE_URL = "sqlite:///./devconf.db"

# PostgreSQL 데이터베이스 URL (프로덕션용)
# SQLALCHEMY_DATABASE_URL = os.getenv(
#     "DATABASE_URL",
#     "postgresql://user:password@localhost/devconf"
# )

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 