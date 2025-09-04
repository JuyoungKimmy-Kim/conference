import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from unittest.mock import patch, MagicMock
from passlib.hash import bcrypt

from main import app
from database import get_db
from models import Base, Account
from schemas import AccountLogin, AccountResponse

# 테스트용 인메모리 SQLite 데이터베이스 설정
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 테스트 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

class TestLoginOrRegisterAccount:
    """login_or_register_account 함수 테스트 클래스"""
    
    def setup_method(self):
        """각 테스트 메서드 실행 전 데이터베이스 초기화"""
        # 테스트 데이터베이스 정리
        db = TestingSessionLocal()
        db.query(Account).delete()
        db.commit()
        db.close()
    
    def test_existing_account_login_success(self):
        """기존 계정 로그인 성공 테스트"""
        # Given: 기존 계정이 데이터베이스에 존재
        db = TestingSessionLocal()
        hashed_password = bcrypt.hash("password123")
        test_account = Account(
            knox_id="test_user",
            hashed_password=hashed_password
        )
        db.add(test_account)
        db.commit()
        db.close()
        
        # When: 올바른 knox_id와 password로 로그인 요청
        login_data = AccountLogin(knox_id="test_user", password="password123")
        response = client.post("/api/login", json=login_data.model_dump())
        
        # Then: 성공적으로 로그인되어 계정 정보 반환
        assert response.status_code == 200
        data = response.json()
        assert data["knox_id"] == "test_user"
        assert "id" in data
        assert "created_at" in data
    
    def test_existing_account_login_wrong_password(self):
        """기존 계정 로그인 실패 - 잘못된 패스워드 테스트"""
        # Given: 기존 계정이 데이터베이스에 존재
        db = TestingSessionLocal()
        hashed_password = bcrypt.hash("password123")
        test_account = Account(
            knox_id="test_user",
            hashed_password=hashed_password
        )
        db.add(test_account)
        db.commit()
        db.close()
        
        # When: 올바른 knox_id이지만 잘못된 password로 로그인 요청
        login_data = AccountLogin(knox_id="test_user", password="wrong_password")
        response = client.post("/api/login", json=login_data.model_dump())
        
        # Then: 401 Unauthorized 에러 반환
        assert response.status_code == 401
        assert response.json()["detail"] == "패스워드가 다릅니다."
    
    def test_new_account_registration(self):
        """새 계정 등록 테스트"""
        # Given: 존재하지 않는 knox_id
        
        # When: 새로운 knox_id와 password로 로그인 요청
        login_data = AccountLogin(knox_id="new_user", password="new_password")
        response = client.post("/api/login", json=login_data.model_dump())
        
        # Then: 새 계정이 생성되어 반환
        assert response.status_code == 200
        data = response.json()
        assert data["knox_id"] == "new_user"
        assert "id" in data
        assert "created_at" in data
        
        # 데이터베이스에 실제로 저장되었는지 확인
        db = TestingSessionLocal()
        saved_account = db.query(Account).filter(Account.knox_id == "new_user").first()
        assert saved_account is not None
        assert saved_account.verify_password("new_password")
        db.close()
    
    def test_empty_knox_id(self):
        """빈 knox_id 테스트"""
        # When: 빈 knox_id로 로그인 요청
        login_data = AccountLogin(knox_id="", password="password123")
        response = client.post("/api/login", json=login_data.model_dump())
        
        # Then: 새 계정이 생성됨 (빈 문자열도 유효한 knox_id로 처리)
        assert response.status_code == 200
        data = response.json()
        assert data["knox_id"] == ""
    
    def test_empty_password_returns_400(self):
        """빈 패스워드 테스트 - 400 에러 반환"""
        # When: 빈 패스워드로 로그인 요청
        login_data = AccountLogin(knox_id="test_user", password="")
        response = client.post("/api/login", json=login_data.model_dump())
        
        # Then: 400 Bad Request 에러 반환
        assert response.status_code == 400
        assert response.json()["detail"] == "패스워드는 필수입니다."
    
    def test_whitespace_only_password_returns_400(self):
        """공백만 있는 패스워드 테스트 - 400 에러 반환"""
        # When: 공백만 있는 패스워드로 로그인 요청
        login_data = AccountLogin(knox_id="test_user", password="   ")
        response = client.post("/api/login", json=login_data.model_dump())
        
        # Then: 400 Bad Request 에러 반환
        assert response.status_code == 400
        assert response.json()["detail"] == "패스워드는 필수입니다."
    
    def test_special_characters_in_credentials(self):
        """특수문자가 포함된 인증정보 테스트"""
        # When: 특수문자가 포함된 knox_id와 password로 로그인 요청
        login_data = AccountLogin(knox_id="user@domain.com", password="p@ssw0rd!")
        response = client.post("/api/login", json=login_data.model_dump())
        
        # Then: 새 계정이 생성되어 반환
        assert response.status_code == 200
        data = response.json()
        assert data["knox_id"] == "user@domain.com"
    
    def test_unicode_characters_in_credentials(self):
        """유니코드 문자가 포함된 인증정보 테스트"""
        # When: 유니코드 문자가 포함된 knox_id와 password로 로그인 요청
        login_data = AccountLogin(knox_id="사용자123", password="비밀번호!@#")
        response = client.post("/api/login", json=login_data.model_dump())
        
        # Then: 새 계정이 생성되어 반환
        assert response.status_code == 200
        data = response.json()
        assert data["knox_id"] == "사용자123"
    
    def test_long_credentials(self):
        """긴 인증정보 테스트"""
        # When: 매우 긴 knox_id와 password로 로그인 요청
        long_knox_id = "a" * 1000
        long_password = "b" * 1000
        login_data = AccountLogin(knox_id=long_knox_id, password=long_password)
        response = client.post("/api/login", json=login_data.model_dump())
        
        # Then: 새 계정이 생성되어 반환
        assert response.status_code == 200
        data = response.json()
        assert data["knox_id"] == long_knox_id
    
    @patch('main.get_account_by_knox_id')
    def test_database_error_handling(self, mock_get_account):
        """데이터베이스 에러 처리 테스트"""
        # Given: 데이터베이스 조회 시 예외 발생
        mock_get_account.side_effect = Exception("Database connection error")
        
        # When: 로그인 요청
        login_data = AccountLogin(knox_id="test_user", password="password123")
        
        # Then: 서버 에러 발생
        with pytest.raises(Exception):
            client.post("/api/login", json=login_data.model_dump())
    
    def test_existing_account_wrong_password_returns_401(self):
        """기존 계정이 있을 때 잘못된 패스워드로 로그인하면 401 에러 반환 테스트"""
        # Given: 기존 계정이 데이터베이스에 존재
        db = TestingSessionLocal()
        hashed_password = bcrypt.hash("old_password")
        test_account = Account(
            knox_id="test_user",
            hashed_password=hashed_password
        )
        db.add(test_account)
        db.commit()
        db.close()
        
        # When: 같은 knox_id로 다른 패스워드로 로그인 요청
        login_data = AccountLogin(knox_id="test_user", password="new_password")
        response = client.post("/api/login", json=login_data.model_dump())
        
        # Then: 401 Unauthorized 에러 반환 (패스워드 업데이트는 지원하지 않음)
        assert response.status_code == 401
        assert response.json()["detail"] == "패스워드가 다릅니다."
        
        # 데이터베이스에서 패스워드가 변경되지 않았는지 확인
        db = TestingSessionLocal()
        account = db.query(Account).filter(Account.knox_id == "test_user").first()
        assert account.verify_password("old_password")
        assert not account.verify_password("new_password")
        db.close()
