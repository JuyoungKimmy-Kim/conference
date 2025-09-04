from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
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
    AccountLogin, AccountResponse, AccountRegister
)
from crud import (
    create_or_update_account, get_account_by_knox_id, update_account_registration
)

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="슬슬 AIdea Agent API",
    description="사내 개발자 경진대회 컨퍼런스 API",
    version="1.0.0"
)

@app.get("/api")
async def api_root():
    return {"message": "슬슬 AIdea Agnet 경진대회에 오신 것을 환영합니다!"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "슬슬 AIdea Agent 경진대회 API"}

@app.post("/api/login", response_model=AccountResponse)
async def login_or_register_account(payload: AccountLogin, db: Session = Depends(get_db)):
    if not payload.password or payload.password.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="패스워드는 필수입니다."
        )
    
    account = get_account_by_knox_id(db, payload.knox_id)

    if account:
        if account.verify_password(payload.password):
            return account
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="패스워드가 다릅니다."
        )

    account = create_or_update_account(db, knox_id=payload.knox_id, password=payload.password)
    return account

@app.post("/api/register", response_model=AccountResponse)
async def register_account(payload: AccountRegister, db: Session = Depends(get_db)):
    try:
        account = update_account_registration(db, payload.knox_id, payload)
        return account
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="등록 중 오류가 발생했습니다."
        )

BUILD_DIR = (Path(__file__).parent / "../frontend/build").resolve()
if not BUILD_DIR.exists():
    raise RuntimeError(f"React build not found: {BUILD_DIR}\nRun `npm run build` in /frontend")

# CRA 정적 리소스(/static/*) 서빙
app.mount("/static", StaticFiles(directory=BUILD_DIR / "static"), name="static")

@app.get("/{full_path:path}", include_in_schema=False)
async def spa(full_path: str):
    return FileResponse(BUILD_DIR / "index.html")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)