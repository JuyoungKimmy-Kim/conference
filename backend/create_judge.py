#!/usr/bin/env python3
"""
심사위원 계정을 생성하는 스크립트
사용법: python create_judge.py
"""

from sqlalchemy.orm import Session
from database import get_db, engine
from models import Base
from crud import create_judge
import sys

def create_sample_judges():
    """샘플 심사위원 계정들을 생성합니다."""
    
    # 데이터베이스 테이블 생성
    Base.metadata.create_all(bind=engine)
    
    # 데이터베이스 세션 생성
    db = next(get_db())
    
    try:
        # 샘플 심사위원 데이터
        judges_data = [
            {
                "judge_id": "admin",
                "password": "1",
                "name": "관리자"
            },
        ]
        
        print("심사위원 계정을 생성합니다...")
        
        for judge_data in judges_data:
            try:
                judge = create_judge(
                    db=db,
                    judge_id=judge_data["judge_id"],
                    password=judge_data["password"],
                    name=judge_data["name"]
                )
                print(f"✅ 심사위원 계정 생성 완료: {judge.name} ({judge.judge_id})")
            except Exception as e:
                print(f"❌ 심사위원 계정 생성 실패: {judge_data['judge_id']} - {e}")
        
        print("\n심사위원 계정 생성이 완료되었습니다.")
        print("\n생성된 계정 정보:")
        print("=" * 50)
        for judge_data in judges_data:
            print(f"ID: {judge_data['judge_id']}")
            print(f"비밀번호: {judge_data['password']}")
            print(f"이름: {judge_data['name']}")
            print("-" * 30)
            
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_judges()
