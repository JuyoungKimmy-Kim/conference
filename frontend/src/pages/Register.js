import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    position: '',
    phone: '',
    track: '',
    dietary: '',
    agreeTerms: false,
    agreeMarketing: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const tracks = [
    { id: 'ai', name: 'AI/ML 트랙', description: '인공지능과 머신러닝 관련 세션' },
    { id: 'cloud', name: '클라우드 트랙', description: '클라우드 아키텍처와 인프라' },
    { id: 'devops', name: 'DevOps 트랙', description: '개발 운영과 자동화' },
    { id: 'frontend', name: '프론트엔드 트랙', description: '사용자 인터페이스와 경험' },
    { id: 'data', name: '데이터 트랙', description: '빅데이터와 분석' },
    { id: 'security', name: '보안 트랙', description: '애플리케이션 보안' }
  ];

  const dietaryOptions = [
    '일반',
    '채식주의',
    '비건',
    '글루텐프리',
    '알레르기 있음 (상세사항 기재)'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="firstName" className="form-label">이름 *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label">성 *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">이메일 주소 *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="company" className="form-label">회사/조직</label>
                        <input
                          type="text"
                          className="form-control"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="position" className="form-label">직책</label>
                        <input
                          type="text"
                          className="form-control"
                          id="position"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">연락처</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="010-0000-0000"
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>참여 정보</h3>
                    <div className="mb-3">
                      <label htmlFor="track" className="form-label">관심 트랙</label>
                      <select
                        className="form-select"
                        id="track"
                        name="track"
                        value={formData.track}
                        onChange={handleInputChange}
                      >
                        <option value="">트랙을 선택하세요</option>
                        {tracks.map(track => (
                          <option key={track.id} value={track.id}>
                            {track.name} - {track.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="dietary" className="form-label">식사 제한사항</label>
                      <select
                        className="form-select"
                        id="dietary"
                        name="dietary"
                        value={formData.dietary}
                        onChange={handleInputChange}
                      >
                        <option value="">선택하세요</option>
                        {dietaryOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
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