import React, { useState } from 'react';
import './Resources.css';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('agent');

  const agentConcepts = [
    {
      title: "AI Agent란?",
      content: `
        <h3>요청·목표를 이해하고, 스스로 계획을 세워 여러 도구를 사용해 결과를 만드는 행동형 AI입니다.</h3>
        
        <p>사람에게 출장 준비를 요청하면, 보통 항공권 찾기 → 일정 조율 → 결제 확인 등의 계획을 세우고 필요한 도구(앱, 데이터)를 써서 처리한 뒤, 
        잘 끝났는지 점검하고 결과를 보고합니다. <br/>
        <strong>AI 에이전트도 이와 같습니다.</strong> 사용자의 목표를 이해하고 계획을 세운 다음, 
        도구(API·앱·데이터)를 활용해 실행하고, 결과를 검토하며 필요하면 다시 시도하여 결과를 보고합니다.</p>
      `
    },
    {
      title: "Agent의 작동 흐름",
      content: `
        <h3>목표 파악 → 계획 → 행동 및 도구사용 → 검증 및 피드백 → 리포트 및 다음단계 수립</h3>
        <div class="agent-steps">
          <div class="steps-circles">
            <div class="step-circle">
              <div class="step-title">계획</div>
              <div class="step-sub">목표/제약 해석하여 실행 단계 계획</div>
            </div>
            <div class="step-circle">
              <div class="step-title">도구 호출</div>
              <div class="step-sub">시스템·API·서비스등 도구 호출</div>
            </div>
            <div class="step-circle">
              <div class="step-title">검증</div>
              <div class="step-sub">규칙·지표 검사 및 재시도</div>
            </div>
            <div class="step-circle">
              <div class="step-title">리포트</div>
              <div class="step-sub">요약·링크·지표 산출물 제공</div>
            </div>
          </div>
          <ul class="steps-notes">
            <li><strong>계획</strong>: 사용자의 목표/제약을 해석해 실행 가능한 단계 목록(목적·입력·도구·성공조건)으로 만든다.</li>
            <li><strong>도구 호출</strong>: 외부 시스템·API·서비스를 실제 호출해 읽기/쓰기/변경을 수행한다.</li>
            <li><strong>검증</strong>: 중간/최종 산출물을 명시적 규칙·근거·지표로 검사하고, 실패 시 재시도 등 복구한다.</li>
            <li><strong>리포트</strong>: 결과를 구조화된 산출물(요약, 링크, 첨부, 지표)로 제공하고, 다음 스텝을 제안/트리거한다.</li>
          </ul>
        </div>
      `
    },
    {
      title: "Agent의 핵심 구성 요소",
      description: "AI Agent를 구성하는 핵심 요소들을 설명합니다.",
      content: `
        <h3>1. 인지 (Perception)</h3>
        <p>환경으로부터 정보를 수집하고 이해하는 능력</p>
        
        <h3>2. 추론 (Reasoning)</h3>
        <p>수집된 정보를 바탕으로 판단하고 결정하는 능력</p>
        
        <h3>3. 행동 (Action)</h3>
        <p>환경에 영향을 미치는 행동을 수행하는 능력</p>
        
        <h3>4. 학습 (Learning)</h3>
        <p>경험을 통해 성능을 개선하는 능력</p>
      `
    },
    {
      title: "AI Service vs AI Agent",
      content: `
        <h3>AI Service: 특정 작업을 수행하는 AI 기반 서비스</h3>
        <ul>
          <li>단일 목적의 작업 수행</li>
          <li>사용자 요청에 대한 응답</li>
          <li>제한된 자율성</li>
        </ul>
        <h3>AI Agent: 더 높은 수준의 자율성과 지능을 가진 AI 시스템</h3>
        <ul>
          <li>다양한 작업을 자율적으로 수행</li>
          <li>환경과의 상호작용</li>
          <li>학습과 적응 능력</li>
          <li>목표 달성을 위한 계획 수립</li>
        </ul>

        <h3>AI 에이전트와 AI 서비스 비교</h3>
        <div class="comparison">
          <div class="comparison-table">
            <div class="row header">
              <div class="cell">기준</div>
              <div class="cell">AI 에이전트</div>
              <div class="cell">AI 서비스</div>
            </div>
            <div class="row">
              <div class="cell">역할</div>
              <div class="cell">일을 대신 수행하는 실행자</div>              
              <div class="cell">특정 기능을 제공하는 모듈</div>
            </div>
            <div class="row">
              <div class="cell">작동 방식</div>
              <div class="cell">목표→계획→실행→점검→보고/다음스텝 (반복가능)</div>              
              <div class="cell">질문→답변(단발)</div>
            </div>
            <div class="row">
              <div class="cell">도구 사용</div>
              <div class="cell">여러 도구를 조합(이메일, 캘린더, 사내 시스템 등)</div>
              <div class="cell">제한적(특정 기능만 사용)</div>
            </div>
            <div class="row">
              <div class="cell">기억/컨텍스트</div>
              <div class="cell">메모리로 과거 결정/상태를 지속 참조</div>
              <div class="cell">단발성 대화 맥락 위주</div>
            </div>
            <div class="row">
              <div class="cell">오류 대응</div>
              <div class="cell">스스로 재시도/경로 수정 가능</div>
              <div class="cell">사용자가 재시도 등 요청해야 함</div>
            </div>
            <div class="row">
              <div class="cell">결과 형태</div>
              <div class="cell">실행 결과(예약, 티켓, 보고서 파일 등)</div>
              <div class="cell">정보 제공/요약</div> 
            </div>
          </div>
        </div>
      `
    },
    {
      title: "AI Agent 판별 예시",
      content: `
        <div class="matrix">
          <h3>사례별 에이전트성 판별</h3>
          <div class="matrix-table">
            <div class="row header">
              <div class="cell">사례</div>
              <div class="cell">에이전트성</div>
              <div class="cell">계획</div>
              <div class="cell">도구호출</div>
              <div class="cell">검증</div>
              <div class="cell">리포트</div>
              <div class="cell">메모리/RAG</div>
              <div class="cell">비고</div>
            </div>
            <div class="row">
              <div class="cell">LLM이 문서만 요약</div>
              <div class="cell">✗</div>
              <div class="cell">✗</div>
              <div class="cell">✗</div>
              <div class="cell">✗</div>
              <div class="cell">✗</div>
              <div class="cell">—</div>
              <div class="cell">단일 요약만 수행, 액션/평가/보고 없음</div>
            </div>
            <div class="row">
              <div class="cell">“계획”은 세우지만 외부 시스템 액션 없이 텍스트만 제안</div>
              <div class="cell">✗</div>
              <div class="cell">O</div>
              <div class="cell">✗</div>
              <div class="cell">✗</div>
              <div class="cell">✗</div>
              <div class="cell">—</div>
              <div class="cell">계획은 있으나 실행(도구 호출)과 후속 단계 부재</div>
            </div>
            <div class="row">
              <div class="cell">API 한 번만 고정 호출 (입력→API→출력)</div>
              <div class="cell">✗</div>
              <div class="cell">✗</div>
              <div class="cell">O</div>
              <div class="cell">✗</div>
              <div class="cell">✗</div>
              <div class="cell">—</div>
              <div class="cell">단발성 호출만 있고 다단계 흐름/검증/보고 없음</div>
            </div>
            <div class="row">
              <div class="cell">목표 입력 → 계획 수립 → JIRA 검색 호출 → 결과 검증 → 캘린더 초안 생성 → 보고</div>
              <div class="cell">O (최소 충족)</div>
              <div class="cell">O</div>
              <div class="cell">O</div>
              <div class="cell">O</div>
              <div class="cell">O</div>
              <div class="cell">✗</div>
              <div class="cell"><strong>최소 기준 충족</strong>: 다단계 + 외부 도구 연동</div>
            </div>
            <div class="row">
              <div class="cell">위와 같고, 추가로 최근 이력 기억 / RAG 참조</div>
              <div class="cell">O (가점)</div>
              <div class="cell">O</div>
              <div class="cell">O</div>
              <div class="cell">O</div>
              <div class="cell">O</div>
              <div class="cell">O</div>
              <div class="cell"><strong>가점</strong>: 상태/문맥(메모리·RAG) 활용</div>
            </div>
          </div>
        </div>
      `
    },
    {
      title: "Agent 아이디어 예시",
      content: `
        <div class="ideas">
          <div class="ideas-table">
            <div class="row header">
              <div class="cell">#</div>
              <div class="cell">에이전트</div>
            </div>
            <div class="row">
              <div class="cell">1</div>
              <div class="cell">Excel spec 문서를 활용한 RTL static checker agent</div>
            </div>
            <div class="row">
              <div class="cell">2</div>
              <div class="cell">Spec 문서 비교 결과를 활용한 검증 plan 작성 agent</div>
            </div>
            <div class="row">
              <div class="cell">3</div>
              <div class="cell">원하는 coding style대로 변경해주는 RTL refactoring agent</div>
            </div>
            <div class="row">
              <div class="cell">4</div>
              <div class="cell">JIRA나 RTL 변경 history 기반 RTL function risk point alarm agent</div>
            </div>
            <div class="row">
              <div class="cell">5</div>
              <div class="cell">RTL timing risk point detect agent</div>
            </div>
            <div class="row">
              <div class="cell">6</div>
              <div class="cell">본인 JIRA 요약/이력 분류, Due Date·TAT 기반 이슈 우선순위 제안 agent</div>
            </div>
            <div class="row">
              <div class="cell">7</div>
              <div class="cell">업무 요약 및 목표 기준 자동 분류, 연간 요약/추가 수행 업무 제안 보고 agent</div>
            </div>
          </div>
        </div>
      `
    }
  ];

  const proposalExample = {
    serviceName: "스마트 회의 도우미 Agent",
    persona: "바쁜 직장인들이 효율적인 회의를 진행할 수 있도록 도와주는 AI Agent",
    problem: "회의 시간이 길어지고, 중요한 내용이 놓치거나 후속 조치가 제대로 이루어지지 않는 문제",
    solution: "회의 내용을 실시간으로 분석하고, 액션 아이템을 자동으로 추출하여 참석자들에게 알림을 보내는 AI Agent",
    dataSources: "회의 녹음 파일, 채팅 메시지, 캘린더 정보, 이메일 데이터",
    actions: "회의 요약 생성, 액션 아이템 추출, 데드라인 설정, 참석자별 알림 발송, 후속 미팅 스케줄링",
    risk: "음성 인식 오류, 개인정보 보호 이슈, 시스템 장애 시 회의 내용 손실 가능성",
    benefits: "회의 효율성 30% 향상, 액션 아이템 누락 방지, 후속 조치 자동화로 업무 생산성 증대",
    plan: "1. ~9월 26일: mcp1, rag 기능 release\n2. ~10월 10일: 회의 내용 분석 및 액션 추출 기능 개발\n3. ~10월 24일: 회의 내용 분석 및 액션 추출 기능 테스트 및 최적화\n4. ~11월 7일: 회의 내용 분석 및 액션 추출 기능 배포"
  };

  return (
    <div className="resources-page">
      <div className="resources-hero section-padding">
        <div className="container text-center">
          <h1 className="resources-title">자료실</h1>
          <p className="resources-subtitle">
            AI Agent 개념과 제안서 작성에 필요한 자료들을 확인하세요
          </p>
        </div>
      </div>

      <div className="resources-content section-padding">
        <div className="container">
          {/* 탭 메뉴 */}
          <div className="resources-tabs">
            <button 
              className={`resources-tab ${activeTab === 'agent' ? 'active' : ''}`}
              onClick={() => setActiveTab('agent')}
            >
              Agent 개념
            </button>
            <button 
              className={`resources-tab ${activeTab === 'template' ? 'active' : ''}`}
              onClick={() => setActiveTab('template')}
            >
              제안서 템플릿
            </button>
          </div>

          {/* Agent 개념 탭 */}
          {activeTab === 'agent' && (
            <div className="agent-concepts">
              <h2 className="section-title text-center mb-5">AI Agent 개념</h2>
              <div className="concepts-grid">
                {agentConcepts.map((concept, index) => (
                  <div key={index} className="concept-card">
                    <h3 className="concept-title">{concept.title}</h3>
                    <p className="concept-description">{concept.description}</p>
                    <div 
                      className="concept-content"
                      dangerouslySetInnerHTML={{ __html: concept.content }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 제안서 템플릿 탭 */}
          {activeTab === 'template' && (
            <div className="template-section">
              <h2 className="section-title text-center mb-5">제안서 템플릿 예시</h2>
              <div className="template-form">
                <div className="form-group">
                  <label className="form-label">서비스 이름</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={proposalExample.serviceName}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Persona</label>
                  <textarea 
                    className="form-textarea" 
                    value={proposalExample.persona}
                    readOnly
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Problem</label>
                  <textarea 
                    className="form-textarea" 
                    value={proposalExample.problem}
                    readOnly
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Solution</label>
                  <textarea 
                    className="form-textarea" 
                    value={proposalExample.solution}
                    readOnly
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Data Sources</label>
                  <textarea 
                    className="form-textarea" 
                    value={proposalExample.dataSources}
                    readOnly
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Actions</label>
                  <textarea 
                    className="form-textarea" 
                    value={proposalExample.actions}
                    readOnly
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Risk</label>
                  <textarea 
                    className="form-textarea" 
                    value={proposalExample.risk}
                    readOnly
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Benefits</label>
                  <textarea 
                    className="form-textarea" 
                    value={proposalExample.benefits}
                    readOnly
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Plan</label>
                  <textarea 
                    className="form-textarea" 
                    value={proposalExample.plan}
                    readOnly
                    rows="3"
                  />
                </div>

                <div className="template-note">
                  <p><strong>참고:</strong> 위 예시를 참고하여 본인의 AI Agent 아이디어로 제안서를 작성해주세요.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources; 