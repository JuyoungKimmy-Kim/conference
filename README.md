# 사내 개발자 경진대회 컨퍼런스

React + FastAPI로 구축된 현대적인 컨퍼런스 웹사이트입니다.

## 프로젝트 구조

```
conference/
├── frontend/          # React 프론트엔드
├── backend/           # FastAPI 백엔드
├── README.md          # 프로젝트 설명
└── docker-compose.yml # 개발 환경 설정
```

## 설치 및 실행

### 1. 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```

### 2. 백엔드 실행
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Docker로 전체 실행
```bash
docker-compose up --build
```

## 기술 스택

- **Frontend**: React, Bootstrap, CSS3
- **Backend**: FastAPI, Python 3.8+
- **Database**: SQLite (개발용)
- **Authentication**: JWT 