import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: '🚀',
      title: '혁신적인 아이디어',
      description: '사내 개발자들의 창의적인 프로젝트와 기술 솔루션을 만나보세요'
    },
    {
      icon: '💡',
      title: '지식 공유',
      description: '다양한 기술 스택과 개발 경험을 공유하며 함께 성장합니다'
    },
    {
      icon: '🤝',
      title: '네트워킹',
      description: '동료 개발자들과의 소통과 협업 기회를 제공합니다'
    },
    {
      icon: '🏆',
      title: '경진대회',
      description: '최고의 프로젝트를 선정하고 상금을 수여합니다'
    }
  ];

  const stats = [
    { number: '50+', label: '참가자' },
    { number: '20+', label: '프로젝트' },
    { number: '8', label: '트랙' },
    { number: '3', label: '상금' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            DevConf <span className="text-gradient">2024</span>
          </h1>
          <p className="hero-subtitle">
            사내 개발자들의 혁신적인 아이디어와 기술을 공유하는 
            연례 개발자 컨퍼런스에 여러분을 초대합니다
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              지금 등록하기
            </Link>
            <Link to="/agenda" className="btn btn-secondary">
              일정 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section-padding">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">왜 DevConf에 참여해야 할까요?</h2>
            <p className="section-subtitle">
              개발자로서의 성장과 동료들과의 소통을 위한 최고의 기회
            </p>
          </div>
          
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="feature-card text-center card-hover">
                  <div className="feature-icon mb-3">
                    <span className="feature-emoji">{feature.icon}</span>
                  </div>
                  <h5 className="feature-title">{feature.title}</h5>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section section-padding">
        <div className="container">
          <div className="row text-center">
            {stats.map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section-padding">
        <div className="container text-center">
          <h2 className="cta-title">지금 바로 참여하세요!</h2>
          <p className="cta-subtitle mb-4">
            제한된 자리로 선착순 마감됩니다. 놓치지 마세요!
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            무료 등록하기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 