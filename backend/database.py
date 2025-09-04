from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from typing import Generator
from dotenv import load_dotenv

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
if ENVIRONMENT not in ["development", "production"]:
    raise ValueError(f"Invalid ENVIRONMENT value: {ENVIRONMENT}. Must be 'development' or 'production'")

default_path = "/app/data/ssai_aidea_prod.db" if ENVIRONMENT == "production" else "./ssai_aidea_dev.db"
DB_PATH = os.path.abspath(os.getenv("DATABASE_PATH", default_path))

dirpath = os.path.dirname(DB_PATH)
if dirpath:
    os.makedirs(dirpath, exist_ok=True)


SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False, "timeout": 30},
)

if engine.url.get_backend_name() == "sqlite":
    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_connection, _):
        """SQLite 연결 시 PRAGMA 설정을 적용합니다."""
        try:
            cur = dbapi_connection.cursor()
            cur.execute("PRAGMA foreign_keys=ON")     # FK 제약조건 강제
            cur.execute("PRAGMA journal_mode=WAL")    # WAL 모드로 동시성/안전성 개선
            cur.execute("PRAGMA synchronous=NORMAL")  # 내구성↔성능 균형(기본 FULL보다 빠름)
            cur.close()
        except Exception as e:
            raise


SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, expire_on_commit=False)
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """데이터베이스 세션을 생성하고 관리합니다."""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        db.rollback()
        raise
    finally:
        db.close() 