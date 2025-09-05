from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from passlib.hash import bcrypt
from database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    knox_id = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=True)  # 사용자 이름
    team_name = Column(String, nullable=True)  # 팀명
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    team_members = relationship("TeamMember", back_populates="account", cascade="all, delete-orphan")
    # Aidea와의 관계
    aideas = relationship("Aidea", back_populates="account", cascade="all, delete-orphan")

    def verify_password(self, password: str) -> bool:
        return bcrypt.verify(password, self.hashed_password)

class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)  # Foreign key linking team member to their Account
    name = Column(String, nullable=False)  # 팀원 이름
    knox_id = Column(String, nullable=False)  # 팀원 Knox ID
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 계정과의 관계
    account = relationship("Account", back_populates="team_members")

class Aidea(Base):
    __tablename__ = "aideas"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    project = Column(String, nullable=False)  # 프로젝트 이름
    persona = Column(Text, nullable=True)  # 페르소나
    problem = Column(Text, nullable=True)  # 문제 정의
    solution = Column(Text, nullable=True)  # 솔루션
    data_sources = Column(Text, nullable=True)  # 데이터 소스
    scenario = Column(Text, nullable=True)  # 시나리오
    workflow = Column(Text, nullable=True)  # 워크플로우
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # 계정과의 관계
    account = relationship("Account", back_populates="aideas")
