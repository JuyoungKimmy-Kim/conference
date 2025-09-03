import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {


  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            DevConf <span className="text-gradient">2024</span>
          </h1>
          <p className="hero-subtitle">
            사내 개발자들의 혁신적인 아이디어와 기술을 공유하는 
            연례 개발자 컨퍼런스에 여러분을 초대합니다
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              지금 등록하기
            </Link>
            <Link to="/agenda" className="btn btn-secondary">
              일정 보기
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section-padding">
        <div className="container text-center">
          <h2 className="cta-title">슬슬 AIdea 등록 OPEN</h2>
          
          <div className="schedule-info mb-4">
            <div className="schedule-row">
              <div className="schedule-label">참가 신청 기간</div>
              <div className="schedule-date">9월 4일 낮 12시 ~ 9월 19일 낮 12시</div>
            </div>
            <div className="schedule-row">
              <div className="schedule-label">서류 심사 발표</div>
              <div className="schedule-date">9월 23일 (예정)</div>
            </div>
            <div className="schedule-row">
              <div className="schedule-label">예선 평가</div>
              <div className="schedule-date">10월 16일 ~ 10월 19일</div>
            </div>
            <div className="schedule-row">
              <div className="schedule-label">본선 평가(임원 평가)</div>
              <div className="schedule-date">10월 23일 (예정)</div>
            </div>
            <div className="schedule-row">
              <div className="schedule-label">시상</div>
              <div className="schedule-date">10월 28일 (개발자 경진대회)</div>
            </div>
          </div>
          
          <Link to="/register" className="btn btn-primary btn-lg">
            등록하기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 