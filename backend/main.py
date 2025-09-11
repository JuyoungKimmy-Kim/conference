from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from typing import List
from pathlib import Path
import os
import uvicorn
import logging
import httpx  # HTTP 클라이언트 라이브러리

from database import get_db, engine
from models import Base
from schemas import (
    AccountLogin, AccountResponse, AccountRegister, JudgeLogin, JudgeResponse, ProjectWithAccount, AideaResponse, TeamMemberResponse,
    EvaluationCreate, EvaluationResponse, AccountWithEvaluations
)
from crud import (
    create_or_update_account, get_account_by_knox_id, update_account_registration,
    verify_judge_login, get_all_projects_with_accounts,
    create_evaluation, get_evaluations_by_account, get_judge_by_id
)

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
if ENVIRONMENT == "development":
    logging.basicConfig(level=logging.INFO)
else:
    logging.basicConfig(level=logging.CRITICAL + 1)
logger = logging.getLogger(__name__)

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
    """
    로그인 또는 회원가입을 처리합니다.
    동시성 문제를 방지하기 위해 안전한 트랜잭션 처리를 사용합니다.
    """
    try:
        if not payload.password or payload.password.strip() == "":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="패스워드는 필수입니다."
            )
        
        account = get_account_by_knox_id(db, payload.knox_id)

        if account:
            if account.verify_password(payload.password):
                logger.info(f"로그인 성공: {payload.knox_id}")
                return account
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="패스워드가 다릅니다."
            )
            
        account = create_or_update_account(db, knox_id=payload.knox_id, password=payload.password)
        logger.info(f"새 계정 생성: {payload.knox_id}")
        return account
        
    except ValueError as e:
        logger.warning(f"계정 생성 시 비밀번호 불일치: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except IntegrityError as e:
        logger.error(f"데이터베이스 무결성 오류: {e}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 존재하는 계정입니다."
        )
    except SQLAlchemyError as e:
        logger.error(f"데이터베이스 오류: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="서버 오류가 발생했습니다."
        )
    except Exception as e:
        logger.error(f"예상치 못한 오류: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="서버 오류가 발생했습니다."
        )

@app.post("/api/register", response_model=AccountResponse)
async def register_account(payload: AccountRegister, db: Session = Depends(get_db)):
    """
    계정 등록 정보를 업데이트합니다.
    트랜잭션 안전성을 보장하고 동시성 문제를 방지합니다.
    """
    try:
        account = update_account_registration(db, payload)
        logger.info(f"계정 정보 등록 완료: knox_id={payload.knox_id}")
        return account
        
    except ValueError as e:
        logger.warning(f"ValueError: knox_id={payload.knox_id} - {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except IntegrityError as e:
        logger.error(f"데이터베이스 무결성 오류: {e}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="데이터 충돌이 발생했습니다. 다시 시도해주세요."
        )
    except SQLAlchemyError as e:
        logger.error(f"데이터베이스 오류: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="서버 오류가 발생했습니다."
        )
    except Exception as e:
        logger.error(f"예상치 못한 오류: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="등록 중 오류가 발생했습니다."
        )

@app.post("/api/judge/login", response_model=JudgeResponse)
async def judge_login(payload: JudgeLogin, db: Session = Depends(get_db)):
    """
    심사위원 로그인을 처리합니다.
    """
    try:
        if not payload.password or payload.password.strip() == "":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="비밀번호는 필수입니다."
            )
        
        judge = verify_judge_login(db, payload.judge_id, payload.password)
        
        if not judge:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="심사위원 ID 또는 패스워드가 다릅니다."
            )
        
        logger.info(f"심사위원 로그인 성공: {payload.judge_id}")
        return judge
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"심사위원 로그인 오류: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="서버 오류가 발생했습니다."
        )

