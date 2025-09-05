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
    service_name: Optional[str] = None
    persona: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    data_sources: Optional[str] = None
    tools: Optional[str] = None
    state_memory: Optional[str] = None
    actions: Optional[str] = None
    risk: Optional[str] = None
    benefits: Optional[str] = None
    plan: Optional[str] = None

# Aidea 스키마
class AideaCreate(BaseModel):
    service_name: str
    persona: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    data_sources: Optional[str] = None
    tools: Optional[str] = None
    state_memory: Optional[str] = None
    actions: Optional[str] = None
    risk: Optional[str] = None
    benefits: Optional[str] = None
    plan: Optional[str] = None

class AideaUpdate(BaseModel):
    service_name: Optional[str] = None
    persona: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    data_sources: Optional[str] = None
    tools: Optional[str] = None
    state_memory: Optional[str] = None
    actions: Optional[str] = None
    risk: Optional[str] = None
    benefits: Optional[str] = None
    plan: Optional[str] = None

class AideaResponse(BaseModel):
    id: int
    account_id: int
    service_name: str
    persona: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    data_sources: Optional[str] = None
    tools: Optional[str] = None
    state_memory: Optional[str] = None
    actions: Optional[str] = None
    risk: Optional[str] = None
    benefits: Optional[str] = None
    plan: Optional[str] = None
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