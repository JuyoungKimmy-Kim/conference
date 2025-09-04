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
    aidea = Column(Text, nullable=True)  # AIdea 제안서
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    team_members = relationship("TeamMember", back_populates="account", cascade="all, delete-orphan")

    def verify_password(self, password: str) -> bool:
        return bcrypt.verify(password, self.hashed_password)

class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)  # Foreign key linking team member to their Account
    name = Column(String, nullable=False)  # 팀원 이름
    knox_id = Column(String, nullable=False)  # 팀원 Knox ID
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    account = relationship("Account", back_populates="team_members")