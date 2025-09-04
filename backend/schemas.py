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
    knox_id: str
    name: str
    team_name: str
    aidea: Optional[str] = None
    team_members: List[TeamMemberCreate] = []

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
    aidea: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    team_members: List[TeamMemberResponse] = []

    class Config:
        from_attributes = True