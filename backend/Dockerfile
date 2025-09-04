# Multi-stage build: Frontend 빌드
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Frontend 의존성 설치
COPY ../frontend/package*.json ./
RUN npm ci --only=production

# Frontend 소스 복사 및 빌드
COPY ../frontend/ ./
RUN npm run build

# Backend 빌드
FROM python:3.11-slim

WORKDIR /app

# 시스템 패키지 업데이트 및 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend 애플리케이션 코드 복사
COPY . .

# Frontend 빌드 결과물 복사
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# 데이터 디렉토리 생성
RUN mkdir -p /app/data

# 포트 노출
EXPOSE 8000

# 애플리케이션 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]