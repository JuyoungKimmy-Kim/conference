import React from 'react';
import './Speakers.css';

const Speakers = () => {
  const speakers = [
    {
      id: 1,
      name: '김개발',
      title: 'CEO',
      company: '테크컴퍼니',
      bio: '20년간의 개발 경험을 바탕으로 혁신적인 기술 솔루션을 만들어온 리더입니다.',
      topic: '개발자 문화와 조직 혁신',
      image: 'https://via.placeholder.com/200x200/6366f1/ffffff?text=김개발',
      track: 'keynote'
    },
    {
      id: 2,
      name: '이인공지능',
      title: 'CTO',
      company: 'AI스타트업',
      bio: '머신러닝과 딥러닝 전문가로, AI 기술의 실무 적용에 대한 깊은 통찰력을 가지고 있습니다.',
      topic: 'AI와 개발의 미래',
      image: 'https://via.placeholder.com/200x200/06b6d4/ffffff?text=이AI',
      track: 'ai'
    },
    {
      id: 3,
      name: '박클라우드',
      title: '시니어 개발자',
      company: '클라우드솔루션즈',
      bio: '클라우드 네이티브 아키텍처와 마이크로서비스 설계 전문가입니다.',
      topic: '클라우드 네이티브 아키텍처',
      image: 'https://via.placeholder.com/200x200/8b5cf6/ffffff?text=박클라우드',
      track: 'cloud'
    },
    {
      id: 4,
      name: '최모니터',
      title: 'DevOps 엔지니어',
      company: '인프라테크',
      bio: 'DevOps 문화와 도구를 활용한 개발 프로세스 최적화 전문가입니다.',
      topic: '마이크로서비스 모니터링',
      image: 'https://via.placeholder.com/200x200/f59e0b/ffffff?text=최모니터',
      track: 'devops'
    },
    {
      id: 5,
      name: '정트렌드',
      title: '프론트엔드 리드',
      company: '웹솔루션즈',
      bio: '최신 프론트엔드 기술 트렌드와 사용자 경험 설계에 대한 전문성을 가지고 있습니다.',
      topic: '프론트엔드 개발 트렌드',
      image: 'https://via.placeholder.com/200x200/10b981/ffffff?text=정트렌드',
      track: 'frontend'
    },
    {
      id: 6,
      name: '한데이터',
      title: '데이터 엔지니어',
      company: '데이터랩',
      bio: '빅데이터 처리와 분석을 위한 인프라 구축 및 최적화 전문가입니다.',
      topic: '데이터 엔지니어링의 새로운 패러다임',
      image: 'https://via.placeholder.com/200x200/ef4444/ffffff?text=한데이터',
      track: 'data'
    },
    {
      id: 7,
      name: '보안김',
      title: '보안 전문가',
      company: '시큐리티랩',
      bio: '애플리케이션 보안과 보안 개발 방법론에 대한 깊은 지식을 보유하고 있습니다.',
      topic: '보안 개발 방법론',
      image: 'https://via.placeholder.com/200x200/84cc16/ffffff?text=보안김',
      track: 'security'
    }
  ];

  const tracks = [
    { id: 'all', name: '전체', color: '#6b7280' },
    { id: 'keynote', name: '키노트', color: '#8b5cf6' },
    { id: 'ai', name: 'AI/ML', color: '#06b6d4' },
    { id: 'cloud', name: '클라우드', color: '#8b5cf6' },
    { id: 'devops', name: 'DevOps', color: '#f59e0b' },
    { id: 'frontend', name: '프론트엔드', color: '#10b981' },
    { id: 'data', name: '데이터', color: '#ef4444' },
    { id: 'security', name: '보안', color: '#84cc16' }
  ];

  const [selectedTrack, setSelectedTrack] = React.useState('all');

  const filteredSpeakers = selectedTrack === 'all' 
    ? speakers 
    : speakers.filter(speaker => speaker.track === selectedTrack);

  return (
    <div className="speakers-page">
      <div className="speakers-hero section-padding">
        <div className="container text-center">
          <h1 className="speakers-title">발표자 소개</h1>
          <p className="speakers-subtitle">
            각 분야의 전문가들이 전하는 인사이트와 경험을 만나보세요
          </p>
        </div>
      </div>

      <div className="speakers-content section-padding">
        <div className="container">
          <div className="track-filter mb-5">
            <div className="filter-buttons">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  className={`filter-btn ${selectedTrack === track.id ? 'active' : ''}`}
                  onClick={() => setSelectedTrack(track.id)}
                  style={{
                    '--track-color': track.color
                  }}
                >
                  {track.name}
                </button>
              ))}
            </div>
          </div>

          <div className="speakers-grid">
            {filteredSpeakers.map((speaker) => (
              <div key={speaker.id} className="speaker-card card-hover">
                <div className="speaker-image">
                  <img src={speaker.image} alt={speaker.name} />
                  <div className="speaker-track" style={{ backgroundColor: tracks.find(t => t.id === speaker.track)?.color }}>
                    {tracks.find(t => t.id === speaker.track)?.name}
                  </div>
                </div>
                <div className="speaker-info">
                  <h3 className="speaker-name">{speaker.name}</h3>
                  <p className="speaker-title">{speaker.title}</p>
                  <p className="speaker-company">{speaker.company}</p>
                  <p className="speaker-bio">{speaker.bio}</p>
                  <div className="speaker-topic">
                    <strong>주제:</strong> {speaker.topic}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSpeakers.length === 0 && (
            <div className="no-speakers text-center">
              <h4>해당 트랙의 발표자가 없습니다.</h4>
              <p>다른 트랙을 선택해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Speakers; 