from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# User 스키마
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    company: Optional[str] = None
    position: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# 컨퍼런스 등록 스키마
class ConferenceRegistration(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    company: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None
    track: Optional[str] = None
    dietary: Optional[str] = None
    agree_terms: bool
    agree_marketing: bool = False

class RegistrationResponse(ConferenceRegistration):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# 일정 스키마
class AgendaItem(BaseModel):
    day: str
    time: str
    title: str
    speaker: Optional[str] = None
    track: str
    type: str
    description: Optional[str] = None

class AgendaResponse(AgendaItem):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# 발표자 스키마
class SpeakerCreate(BaseModel):
    name: str
    title: str
    company: str
    bio: Optional[str] = None
    topic: str
    track: str
    image_url: Optional[str] = None

class SpeakerResponse(SpeakerCreate):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# 로그인 스키마
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# 토큰 스키마
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 