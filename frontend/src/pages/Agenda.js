import React, { useState } from 'react';
import './Agenda.css';

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1)); // 2025년 9월로 초기 설정
  
  const agendaData = [
    {
      time: '9월 10일 ~ 9월 19일',
      title: '참가 신청',
      track: '온라인',
      type: 'registration',
      startDate: new Date(2025, 8, 10), // 2025년 9월 4일
      endDate: new Date(2025, 8, 19)   // 2025년 9월 19일
    },
    {
      time: '9월 20일 ~ 9월 23일',
      title: '서류 심사',
      track: '온라인',
      type: 'announcement',
      startDate: new Date(2025, 8, 20), // 2025년 9월 23일
      endDate: new Date(2025, 8, 23)
    },
    {
      time: '9월 24일 ~ 10월 16일',
      title: '개발 기간',
      track: '온라인',
      type: 'competition',
      startDate: new Date(2025, 8, 24), // 2025년 9월 24일
      endDate: new Date(2025, 9, 16)    // 2025년 10월 15일
    },
    {
      time: '10월 17일',
      title: '예선 평가',
      track: '온라인',
      type: 'evaluation',
      startDate: new Date(2025, 9, 17), // 2025년 10월 16일
      endDate: new Date(2025, 9, 17)    // 2025년 10월 19일
    },
    {
      time: '10월 18일일 ~ 10월 27일',
      title: '본선 준비',
      track: '온라인',
      type: 'final',
      startDate: new Date(2025, 9, 18), // 2025년 10월 23일
      endDate: new Date(2025, 9, 27)
    },
    {
      time: '10월 28일',
      title: '본선 및 시상',
      track: '온라인',
      type: 'award',
      startDate: new Date(2025, 9, 28), // 2025년 10월 28일
      endDate: new Date(2025, 9, 28)
    }
  ];

  const getTypeColor = (type) => {
    const colors = {
      registration: '#3b82f6',
      announcement: '#8b5cf6',
      competition: '#f59e0b',
      evaluation: '#ef4444',
      final: '#06b6d4',
      award: '#10b981'
    };
    return colors[type] || '#6b7280';
  };

  // 캘린더 관련 함수들
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateInRange = (date, startDate, endDate) => {
    return date >= startDate && date <= endDate;
  };

  const getEventForDate = (date) => {
    return agendaData.find(event => 
      isDateInRange(date, event.startDate, event.endDate)
    );
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // 빈 칸들 추가
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // 날짜들 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const event = getEventForDate(date);
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${event ? 'has-event' : ''}`}
        >
          <span className="day-number">{day}</span>
          {event && (
            <div 
              className="event-block"
              style={{ backgroundColor: getTypeColor(event.type) }}
              title={event.title}
            >
              <div className="event-title">{event.title}</div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="agenda-page">
      <div className="agenda-hero section-padding">
        <div className="container text-center">
          <h1 className="agenda-title">경진대회 일정</h1>
        </div>
      </div>

      <div className="agenda-content section-padding">
        <div className="container">
          {/* 캘린더 섹션 */}
          <div className="calendar-section">
            <h3 className="calendar-title text-center mb-4">일정 캘린더</h3>
            <div className="calendar-container">
              <div className="calendar-header">
                <button 
                  className="calendar-nav-btn"
                  onClick={() => navigateMonth(-1)}
                >
                  ‹
                </button>
                <h4 className="calendar-month">
                  {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                </h4>
                <button 
                  className="calendar-nav-btn"
                  onClick={() => navigateMonth(1)}
                >
                  ›
                </button>
              </div>
              
              <div className="calendar-grid">
                <div className="calendar-weekdays">
                  <div className="weekday">일</div>
                  <div className="weekday">월</div>
                  <div className="weekday">화</div>
                  <div className="weekday">수</div>
                  <div className="weekday">목</div>
                  <div className="weekday">금</div>
                  <div className="weekday">토</div>
                </div>
                <div className="calendar-days">
                  {renderCalendar()}
                </div>
              </div>
            </div>
          </div>

          {/* 일정 설명 섹션 */}
          <div className="schedule-description-section">
            <h3 className="description-title text-center mb-5">일정 상세 안내</h3>
            <div className="description-grid">
              <div className="description-item">
                <div className="description-header">
                  <div className="description-icon" style={{ backgroundColor: getTypeColor('registration') }}>
                    📝
                  </div>
                  <h4 className="description-name">참가 신청</h4>
                </div>
                <p className="description-text">아이디어 제안서 제출</p>
              </div>

              <div className="description-item">
                <div className="description-header">
                  <div className="description-icon" style={{ backgroundColor: getTypeColor('announcement') }}>
                    📋
                  </div>
                  <h4 className="description-name">서류 심사</h4>
                </div>
                <p className="description-text">제출된 아이디어 제안서 심사</p>
              </div>

              <div className="description-item">
                <div className="description-header">
                  <div className="description-icon" style={{ backgroundColor: getTypeColor('competition') }}>
                    💻
                  </div>
                  <h4 className="description-name">개발 기간</h4>
                </div>
                <p className="description-text">AIdea를 AI Agent로 구현 기간</p>
              </div>

              <div className="description-item">
                <div className="description-header">
                  <div className="description-icon" style={{ backgroundColor: getTypeColor('evaluation') }}>
                    🎯
                  </div>
                  <h4 className="description-name">예선 평가</h4>
                </div>
                <p className="description-text">15분 발표 및 녹스 미팅 데모 시연</p>
              </div>

              <div className="description-item">
                <div className="description-header">
                  <div className="description-icon" style={{ backgroundColor: getTypeColor('final') }}>
                    🔧
                  </div>
                  <h4 className="description-name">본선 준비</h4>
                </div>
                <p className="description-text">본선 발표를 위한 최종 준비 기간</p>
              </div>

              <div className="description-item">
                <div className="description-header">
                  <div className="description-icon" style={{ backgroundColor: getTypeColor('award') }}>
                    🏆
                  </div>
                  <h4 className="description-name">본선 및 시상</h4>
                </div>
                <p className="description-text">개발자행사에서 임원 평가 및 임직원 투표 진행 후 시상자 선정</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda; 