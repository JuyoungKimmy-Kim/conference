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
  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' 또는 'projects'
  const [selectedProject, setSelectedProject] = useState(null);
  const [isTeamInfoExpanded, setIsTeamInfoExpanded] = useState(false);
  const [isProjectDetailExpanded, setIsProjectDetailExpanded] = useState(true);

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
    setProjects([]);
    setShowProjects(false);
    setViewMode('dashboard');
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('프로젝트 목록을 가져오는데 실패했습니다.');
      }
      const projectsData = await response.json();
      setProjects(projectsData);
      setShowProjects(true);
    } catch (error) {
      console.error('프로젝트 목록 조회 오류:', error);
      alert('프로젝트 목록을 가져오는데 실패했습니다: ' + error.message);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleShowProjects = () => {
    if (projects.length === 0) {
      fetchProjects();
    }
    setViewMode('projects');
  };

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setViewMode('detail');
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setViewMode('projects');
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

  // 프로젝트 목록 전용 화면
  if (isLoggedIn && viewMode === 'projects') {
    return (
      <div className="evaluation-page">
        <div className="evaluation-hero section-padding">
          <div className="container text-center">
            <h1 className="evaluation-title">제출된 프로젝트 목록</h1>
            <p className="evaluation-subtitle">
              AI Agent 경진대회에 제출된 프로젝트들을 확인하세요
            </p>
          </div>
        </div>

        <div className="evaluation-content section-padding">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="projects-full-section">
                  <div className="projects-header">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2>📊 제출된 프로젝트 목록</h2>
                      <div>
                        <button 
                          className="btn btn-outline-secondary me-2"
                          onClick={handleBackToDashboard}
                        >
                          ← 대시보드로 돌아가기
                        </button>
                        <button 
                          className="btn btn-primary"
                          onClick={fetchProjects}
                          disabled={loadingProjects}
                        >
                          {loadingProjects ? '로딩 중...' : '새로고침'}
                        </button>
                      </div>
                    </div>
                    <p className="text-muted">총 {projects.length}개의 프로젝트가 제출되었습니다.</p>
                  </div>
                  
                  {projects.length === 0 ? (
                    <div className="alert alert-info text-center">
                      <h5>📝 아직 제출된 프로젝트가 없습니다</h5>
                      <p className="mb-0">참가자들이 프로젝트를 제출하면 여기에 표시됩니다.</p>
                    </div>
                  ) : (
                    <div className="projects-list">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-dark">
                            <tr>
                              <th>사업팀</th>
                              <th>팀명</th>
                              <th>프로젝트 이름</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projects.map((project, index) => (
                              <tr key={project.aidea.id} onClick={() => handleProjectClick(project)} style={{cursor: 'pointer'}}>
                                <td>{project.account.department || "미입력"}</td>
                                <td>{project.account.team_name || "미입력"}</td>
                                <td>
                                  <strong>{project.aidea.project}</strong>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoggedIn && viewMode === 'detail' && selectedProject) {
    return (
      <div className="evaluation-page">
        <div className="evaluation-hero section-padding">
          <div className="container text-center">
            <h1 className="evaluation-title">프로젝트 상세보기</h1>
            <p className="evaluation-subtitle">
              {selectedProject.account.team_name || "미입력"} - {selectedProject.aidea.project}
            </p>
          </div>
        </div>
        <div className="evaluation-content section-padding">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="project-detail-section">
                  <div className="project-detail-header">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2>📋 프로젝트 상세 정보</h2>
                      <button className="btn btn-outline-secondary" onClick={handleBackToProjects}>
                        ← 목록으로 돌아가기
                      </button>
                    </div>
                  </div>
                  
                  <div className="project-detail-content">
                    <div className="project-title-section">
                      <h3 className="project-title">{selectedProject.aidea.project}</h3>
                    </div>
                    
                    <div className="row">
                      <div className="col-12">
                        <div className="detail-card">
                          <div 
                            className="detail-card-header" 
                            onClick={() => setIsTeamInfoExpanded(!isTeamInfoExpanded)}
                            style={{cursor: 'pointer'}}
                          >
                            <h4>팀 정보</h4>
                            <span className="expand-icon">
                              {isTeamInfoExpanded ? '▼' : '▶'}
                            </span>
                          </div>
                          {isTeamInfoExpanded && (
                            <div className="detail-card-content">
                              <div className="detail-item">
                                <strong>팀명:</strong> {selectedProject.account.team_name || "미입력"}
                              </div>
                              <div className="detail-item">
                                <strong>사업팀:</strong> {selectedProject.account.department || "미입력"}
                              </div>
                              <div className="detail-item">
                                <strong>팀장:</strong> {selectedProject.account.name} ({selectedProject.account.knox_id})
                              </div>
                              <div className="detail-item">
                                <strong>팀원:</strong>
                                {selectedProject.team_members && selectedProject.team_members.length > 0 ? (
                                  <ul className="team-members-list">
                                    {selectedProject.team_members.map((member) => (
                                      <li key={member.id}>
                                        {member.name} ({member.knox_id})
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <span className="text-muted">팀원 없음</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="row mt-4">
                      <div className="col-12">
                        <div className="detail-card">
                          <div 
                            className="detail-card-header" 
                            onClick={() => setIsProjectDetailExpanded(!isProjectDetailExpanded)}
                            style={{cursor: 'pointer'}}
                          >
                            <h4>프로젝트 상세 내용</h4>
                            <span className="expand-icon">
                              {isProjectDetailExpanded ? '▼' : '▶'}
                            </span>
                          </div>
                          {isProjectDetailExpanded && (
                            <div className="detail-card-content">
                              <div className="detail-item">
                                <strong>문제 정의:</strong>
                                <div className="detail-content">
                                  {selectedProject.aidea.problem || "미입력"}
                                </div>
                              </div>
                              <div className="detail-item">
                                <strong>해결 방안:</strong>
                                <div className="detail-content">
                                  {selectedProject.aidea.solution || "미입력"}
                                </div>
                              </div>
                              <div className="detail-item">
                                <strong>데이터 소스:</strong>
                                <div className="detail-content">
                                  {selectedProject.aidea.data_sources || "미입력"}
                                </div>
                              </div>
                              <div className="detail-item">
                                <strong>시나리오:</strong>
                                <div className="detail-content">
                                  {selectedProject.aidea.scenario || "미입력"}
                                </div>
                              </div>
                              <div className="detail-item">
                                <strong>워크플로우:</strong>
                                <div className="detail-content">
                                  {selectedProject.aidea.workflow || "미입력"}
                                </div>
                              </div>
                            </div>
                          )}
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
                    <p className="mb-0">
                    📋 심사위원으로 로그인하셨습니다. 제출된 프로젝트들을 평가해주세요.
                    </p>
 
                  </div>
                  
                  <div className="evaluation-sections">
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className="evaluation-card">
                          <h4>📊 제출된 프로젝트</h4>
                          <p>등록된 AI Agent 프로젝트 목록을 확인하고 평가할 수 있습니다.</p>
                          <button 
                            className="btn btn-primary"
                            onClick={handleShowProjects}
                            disabled={loadingProjects}
                          >
                            {loadingProjects ? '로딩 중...' : '프로젝트 목록 보기'}
                          </button>
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
