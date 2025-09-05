from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Knox 계정 스키마
class AccountLogin(BaseModel):
    knox_id: str
    password: str

class TeamMemberCreate(BaseModel):
    name: str
    knox_id: str

class AccountRegister(BaseModel):
    id: int
    knox_id: str
    name: str
    team_name: str
    team_members: List[TeamMemberCreate] = []
    # Aidea 정보
    project: Optional[str] = None
    persona: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    data_sources: Optional[str] = None
    scenario: Optional[str] = None
    workflow: Optional[str] = None
    benefit: Optional[str] = None  # 기대효과 필드 추가

# Aidea 스키마
class AideaCreate(BaseModel):
    project: str
    persona: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    data_sources: Optional[str] = None
    scenario: Optional[str] = None
    workflow: Optional[str] = None
    benefit: Optional[str] = None  # 기대효과 필드 추가

class AideaUpdate(BaseModel):
    project: Optional[str] = None
    persona: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    data_sources: Optional[str] = None
    scenario: Optional[str] = None
    workflow: Optional[str] = None
    benefit: Optional[str] = None

class AideaResponse(BaseModel):
    id: int
    account_id: int
    project: str
    persona: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    data_sources: Optional[str] = None
    scenario: Optional[str] = None
    workflow: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TeamMemberResponse(BaseModel):
    id: int
    name: str
    knox_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class AccountResponse(BaseModel):
    id: int
    knox_id: str
    name: Optional[str] = None
    team_name: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    team_members: List[TeamMemberResponse] = []
    aideas: List[AideaResponse] = []

    class Config:
        from_attributes = True
