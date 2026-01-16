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
  const [error, setError] = useState<string | null>(null);
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
        setError(null);

        // Fetch widget config
        const configRes = await fetch('/api/widget/config');
        if (!configRes.ok) {
          throw new Error('Failed to fetch widget configuration');
        }
        const configData = await configRes.json();
        setConfig(configData);

        // Create or get thread for this visitor
        const threadRes = await fetch('/api/chat/thread', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId }),
        });

        if (!threadRes.ok) {
          throw new Error('Failed to create conversation thread');
        }

        const threadData = await threadRes.json();
        if (!threadData.threadId) {
          throw new Error('No thread ID received');
        }

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
        setError(error instanceof Error ? error.message : 'Failed to initialize widget');
      }
    };

    initialize();
  }, [visitorId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !threadId) {
      setError('Unable to send message. Please try refreshing.');
      return;
    }

    // Add user message to UI immediately
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: inputValue,
    };

    const messageContent = inputValue;
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, message: messageContent }),
      });

      const data = await res.json();

      if (res.ok && data.response) {
        const assistantMessage: Message = {
          id: data.messageId,
          role: 'assistant',
          content: data.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMsg = data.error || 'Sorry, something went wrong. Please try again.';
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            role: 'assistant',
            content: errorMsg,
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
          content: 'Connection error. Please check your internet and try again.',
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
          {error ? (
            <>
              <div className="text-red-600 text-4xl mb-4">⚠️</div>
              <p className="text-gray-800 font-semibold mb-2">Setup Error</p>
              <p className="text-gray-600 text-sm max-w-xs">{error}</p>
              <p className="text-gray-500 text-xs mt-4">
                Check your OpenAI API key and Assistant ID
              </p>
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </>
          )}
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
        {error && (
          <div
            style={{
              backgroundColor: isDarkTheme ? '#4a2a2a' : '#ffe6e6',
              color: isDarkTheme ? '#ff6b6b' : '#c41e3a',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              marginBottom: '8px',
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={!threadId ? 'Initializing...' : 'Type your message...'}
            disabled={loading || !threadId}
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
            disabled={loading || !inputValue.trim() || !threadId}
            style={{
              backgroundColor: config.primaryColor,
              color: config.accentColor,
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: loading || !inputValue.trim() || !threadId ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: loading || !inputValue.trim() || !threadId ? 0.6 : 1,
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
