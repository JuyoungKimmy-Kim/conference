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
    department: Optional[str] = None  # 부서는 선택사항
    team_members: List[TeamMemberCreate] = []
    # Aidea 정보
    project: Optional[str] = None
    target_user: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    data_sources: Optional[str] = None
    scenario: Optional[str] = None
    workflow: Optional[str] = None
    benefit: Optional[str] = None  # 기대효과 필드 추가

# Aidea 스키마
class AideaCreate(BaseModel):
    project: str
    target_user: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    data_sources: Optional[str] = None
    scenario: Optional[str] = None
    workflow: Optional[str] = None
    benefit: Optional[str] = None  # 기대효과 필드 추가

class AideaUpdate(BaseModel):
    project: Optional[str] = None
    target_user: Optional[str] = None
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
    target_user: Optional[str] = None
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
    department: Optional[str] = None  # 부서 필드 추가
    created_at: datetime
    updated_at: Optional[datetime] = None
    team_members: List[TeamMemberResponse] = []
    aideas: List[AideaResponse] = []

    class Config:
        from_attributes = True

# 관리자 스키마
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    message: str
    token: str

class AccountListResponse(BaseModel):
    accounts: List[AccountResponse]
    total: int

# Judge 스키마
class JudgeLogin(BaseModel):
    judge_id: str
    password: str

class JudgeResponse(BaseModel):
    id: int
    judge_id: str
    name: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProjectWithAccount(BaseModel):
    account: AccountResponse
    team_members: List[TeamMemberResponse]
    aidea: AideaResponse
    is_evaluated: bool = False  # 평가 여부 추가

    class Config:
        from_attributes = True

# Evaluation 스키마
class EvaluationCreate(BaseModel):
    aidea_id: int
    judge_id: int
    innovation_score: int
    feasibility_score: int
    effectiveness_score: int

class EvaluationResponse(BaseModel):
    id: int
    aidea_id: int
    judge_id: int
    innovation_score: int
    feasibility_score: int
    effectiveness_score: int
    total_score: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    judge: JudgeResponse

    class Config:
        from_attributes = True

class AccountWithEvaluations(AccountResponse):
    evaluations: List[EvaluationResponse] = []

    class Config:
        from_attributes = True
