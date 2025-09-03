import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('event');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const eventFAQs = [
    {
      question: "슬슬 AIdea Agent란 어떤 행사인가요?",
      answer: "슬슬 AIdea는 슬시인의 AI와 아이디어를 결합한 개발자 경진대회입니다. 이 대회를 통해 참가자들은 AI 서비스를 Agent 개념까지 확장 및 발전하는 것을 목표로 합니다."
    },
    {
      question: "꼭 Agent 개념을 사용해야 하나요?",
      answer: "네, 이번 대회는 AI 서비스를 넘어 Agent 개념까지 확장 및 발전하는 것을 목표로 합니다."
    },
    {
      question: "AI Service와 AI Agent를 잘 구분하지 못하겠습니다.",
      answer: "Agent에 대한 자세한 내용은 이곳에서 확인하실 수 있습니다."
    }
  ];

  const registrationFAQs = [
    {
      question: "참가 신청은 어떻게 하나요?",
      answer: "참가 신청 기간(9월 10일 ~ 9월 19일) 내에 등록 페이지에서 신청을 완료해야 합니다."
    },
    {
      question: "팀 구성은 어떻게 하나요?",
      answer: "개발자 2-4명으로 팀을 구성하여 참가하실 수 있습니다."
    },
  ];

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
          <h2 className="cta-title">DevConf 2024 참가 신청 OPEN</h2>
          
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

      {/* FAQ Section */}
      <section className="faq-section section-padding">
        <div className="container">
          <h2 className="section-title text-center mb-5">자주 묻는 질문</h2>
          
          {/* FAQ 탭 */}
          <div className="faq-tabs">
            <button 
              className={`faq-tab ${activeTab === 'event' ? 'active' : ''}`}
              onClick={() => setActiveTab('event')}
            >
              행사 안내
            </button>
            <button 
              className={`faq-tab ${activeTab === 'registration' ? 'active' : ''}`}
              onClick={() => setActiveTab('registration')}
            >
              참가 신청
            </button>
          </div>

          {/* FAQ 내용 */}
          <div className="faq-content">
            {activeTab === 'event' && (
              <div className="faq-items">
                {eventFAQs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div className="faq-question">
                      <strong>{faq.question}</strong>
                    </div>
                    <div className="faq-answer">
                      {faq.answer}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'registration' && (
              <div className="faq-items">
                {registrationFAQs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div className="faq-question">
                      <strong>{faq.question}</strong>
                    </div>
                    <div className="faq-answer">
                      {faq.answer}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 