import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Resources.css';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('agent');
  const [activeAgentTab, setActiveAgentTab] = useState('requirements'); // 새로운 상태 추가

  const agentConcepts = [
    {
      title: "AI Agent란?",
      content: `
        <h3>요청·목표를 이해하고, 스스로 계획을 세워 여러 도구를 사용해 결과를 만드는 행동형 AI입니다.</h3>
        
        <p>사람에게 출장 준비를 요청하면, 보통 항공권 찾기 → 일정 조율 → 결제 확인 등의 계획을 세우고 필요한 도구(앱, 데이터)를 써서 처리한 뒤, 
        잘 끝났는지 점검하고 결과를 보고합니다.

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
    target_user: "바쁜 직장인들이 효율적인 회의를 진행할 수 있도록 도와주는 AI Agent",
    problem: "회의 시간이 길어지고, 중요한 내용이 놓치거나 후속 조치가 제대로 이루어지지 않는 문제",
    solution: "회의 내용을 실시간으로 분석하고, 액션 아이템을 자동으로 추출하여 참석자들에게 알림을 보내는 AI Agent",
    dataSources: "회의 녹음 파일, 채팅 메시지, 캘린더 정보, 이메일 데이터",
    actions: "회의 요약 생성, 액션 아이템 추출, 데드라인 설정, 참석자별 알림 발송, 후속 미팅 스케줄링",
    risk: "음성 인식 오류, 개인정보 보호 이슈, 시스템 장애 시 회의 내용 손실 가능성",
    benefits: "회의 효율성 30% 향상, 액션 아이템 누락 방지, 후속 조치 자동화로 업무 생산성 증대",
    plan: "1. ~9월 26일: mcp1, rag 기능 release\n2. ~10월 10일: 회의 내용 분석 및 액션 추출 기능 개발\n3. ~10월 24일: 회의 내용 분석 및 액션 추출 기능 테스트 및 최적화\n4. ~11월 7일: 회의 내용 분석 및 액션 추출 기능 배포"
  };

  const exampleCodeData = {
    title: "AI Agent 예제 코드",
    description: "AI Agent 개념을 쉽게 설명하기 위해 예제 코드를 준비했습니다.",
    environment: "주피터 노트북",
    gitUrl: "https://github.com/dEitY719/ai-agent-patterns",
    readme: `**ai-agent-patterns**는 LangChain과 LangGraph를 활용하여 다양한 AI 에이전트 설계 패턴을 탐구하는 저장소입니다. 이 프로젝트는 단순한 도구(Tool) 사용부터 시작하여, 질문을 분류하는 라우터(Router), 그리고 여러 전문 에이전트들이 협력하는 복잡한 멀티 에이전트 시스템에 이르기까지 점진적인 학습 경험을 제공합니다.

### 프로젝트 목표

- **LangChain 및 LangGraph 학습:** Agent 및 Graph 기반 워크플로우를 구축하는 방법을 단계별로 학습합니다.
- **Agent 패턴 이해:** 질문 라우팅, 전문 에이전트 분리, 슈퍼바이저(Supervisor) 에이전트 오케스트레이션 등 핵심 패턴을 이해합니다.
- **실용적인 예제 제공:** 실제 코드를 통해 각 패턴이 어떻게 동작하는지 직관적으로 파악할 수 있도록 돕습니다.

---

### 설치 및 실행

#### 1. 가상 환경 설정
\`\`\`bash
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# .venv\\Scripts\\activate  # Windows
\`\`\`

#### 2. 패키지 설치
\`\`\`bash
pip install -r requirements.txt
\`\`\`

#### 3. API 키 설정

프로젝트에 필요한 API 키를 설정하기 위해 \`.env\` 파일을 생성합니다. 이 파일은 보안을 위해 Git에 포함되지 않도록 \`.gitignore\`에 추가하는 것이 좋습니다.
먼저, 아래 링크에서 각 API 키를 발급받으세요:

  * **OpenAI API 키:** [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
  * **Tavily API 키:** [https://www.tavily.com/](https://www.tavily.com/)

발급받은 키를 사용하여 프로젝트 루트 디렉터리에 \`.env\` 파일을 만들고 아래와 같이 내용을 작성합니다.

\`\`\`ini
OPENAI_API_KEY="sk-proj-Ap********"
TAVILY_API_KEY="tvly-eMVVz********"
\`\`\`

**주의:** 따옴표는 선택 사항이지만, 키 값에 공백이나 특수 문자가 포함될 경우를 대비하여 사용하는 것을 권장합니다.

#### 4. 실행 방법

\`practice_Agentic_RAG.ipynb\` 파일은 Jupyter Notebook 형식으로 되어 있으므로, VS Code에서 확장 프로그램을 설치하여 실행할 수 있습니다.

##### 4.1. Jupyter 확장 프로그램 설치

VS Code 좌측 메뉴에서 **확장 프로그램** 아이콘을 클릭하거나 \`Ctrl+Shift+X\`를 눌러 확장 프로그램 마켓플레이스를 엽니다. 검색창에 **Jupyter**를 입력하고 Microsoft에서 제공하는 확장 프로그램을 설치합니다.


##### 4.2. 가상 환경 활성화

VS Code의 터미널을 열고(단축키 \`Ctrl+'\`) 이전에 설정한 가상 환경을 활성화합니다.

* **macOS/Linux:** \`source venv/bin/activate\`
* **Windows:** \`.venv\\Scripts\\activate\`


##### 4.3. Notebook 실행

\`src/practice_Agentic_RAG.ipynb\` 파일을 클릭하여 엽니다. 파일 상단에 나타나는 'Jupyter 서버 시작' 버튼을 클릭하거나, 커널을 선택하라는 메시지가 나타나면 **Python Environments**에서 \`venv\`로 설정된 가상 환경을 선택합니다.

이제 각 셀(\`In [ ]:\` 으로 표시된 코드 블록) 옆의 실행 버튼을 클릭하거나 \`Shift+Enter\`를 눌러 코드를 순차적으로 실행하며 결과를 확인할 수 있습니다.`,
    concepts: [
      {
        title: "1. 기본 Agent",
        description: "사용자의 질문에 답변하는 가장 기본적인 AI Agent",
        code: `# 기본 Agent 예제
import openai

def basic_agent(question):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": question}]
    )
    return response.choices[0].message.content

# 사용 예시
answer = basic_agent("안녕하세요!")
print(answer)`
      },
      {
        title: "2. 도구 사용 Agent",
        description: "외부 도구나 API를 호출하여 더 복잡한 작업을 수행하는 Agent",
        code: `# 도구 사용 Agent 예제
import requests
import json

def weather_agent(city):
    # 날씨 API 호출
    api_key = "your_api_key"
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}"
    
    response = requests.get(url)
    data = response.json()
    
    # 결과 해석 및 응답
    if response.status_code == 200:
        temp = data['main']['temp'] - 273.15  # 켈빈을 섭씨로 변환
        return f"{city}의 현재 온도는 {temp:.1f}°C입니다."
    else:
        return "날씨 정보를 가져올 수 없습니다."

# 사용 예시
result = weather_agent("서울")
print(result)`
      },
      {
        title: "3. 메모리 Agent",
        description: "대화 기록을 기억하고 맥락을 유지하는 Agent",
        code: `# 메모리 Agent 예제
class MemoryAgent:
    def __init__(self):
        self.conversation_history = []
    
    def chat(self, message):
        # 대화 기록에 사용자 메시지 추가
        self.conversation_history.append({"role": "user", "content": message})
        
        # 전체 대화 기록을 컨텍스트로 사용
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=self.conversation_history
        )
        
        # 응답을 대화 기록에 추가
        assistant_message = response.choices[0].message.content
        self.conversation_history.append({"role": "assistant", "content": assistant_message})
        
        return assistant_message

# 사용 예시
agent = MemoryAgent()
print(agent.chat("안녕하세요!"))
print(agent.chat("제 이름은 김철수입니다."))
print(agent.chat("제 이름이 뭐라고 했죠?"))`
      },
      {
        title: "4. 계획 수립 Agent",
        description: "목표를 달성하기 위한 단계별 계획을 세우고 실행하는 Agent",
        code: `# 계획 수립 Agent 예제
class PlanningAgent:
    def __init__(self):
        self.goals = []
        self.plan = []
    
    def set_goal(self, goal):
        self.goals.append(goal)
        self.create_plan(goal)
    
    def create_plan(self, goal):
        # 목표를 달성하기 위한 계획 수립
        prompt = f"다음 목표를 달성하기 위한 단계별 계획을 세워주세요: {goal}"
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        
        self.plan = response.choices[0].message.content
        return self.plan
    
    def execute_plan(self):
        # 계획 실행 (실제 구현에서는 각 단계를 실행)
        return f"계획을 실행합니다: {self.plan}"

# 사용 예시
agent = PlanningAgent()
agent.set_goal("웹사이트를 만들어주세요")
print(agent.execute_plan())`
      }
    ],
    downloadLinks: [
      {
        title: "기본 Agent 예제 (HTML)",
        url: "/downloads/basic-agent.html",
        description: "기본 Agent 예제를 HTML로 변환한 파일"
      },
      {
        title: "도구 사용 Agent 예제 (HTML)",
        url: "/downloads/tool-agent.html", 
        description: "도구 사용 Agent 예제를 HTML로 변환한 파일"
      },
      {
        title: "메모리 Agent 예제 (HTML)",
        url: "/downloads/memory-agent.html",
        description: "메모리 Agent 예제를 HTML로 변환한 파일"
      },
      {
        title: "계획 수립 Agent 예제 (HTML)",
        url: "/downloads/planning-agent.html",
        description: "계획 수립 Agent 예제를 HTML로 변환한 파일"
      }
    ]
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
            <button 
              className={`resources-tab ${activeTab === 'example' ? 'active' : ''}`}
              onClick={() => setActiveTab('example')}
            >
              예제 코드
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
              
              {/* 프로젝트 이름 - 맨 위에 배치 */}
              <div className="mb-4">
                <label className="form-label">프로젝트 이름</label>
                <input
                  type="text"
                  className="form-control"
                  value={proposalExample.serviceName}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                />
              </div>

              {/* 표 형식으로 나머지 필드들 배치 */}
              <div className="table-responsive">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td className="bg-light fw-bold text-center align-middle" style={{ width: '20%' }}>주 사용자</td>
                      <td>
                        <input
                          type="text"
                          className="form-control border-0"
                          value={proposalExample.target_user}
                          readOnly
                          style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold text-center align-middle">문제 정의</td>
                      <td>
                        <textarea
                          className="form-control border-0"
                          rows="3"
                          value={proposalExample.problem}
                          readOnly
                          style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold text-center align-middle">해결 방법</td>
                      <td>
                        <textarea
                          className="form-control border-0"
                          rows="3"
                          value={proposalExample.solution}
                          readOnly
                          style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold text-center align-middle">활용 데이터</td>
                      <td>
                        <textarea
                          className="form-control border-0"
                          rows="3"
                          value={proposalExample.dataSources}
                          readOnly
                          style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold text-center align-middle">동작 시나리오</td>
                      <td>
                        <textarea
                          className="form-control border-0"
                          rows="3"
                          value={proposalExample.actions}
                          readOnly
                          style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold text-center align-middle">기대효과</td>
                      <td>
                        <textarea
                          className="form-control border-0"
                          rows="3"
                          value={proposalExample.benefits}
                          readOnly
                          style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-light fw-bold text-center align-middle">워크 플로우</td>
                      <td>
                        <textarea
                          className="form-control border-0"
                          rows="4"
                          value={proposalExample.plan}
                          readOnly
                          style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="template-note mt-4">
                <div className="alert alert-info d-flex align-items-center" role="alert" style={{ borderRadius: 12 }}>
                  <span className="me-2" aria-hidden="true">ℹ️</span>
                  <div>
                    <strong>참고:</strong> 위 예시를 참고하여 본인의 AI Agent 아이디어로 제안서를 작성해주세요.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 예제 코드 탭 */}
          {activeTab === 'example' && (
            <div className="example-code-section">
              <h2 className="section-title text-center mb-3">{exampleCodeData.title}</h2>
              <p className="text-center text-muted mb-4">{exampleCodeData.description}</p>
              
              {/* 각 섹션을 개별 카드로 분리 */}
              <div className="concepts-grid">
                {/* Git Clone 섹션 */}
                <div className="concept-card">
                  <h3 className="concept-title">1. Git Clone</h3>
                  <div className="concept-content">
                    <p>다음 명령어로 예제 코드를 다운로드하세요:</p>
                    <div className="bg-dark text-light p-3 rounded mb-3">
                      <code>git clone {exampleCodeData.gitUrl}</code>
                    </div>
                    <button 
                      className="btn mt-2"
                      onClick={() => window.open(exampleCodeData.gitUrl, '_blank')}
                      style={{
                        background: '#1F2937',
                        border: '2px solid #1F2937',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '15px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      GitHub에서 보기
                    </button>
                  </div>
                </div>

                {/* README 설명 섹션 */}
                <div className="concept-card">
                  <h3 className="concept-title">2. Readme</h3>
                  <div className="concept-content">
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {exampleCodeData.readme}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>

                {/* 예제 코드 개념 설명 섹션 */}
                <div className="concept-card">
                  <h3 className="concept-title">3. 예제 코드 개념 설명</h3>
                  <div className="concept-content">
                    {/* 탭 메뉴 */}
                    <div className="nav nav-tabs mb-4" id="agentTabs" role="tablist">
                      <button 
                        className={`nav-link ${activeAgentTab === 'requirements' ? 'active' : ''}`}
                        onClick={() => setActiveAgentTab('requirements')}
                        type="button"
                      >
                        요구사항
                      </button>
                      <button 
                        className={`nav-link ${activeAgentTab === 'simple' ? 'active' : ''}`}
                        onClick={() => setActiveAgentTab('simple')}
                        type="button"
                      >
                        SimpleAgenticRAG
                      </button>
                      <button 
                        className={`nav-link ${activeAgentTab === 'rulebased' ? 'active' : ''}`}
                        onClick={() => setActiveAgentTab('rulebased')}
                        type="button"
                      >
                        RuleBasedRoutedRAG
                      </button>
                      <button 
                        className={`nav-link ${activeAgentTab === 'llm' ? 'active' : ''}`}
                        onClick={() => setActiveAgentTab('llm')}
                        type="button"
                      >
                        LLMRoutedRAG
                      </button>
                      <button 
                        className={`nav-link ${activeAgentTab === 'multi' ? 'active' : ''}`}
                        onClick={() => setActiveAgentTab('multi')}
                        type="button"
                      >
                        MultiAgentRAG
                      </button>
                      <button 
                        className={`nav-link ${activeAgentTab === 'corrective' ? 'active' : ''}`}
                        onClick={() => setActiveAgentTab('corrective')}
                        type="button"
                      >
                        CorrectiveAgentRAG
                      </button>
                    </div>

                    {/* 탭 콘텐츠 */}
                    <div className="tab-content" id="agentTabsContent">
                      {/* 요구사항 탭 */}
                      {activeAgentTab === 'requirements' && (
                        <div className="tab-pane fade show active">
                          <div className="card">
                            <div className="card-body">
                              <h5 className="card-title">요구사항</h5>
                              <p className="card-text">
                                공통 기능 요약: 4가지 핵심 도구
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SimpleAgenticRAG 탭 */}
                      {activeAgentTab === 'simple' && (
                        <div className="tab-pane fade show active">
                          <div className="card">
                            <div className="card-body text-center">
                              <h5 className="card-title">SimpleAgenticRAG</h5>
                              <img 
                                src="/assets/workflow.png" 
                                alt="SimpleAgenticRAG Workflow" 
                                className="img-fluid rounded"
                                style={{ maxWidth: '100%', height: 'auto' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* RuleBasedRoutedRAG 탭 */}
                      {activeAgentTab === 'rulebased' && (
                        <div className="tab-pane fade show active">
                          <div className="card">
                            <div className="card-body text-center">
                              <h5 className="card-title">RuleBasedRoutedRAG</h5>
                              <img 
                                src="/assets/workflow.png" 
                                alt="RuleBasedRoutedRAG Workflow" 
                                className="img-fluid rounded"
                                style={{ maxWidth: '100%', height: 'auto' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* LLMRoutedRAG 탭 */}
                      {activeAgentTab === 'llm' && (
                        <div className="tab-pane fade show active">
                          <div className="card">
                            <div className="card-body text-center">
                              <h5 className="card-title">LLMRoutedRAG</h5>
                              <img 
                                src="/assets/workflow.png" 
                                alt="LLMRoutedRAG Workflow" 
                                className="img-fluid rounded"
                                style={{ maxWidth: '100%', height: 'auto' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* MultiAgentRAG 탭 */}
                      {activeAgentTab === 'multi' && (
                        <div className="tab-pane fade show active">
                          <div className="card">
                            <div className="card-body text-center">
                              <h5 className="card-title">MultiAgentRAG</h5>
                              <img 
                                src="/assets/workflow.png" 
                                alt="MultiAgentRAG Workflow" 
                                className="img-fluid rounded"
                                style={{ maxWidth: '100%', height: 'auto' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CorrectiveAgentRAG 탭 */}
                      {activeAgentTab === 'corrective' && (
                        <div className="tab-pane fade show active">
                          <div className="card">
                            <div className="card-body text-center">
                              <h5 className="card-title">CorrectiveAgentRAG</h5>
                              <img 
                                src="/assets/workflow.png" 
                                alt="CorrectiveAgentRAG Workflow" 
                                className="img-fluid rounded"
                                style={{ maxWidth: '100%', height: 'auto' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* HTML 다운로드 섹션 */}
                <div className="concept-card">
                  <h3 className="concept-title">4. 주피터 노트북을 HTML로 변환한 자료</h3>
                  <div className="concept-content">
                    <p className="text-muted mb-3">
                      Git clone과 VSCode IDE로 실행하기 힘든 환경이라면, 주피터 노트북 파일을 HTML로 변환한 자료를 다운로드하여 읽어보세요.
                    </p>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="card">
                          <div className="card-body text-center">
                            <h6 className="card-title">📄 Agent RAG 4예제</h6>
                            <p className="card-text small text-muted">Agentic RAG 시스템 4가지 패턴 예제</p>
                            <a 
                              href="/downloads/Agent_RAG_4examples.html" 
                              className="btn btn-outline-primary btn-sm"
                              download="Agent_RAG_4examples.html"
                            >
                              HTML 다운로드
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="card">
                          <div className="card-body text-center">
                            <h6 className="card-title">🔧 Corrective RAG 예제</h6>
                            <p className="card-text small text-muted">자동 수정 기능을 포함한 RAG 시스템</p>
                            <a 
                              href="/downloads/pbl_Corrective_RAG.html" 
                              className="btn btn-outline-primary btn-sm"
                              download="pbl_Corrective_RAG.html"
                            >
                              HTML 다운로드
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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