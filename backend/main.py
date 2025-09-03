from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from pathlib import Path
import os
import uvicorn

from database import get_db, engine
from models import Base
from schemas import (
    UserCreate, UserResponse,
    ConferenceRegistration, RegistrationResponse,
    AgendaItem, AgendaResponse
)
from crud import (
    create_user, get_user_by_email,
    create_registration, get_registrations,
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

# (선택) 개발 중 CRA dev 서버(3000)에서 호출할 때만 CORS 허용
# 배포 통합형(프런트와 같은 도메인)에서는 CORS가 필요 없습니다.
if os.getenv("ENV", "dev") == "dev":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# 보안 설정
security = HTTPBearer()

# -----------------------------
#       ✅ API 엔드포인트
#    (모두 /api/* 로 변경)
# -----------------------------

@app.get("/api")
async def api_root():
    return {"message": "슬슬 AIdea API에 오신 것을 환영합니다!"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "DevConf API"}

# 사용자 관련
@app.post("/api/users/", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="이미 등록된 이메일입니다."
        )
    return create_user(db=db, user=user)

@app.post("/api/users/login")
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

# 컨퍼런스 등록
@app.post("/api/register/", response_model=RegistrationResponse)
async def register_conference(
    registration: ConferenceRegistration,
    db: Session = Depends(get_db)
):
    return create_registration(db=db, registration=registration)

@app.get("/api/register/", response_model=List[RegistrationResponse])
async def get_conference_registrations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return get_registrations(db, skip=skip, limit=limit)

# 일정
@app.post("/api/agenda/", response_model=AgendaResponse)
async def add_agenda_item(
    agenda_item: AgendaItem,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return create_agenda_item(db=db, agenda_item=agenda_item)

@app.get("/api/agenda/", response_model=List[AgendaResponse])
async def get_conference_agenda(
    day: Optional[str] = None,
    db: Session = Depends(get_db)
):
    agenda_items = get_agenda_items(db)
    if day:
        agenda_items = [item for item in agenda_items if item.day == day]
    return agenda_items

# 통계
@app.get("/api/stats/")
async def get_conference_stats(db: Session = Depends(get_db)):
    registrations = get_registrations(db)
    agenda_items = get_agenda_items(db)
    return {
        "total_registrations": len(registrations),
        "total_agenda_items": len(agenda_items),
        "tracks": list(set([item.track for item in agenda_items])),
        "days": list(set([item.day for item in agenda_items]))
    }

# -----------------------------
#  ✅ CRA 정적 파일 + SPA 라우팅
# -----------------------------

# CRA 빌드 폴더 경로 (절대경로 권장)
BUILD_DIR = (Path(__file__).parent / "../frontend/build").resolve()
if not BUILD_DIR.exists():
    raise RuntimeError(f"React build not found: {BUILD_DIR}\nRun `npm run build` in /frontend")

# CRA 정적 리소스(/static/*) 서빙
app.mount("/static", StaticFiles(directory=BUILD_DIR / "static"), name="static")

# 나머지 모든 경로를 index.html로 돌려서 SPA 라우팅 처리
# (API는 위에서 /api/* 로 먼저 매칭되므로 안전)
@app.get("/{full_path:path}", include_in_schema=False)
async def spa(full_path: str):
    return FileResponse(BUILD_DIR / "index.html")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
