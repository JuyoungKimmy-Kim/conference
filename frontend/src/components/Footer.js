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
            <h5 className="footer-title">슬슬 AIdea Agent</h5>
            <p className="footer-description">
              사내 개발자들의 혁신적인 아이디어와 기술을 공유하는 
              연례 개발자 컨퍼런스입니다.
            </p>
          </div>
          
          <div className="footer-section">
            <h6 className="footer-subtitle">빠른 링크</h6>
            <ul className="footer-links">
              <li><Link to="/">홈</Link></li>
              <li><Link to="/agenda">일정</Link></li>
              <li><Link to="/register">등록</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h6 className="footer-subtitle">지원</h6>
            <ul className="footer-links">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">연락처</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} 슬슬 AIdea Agent</p>
          <p>Made with ❤️ by S.LSI AI Agent Group</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 