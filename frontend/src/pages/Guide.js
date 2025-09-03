import React from 'react';
import './Guide.css';

const Guide = () => {
  return (
    <div className="guide-page">
      <div className="guide-hero section-padding">
        <div className="container text-center">
            <br></br>
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
                사내 데이터를 사용하거나 업무에 적용 가능한 아이디어 및 기술 발굴
              </p>
            </div>
            <div className="goals-grid">
              <div className="goal-card">
                <div className="goal-icon">🎯</div>
                <h3>혁신성</h3>
                <p>창의적이고 혁신적인 기술 솔루션 개발</p>
              </div>
              <div className="goal-card">
                <div className="goal-icon">🤝</div>
                <h3>협업</h3>
                <p>팀워크와 협업을 통한 시너지 창출</p>
              </div>
              <div className="goal-card">
                <div className="goal-icon">💡</div>
                <h3>실용성</h3>
                <p>실제 업무에 적용 가능한 실용적인 솔루션</p>
              </div>
              <div className="goal-card">
                <div className="goal-icon">🚀</div>
                <h3>성장</h3>
                <p>개발자들의 기술적 성장과 역량 강화</p>
              </div>
            </div>
          </section>

          {/* 참가 방법 */}
          <section className="guide-section">
            <div className="section-header">
              <h2 className="section-title">참가 방법</h2>
            </div>
            <div className="process-steps">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>팀 구성</h3>
                  <p>개발자 2-4명으로 팀을 구성합니다</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>참가 신청</h3>
                  <p>온라인으로 팀 정보와 프로젝트 계획을 제출합니다</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>서류 심사</h3>
                  <p>제출된 서류를 바탕으로 1차 심사를 진행합니다</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>개발 진행</h3>
                  <p>선정된 팀들이 프로젝트를 개발합니다</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h3>예선/본선 심사</h3>
                  <p>개발된 프로젝트를 평가하여 수상팀을 선정합니다</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">6</div>
                <div className="step-content">
                  <h3>시상</h3>
                  <p>우수한 프로젝트에 대해 시상식을 진행합니다</p>
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
                  <li>혁신성(10점)</li>
                  <li>기술적 실현 가능성(10점)</li>
                  <li>기대효과 (10점)</li>
                </ul>
              </div>
              <div className="rule-category">
                <h3>예선 평가</h3>
                <ul>
                  <li>기능 구현 (30점)</li>
                  <li>기술적 완성도 (30점)</li>
                  <li>기획안 대비 진척도 (20점)</li>
                  <li>발표 품질 (20점)</li>
                </ul>
              </div>
              <div className="rule-category">
                <h3>본선 평가</h3>
                <ul>
                  <li>기술적 우수성 (40점)</li>
                  <li>확장성 (25점)</li>
                  <li>사용자 경험 (25점)</li>
                  <li>기대 효과 (30점)</li>
                  <li>발표 및 데모 전달력 (10점)</li>
                  <li>임직원 사전 투표 (10점)</li>
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
                <div className="award-prize">상금 500만원</div>
                <p>최우수 프로젝트 1팀</p>
              </div>
              <div className="award-card silver">
                <div className="award-rank">🥈</div>
                <h3>금상</h3>
                <div className="award-prize">상금 300만원</div>
                <p>우수 프로젝트 1팀</p>
              </div>
              <div className="award-card bronze">
                <div className="award-rank">🥉</div>
                <h3>은상</h3>
                <div className="award-prize">상금 200만원</div>
                <p>우수 프로젝트 1팀</p>
              </div>
              <div className="award-card special">
                <div className="award-rank">🏆</div>
                <h3>특별상</h3>
                <div className="award-prize">상금 100만원</div>
                <p>특별한 아이디어 2팀</p>
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
                <p>e-mail: devconf@company.com</p>
              </div>
              <div className="contact-item">
                <h4>기술 지원</h4>
                <p>e-mail: ssai@samsung.com</p>
                <p>MOSAIC: </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Guide; 