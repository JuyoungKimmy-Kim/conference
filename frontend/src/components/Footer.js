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