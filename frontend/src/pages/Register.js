import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [currentStep, setCurrentStep] = useState('login'); // 'login' 또는 'register'
  const [loginData, setLoginData] = useState({
    id: '',
    knoxId: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    team: '',
    // Aidea 필드들
    project: '',
    persona: '',
    problem: '',
    solution: '',
    data_sources: '',
    scenario: '',
    workflow: '',
    benefit: '' // 기대효과 필드 추가
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: '',
    knoxId: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [teamMemberLimitError, setTeamMemberLimitError] = useState('');
  const [hasExistingData, setHasExistingData] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTeamMember = () => {
    if (teamMembers.length >= 3) {
      setTeamMemberLimitError('팀원은 본인 포함 최대 4명까지 가능합니다.');
      return;
    }
    
    if (newMember.name && newMember.knoxId) {
      if (newMember.knoxId === loginData.knoxId) {
        setTeamMemberLimitError('본인 Knox ID와 동일한 팀원을 추가할 수 없습니다.');
        return;
      }

      if (teamMembers.some(member => member.knoxId === newMember.knoxId)) {
        setTeamMemberLimitError('동일한 Knox ID인 팀원이 존재합니다.');
        return;
      }

      const member = {
        id: Date.now(),
        name: newMember.name,
        knoxId: newMember.knoxId
      };
      setTeamMembers(prev => [...prev, member]);
      setNewMember({ name: '', knoxId: '' });
      setTeamMemberLimitError('');
    }
  };

  const removeTeamMember = (id) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
    setTeamMemberLimitError('');
  };

  const loadExistingData = (accountData) => {
    if (accountData.name || accountData.team_name) {
      setFormData({
        name: accountData.name || '',
        team: accountData.team_name || '',
        // Aidea 데이터 로드
        project: accountData.aideas?.[0]?.project || '',
        persona: accountData.aideas?.[0]?.persona || '',
        problem: accountData.aideas?.[0]?.problem || '',
        solution: accountData.aideas?.[0]?.solution || '',
        data_sources: accountData.aideas?.[0]?.data_sources || '',
        scenario: accountData.aideas?.[0]?.scenario || '',
        workflow: accountData.aideas?.[0]?.workflow || '',
        benefit: accountData.aideas?.[0]?.benefit || '' // 기대효과 필드 추가
      });
      
      if (accountData.team_members && accountData.team_members.length > 0) {
        const members = accountData.team_members.map((member, index) => ({
          id: Date.now() + index,
          name: member.name,
          knoxId: member.knox_id
        }));
        setTeamMembers(members);
      }
      
      setHasExistingData(true);
    } else {
      setHasExistingData(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setLoginError('');
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ knox_id: loginData.knoxId, password: loginData.password })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        
        if (res.status === 400) {
          setLoginError(errorData.detail || '비밀번호는 필수입니다.');
        } else if (res.status === 401) {
          setLoginError(errorData.detail || '패스워드가 다릅니다.');
        } else {
          setLoginError('로그인에 실패했습니다. 다시 시도해 주세요.');
        }
        return;
      }
      
      const accountData = await res.json();
      loadExistingData(accountData);
      setLoginData(prev => ({ ...prev, id: accountData.id }));

      setCurrentStep('register');
    } catch (err) {
      console.error(err);
      setLoginError('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const registrationData = {
        id: loginData.id,
        knox_id: loginData.knoxId,
        name: formData.name,
        team_name: formData.team,
        team_members: teamMembers.map(member => ({
          name: member.name,
          knox_id: member.knoxId
        })),
        // Aidea 데이터 추가
        project: formData.project,
        persona: formData.persona,
        problem: formData.problem,
        solution: formData.solution,
        data_sources: formData.data_sources,
        scenario: formData.scenario,
        workflow: formData.workflow,
        benefit: formData.benefit // 기대효과 필드 추가
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || '등록에 실패했습니다.');
      }

      await response.json();
      setSubmitSuccess(true);
    } catch (error) {
      console.error('등록 실패:', error);
      alert('등록에 실패했습니다: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 'login') {
    return (
      <div className="register-page">
        <div className="register-hero section-padding">
          <div className="container text-center">
            <h1 className="register-title">경진대회 등록</h1>
            <p className="register-subtitle">
              슬슬 AIdea Agent에 참여하고 싶으시다면 지금 바로 등록하세요!
            </p>
          </div>
        </div>

        <div className="register-content section-padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 mx-auto">
                <div className="register-form-container">
                  <form onSubmit={handleLoginSubmit} className="register-form">
                    <div className="form-section">
                      <h3>로그인 정보</h3>
                      <div className="mb-3">
                        <label htmlFor="knoxId" className="form-label">knox id *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="knoxId"
                          name="knoxId"
                          value={loginData.knoxId}
                          onChange={handleLoginInputChange}
                          required
                          placeholder="아이디를 입력하세요"
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
                    별도의 회원가입은 필요하지 않습니다.<br />
                    최초 로그인 시 입력한 Knox ID와 비밀번호가 계정으로 등록됩니다. 
                    설정한 비밀번호는 꼭 기억해 주세요.
                    </small>
                    <div className="form-submit">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={!loginData.knoxId || !loginData.password || isSubmitting}
                      >
                        {isSubmitting ? '로그인 중...' : '다음 단계로'}
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

  if (submitSuccess) {
    return (
      <div className="register-success">
        <div className="container text-center">
          <div className="success-icon">✅</div>
          <h1>등록이 완료되었습니다!</h1>
          <p>슬슬 AIdea Agent 2025에 참여해주셔서 감사합니다.</p>
          <p>등록 확인 이메일을 발송했습니다. 이메일을 확인해주세요.</p>
          <button 
            className="btn btn-primary mt-4"
            onClick={() => window.location.href = '/'}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-hero section-padding">
        <div className="container text-center">
          <h1 className="register-title">경진대회 등록</h1>
          <p className="register-subtitle">
            슬슬 AIdea Agent에 참여하고 싶으시다면 지금 바로 등록하세요!
          </p>
        </div>
      </div>

      <div className="register-content section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="register-form-container">
                <form onSubmit={handleSubmit} className="register-form">
                <div
                  className="alert alert-danger d-flex align-items-center mb-4"
                  role="alert"
                  style={{ borderRadius: 12 }}
                >
                  <span className="me-2" aria-hidden="true">⚠️</span>
                  <div>
                    작성한 내용은 자동으로 저장되지 않습니다. <br />저장하기 버튼을 눌러 저장해 주세요.
                  </div>
                </div>
                {hasExistingData ? (
                  <div
                    className="alert alert-info d-flex align-items-center mb-4"
                    role="alert"
                    style={{ borderRadius: 12 }}
                  >
                    <span className="me-2" aria-hidden="true">ℹ️</span>
                    <div>
                      기존에 작성하신 내용을 불러왔습니다.<br /> 필요에 따라 수정하신 후 저장해주세요.
                    </div>
                  </div>
                ) : (
                  <div
                    className="alert alert-danger d-flex align-items-center mb-4"
                    role="alert"
                    style={{ borderRadius: 12 }}
                  >
                    <span className="me-2" aria-hidden="true">⚠️</span>
                    <div>
                      저장한 후에는 사용한 Knox id와 비밀번호로 조회 및 수정하실 수 있습니다.
                    </div>
                  </div>
                )}

                  <div className="form-section">
                    <h3>기본 정보</h3>
                    <div className="mb-3">
                      <label htmlFor="knoxId" className="form-label">Knox ID</label>
                        <input
                          type="text"
                          className="form-control"
                        id="knoxId"
                        name="knoxId"
                        value={loginData.knoxId}
                        readOnly
                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">이름 *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="team" className="form-label">팀명 *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="team"
                        name="team"
                        value={formData.team}
                        onChange={handleInputChange}
                        placeholder="팀명을 입력하세요 (개인 등록시 개인명 입력도 가능)"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">팀원 관리</label>
                      <div className="border rounded p-3" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="row mb-3">
                          <div className="col-md-5 mb-2">
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={newMember.name}
                              onChange={handleNewMemberChange}
                              placeholder="팀원 이름"
                            />
                          </div>
                          <div className="col-md-5 mb-2">
                            <input
                              type="text"
                              className="form-control"
                              name="knoxId"
                              value={newMember.knoxId}
                              onChange={handleNewMemberChange}
                              placeholder="Knox ID"
                            />
                          </div>
                          <div className="col-md-2 mb-2">
                            <button
                              type="button"
                              className="btn btn-outline-primary w-100"
                              onClick={addTeamMember}
                              disabled={!newMember.name || !newMember.knoxId || teamMembers.length >= 3}
                            >
                              추가
                            </button>
                          </div>
                        </div>
                        
                        {teamMembers.length > 0 && (
                          <div>
                            <h6 className="mb-2">팀원 목록 ({teamMembers.length}명)</h6>
                            <div className="list-group">
                              {teamMembers.map(member => (
                                <div key={member.id} className="list-group-item d-flex justify-content-between align-items-center">
                                  <div>
                                    <strong>{member.name}</strong>({member.knoxId})
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeTeamMember(member.id)}
                                  >
                                    삭제
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {(teamMemberLimitError || teamMembers.length >= 3) && (
                          <div className="alert alert-warning mt-2" role="alert">
                            {teamMemberLimitError || '팀원은 본인 포함 최대 4명까지 가능합니다.'}
                          </div>
                        )}
                        
                        {teamMembers.length === 0 && (
                          <div className="text-center text-muted py-3">
                            <small>아직 추가된 팀원이 없습니다.</small>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="form-section">
                    <h3>AIdea 제안서</h3>
                    
                    {/* 서비스 이름 - 맨 위에 배치 */}
                    <div className="mb-4">
                      <label htmlFor="project" className="form-label">프로젝트 이름 *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="project"
                        name="project"
                        value={formData.project}
                        onChange={handleInputChange}
                        placeholder="제안하는 프로젝트의 이름을 입력하세요"
                        required
                      />
                    </div>

                    {/* 표 형식으로 나머지 필드들 배치 */}
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <td className="bg-light fw-bold text-center align-middle" style={{ width: '20%' }}>페르소나</td>
                            <td>
                              <input
                                type="text"
                                className="form-control border-0"
                                name="persona"
                                value={formData.persona}
                                onChange={handleInputChange}
                                placeholder="타겟 사용자 페르소나를 입력하세요"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="bg-light fw-bold text-center align-middle">문제 정의</td>
                            <td>
                              <textarea
                                className="form-control border-0"
                                name="problem"
                                value={formData.problem}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="해당 Agent가 나오게 된 이슈, 배경 등 개발 목적 또는 문제 정의"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="bg-light fw-bold text-center align-middle">해결 방법</td>
                            <td>
                              <textarea
                                className="form-control border-0"
                                name="solution"
                                value={formData.solution}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="해당 Agent의 역할, 개발 목표"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="bg-light fw-bold text-center align-middle">활용 데이터</td>
                            <td>
                              <textarea
                                className="form-control border-0"
                                name="data_sources"
                                value={formData.data_sources}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="예: 내부 문서, Jira, github, web search 등"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="bg-light fw-bold text-center align-middle">동작 시나리오</td>
                            <td>
                              <textarea
                                className="form-control border-0"
                                name="scenario"
                                value={formData.scenario}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="수행할 시나리오를 설명하세요"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="bg-light fw-bold text-center align-middle">기대효과</td>
                            <td>
                              <textarea
                                className="form-control border-0"
                                name="benefit"
                                value={formData.benefit}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="이 Agent를 통해 얻을 수 있는 기대효과를 설명하세요"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="bg-light fw-bold text-center align-middle">워크 플로우</td>
                            <td>
                              <textarea
                                className="form-control border-0"
                                name="workflow"
                                value={formData.workflow}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Agent의 5가지 요소를 포함하여 설명하세요. url 링크를 남겨주세요."
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="form-submit">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? '등록 중...' : '저장하기'}
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
};

export default Register; 