import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h5 className="footer-title">DevConf 2024</h5>
            <p className="footer-description">
              사내 개발자들의 혁신적인 아이디어와 기술을 공유하는 
              연례 개발자 컨퍼런스입니다.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" className="social-link">
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h6 className="footer-subtitle">빠른 링크</h6>
            <ul className="footer-links">
              <li><Link to="/">홈</Link></li>
              <li><Link to="/agenda">일정</Link></li>
              <li><Link to="/speakers">발표자</Link></li>
              <li><Link to="/register">등록</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h6 className="footer-subtitle">지원</h6>
            <ul className="footer-links">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">연락처</a></li>
              <li><a href="#">행동 강령</a></li>
              <li><a href="#">개인정보처리방침</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h6 className="footer-subtitle">뉴스레터</h6>
            <p>최신 업데이트를 받아보세요</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="이메일 주소" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">구독</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} DevConf. 모든 권리 보유.</p>
          <p>Made with ❤️ by the Dev Team</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 