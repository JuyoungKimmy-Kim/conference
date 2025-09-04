import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [currentStep, setCurrentStep] = useState('login'); // 'login' 또는 'register'
  const [loginData, setLoginData] = useState({
    id: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    team: '',
    aidea: '',
    agreeTerms: false,
    agreeMarketing: false
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: '',
    knoxId: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 에러 메시지 초기화
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
    if (newMember.name && newMember.knoxId) {
      const member = {
        id: Date.now(),
        name: newMember.name,
        knoxId: newMember.knoxId
      };
      setTeamMembers(prev => [...prev, member]);
      setNewMember({ name: '', knoxId: '' });
    }
  };

  const removeTeamMember = (id) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setLoginError('');
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ knox_id: loginData.id, password: loginData.password })
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
      
      await res.json();
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
    
    // 실제 구현에서는 API 호출
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
    } catch (error) {
      console.error('등록 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로그인 화면 렌더링
  if (currentStep === 'login') {
    return (
      <div className="register-page">
        <div className="register-hero section-padding">
          <div className="container text-center">
            <h1 className="register-title">컨퍼런스 등록</h1>
            <p className="register-subtitle">
              DevConf 2024에 참여하고 싶으시다면 지금 바로 등록하세요!
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
                        <label htmlFor="id" className="form-label">knox id *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="id"
                          name="id"
                          value={loginData.id}
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
                        disabled={!loginData.id || !loginData.password || isSubmitting}
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
          <p>DevConf 2024에 참여해주셔서 감사합니다.</p>
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
          <h1 className="register-title">컨퍼런스 등록</h1>
          <p className="register-subtitle">
            DevConf 2024에 참여하고 싶으시다면 지금 바로 등록하세요!
          </p>
        </div>
      </div>

      <div className="register-content section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="register-form-container">
                <form onSubmit={handleSubmit} className="register-form">
                  <div className="form-section">
                    <h3>기본 정보</h3>
                    <div className="mb-3">
                      <label htmlFor="knoxId" className="form-label">Knox ID</label>
                        <input
                          type="text"
                          className="form-control"
                        id="knoxId"
                        name="knoxId"
                        value={loginData.id}
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
                      <label htmlFor="phone" className="form-label">연락처 *</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="010-0000-0000"
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
                              disabled={!newMember.name || !newMember.knoxId}
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
                        
                        {teamMembers.length === 0 && (
                          <div className="text-center text-muted py-3">
                            <small>아직 추가된 팀원이 없습니다.</small>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="form-section">
                    <h3>참여 정보</h3>
                    <div className="mb-3">
                      <label htmlFor="aidea" className="form-label">AIdea 제안서</label>
                      <textarea
                        className="form-control"
                        id="aidea"
                        name="aidea"
                        value={formData.aidea}
                        onChange={handleInputChange}
                        rows="8"
                        placeholder="AIdea 제안서 내용을 입력하세요..."
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>약관 동의</h3>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="agreeTerms"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                          required
                        />
                        <label className="form-check-label" htmlFor="agreeTerms">
                          <a href="#" target="_blank" rel="noopener noreferrer">참가자 약관</a>에 동의합니다 *
                        </label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="agreeMarketing"
                          name="agreeMarketing"
                          checked={formData.agreeMarketing}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="agreeMarketing">
                          마케팅 정보 수신에 동의합니다 (선택사항)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-submit">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? '등록 중...' : '등록 완료하기'}
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