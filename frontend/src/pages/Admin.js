import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [judges, setJudges] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalJudges: 0,
    totalEvaluations: 0,
    averageScore: 0
  });

  // 관리자 로그인 처리
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      if (response.ok) {
        setIsLoggedIn(true);
        await fetchAllData();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setLoginError(errorData.detail || '관리자 ID 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error(err);
      setLoginError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 모든 데이터 가져오기
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProjects(),
        fetchJudges(),
        fetchEvaluations(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 프로젝트 목록 가져오기
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        setStats(prev => ({ ...prev, totalProjects: data.length }));
      }
    } catch (error) {
      console.error('프로젝트 조회 오류:', error);
    }
  };

  // 심사위원 목록 가져오기
  const fetchJudges = async () => {
    try {
      const response = await fetch('/api/admin/judges');
      if (response.ok) {
        const data = await response.json();
        setJudges(data);
        setStats(prev => ({ ...prev, totalJudges: data.length }));
      }
    } catch (error) {
      console.error('심사위원 조회 오류:', error);
    }
  };

  // 평가 결과 가져오기
  const fetchEvaluations = async () => {
    try {
      const response = await fetch('/api/admin/evaluations');
      if (response.ok) {
        const data = await response.json();
        setEvaluations(data);
        setStats(prev => ({ 
          ...prev, 
          totalEvaluations: data.length
        }));
      }
    } catch (error) {
      console.error('평가 조회 오류:', error);
    }
  };

  // 통계 정보 가져오기
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          totalProjects: data.total_projects,
          totalJudges: data.total_judges,
          totalEvaluations: data.total_evaluations,
          averageScore: data.average_score
        }));
      }
    } catch (error) {
      console.error('통계 조회 오류:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ username: '', password: '' });
    setLoginError('');
    setProjects([]);
    setJudges([]);
    setEvaluations([]);
    setActiveTab('dashboard');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    if (loginError) {
      setLoginError('');
    }
  };

  // 로그인하지 않은 경우
  if (!isLoggedIn) {
    return (
      <div className="admin-page">
        <div className="admin-hero section-padding">
          <div className="container text-center">
            <h1 className="admin-title">관리자 페이지</h1>
            <p className="admin-subtitle">
              슬슬 AIdea 2025 경진대회 관리 시스템
            </p>
          </div>
        </div>

        <div className="admin-content section-padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 mx-auto">
                <div className="admin-form-container">
                  <form onSubmit={handleLoginSubmit} className="admin-form">
                    <div className="form-section">
                      <h3>관리자 로그인</h3>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">관리자 ID *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          name="username"
                          value={loginData.username}
                          onChange={handleInputChange}
                          required
                          placeholder="관리자 ID를 입력하세요"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">비밀번호 *</label>
                        <input
                          type="password"
                          className={`form-control ${loginError ? 'is-invalid' : ''}`}
                          id="password"
                          name="password"
                          value={loginData.password}
                          onChange={handleInputChange}
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
                      관리자 전용 로그인입니다.<br />
                      기본 계정: admin / admin123
                    </small>
                    
                    <div className="form-submit">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={!loginData.username || !loginData.password || isSubmitting}
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

  // 로그인한 경우 - 관리자 대시보드
  return (
    <div className="admin-page">
      <div className="admin-hero section-padding">
        <div className="container text-center">
          <h1 className="admin-title">관리자 대시보드</h1>
          <p className="admin-subtitle">
            슬슬 AIdea 2025 경진대회 관리 시스템
          </p>
          <div className="mt-3">
            <button 
              className="btn btn-outline-secondary"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content section-padding">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* 탭 네비게이션 */}
              <ul className="nav nav-tabs admin-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    📊 대시보드
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
                    onClick={() => setActiveTab('projects')}
                  >
                    📋 프로젝트 관리
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'judges' ? 'active' : ''}`}
                    onClick={() => setActiveTab('judges')}
                  >
                    👨‍⚖️ 심사위원 관리
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'evaluations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('evaluations')}
                  >
                    📈 평가 결과
                  </button>
                </li>
              </ul>

              {/* 탭 컨텐츠 */}
              <div className="tab-content admin-tab-content">
                {/* 대시보드 탭 */}
                {activeTab === 'dashboard' && (
                  <div className="tab-pane fade show active">
                    <div className="row mt-4">
                      <div className="col-md-3">
                        <div className="stat-card">
                          <div className="stat-icon">📊</div>
                          <div className="stat-content">
                            <h3>{stats.totalProjects}</h3>
                            <p>총 프로젝트</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="stat-card">
                          <div className="stat-icon">👨‍⚖️</div>
                          <div className="stat-content">
                            <h3>{stats.totalJudges}</h3>
                            <p>심사위원</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="stat-card">
                          <div className="stat-icon">📝</div>
                          <div className="stat-content">
                            <h3>{stats.totalEvaluations}</h3>
                            <p>완료된 평가</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="stat-card">
                          <div className="stat-icon">⭐</div>
                          <div className="stat-content">
                            <h3>{stats.averageScore}</h3>
                            <p>평균 점수</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-12">
                        <div className="admin-card">
                          <h4>📈 최근 활동</h4>
                          <div className="activity-list">
                            <div className="activity-item">
                              <span className="activity-time">방금 전</span>
                              <span className="activity-text">새로운 프로젝트가 제출되었습니다.</span>
                            </div>
                            <div className="activity-item">
                              <span className="activity-time">5분 전</span>
                              <span className="activity-text">심사위원이 평가를 완료했습니다.</span>
                            </div>
                            <div className="activity-item">
                              <span className="activity-time">10분 전</span>
                              <span className="activity-text">새로운 팀이 등록되었습니다.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 프로젝트 관리 탭 */}
                {activeTab === 'projects' && (
                  <div className="tab-pane fade show active">
                    <div className="admin-card">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>📋 프로젝트 목록</h4>
                        <button 
                          className="btn btn-primary"
                          onClick={fetchProjects}
                          disabled={loading}
                        >
                          {loading ? '로딩 중...' : '새로고침'}
                        </button>
                      </div>
                      
                      {projects.length === 0 ? (
                        <div className="alert alert-info text-center">
                          <h5>📝 아직 제출된 프로젝트가 없습니다</h5>
                          <p className="mb-0">참가자들이 프로젝트를 제출하면 여기에 표시됩니다.</p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead className="table-dark">
                              <tr>
                                <th>사업팀</th>
                                <th>팀명</th>
                                <th>프로젝트 이름</th>
                                <th>팀장</th>
                                <th>제출일</th>
                                <th>평가 상태</th>
                              </tr>
                            </thead>
                            <tbody>
                              {projects.map((project) => (
                                <tr key={project.aidea.id}>
                                  <td>{project.account.department || "미입력"}</td>
                                  <td>{project.account.team_name || "미입력"}</td>
                                  <td>
                                    <strong>{project.aidea.project}</strong>
                                  </td>
                                  <td>{project.account.name}</td>
                                  <td>
                                    {new Date(project.aidea.created_at).toLocaleDateString('ko-KR')}
                                  </td>
                                  <td>
                                    {project.is_evaluated ? (
                                      <span className="badge bg-success">평가 완료</span>
                                    ) : (
                                      <span className="badge bg-secondary">미평가</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 심사위원 관리 탭 */}
                {activeTab === 'judges' && (
                  <div className="tab-pane fade show active">
                    <div className="admin-card">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>👨‍⚖️ 심사위원 관리</h4>
                        <button 
                          className="btn btn-primary"
                          onClick={fetchJudges}
                          disabled={loading}
                        >
                          {loading ? '로딩 중...' : '새로고침'}
                        </button>
                      </div>
                      
                      {judges.length === 0 ? (
                        <div className="alert alert-info text-center">
                          <h5>👨‍⚖️ 등록된 심사위원이 없습니다</h5>
                          <p className="mb-0">심사위원을 등록하면 여기에 표시됩니다.</p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead className="table-dark">
                              <tr>
                                <th>심사위원 ID</th>
                                <th>이름</th>
                                <th>등록일</th>
                                <th>수정일</th>
                                <th>관리</th>
                              </tr>
                            </thead>
                            <tbody>
                              {judges.map((judge) => (
                                <tr key={judge.id}>
                                  <td>
                                    <strong>{judge.judge_id}</strong>
                                  </td>
                                  <td>{judge.name}</td>
                                  <td>
                                    {new Date(judge.created_at).toLocaleDateString('ko-KR')}
                                  </td>
                                  <td>
                                    {judge.updated_at 
                                      ? new Date(judge.updated_at).toLocaleDateString('ko-KR')
                                      : '-'
                                    }
                                  </td>
                                  <td>
                                    <div className="btn-group" role="group">
                                      <button 
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => alert('수정 기능은 추후 구현 예정입니다.')}
                                      >
                                        수정
                                      </button>
                                      <button 
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => {
                                          if (window.confirm('정말로 이 심사위원을 삭제하시겠습니까?')) {
                                            alert('삭제 기능은 추후 구현 예정입니다.');
                                          }
                                        }}
                                      >
                                        삭제
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <div className="alert alert-info">
                          <h5>🔧 심사위원 관리 기능</h5>
                          <p className="mb-2">
                            현재는 심사위원 목록 조회만 가능합니다. 
                            심사위원 추가, 수정, 삭제 기능은 추후 구현 예정입니다.
                          </p>
                          <p className="mb-0">
                            <strong>기본 계정:</strong> admin / admin123
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 평가 결과 탭 */}
                {activeTab === 'evaluations' && (
                  <div className="tab-pane fade show active">
                    <div className="admin-card">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>📈 평가 결과</h4>
                        <button 
                          className="btn btn-primary"
                          onClick={fetchEvaluations}
                          disabled={loading}
                        >
                          {loading ? '로딩 중...' : '새로고침'}
                        </button>
                      </div>
                      
                      {evaluations.length === 0 ? (
                        <div className="alert alert-info text-center">
                          <h5>📝 아직 완료된 평가가 없습니다</h5>
                          <p className="mb-0">심사위원들이 평가를 완료하면 여기에 표시됩니다.</p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead className="table-dark">
                              <tr>
                                <th>프로젝트</th>
                                <th>팀명</th>
                                <th>심사위원</th>
                                <th>혁신성</th>
                                <th>실현가능성</th>
                                <th>효과성</th>
                                <th>총점</th>
                                <th>평가일</th>
                              </tr>
                            </thead>
                            <tbody>
                              {evaluations.map((evaluation) => (
                                <tr key={evaluation.id}>
                                  <td>
                                    <strong>{evaluation.project_name}</strong>
                                  </td>
                                  <td>{evaluation.team_name}</td>
                                  <td>{evaluation.judge_name}</td>
                                  <td>
                                    <span className="badge bg-primary">
                                      {evaluation.innovation_score}점
                                    </span>
                                  </td>
                                  <td>
                                    <span className="badge bg-info">
                                      {evaluation.feasibility_score}점
                                    </span>
                                  </td>
                                  <td>
                                    <span className="badge bg-warning">
                                      {evaluation.effectiveness_score}점
                                    </span>
                                  </td>
                                  <td>
                                    <strong className="text-success">
                                      {evaluation.total_score}점
                                    </strong>
                                  </td>
                                  <td>
                                    {new Date(evaluation.created_at).toLocaleDateString('ko-KR')}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
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
};

export default Admin;
