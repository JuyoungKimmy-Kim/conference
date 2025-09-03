import React, { useState } from 'react';
import './Resources.css';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('agent');

  const agentConcepts = [
    {
      title: "AI Service vs AI Agent",
      description: "AI Service와 AI Agent의 차이점과 Agent의 특징을 설명합니다.",
      content: `
        <h3>AI Service</h3>
        <p>AI Service는 특정 작업을 수행하는 AI 기반 서비스입니다.</p>
        <ul>
          <li>단일 목적의 작업 수행</li>
          <li>사용자 요청에 대한 응답</li>
          <li>제한된 자율성</li>
        </ul>
        
        <h3>AI Agent</h3>
        <p>AI Agent는 더 높은 수준의 자율성과 지능을 가진 AI 시스템입니다.</p>
        <ul>
          <li>다양한 작업을 자율적으로 수행</li>
          <li>환경과의 상호작용</li>
          <li>학습과 적응 능력</li>
          <li>목표 달성을 위한 계획 수립</li>
        </ul>
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