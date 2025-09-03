import React, { useState } from 'react';
import './Agenda.css';

const Agenda = () => {
  const [selectedDay, setSelectedDay] = useState('day1');

  const agendaData = {
    day1: [
      {
        time: '09:00 - 09:30',
        title: '개회식 및 환영사',
        speaker: 'CEO 김개발',
        track: 'Main Hall',
        type: 'keynote'
      },
      {
        time: '09:30 - 10:30',
        title: 'AI와 개발의 미래',
        speaker: 'CTO 이인공지능',
        track: 'Track A',
        type: 'session'
      },
      {
        time: '10:45 - 11:45',
        title: '클라우드 네이티브 아키텍처',
        speaker: '시니어 개발자 박클라우드',
        track: 'Track B',
        type: 'session'
      },
      {
        time: '12:00 - 13:00',
        title: '점심 식사 및 네트워킹',
        speaker: '',
        track: 'Lunch Area',
        type: 'break'
      },
      {
        time: '13:00 - 14:00',
        title: '프로젝트 경진대회 1차',
        speaker: '참가팀들',
        track: 'Main Hall',
        type: 'competition'
      },
      {
        time: '14:15 - 15:15',
        title: '마이크로서비스 모니터링',
        speaker: 'DevOps 엔지니어 최모니터',
        track: 'Track C',
        type: 'session'
      },
      {
        time: '15:30 - 16:30',
        title: '프론트엔드 개발 트렌드',
        speaker: '프론트엔드 리드 정트렌드',
        track: 'Track A',
        type: 'session'
      }
    ],
    day2: [
      {
        time: '09:00 - 10:00',
        title: '데이터 엔지니어링의 새로운 패러다임',
        speaker: '데이터 엔지니어 한데이터',
        track: 'Track B',
        type: 'session'
      },
      {
        time: '10:15 - 11:15',
        title: '보안 개발 방법론',
        speaker: '보안 전문가 보안김',
        track: 'Track C',
        type: 'session'
      },
      {
        time: '11:30 - 12:30',
        title: '프로젝트 경진대회 2차',
        speaker: '참가팀들',
        track: 'Main Hall',
        type: 'competition'
      },
      {
        time: '12:30 - 13:30',
        title: '점심 식사',
        speaker: '',
        track: 'Lunch Area',
        type: 'break'
      },
      {
        time: '13:30 - 15:00',
        title: '최종 프로젝트 발표 및 시상식',
        speaker: '수상팀들',
        track: 'Main Hall',
        type: 'award'
      },
      {
        time: '15:00 - 16:00',
        title: '폐회식 및 네트워킹',
        speaker: '전체 참가자',
        track: 'Main Hall',
        type: 'networking'
      }
    ]
  };

  const getTypeColor = (type) => {
    const colors = {
      keynote: '#8b5cf6',
      session: '#06b6d4',
      competition: '#f59e0b',
      break: '#6b7280',
      award: '#10b981',
      networking: '#6366f1'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeLabel = (type) => {
    const labels = {
      keynote: '키노트',
      session: '세션',
      competition: '경진대회',
      break: '휴식',
      award: '시상식',
      networking: '네트워킹'
    };
    return labels[type] || '기타';
  };

  return (
    <div className="agenda-page">
      <div className="agenda-hero section-padding">
        <div className="container text-center">
          <h1 className="agenda-title">컨퍼런스 일정</h1>
          <p className="agenda-subtitle">
            2일간의 흥미진진한 개발자 컨퍼런스 일정을 확인하세요
          </p>
        </div>
      </div>

      <div className="agenda-content section-padding">
        <div className="container">
          <div className="day-selector mb-5">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn ${selectedDay === 'day1' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedDay('day1')}
              >
                Day 1 (12월 15일)
              </button>
              <button
                type="button"
                className={`btn ${selectedDay === 'day2' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedDay('day2')}
              >
                Day 2 (12월 16일)
              </button>
            </div>
          </div>

          <div className="agenda-timeline">
            {agendaData[selectedDay].map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker" style={{ backgroundColor: getTypeColor(item.type) }}>
                  <span className="timeline-type">{getTypeLabel(item.type)}</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-time">{item.time}</div>
                  <h4 className="timeline-title">{item.title}</h4>
                  {item.speaker && (
                    <p className="timeline-speaker">발표자: {item.speaker}</p>
                  )}
                  <div className="timeline-track">{item.track}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="agenda-legend mt-5">
            <h5>일정 구분</h5>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></span>
                <span>키노트</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#06b6d4' }}></span>
                <span>세션</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
                <span>경진대회</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
                <span>시상식</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#6366f1' }}></span>
                <span>네트워킹</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda; 