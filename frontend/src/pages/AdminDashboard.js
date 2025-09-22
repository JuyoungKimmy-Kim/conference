import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('aideas');
  const [accounts, setAccounts] = useState([]);
  const [accountsWithAideas, setAccountsWithAideas] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAidea, setSelectedAidea] = useState(null);
  const [showAideaDetail, setShowAideaDetail] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEvaluationDepartment, setSelectedEvaluationDepartment] = useState('all');
  const [showJudgeForm, setShowJudgeForm] = useState(false);
  const [judgeFormData, setJudgeFormData] = useState({
    judge_id: '',
    password: '',
    name: ''
  });
  const [isJudgeProgressExpanded, setIsJudgeProgressExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  // 브라우저 뒤로가기 이벤트 처리
  useEffect(() => {
    const handlePopState = (event) => {
      // Aidea 세부 정보 화면에서 뒤로가기를 누르면 목록으로 돌아가기
      if (showAideaDetail && selectedAidea) {
        goBackToList();
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showAideaDetail, selectedAidea]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [accountsRes, aideasRes, evaluationsRes, judgesRes] = await Promise.all([
        axios.get('/api/admin/accounts', { headers }),
        axios.get('/api/admin/aideas', { headers }),
        axios.get('/api/admin/evaluations', { headers }),
        axios.get('/api/admin/judges', { headers })
      ]);
      
      setAccounts(accountsRes.data.accounts);
      setAccountsWithAideas(aideasRes.data.accounts);
      setEvaluations(evaluationsRes.data);
      setJudges(judgesRes.data.judges);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleJudgeFormChange = (e) => {
    const { name, value } = e.target;
    setJudgeFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateJudge = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post('/api/admin/judges', judgeFormData, { headers });
      
      // 폼 초기화
      setJudgeFormData({
        judge_id: '',
        password: '',
        name: ''
      });
      setShowJudgeForm(false);
      
      // 데이터 다시 로드
      await loadData();
      
      alert('심사위원이 성공적으로 생성되었습니다.');
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError(err.response?.data?.detail || '심사위원 생성에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAideaClick = (aidea) => {
    setSelectedAidea(aidea);
    setShowAideaDetail(true);
    
    // 브라우저 히스토리에 상태 추가
    window.history.pushState({ showAideaDetail: true, aideaId: aidea.id }, '', window.location.pathname);
  };

  const goBackToList = () => {
    setShowAideaDetail(false);
    setSelectedAidea(null);
    
    // 브라우저 히스토리 업데이트
    window.history.pushState({ showAideaDetail: false }, '', window.location.pathname);
  };

  // Department 목록 가져오기
  const getDepartments = () => {
    const departments = new Set();
    if (accountsWithAideas && Array.isArray(accountsWithAideas)) {
      accountsWithAideas.forEach(account => {
        if (account.department) {
          departments.add(account.department);
        }
      });
    }
    return Array.from(departments).sort();
  };

  // 필터링된 Aidea 목록 가져오기
  const getFilteredAideas = () => {
    const allAideas = [];
    
    if (accountsWithAideas && Array.isArray(accountsWithAideas)) {
      accountsWithAideas.forEach(account => {
        if (selectedDepartment === 'all' || account.department === selectedDepartment) {
          if (account.aideas && Array.isArray(account.aideas)) {
            account.aideas.forEach(aidea => {
              allAideas.push({ aidea, account });
            });
          }
        }
      });
    }
    return allAideas;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  // 심사위원별 진행사항 계산
  const _calculateJudgeProgress = () => {
    if (!judges || !evaluations || !accountsWithAideas) return [];

    // 전체 프로젝트 수 계산
    const totalProjects = accountsWithAideas.length;

    // 심사위원별 평가한 프로젝트 수 계산
    const judgeProgress = judges.map(judge => {
      const evaluatedCount = evaluations.filter(evaluation => 
        evaluation.judge_id === judge.id
      ).length;

      return {
        judge,
        evaluatedCount,
        totalProjects,
        progressPercentage: totalProjects > 0 ? Math.round((evaluatedCount / totalProjects) * 100) : 0
      };
    });

    // 평가한 프로젝트 수 기준으로 내림차순 정렬
    return judgeProgress.sort((a, b) => b.evaluatedCount - a.evaluatedCount);
  };

  // 심사 결과에서 부서 목록 가져오기
  const _getEvaluationDepartments = () => {
    const departments = new Set();
    if (evaluations && accountsWithAideas) {
      evaluations.forEach(evaluation => {
        for (const account of accountsWithAideas) {
          if (account.aideas) {
            const aidea = account.aideas.find(a => a.id === evaluation.aidea_id);
            if (aidea && account.department) {
              departments.add(account.department);
              break;
            }
          }
        }
      });
    }
    return Array.from(departments).sort();
  };

  // 심사 결과와 Aidea 정보를 결합하고 프로젝트별로 그룹화
  const _getEvaluationsWithAideaInfo = () => {
    if (!evaluations || !accountsWithAideas) return [];

    const evaluationsWithInfo = evaluations.map(evaluation => {
      // 해당 evaluation의 aidea_id로 aidea와 account 정보 찾기
      let aideaInfo = null;
      let accountInfo = null;

      for (const account of accountsWithAideas) {
        if (account.aideas) {
          const aidea = account.aideas.find(a => a.id === evaluation.aidea_id);
          if (aidea) {
            aideaInfo = aidea;
            accountInfo = account;
            break;
          }
        }
      }

      return {
        ...evaluation,
        aidea: aideaInfo,
        account: accountInfo
      };
    });

    // aidea_id별로 그룹화 (같은 프로젝트라도 다른 aidea_id는 별도 행으로 표시)
    const groupedByAidea = {};
    evaluationsWithInfo.forEach(evaluation => {
      const aideaKey = evaluation.aidea_id;
      if (!groupedByAidea[aideaKey]) {
        groupedByAidea[aideaKey] = {
          aidea: evaluation.aidea,
          account: evaluation.account,
          evaluations: []
        };
      }
      groupedByAidea[aideaKey].evaluations.push(evaluation);
    });

    // 그룹화된 데이터를 배열로 변환
    let projectGroups = Object.values(groupedByAidea);
    
    // 부서별 필터링 적용
    if (selectedEvaluationDepartment !== 'all') {
      projectGroups = projectGroups.filter(group => 
        group.account?.department === selectedEvaluationDepartment
      );
    }
    
    // 각 프로젝트의 총점을 계산하여 정렬
    return projectGroups.sort((a, b) => {
      const totalScoreA = a.evaluations.reduce((sum, evaluation) => sum + evaluation.total_score, 0);
      const totalScoreB = b.evaluations.reduce((sum, evaluation) => sum + evaluation.total_score, 0);
      return totalScoreB - totalScoreA; // 높은 점수부터 정렬
    });
  };

  const renderAccounts = () => {
    const accountsList = accounts || [];
    
    return (
      <div className="data-section">
        <div className="section-header">
          <h3>등록된 계정 ({accountsList.length}개)</h3>
        </div>
        
        <div className="projects-list">
          <div className="table-responsive">
            <table className="table table-hover accounts-table">
              <thead className="table-dark">
                <tr>
                  <th>Knox ID</th>
                  <th>이름</th>
                  <th>팀명</th>
                  <th>부서</th>
                  <th>팀원 수</th>
                </tr>
              </thead>
              <tbody>
                {accountsList.map((account) => (
                  <tr key={account.id}>
                    <td>
                      <strong>{account.knox_id}</strong>
                    </td>
                    <td>{account.name || '-'}</td>
                    <td>{account.team_name || '-'}</td>
                    <td>{account.department || '-'}</td>
                    <td>
                      <span className="badge bg-primary">
                        {account.team_members?.length || 0}명
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAideas = () => {
    const filteredAideas = getFilteredAideas();
    const departments = getDepartments();

    return (
      <div className="data-section">
        <div className="section-header">
          <h3>등록된 Aidea ({filteredAideas.length}개)</h3>
          <div className="filter-controls">
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="department-filter"
            >
              <option value="all">전체 부서</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="aidea-list">
          {filteredAideas.map((item) => (
            <div 
              key={item.aidea.id} 
              className="aidea-list-item"
              onClick={() => handleAideaClick({...item.aidea, account: item.account})}
            >
              <div className="aidea-list-content">
                <h4 className="aidea-project-name">{item.aidea.project}</h4>
                <div className="aidea-list-team-info">
                  {item.account?.team_name && (
                    <span className="team-name">팀: {item.account.team_name}</span>
                  )}
                  {item.account?.department && (
                    <span className="department">부서: {item.account.department}</span>
                  )}
                </div>
                <div className="aidea-list-meta">
                  <span className="aidea-date">{formatDate(item.aidea.created_at)}</span>
                </div>
              </div>
              <div className="aidea-list-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEvaluations = () => {
    const evaluationsWithInfo = _getEvaluationsWithAideaInfo();
    const evaluationDepartments = _getEvaluationDepartments();
    const judgeProgress = _calculateJudgeProgress();

    return (
      <div className="data-section">
        <div className="section-header">
          <h3>심사 결과 </h3>
          <div className="filter-controls">
            <select 
              value={selectedEvaluationDepartment} 
              onChange={(e) => setSelectedEvaluationDepartment(e.target.value)}
              className="department-filter"
            >
              <option value="all">전체 부서</option>
              {evaluationDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 심사위원별 진행사항 */}
        {judgeProgress.length > 0 && (
          <div className="judge-progress-section">
            <div className="judge-progress-header" onClick={() => setIsJudgeProgressExpanded(!isJudgeProgressExpanded)}>
              <h4>심사위원별 진행사항</h4>
              <button className="expand-toggle-btn">
                <span className={`expand-icon ${isJudgeProgressExpanded ? 'expanded' : 'collapsed'}`}>
                  ▼
                </span>
              </button>
            </div>
            <div className={`judge-progress-content ${isJudgeProgressExpanded ? 'expanded' : 'collapsed'}`}>
              <div className="judge-progress-list">
                {judgeProgress.map((progress, index) => (
                  <div key={progress.judge.id} className="judge-progress-item">
                    <div className="judge-info">
                      <span className="judge-name">{progress.judge.name}</span>
                      <span className="progress-text">
                        ({progress.evaluatedCount}/{progress.totalProjects})
                      </span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar"
                        style={{ width: `${progress.progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="progress-percentage">
                      {progress.progressPercentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 심사 결과 테이블 */}
        <div className="projects-list">
          <div className="table-responsive">
            <table className="table table-hover evaluations-table">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>프로젝트명</th>
                  <th>팀명</th>
                  <th>부서</th>
                  <th>심사위원</th>
                  <th>총점</th>
                </tr>
              </thead>
              <tbody>
                {evaluationsWithInfo.map((projectGroup, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{projectGroup.aidea?.id || '-'}</strong>
                    </td>
                    <td>
                      <strong>{projectGroup.aidea?.project || '-'}</strong>
                    </td>
                    <td>{projectGroup.account?.team_name || '-'}</td>
                    <td>{projectGroup.account?.department || '-'}</td>
                    <td>
                      {projectGroup.evaluations.map((evaluation, evalIndex) => (
                        <span key={evalIndex}>
                          {evaluation.judge?.name || '-'}({evaluation.total_score})
                          {evalIndex < projectGroup.evaluations.length - 1 && ', '}
                        </span>
                      ))}
                    </td>
                    <td>
                      <span className="badge bg-success">
                        {projectGroup.evaluations.reduce((sum, evaluation) => sum + evaluation.total_score, 0)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {evaluationsWithInfo.length === 0 && (
          <div className="no-data">
            <p>아직 심사 결과가 없습니다.</p>
          </div>
        )}
      </div>
    );
  };

  const renderJudges = () => {
    const judgesList = judges || [];

    return (
      <div className="data-section">
        <div className="section-header">
          <h3>심사위원 관리 ({judgesList.length}명)</h3>
          <button 
            className="btn btn-primary"
            onClick={() => setShowJudgeForm(true)}
          >
            + 심사위원 추가
          </button>
        </div>

        {/* 심사위원 목록 테이블 */}
        <div className="projects-list">
          <div className="table-responsive">
            <table className="table table-hover judges-table">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>심사위원 ID</th>
                  <th>이름</th>
                  <th>생성일</th>
                </tr>
              </thead>
              <tbody>
                {judgesList.map((judge) => (
                  <tr key={judge.id}>
                    <td>
                      <strong>{judge.id}</strong>
                    </td>
                    <td>{judge.judge_id}</td>
                    <td>{judge.name}</td>
                    <td>{formatDate(judge.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {judgesList.length === 0 && (
          <div className="no-data">
            <p>등록된 심사위원이 없습니다.</p>
          </div>
        )}

        {/* 심사위원 생성 폼 모달 */}
        {showJudgeForm && (
          <div className="modal-overlay" onClick={() => setShowJudgeForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h4>심사위원 추가</h4>
                <button 
                  className="close-button"
                  onClick={() => setShowJudgeForm(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateJudge}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="judge_id">심사위원 ID *</label>
                    <input
                      type="text"
                      id="judge_id"
                      name="judge_id"
                      value={judgeFormData.judge_id}
                      onChange={handleJudgeFormChange}
                      required
                      className="form-control"
                      placeholder="심사위원 ID를 입력하세요"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">비밀번호 *</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={judgeFormData.password}
                      onChange={handleJudgeFormChange}
                      required
                      className="form-control"
                      placeholder="비밀번호를 입력하세요"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="name">이름 *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={judgeFormData.name}
                      onChange={handleJudgeFormChange}
                      required
                      className="form-control"
                      placeholder="심사위원 이름을 입력하세요"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowJudgeForm(false)}
                  >
                    취소
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? '생성 중...' : '생성'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // Aidea 세부 정보 페이지
  if (showAideaDetail && selectedAidea) {
    return (
      <div className="admin-dashboard">
        <div className="admin-header">
          <div className="header-left">
            <h1>Aidea 세부 정보</h1>
          </div>
          <div className="admin-actions">
            <button onClick={goBackToList} className="back-button">
              ← 목록으로 돌아가기
            </button>
            <button onClick={handleLogout} className="logout-button">
              로그아웃
            </button>
          </div>
        </div>

        <div className="aidea-detail-page">
          <div className="aidea-detail-header">
            <h2>{selectedAidea.project}</h2>
            <div className="aidea-detail-meta">
              <span className="aidea-date">등록일: {formatDate(selectedAidea.created_at)}</span>
            </div>
          </div>

          <div className="aidea-detail-content">
            <div className="aidea-detail-field">
              <h3>등록자 정보</h3>
              <div className="account-info-detail">
                <p><strong>Knox ID:</strong> {selectedAidea.account?.knox_id || '-'}</p>
                <p><strong>이름:</strong> {selectedAidea.account?.name || '-'}</p>
                <p><strong>팀명:</strong> {selectedAidea.account?.team_name || '-'}</p>
                <p><strong>부서:</strong> {selectedAidea.account?.department || '-'}</p>
              </div>
            </div>

            {selectedAidea.account?.team_members && selectedAidea.account.team_members.length > 0 && (
              <div className="aidea-detail-field">
                <h3>팀 멤버</h3>
                <div className="team-members-detail">
                  <p><strong>팀 멤버:</strong> {selectedAidea.account.team_members.map(member => member.name || '-').join(', ')}</p>
                </div>
              </div>
            )}

            {selectedAidea.target_user && (
              <div className="aidea-detail-field">
                <h3>주 사용자</h3>
                <p>{selectedAidea.target_user}</p>
              </div>
            )}
            
            <div className="aidea-detail-field">
              <h3>문제 정의</h3>
              <p>{selectedAidea.problem && selectedAidea.problem.trim() ? selectedAidea.problem : '(미입력)'}</p>
            </div>
            
            <div className="aidea-detail-field">
              <h3>해결 방법</h3>
              <p>{selectedAidea.solution && selectedAidea.solution.trim() ? selectedAidea.solution : '(미입력)'}</p>
            </div>
            
            <div className="aidea-detail-field">
              <h3>활용 데이터</h3>
              <p>{selectedAidea.data_sources && selectedAidea.data_sources.trim() ? selectedAidea.data_sources : '(미입력)'}</p>
            </div>
            
            <div className="aidea-detail-field">
              <h3>동작 시나리오</h3>
              <p>{selectedAidea.scenario && selectedAidea.scenario.trim() ? selectedAidea.scenario : '(미입력)'}</p>
            </div>
            
            <div className="aidea-detail-field">
              <h3>기대효과</h3>
              <p>{selectedAidea.benefit && selectedAidea.benefit.trim() ? selectedAidea.benefit : '미입력'}</p>
            </div>
            
            {selectedAidea.updated_at && (
              <div className="aidea-detail-field">
                <h3>수정일</h3>
                <p>{formatDate(selectedAidea.updated_at)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>관리자 대시보드</h1>
        <div className="admin-actions">
          <button onClick={loadData} className="refresh-button">
            새로고침
          </button>
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'aideas' ? 'active' : ''}`}
          onClick={() => setActiveTab('aideas')}
        >
          Aidea 관리
        </button>
        <button
          className={`tab-button ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          계정 관리
        </button>
        <button
          className={`tab-button ${activeTab === 'judges' ? 'active' : ''}`}
          onClick={() => setActiveTab('judges')}
        >
          심사위원 관리
        </button>
        <button
          className={`tab-button ${activeTab === 'evaluations' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluations')}
        >
          심사 결과
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="admin-content">
        {activeTab === 'accounts' ? renderAccounts() : 
         activeTab === 'judges' ? renderJudges() :
         activeTab === 'evaluations' ? renderEvaluations() : 
         renderAideas()}
      </div>
    </div>
  );
};

export default AdminDashboard;
