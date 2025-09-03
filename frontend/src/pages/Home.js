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
            슬슬 AIdea <span className="text-gradient">2025</span>
          </h1>
          <p className="hero-subtitle">
            슬시인의 AIdea (AI+Idea), 일상을 바꾸는 업무 혁신
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section-padding">
        <div className="container text-center">
          <div className="schedule-info mb-4">
            <div className="schedule-row">
              <div className="schedule-label">참가 신청 기간</div>
              <div className="schedule-date">9월 10일 ~ 9월 19일</div>
            </div>
            <div className="schedule-row">
              <div className="schedule-label">서류 심사</div>
              <div className="schedule-date">9월 20일 ~ 9월 23일</div>
            </div>
            <div className="schedule-row">
              <div className="schedule-label">개발 기간</div>
              <div className="schedule-date">9월 24일 ~ 10월 16일</div>
            </div>
            <div className="schedule-row">
              <div className="schedule-label">예선 평가</div>
              <div className="schedule-date">10월 17일</div>
            </div>
            <div className="schedule-row">
              <div className="schedule-label">본선 및 시상</div>
              <div className="schedule-date">10월 28일</div>
            </div>
            <div className="schedule-row">
              <div className="schedule-label">시상</div>
              <div className="schedule-date">10월 28일 (개발자 경진대회)</div>
            </div>
          </div>
          
          <Link to="/register" className="btn btn-primary btn-lg">
            참가 신청하기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 