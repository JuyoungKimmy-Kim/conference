from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn

from database import get_db, engine
from models import Base
from schemas import (
    UserCreate, UserResponse, 
    ConferenceRegistration, RegistrationResponse,
    SpeakerCreate, SpeakerResponse,
    AgendaItem, AgendaResponse
)
from crud import (
    create_user, get_user_by_email,
    create_registration, get_registrations,
    create_speaker, get_speakers,
    create_agenda_item, get_agenda_items
)
from auth import create_access_token, get_current_user

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="슬슬 AIdea API",
    description="사내 개발자 경진대회 컨퍼런스 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 보안 설정
security = HTTPBearer()

@app.get("/")
async def root():
    return {"message": "슬슬 AIdea API에 오신 것을 환영합니다!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "DevConf API"}

# 사용자 관련 엔드포인트
@app.post("/users/", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="이미 등록된 이메일입니다."
        )
    return create_user(db=db, user=user)

@app.post("/users/login")
async def login_user(email: str, password: str, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=email)
    if not user or not user.verify_password(password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="잘못된 이메일 또는 비밀번호입니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# 컨퍼런스 등록 관련 엔드포인트
@app.post("/register/", response_model=RegistrationResponse)
async def register_conference(
    registration: ConferenceRegistration, 
    db: Session = Depends(get_db)
):
    return create_registration(db=db, registration=registration)

@app.get("/register/", response_model=List[RegistrationResponse])
async def get_conference_registrations(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return get_registrations(db, skip=skip, limit=limit)

# 발표자 관련 엔드포인트
@app.post("/speakers/", response_model=SpeakerResponse)
async def add_speaker(
    speaker: SpeakerCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return create_speaker(db=db, speaker=speaker)

@app.get("/speakers/", response_model=List[SpeakerResponse])
async def get_conference_speakers(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return get_speakers(db, skip=skip, limit=limit)

@app.get("/speakers/{speaker_id}", response_model=SpeakerResponse)
async def get_speaker(speaker_id: int, db: Session = Depends(get_db)):
    speakers = get_speakers(db, skip=0, limit=1000)
    for speaker in speakers:
        if speaker.id == speaker_id:
            return speaker
    raise HTTPException(status_code=404, detail="발표자를 찾을 수 없습니다.")

# 일정 관련 엔드포인트
@app.post("/agenda/", response_model=AgendaResponse)
async def add_agenda_item(
    agenda_item: AgendaItem, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return create_agenda_item(db=db, agenda_item=agenda_item)

@app.get("/agenda/", response_model=List[AgendaResponse])
async def get_conference_agenda(
    day: Optional[str] = None,
    db: Session = Depends(get_db)
):
    agenda_items = get_agenda_items(db)
    if day:
        agenda_items = [item for item in agenda_items if item.day == day]
    return agenda_items

# 통계 엔드포인트
@app.get("/stats/")
async def get_conference_stats(db: Session = Depends(get_db)):
    registrations = get_registrations(db)
    speakers = get_speakers(db)
    agenda_items = get_agenda_items(db)
    
    return {
        "total_registrations": len(registrations),
        "total_speakers": len(speakers),
        "total_agenda_items": len(agenda_items),
        "tracks": list(set([item.track for item in agenda_items])),
        "days": list(set([item.day for item in agenda_items]))
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 