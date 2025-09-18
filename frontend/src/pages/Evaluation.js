import React, { useState, useEffect } from 'react';
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
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [viewMode, setViewMode] = useState('projects'); // 'projects' 또는 'detail'
  const [selectedProject, setSelectedProject] = useState(null);
  const [isTeamInfoExpanded, setIsTeamInfoExpanded] = useState(false);
  const [isProjectDetailExpanded, setIsProjectDetailExpanded] = useState(true);
  const [isEvaluationExpanded, setIsEvaluationExpanded] = useState(true);
  const [evaluationScores, setEvaluationScores] = useState({
    innovation: '',
    feasibility: '',
    effectiveness: ''
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState({
    innovation: false,
    feasibility: false,
    effectiveness: false
  });
  const [currentJudge, setCurrentJudge] = useState(null);
  const [isSubmittingEvaluation, setIsSubmittingEvaluation] = useState(false);
  const [hasExistingEvaluation, setHasExistingEvaluation] = useState(false);
  const [showOnlyUnevaluated, setShowOnlyUnevaluated] = useState(false);

  // currentJudge가 설정되면 프로젝트 목록을 자동으로 가져오기
  useEffect(() => {
    if (currentJudge && isLoggedIn) {
      fetchProjects();
    }
  }, [currentJudge, isLoggedIn]);

  // 필터링된 프로젝트 목록 계산
  const filteredProjects = showOnlyUnevaluated 
    ? projects.filter(project => !project.is_evaluated)
    : projects;

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
      setCurrentJudge(judgeData);
      setIsLoggedIn(true);
      setViewMode('projects');
    } catch (err) {
      console.error(err);
      setLoginError('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentJudge(null);
    setLoginData({ judgeId: '', password: '' });
    setLoginError('');
    setProjects([]);
    setViewMode('projects');
    setEvaluationScores({
      innovation: '',
      feasibility: '',
      effectiveness: ''
    });
    setHasExistingEvaluation(false);
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      let url = '/api/projects';
      if (currentJudge) {
        url += `?judge_id=${currentJudge.id}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('프로젝트 목록을 가져오는데 실패했습니다.');
      }
      const projectsData = await response.json();
      setProjects(projectsData);
    } catch (error) {
      console.error('프로젝트 목록 조회 오류:', error);
      alert('프로젝트 목록을 가져오는데 실패했습니다: ' + error.message);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchExistingEvaluation = async (aideaId, judgeId) => {
    try {
      const response = await fetch(`/api/evaluations/aidea/${aideaId}/judge/${judgeId}`);
      if (response.ok) {
        const evaluation = await response.json();
        // 점수를 등급으로 변환하여 상태에 설정
        setEvaluationScores({
          innovation: getGradeFromScore(evaluation.innovation_score, 'innovation'),
          feasibility: getGradeFromScore(evaluation.feasibility_score, 'feasibility'),
          effectiveness: getGradeFromScore(evaluation.effectiveness_score, 'effectiveness')
        });
        setHasExistingEvaluation(true);
        return evaluation;
      } else if (response.status === 404) {
        // 평가가 없는 경우 - 상태를 초기화
        setEvaluationScores({
          innovation: '',
          feasibility: '',
          effectiveness: ''
        });
        setHasExistingEvaluation(false);
        return null;
      } else {
        throw new Error('평가 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('기존 평가 조회 오류:', error);
      // 오류 발생 시 상태를 초기화
      setEvaluationScores({
        innovation: '',
        feasibility: '',
        effectiveness: ''
      });
      setHasExistingEvaluation(false);
      return null;
    }
  };

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setViewMode('detail');
    
    // 기존 평가 데이터 불러오기
    if (currentJudge) {
      await fetchExistingEvaluation(project.aidea.id, currentJudge.id);
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setViewMode('projects');
    // 평가 상태 초기화
    setEvaluationScores({
      innovation: '',
      feasibility: '',
      effectiveness: ''
    });
    setHasExistingEvaluation(false);
  };

  const toggleUnevaluatedFilter = () => {
    setShowOnlyUnevaluated(!showOnlyUnevaluated);
  };

  const handleGradeChange = (category, grade) => {
    setEvaluationScores(prev => ({
      ...prev,
      [category]: grade
    }));
  };

  const getGradeValue = (grade, category) => {
    if (category === 'innovation' || category === 'feasibility') {
      // 아이디어 혁신성, 기술 실현 가능성: UN(6), NI(12), GD(18), VG(24), EX(30)
      const gradeValues = { 'UN': 6, 'NI': 12, 'GD': 18, 'VG': 24, 'EX': 30 };
      return gradeValues[grade] || 0;
    } else {
      // 업무 효과성: UN(8), NI(16), GD(24), VG(32), EX(40)
      const gradeValues = { 'UN': 8, 'NI': 16, 'GD': 24, 'VG': 32, 'EX': 40 };
      return gradeValues[grade] || 0;
    }
  };

  const getGradeFromScore = (score, category) => {
    if (category === 'innovation' || category === 'feasibility') {
      // 아이디어 혁신성, 기술 실현 가능성: UN(6), NI(12), GD(18), VG(24), EX(30)
      const scoreToGrade = { 6: 'UN', 12: 'NI', 18: 'GD', 24: 'VG', 30: 'EX' };
      return scoreToGrade[score] || '';
    } else {
      // 업무 효과성: UN(8), NI(16), GD(24), VG(32), EX(40)
      const scoreToGrade = { 8: 'UN', 16: 'NI', 24: 'GD', 32: 'VG', 40: 'EX' };
      return scoreToGrade[score] || '';
    }
  };

  const getTotalScore = () => {
    return getGradeValue(evaluationScores.innovation, 'innovation') + 
           getGradeValue(evaluationScores.feasibility, 'feasibility') + 
           getGradeValue(evaluationScores.effectiveness, 'effectiveness');
  };

  const handleSubmitEvaluation = async () => {
    if (!currentJudge || !selectedProject) {
      alert('로그인 정보 또는 프로젝트 정보가 없습니다.');
      return;
    }

    // 모든 평가 항목이 선택되었는지 확인
    if (!evaluationScores.innovation || !evaluationScores.feasibility || !evaluationScores.effectiveness) {
      alert('모든 평가 항목을 선택해주세요.');
      return;
    }

    setIsSubmittingEvaluation(true);
    try {
      const evaluationData = {
        aidea_id: selectedProject.aidea.id,
        judge_id: currentJudge.id,
        innovation_score: getGradeValue(evaluationScores.innovation, 'innovation'),
        feasibility_score: getGradeValue(evaluationScores.feasibility, 'feasibility'),
        effectiveness_score: getGradeValue(evaluationScores.effectiveness, 'effectiveness')
      };

      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluationData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || '평가 제출에 실패했습니다.');
      }

      const result = await response.json();
      console.log('평가 제출 성공:', result);
      
      const message = hasExistingEvaluation 
        ? `평가가 수정되었습니다!\n총점: ${result.total_score}/100점`
        : `평가가 완료되었습니다!\n총점: ${result.total_score}/100점`;
      
      alert(message);
      
      // 평가 완료 후 상태는 유지 (기존 평가가 체크된 상태로 유지)
      setHasExistingEvaluation(true);
      
      // 프로젝트 목록 새로고침하여 평가 여부 업데이트
      fetchProjects();
      
    } catch (error) {
      console.error('평가 제출 오류:', error);
      alert('평가 제출 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsSubmittingEvaluation(false);
    }
  };

  const toggleDescription = (category) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="evaluation-page">
        <div className="evaluation-hero section-padding">
          <div className="container text-center">
            <h1 className="evaluation-title">평가</h1>
            <p className="evaluation-subtitle">
            슬슬 AIdea 2025 심사위원을 위한 페이지 입니다.
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
                                <strong>주 사용자:</strong>
                                <div className="detail-content">
                                  {selectedProject.aidea.target_user || "미입력"}
                                </div>
                              </div>                              
                              <div className="detail-item">
                                <strong>문제 정의:</strong>
                                <div className="detail-content">
                                  {selectedProject.aidea.problem || "미입력"}
                                </div>
                              </div>
                              <div className="detail-item">
                                <strong>해결 방법:</strong>
                                <div className="detail-content">
                                  {selectedProject.aidea.solution || "미입력"}
                                </div>
                              </div>
                              <div className="detail-item">
                                <strong>활용 데이터:</strong>
                                <div className="detail-content">
                                  {selectedProject.aidea.data_sources || "미입력"}
                                </div>
                              </div>
                              <div className="detail-item">
                                <strong>동작 시나리오:</strong>
                                <div className="detail-content">
                                  {selectedProject.aidea.scenario || "미입력"}
                                </div>
                              </div>
                              <div className="detail-item">
                                <strong>기대효과:</strong>
                                <div className="detail-content">
                                  {selectedProject.aidea.benefit || "미입력"}
                                </div>
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
                            onClick={() => setIsEvaluationExpanded(!isEvaluationExpanded)}
                            style={{cursor: 'pointer'}}
                          >
                            <h4>📊 평가하기</h4>
                            <span className="expand-icon">
                              {isEvaluationExpanded ? '▼' : '▶'}
                            </span>
                          </div>
                          {isEvaluationExpanded && (
                            <div className="detail-card-content">
                              <div className="evaluation-form">
                                <div className="evaluation-item">
                                  <div className="evaluation-header">
                                    <div className="evaluation-title-section">
                                      <strong>아이디어 혁신성</strong>
                                      <span className="grade-display">
                                        {evaluationScores.innovation || '미선택'}
                                        {evaluationScores.innovation && ` (${getGradeValue(evaluationScores.innovation, 'innovation')}점)`}
                                      </span>
                                    </div>
                                    <div className="grade-options-inline">
                                      {['UN', 'NI', 'GD', 'VG', 'EX'].map((grade) => (
                                        <label key={grade} className="grade-option">
                                          <input
                                            type="radio"
                                            name="innovation"
                                            value={grade}
                                            checked={evaluationScores.innovation === grade}
                                            onChange={(e) => handleGradeChange('innovation', e.target.value)}
                                          />
                                          <span className="grade-label">{grade}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="score-description">
                                    <div 
                                      className="description-header"
                                      onClick={() => toggleDescription('innovation')}
                                      style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                                    >
                                      <span>새로운 아이디어의 창의성과 혁신성을 평가합니다.</span>
                                      <span className="expand-icon-small">
                                        {expandedDescriptions.innovation ? '▼' : '▶'}
                                      </span>
                                    </div>
                                    {expandedDescriptions.innovation && (
                                      <div className="detailed-description">
                                        <h6>평가 기준:</h6>
                                        <ul>
                                          <li><strong>EX (30점):</strong> 완전히 새로운 접근법이나 혁신적인 아이디어로, 기존 방식과 완전히 차별화됨</li>
                                          <li><strong>VG (24점):</strong> 기존 아이디어를 크게 개선하거나 새로운 관점을 제시함</li>
                                          <li><strong>GD (18점):</strong> 기존 아이디어에 일부 개선사항이나 새로운 요소를 추가함</li>
                                          <li><strong>NI (12점):</strong> 기존 아이디어와 유사하지만 약간의 차별점이 있음</li>
                                          <li><strong>UN (6점):</strong> 기존 아이디어와 거의 동일하거나 혁신성이 부족함</li>
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="evaluation-item">
                                  <div className="evaluation-header">
                                    <div className="evaluation-title-section">
                                      <strong>기술 실현 가능성</strong>
                                      <span className="grade-display">
                                        {evaluationScores.feasibility || '미선택'}
                                        {evaluationScores.feasibility && ` (${getGradeValue(evaluationScores.feasibility, 'feasibility')}점)`}
                                      </span>
                                    </div>
                                    <div className="grade-options-inline">
                                      {['UN', 'NI', 'GD', 'VG', 'EX'].map((grade) => (
                                        <label key={grade} className="grade-option">
                                          <input
                                            type="radio"
                                            name="feasibility"
                                            value={grade}
                                            checked={evaluationScores.feasibility === grade}
                                            onChange={(e) => handleGradeChange('feasibility', e.target.value)}
                                          />
                                          <span className="grade-label">{grade}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="score-description">
                                    <div 
                                      className="description-header"
                                      onClick={() => toggleDescription('feasibility')}
                                      style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                                    >
                                      <span>제안된 기술의 구현 가능성과 현실성을 평가합니다.</span>
                                      <span className="expand-icon-small">
                                        {expandedDescriptions.feasibility ? '▼' : '▶'}
                                      </span>
                                    </div>
                                    {expandedDescriptions.feasibility && (
                                      <div className="detailed-description">
                                        <h6>평가 기준:</h6>
                                        <ul>
                                          <li><strong>EX (30점):</strong> 현재 기술로 완전히 구현 가능하며, 명확한 로드맵과 구체적인 실행 계획이 있음</li>
                                          <li><strong>VG (24점):</strong> 대부분 구현 가능하며, 일부 기술적 도전과제가 있지만 해결 가능함</li>
                                          <li><strong>GD (18점):</strong> 기본적인 구현은 가능하지만, 상당한 기술적 개선이나 추가 개발이 필요함</li>
                                          <li><strong>NI (12점):</strong> 구현 가능성은 있지만, 기술적 제약이나 리소스 부족으로 어려움이 예상됨</li>
                                          <li><strong>UN (6점):</strong> 현재 기술 수준으로는 구현이 매우 어렵거나 불가능함</li>
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="evaluation-item">
                                  <div className="evaluation-header">
                                    <div className="evaluation-title-section">
                                      <strong>업무 효과성</strong>
                                      <span className="grade-display">
                                        {evaluationScores.effectiveness || '미선택'}
                                        {evaluationScores.effectiveness && ` (${getGradeValue(evaluationScores.effectiveness, 'effectiveness')}점)`}
                                      </span>
                                    </div>
                                    <div className="grade-options-inline">
                                      {['UN', 'NI', 'GD', 'VG', 'EX'].map((grade) => (
                                        <label key={grade} className="grade-option">
                                          <input
                                            type="radio"
                                            name="effectiveness"
                                            value={grade}
                                            checked={evaluationScores.effectiveness === grade}
                                            onChange={(e) => handleGradeChange('effectiveness', e.target.value)}
                                          />
                                          <span className="grade-label">{grade}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="score-description">
                                    <div 
                                      className="description-header"
                                      onClick={() => toggleDescription('effectiveness')}
                                      style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                                    >
                                      <span>업무 효율성 향상과 비즈니스 가치 창출을 평가합니다.</span>
                                      <span className="expand-icon-small">
                                        {expandedDescriptions.effectiveness ? '▼' : '▶'}
                                      </span>
                                    </div>
                                    {expandedDescriptions.effectiveness && (
                                      <div className="detailed-description">
                                        <h6>평가 기준:</h6>
                                        <ul>
                                          <li><strong>EX (40점):</strong> 업무 효율성이 극적으로 향상되며, 명확한 ROI와 비즈니스 임팩트가 예상됨</li>
                                          <li><strong>VG (32점):</strong> 상당한 업무 효율성 향상과 비즈니스 가치 창출이 기대됨</li>
                                          <li><strong>GD (24점):</strong> 일정 수준의 업무 개선과 비즈니스 효과가 예상됨</li>
                                          <li><strong>NI (16점):</strong> 약간의 업무 개선은 있지만, 비즈니스 임팩트는 제한적임</li>
                                          <li><strong>UN (8점):</strong> 업무 개선 효과가 미미하거나 비즈니스 가치가 불분명함</li>
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="evaluation-summary">
                                  <div className="total-score">
                                    <strong>총점: {getTotalScore()}/100</strong>
                                  </div>
                                </div>
                                
                                <div className="evaluation-actions">
                                  <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={handleSubmitEvaluation}
                                    disabled={isSubmittingEvaluation}
                                  >
                                    {isSubmittingEvaluation 
                                      ? '제출 중...' 
                                      : hasExistingEvaluation 
                                        ? '평가 수정' 
                                        : '평가 제출'
                                    }
                                  </button>
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

  if (isLoggedIn) {
    return (
      <div className="evaluation-page">
        <div className="evaluation-hero section-padding">
          <div className="container text-center">
            <h1 className="evaluation-title">심사위원 평가</h1>
            <p className="evaluation-subtitle">
              슬슬 AIdea 2025에 제출된 프로젝트들을 평가해주세요
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

        <div className="evaluation-content section-padding">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="projects-full-section">
                  <div className="alert alert-info">
                    <p className="mb-0">
                      📋 심사위원으로 로그인하셨습니다. 제출된 프로젝트들을 평가해주세요.
                    </p>
                  </div>
                  
                  <div className="projects-header">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2>📊 제출된 프로젝트</h2>
                      <div>
                        <button 
                          className="btn btn-primary"
                          onClick={fetchProjects}
                          disabled={loadingProjects}
                        >
                          {loadingProjects ? '로딩 중...' : '새로고침'}
                        </button>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="text-muted mb-0">
                        총 {projects.length}개의 프로젝트가 제출되었습니다.
                        {currentJudge && (
                          <span className="ms-3">
                            <span className="badge bg-success me-2">
                              평가 완료: {projects.filter(p => p.is_evaluated).length}개
                            </span>
                            <span className="badge bg-secondary">
                              미평가: {projects.filter(p => !p.is_evaluated).length}개
                            </span>
                          </span>
                        )}
                      </p>
                      {currentJudge && (
                        <div className="filter-toggle-container">
                          <div className="form-check form-switch">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="unevaluatedFilter"
                              checked={showOnlyUnevaluated}
                              onChange={toggleUnevaluatedFilter}
                            />
                            <label className="form-check-label" htmlFor="unevaluatedFilter">
                              미평가만 보기
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {filteredProjects.length === 0 ? (
                    <div className="alert alert-info text-center">
                      <h5>📝 {showOnlyUnevaluated ? '미평가 프로젝트가 없습니다' : '아직 제출된 프로젝트가 없습니다'}</h5>
                      <p className="mb-0">
                        {showOnlyUnevaluated 
                          ? '모든 프로젝트를 평가 완료했습니다!' 
                          : '참가자들이 프로젝트를 제출하면 여기에 표시됩니다.'
                        }
                      </p>
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
                              <th>상태</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProjects.map((project, index) => (
                              <tr key={project.aidea.id} onClick={() => handleProjectClick(project)} style={{cursor: 'pointer'}}>
                                <td>{project.account.department || "미입력"}</td>
                                <td>{project.account.team_name || "미입력"}</td>
                                <td>
                                  <strong>{project.aidea.project}</strong>
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

  // 로그인되지 않은 상태에서는 로그인 폼 표시
  return null;
};

export default Evaluation;
