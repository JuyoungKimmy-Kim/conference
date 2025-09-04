from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Knox 계정 스키마
class AccountLogin(BaseModel):
    knox_id: str
    password: str

class AccountResponse(BaseModel):
    id: int
    knox_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True