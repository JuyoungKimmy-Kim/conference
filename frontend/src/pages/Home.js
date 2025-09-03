import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home">
      {/* Hero Section - 전체 화면 */}
      <section className="hero-section" style={{ 
        transform: `translateY(${scrollY * 0.5}px)`,
        opacity: Math.max(0, 1 - scrollY / 800)
      }}>
        <div className="hero-content">
          <h1 className="hero-title">
            슬슬 AIdea Agent <span className="text-gradient">2025</span>
          </h1>
          <p className="hero-subtitle">
            슬시인의 AIdea (AI+Idea) Agent, 업무 혁신을 이루는 AI Agent
          </p>
        </div>
      </section>

      {/* CTA Section - 스크롤 시 나타남 */}
      <section 
        className="cta-section section-padding"
        style={{
          opacity: Math.min(1, (scrollY - 400) / 400),
          transform: `translateY(${Math.max(0, 400 - scrollY)}px)`
        }}
      >
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