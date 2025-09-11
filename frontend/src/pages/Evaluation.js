import React, { useState } from 'react';
import './Evaluation.css';

const Evaluation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    judgeId: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    if (loginError) {
      setLoginError('');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setLoginError('');
    
    try {
      const res = await fetch('/api/judge/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          judge_id: loginData.judgeId, 
          password: loginData.password 
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        
        if (res.status === 400) {
          setLoginError(errorData.detail || '비밀번호는 필수입니다.');
        } else if (res.status === 401) {
          setLoginError(errorData.detail || '심사위원 ID 또는 패스워드가 다릅니다.');
        } else {
          setLoginError('로그인에 실패했습니다. 다시 시도해 주세요.');
        }
        return;
      }
      
      const judgeData = await res.json();
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
      setLoginError('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ judgeId: '', password: '' });
    setLoginError('');
  };

  if (!isLoggedIn) {
    return (
      <div className="evaluation-page">
        <div className="evaluation-hero section-padding">
          <div className="container text-center">
            <h1 className="evaluation-title">평가</h1>
            <p className="evaluation-subtitle">
              AI Agent 경진대회 심사위원을 위한 페이지 입니다.
            </p>
          </div>
        </div>

        <div className="evaluation-content section-padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 mx-auto">
                <div className="evaluation-form-container">
                  <form onSubmit={handleLoginSubmit} className="evaluation-form">
                    <div className="form-section">
                      <h3>심사위원 로그인</h3>
                      <div className="mb-3">
                        <label htmlFor="judgeId" className="form-label">심사위원 ID *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="judgeId"
                          name="judgeId"
                          value={loginData.judgeId}
                          onChange={handleLoginInputChange}
                          required
                          placeholder="심사위원 ID를 입력하세요"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password *</label>
                        <input
                          type="password"
                          className={`form-control ${loginError ? 'is-invalid' : ''}`}
                          id="password"
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginInputChange}
                          required
                          placeholder="비밀번호를 입력하세요"
                        />
                      </div>
                      
                      {loginError && (
                        <div className="alert alert-danger" role="alert">
                          {loginError}
                        </div>
                      )}
                      
                    </div>
                    <small className="form-text text-muted">
                      심사위원 전용 로그인입니다.<br />
                      발급받은 심사위원 ID와 비밀번호를 입력해주세요.
                    </small>
                    <div className="form-submit">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={!loginData.judgeId || !loginData.password || isSubmitting}
                      >
                        {isSubmitting ? '로그인 중...' : '로그인'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="evaluation-page">
      <div className="evaluation-hero section-padding">
        <div className="container text-center">
          <h1 className="evaluation-title">평가</h1>
          <p className="evaluation-subtitle">
            AI Agent 경진대회 심사위원을 위한 페이지 입니다.
          </p>
        </div>
      </div>

      <div className="evaluation-content section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="evaluation-dashboard">
                <div className="dashboard-header">
                  <h2>심사위원 대시보드</h2>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </div>
                
                <div className="dashboard-content">
                  <div className="alert alert-info">
                    <h5>📋 심사 안내</h5>
                    <p className="mb-0">
                      심사위원으로 로그인하셨습니다. 제출된 프로젝트들을 평가해주세요.
                    </p>
                  </div>
                  
                  <div className="evaluation-sections">
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className="evaluation-card">
                          <h4>📊 제출된 프로젝트</h4>
                          <p>등록된 AI Agent 프로젝트 목록을 확인하고 평가할 수 있습니다.</p>
                          <button className="btn btn-primary">프로젝트 목록 보기</button>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className="evaluation-card">
                          <h4>📈 평가 현황</h4>
                          <p>현재까지의 평가 진행 상황을 확인할 수 있습니다.</p>
                          <button className="btn btn-primary">현황 확인</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
