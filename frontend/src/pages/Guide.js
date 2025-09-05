import React from 'react';
import './Guide.css';

const Guide = () => {
  return (
    <div className="guide-page">
      <div className="guide-hero section-padding">
        <div className="container text-center">
          <h1 className="guide-title">대회 안내</h1>
        </div>
      </div>

      <div className="guide-content section-padding">
        <div className="container">
          {/* 대회 목표 */}
          <section className="guide-section">
            <div className="section-header">
              <h2 className="section-title">대회 목표</h2>
              <p className="section-subtitle">
                업무 현장 실사용 가능한 AI Agent 발굴 및 확산
              </p>
            </div>
            <div className="goals-grid">
              <div className="goal-card">
                <div className="goal-icon">🏢</div>
                <h3>실무 적용</h3>
                <p>업무 현장에서 즉시 활용 가능한<br />실용적인 AI Agent 개발</p>
              </div>
              <div className="goal-card">
                <div className="goal-icon">🤖</div>
                <h3>AI Agent 발굴</h3>
                <p>혁신적이고 독창적인<br /> AI Agent 솔루션 발굴 및 검증</p>
              </div>
              <div className="goal-card">
                <div className="goal-icon">📈</div>
                <h3>확산 및 성장</h3>
                <p>AI Agent의<br />조직 내 확산과 지속적 성장</p>
              </div>
            </div>
          </section>

          {/* 대회의 Agent의 최소 요건 */}
          <section className="guide-section">
            <div className="section-header">
              <h2 className="section-title">대회의 최소 요건</h2>
            </div>
            <div className="conditions-grid">
              <div className="condition-card">
                <div className="condition-icon">👥</div>
                <h3>팀 구성</h3>
                <p>개발자 2-4명으로 팀을 구성</p>
              </div>
              <div className="condition-card">
                <div className="condition-icon">🔄</div>
                <h3>Agent 필수 요소 충족</h3>
                <p>계획/도구호출/검증/리포트 중<br />2개 이상 포함</p>
                <p className="condition-note">자세한 내용 자료실 참고</p>
              </div>
              <div className="condition-card">
                <div className="condition-icon">🔧</div>
                <h3>도구 연동</h3>
                <p>도구 1개 이상 연동</p>
                <br></br>
                <p className="condition-note">자세한 내용 자료실 참고</p>
              </div>
            </div>
          </section>

          {/* 운영 방법 */}
          <section className="guide-section">
            <div className="section-header">
              <h2 className="section-title">운영 방법</h2>
            </div>
            <div className="process-overview">
              <div className="process-card">
                <h3>대회 진행 과정</h3>
                <div className="process-content">
                  <div className="process-item">
                    <span className="process-step">1. 서류 심사</span>
                    <span className="process-desc">참가 신청서 기반 평가</span>
                  </div>
                  <div className="process-item">
                    <span className="process-step">2. 개발 기간</span>
                    <span className="process-desc">약 6주</span>
                  </div>
                  <div className="mentor-notice">
                    <div className="notice-icon">📢</div>
                    <p className="condition-note">개발 기간 동안 각 팀에 전담 멘토(진행 지원), 조커 멘토(기술 지원)을 AI Agent Group에서 배정합니다.</p>
                  </div>
                  <div className="process-item">
                    <span className="process-step">3. 예선 평가</span>
                    <span className="process-desc">개발 성과 발표 및 심사</span>
                  </div>
                  <div className="process-item">
                    <span className="process-step">4. 본선 준비</span>
                    <span className="process-desc">예선 통과 팀은 1주간 추가 개발 및 발표 준비</span>
                  </div>
                  <div className="process-item">
                    <span className="process-step">5. 최종 평가</span>
                    <span className="process-desc">최종 발표 및 시상식 진행</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        {/* 대회 평가 기준 */}
        <section className="guide-section">
            <div className="section-header">
              <h2 className="section-title">대회 평가 기준</h2>
            </div>
            <div className="rules-grid">
              <div className="rule-category">
                <h3>서류 심사</h3>
                <ul>
                  <li>아이디어 혁신성</li>
                  <li>기술 실현 가능성</li>
                  <li>업무 효과성</li>
                </ul>
              </div>
              <div className="rule-category">
                <h3>예선 평가</h3>
                <ul>
                  <li>핵심 기능 구현</li>
                  <li>기술적 완성도</li>
                  <li>사용자 경험</li>
                  <li>발표 품질</li>
                </ul>
              </div>
              <div className="rule-category">
                <h3>본선 평가</h3>
                <ul>
                  <li>AI 모델 성능</li>
                  <li>기술 혁신성</li>
                  <li>확장성 및 범용성</li>
                  <li>비즈니스 임팩트</li>
                  <li>발표 및 데모</li>
                  <li>임직원 사전 투표</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 수상 안내 */}
          <section className="guide-section">
            <div className="section-header">
              <h2 className="section-title">수상 안내</h2>
              <p className="section-subtitle">
                우수한 프로젝트를 선정하여 시상합니다
              </p>
            </div>
            <div className="awards-grid">
              <div className="award-card gold">
                <div className="award-rank">🥇</div>
                <h3>대상</h3>
                <div className="award-prize">상금 3000만원</div>
                <p>최우수 프로젝트 1팀</p>
              </div>
              <div className="award-card silver">
                <div className="award-rank">🥈</div>
                <h3>금상</h3>
                <div className="award-prize">상금 1000만원</div>
                <p>우수 프로젝트 1팀</p>
              </div>
              <div className="award-card bronze">
                <div className="award-rank">🥉</div>
                <h3>은상</h3>
                <div className="award-prize">상금 500만원</div>
                <p>우수 프로젝트 1팀</p>
              </div>
            </div>
          </section>

          {/* 문의 안내 */}
          <section className="guide-section">
            <div className="section-header">
              <h2 className="section-title">문의 안내</h2>
              <p className="section-subtitle">
                궁금한 사항이 있으시면 언제든 문의해주세요
              </p>
            </div>
            <div className="contact-info">
              <div className="contact-item">
                <h4>대회 운영팀</h4>
                <p>e-mail: ssai@samsung.com</p>
              </div>
              <div className="contact-item">
                <h4>기술 지원</h4>
                <p>e-mail: ssai@samsung.com</p>
                <p>mosiac: </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Guide;