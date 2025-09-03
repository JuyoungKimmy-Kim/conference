import React, { useState } from 'react';
import './Agenda.css';

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1)); // 2025년 9월로 초기 설정
  
  const agendaData = [
    {
      time: '9월 4일 낮 12시 ~ 9월 19일 낮 12시',
      title: '참가 신청',
      track: '온라인',
      type: 'registration',
      startDate: new Date(2025, 8, 4), // 2025년 9월 4일
      endDate: new Date(2025, 8, 19)   // 2025년 9월 19일
    },
    {
      time: '9월 23일 (예정)',
      title: '서류 심사 발표',
      track: '온라인',
      type: 'announcement',
      startDate: new Date(2025, 8, 23), // 2025년 9월 23일
      endDate: new Date(2025, 8, 23)
    },
    {
      time: '9월 24일 ~ 10월 15일',
      title: '예선',
      track: '온라인',
      type: 'competition',
      startDate: new Date(2025, 8, 24), // 2025년 9월 24일
      endDate: new Date(2025, 9, 15)    // 2025년 10월 15일
    },
    {
      time: '10월 16일 ~ 10월 19일',
      title: '예선 평가',
      track: '온라인',
      type: 'evaluation',
      startDate: new Date(2025, 9, 16), // 2025년 10월 16일
      endDate: new Date(2025, 9, 19)    // 2025년 10월 19일
    },
    {
      time: '10월 23일 (예정)',
      title: '본선 평가',
      track: '온라인',
      type: 'final',
      startDate: new Date(2025, 9, 23), // 2025년 10월 23일
      endDate: new Date(2025, 9, 23)
    },
    {
      time: '10월 28일',
      title: '시상',
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
      evaluation: '#06b6d4',
      final: '#ef4444',
      award: '#10b981'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeLabel = (type) => {
    const labels = {
      registration: '신청',
      announcement: '발표',
      competition: '예선',
      evaluation: '평가',
      final: '본선',
      award: '시상'
    };
    return labels[type] || '기타';
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
          <br></br>
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
        </div>
      </div>
    </div>
  );
};

export default Agenda; 