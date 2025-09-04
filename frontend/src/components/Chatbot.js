import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '안녕하세요! 슬슬 AIdea Agent 챗봇입니다. 무엇을 도와드릴까요?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 자동 응답 로직
  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('일정') || lowerMessage.includes('스케줄')) {
      return '컨퍼런스는 12월 15일-16일 이틀간 진행됩니다. 상세 일정은 일정 페이지에서 확인하실 수 있어요!';
    } else if (lowerMessage.includes('등록') || lowerMessage.includes('참가')) {
      return '컨퍼런스 등록은 등록 페이지에서 가능합니다. 무료로 참가하실 수 있어요!';
    } else if (lowerMessage.includes('발표자') || lowerMessage.includes('스피커')) {
      return '각 분야의 전문가들이 발표합니다. AI, 클라우드, DevOps, 프론트엔드 등 다양한 트랙이 있어요!';
    } else if (lowerMessage.includes('위치') || lowerMessage.includes('장소')) {
      return '컨퍼런스는 온라인으로 진행됩니다. 집에서 편안하게 참여하실 수 있어요!';
    } else if (lowerMessage.includes('비용') || lowerMessage.includes('가격')) {
      return '컨퍼런스 참가는 완전 무료입니다! 사내 개발자분들을 위한 특별한 혜택이에요.';
    } else if (lowerMessage.includes('기술') || lowerMessage.includes('트랙')) {
      return 'AI/ML, 클라우드, DevOps, 프론트엔드, 데이터, 보안 등 다양한 기술 트랙을 준비했습니다!';
    } else if (lowerMessage.includes('네트워킹') || lowerMessage.includes('소통')) {
      return '컨퍼런스 중 네트워킹 세션과 채팅을 통해 다른 개발자들과 소통할 수 있어요!';
    } else if (lowerMessage.includes('상금') || lowerMessage.includes('경진대회')) {
      return '프로젝트 경진대회에서 우수한 프로젝트를 선정하여 상금을 수여합니다!';
    } else if (lowerMessage.includes('도움') || lowerMessage.includes('help')) {
      return '일정, 등록, 발표자, 위치, 비용, 기술 트랙, 네트워킹, 경진대회 등에 대해 질문해주세요!';
    } else {
      return '죄송합니다. 질문을 이해하지 못했어요. 다른 방식으로 질문해주시거나, "도움"이라고 입력해주세요!';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 챗봇 응답 시뮬레이션
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: getBotResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* 챗봇 토글 버튼 */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChatbot}
        aria-label="챗봇 열기/닫기"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* 챗봇 패널 */}
      <div className={`chatbot-panel ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-avatar">
            <div className="avatar-icon">🤖</div>
          </div>
          <div className="chatbot-info">
            <h3>슬슬 AIdea Agent</h3>
            <span className="status">온라인</span>
          </div>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-time">
                {formatTime(message.timestamp)}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot typing">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="send-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="quick-questions">
            <button onClick={() => setInputMessage('일정이 궁금해요')}>
              일정
            </button>
            <button onClick={() => setInputMessage('등록 방법')}>
              등록
            </button>
            <button onClick={() => setInputMessage('발표자')}>
              발표자
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot; 