@app.get("/api/projects", response_model=List[ProjectWithAccount])
async def get_projects(db: Session = Depends(get_db)):
    """
    제출된 모든 프로젝트 목록을 가져옵니다.
    """
    try:
        projects = get_all_projects_with_accounts(db)
        
        project_list = []
        for account in projects:
            team_members_response = [
                TeamMemberResponse.model_validate(member) 
                for member in account.team_members
            ]
            
            account_response = AccountResponse.model_validate(account)
            
            if account.aideas:
                aidea = account.aideas[0]
                aidea_response = AideaResponse.model_validate(aidea)
            else:
                # Aidea가 없는 경우: 빈 AideaResponse로 프로젝트 항목 생성
                aidea_response = AideaResponse(
                    id=0,
                    account_id=account.id,
                    project="(프로젝트 미제출)",
                    target_user="",
                    problem="",
                    solution="",
                    data_sources="",
                    scenario="",
                    workflow="",
                    created_at=account.created_at,
                    updated_at=account.updated_at
                )

            project_item = ProjectWithAccount(
                account=account_response,
                team_members=team_members_response,
                aidea=aidea_response
            )
            project_list.append(project_item)
        
        return project_list
        
    except Exception as e:
        logger.error(f"프로젝트 목록 조회 오류: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="서버 오류가 발생했습니다."
        )

@app.post("/api/evaluations", response_model=EvaluationResponse)
async def submit_evaluation(evaluation_data: EvaluationCreate, db: Session = Depends(get_db)):
    """
    평가를 제출합니다.
    """
    try:
        judge_id = evaluation_data.judge_id
        account_id = evaluation_data.account_id
        
        # 점수 유효성 검사
        if not (6 <= evaluation_data.innovation_score <= 30 and 
                evaluation_data.innovation_score % 6 == 0):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="아이디어 혁신성 점수는 6, 12, 18, 24, 30 중 하나여야 합니다."
            )
        
        if not (6 <= evaluation_data.feasibility_score <= 30 and 
                evaluation_data.feasibility_score % 6 == 0):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="기술 실현 가능성 점수는 6, 12, 18, 24, 30 중 하나여야 합니다."
            )
        
        if not (8 <= evaluation_data.effectiveness_score <= 40 and 
                evaluation_data.effectiveness_score % 8 == 0):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="업무 효과성 점수는 8, 16, 24, 32, 40 중 하나여야 합니다."
            )
        
        # 평가 생성
        evaluation = create_evaluation(
            db=db,
            account_id=account_id,
            judge_id=judge_id,
            innovation_score=evaluation_data.innovation_score,
            feasibility_score=evaluation_data.feasibility_score,
            effectiveness_score=evaluation_data.effectiveness_score
        )
        
        logger.info(f"평가 제출 완료: account_id={account_id}, judge_id={judge_id}, total_score={evaluation.total_score}")
        return evaluation
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"평가 제출 오류: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="평가 제출 중 오류가 발생했습니다."
        )

@app.get("/api/evaluations/{account_id}", response_model=List[EvaluationResponse])
async def get_evaluations(account_id: int, db: Session = Depends(get_db)):
    """
    특정 계정의 모든 평가를 가져옵니다.
    """
    try:
        evaluations = get_evaluations_by_account(db, account_id)
        return evaluations
    except Exception as e:
        logger.error(f"평가 조회 오류: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="평가 조회 중 오류가 발생했습니다."
        )

@app.post("/api/send-email")
async def send_email(email_data: dict):
    """
    Knox email server로 메일 발송 요청을 프록시합니다.
    """
    try:
        # Knox email server로 요청 전달
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://10.229.19.169:1111/knox_api",
                json=email_data,
                headers={"Content-Type": "application/json"},
                timeout=30.0
            )
            
            if response.status_code == 200:
                return {"message": "메일 발송 성공", "data": response.json()}
            else:
                return {"message": "메일 발송 실패", "error": response.text}
                
    except Exception as e:
        logger.error(f"메일 발송 오류: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"메일 발송 중 오류가 발생했습니다: {str(e)}"
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