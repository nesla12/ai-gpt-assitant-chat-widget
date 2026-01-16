'use client';

import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface WidgetConfig {
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  welcomeMessage: string;
  subtitle: string;
  position: string;
  theme: string;
}

export default function WidgetPage() {
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [threadId, setThreadId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [visitorId] = useState(() => {
    // Try to get from localStorage, or generate new
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('widget_visitor_id');
      if (stored) return stored;
      const newId = uuidv4();
      localStorage.setItem('widget_visitor_id', newId);
      return newId;
    }
    return uuidv4();
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch config and create/get thread
  useEffect(() => {
    const initialize = async () => {
      try {
        // Fetch widget config
        const configRes = await fetch('/api/widget/config');
        const configData = await configRes.json();
        setConfig(configData);

        // Create or get thread for this visitor
        const threadRes = await fetch('/api/chat/thread', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId }),
        });

        const threadData = await threadRes.json();
        setThreadId(threadData.threadId);

        // Add welcome message
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: configData.welcomeMessage,
          },
        ]);
      } catch (error) {
        console.error('Failed to initialize widget:', error);
      }
    };

    initialize();
  }, [visitorId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !threadId) return;

    // Add user message to UI immediately
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, message: inputValue }),
      });

      const data = await res.json();

      if (res.ok) {
        const assistantMessage: Message = {
          id: data.messageId,
          role: 'assistant',
          content: data.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Show error message
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isDarkTheme = config.theme === 'dark';
  const bgColor = isDarkTheme ? '#1a1a1a' : '#ffffff';
  const textColor = isDarkTheme ? '#ffffff' : '#000000';
  const messageBgUser = config.primaryColor;
  const messageBgAssistant = isDarkTheme ? '#2a2a2a' : '#f0f0f0';

  return (
    <div
      style={{
        background: bgColor,
        color: textColor,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: config.primaryColor,
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: config.accentColor,
        }}
      >
        {config.logoUrl && (
          <img
            src={config.logoUrl}
            alt="Logo"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            AI Assistant
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
            {config.subtitle}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                backgroundColor:
                  msg.role === 'user' ? messageBgUser : messageBgAssistant,
                color: msg.role === 'user' ? config.accentColor : textColor,
                padding: '12px 16px',
                borderRadius: '12px',
                maxWidth: '80%',
                wordWrap: 'break-word',
                lineHeight: '1.4',
                fontSize: '14px',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                backgroundColor: messageBgAssistant,
                color: textColor,
                padding: '12px 16px',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ animation: 'bounce 1.4s infinite' }}>●</span>
                <span style={{ animation: 'bounce 1.4s infinite 0.2s' }}>●</span>
                <span style={{ animation: 'bounce 1.4s infinite 0.4s' }}>●</span>
              </div>
              <style>{`
                @keyframes bounce {
                  0%, 80%, 100% { opacity: 0.5; }
                  40% { opacity: 1; }
                }
              `}</style>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          borderTop: `1px solid ${isDarkTheme ? '#333' : '#e0e0e0'}`,
          padding: '12px',
          backgroundColor: bgColor,
        }}
      >
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: `1px solid ${isDarkTheme ? '#444' : '#ddd'}`,
              borderRadius: '8px',
              backgroundColor: isDarkTheme ? '#2a2a2a' : '#f5f5f5',
              color: textColor,
              outline: 'none',
              fontSize: '14px',
            }}
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            style={{
              backgroundColor: config.primaryColor,
              color: config.accentColor,
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: loading || !inputValue.trim() ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: loading || !inputValue.trim() ? 0.6 : 1,
              transition: 'opacity 0.2s',
              fontSize: '14px',
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
