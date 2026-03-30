import { useState, useRef, useEffect } from 'react';

const WIDGET_TOKEN = import.meta.env.VITE_APP_SECRET_TOKEN || '';

// Inject keyframe animations once
if (typeof document !== 'undefined' && !document.getElementById('cw-styles')) {
  const s = document.createElement('style');
  s.id = 'cw-styles';
  s.textContent = `
    @keyframes cw-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes cw-dot {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40%            { transform: translateY(-4px); opacity: 1; }
    }
    @keyframes cw-pulse-border {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(108, 99, 255, 0);
        border-color: rgba(108, 99, 255, 0.15);
      }
      50% {
        box-shadow: 0 0 0 4px rgba(108, 99, 255, 0.1);
        border-color: rgba(108, 99, 255, 0.45);
      }
    }
    @keyframes cw-sparkle {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
      50%       { transform: scale(1.25) rotate(20deg); opacity: 1; }
    }
    @keyframes cw-cursor-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }

    .cw-dot { animation: cw-dot 1.2s infinite ease-in-out; }
    .cw-dot:nth-child(2) { animation-delay: 0.15s; }
    .cw-dot:nth-child(3) { animation-delay: 0.3s; }

    .cw-pill-btn { animation: cw-pulse-border 3s ease-in-out infinite; }
    .cw-pill-btn:hover { animation: none !important; }

    .cw-sparkle { animation: cw-sparkle 3s ease-in-out infinite; display: inline-block; }
    .cw-cursor  { animation: cw-cursor-blink 0.9s step-end infinite; margin-left: 1px; font-weight: 300; }

    .cw-messages::-webkit-scrollbar { width: 3px; }
    .cw-messages::-webkit-scrollbar-track { background: transparent; }
    .cw-messages::-webkit-scrollbar-thumb { background: rgba(108, 99, 255, 0.2); border-radius: 4px; }

    .cw-input:focus { outline: none; border-color: rgba(108, 99, 255, 0.5) !important; }
    .cw-input::placeholder { color: var(--text-secondary); }
    .cw-send:disabled { opacity: 0.3; cursor: not-allowed; }
    .cw-send:not(:disabled):hover { opacity: 0.85; }
  `;
  document.head.appendChild(s);
}

function TypingDots() {
  const dot = {
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent-primary)',
    margin: '0 2px',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '4px 2px' }}>
      <span className="cw-dot" style={dot} />
      <span className="cw-dot" style={dot} />
      <span className="cw-dot" style={dot} />
    </div>
  );
}

const PROMPTS = [
  'What has Yassine built?',
  'What are his top skills?',
  'Is he open to work?',
  'Tell me about his experience…',
  'What stack does he use?',
];

function useTypewriter(phrases, { typingSpeed = 55, pauseMs = 1800, deletingSpeed = 30 } = {}) {
  const [display, setDisplay] = useState('');
  const phraseIdx = useRef(0);
  const charIdx   = useRef(0);
  const deleting  = useRef(false);

  useEffect(() => {
    let timeout;
    function tick() {
      const phrase = phrases[phraseIdx.current];
      if (!deleting.current) {
        charIdx.current += 1;
        setDisplay(phrase.slice(0, charIdx.current));
        if (charIdx.current === phrase.length) {
          deleting.current = true;
          timeout = setTimeout(tick, pauseMs);
        } else {
          timeout = setTimeout(tick, typingSpeed);
        }
      } else {
        charIdx.current -= 1;
        setDisplay(phrase.slice(0, charIdx.current));
        if (charIdx.current === 0) {
          deleting.current = false;
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length;
          timeout = setTimeout(tick, typingSpeed);
        } else {
          timeout = setTimeout(tick, deletingSpeed);
        }
      }
    }
    timeout = setTimeout(tick, typingSpeed);
    return () => clearTimeout(timeout);
  }, []);

  return display;
}

export default function ChatWidget() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const typedText  = useTypewriter(PROMPTS);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, open]);

  function handleOpen() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-token': WIDGET_TOKEN,
        },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.ok && data.reply
            ? data.reply
            : (data.error || 'Something went wrong, please try again.'),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // ── Collapsed: pill trigger ─────────────────────────────────────────────────
  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="cw-pill-btn"
        aria-label="Open AI chat"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          width: '100%',
          marginTop: '1.5rem',
          padding: '0.8rem 1.1rem',
          background: 'var(--bg-secondary)',
          border: '1px solid rgba(108, 99, 255, 0.2)',
          borderRadius: '999px',
          cursor: 'text',
          fontFamily: 'inherit',
          color: 'var(--text-secondary)',
          fontSize: '0.88rem',
          transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.5)';
          e.currentTarget.style.background  = 'var(--bg-tertiary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.2)';
          e.currentTarget.style.background  = 'var(--bg-secondary)';
        }}
      >
        <span
          className="cw-sparkle"
          style={{ fontSize: '0.95rem', flexShrink: 0, color: 'var(--accent-primary)' }}
        >
          ✦
        </span>
        <span style={{ flex: 1, textAlign: 'left', minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {typedText || '\u00A0'}
          <span className="cw-cursor" style={{ color: 'var(--accent-primary)' }}>|</span>
        </span>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--accent-primary)',
          background: 'rgba(108, 99, 255, 0.1)',
          border: '1px solid rgba(108, 99, 255, 0.25)',
          padding: '0.2rem 0.55rem',
          borderRadius: '999px',
          flexShrink: 0,
        }}>
          Ask AI
        </span>
      </button>
    );
  }

  // ── Expanded: chat panel ────────────────────────────────────────────────────
  return (
    <div
      style={{
        marginTop: '1.5rem',
        border: '1px solid rgba(108, 99, 255, 0.25)',
        borderRadius: '16px',
        background: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'cw-fade-in 0.22s ease',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.85rem 1rem',
          borderBottom: '1px solid rgba(108, 99, 255, 0.12)',
          background: 'linear-gradient(90deg, rgba(108,99,255,0.06), rgba(0,212,255,0.04))',
        }}
      >
        <span style={{ fontSize: '0.95rem', color: 'var(--accent-primary)' }}>✦</span>
        <span style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
          Ask about Yassine
        </span>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close chat"
          style={{
            background: 'none',
            border: '1px solid rgba(108, 99, 255, 0.15)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            padding: '3px 8px',
            borderRadius: '6px',
            fontFamily: 'inherit',
            lineHeight: 1,
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = 'rgba(108,99,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'none';
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        className="cw-messages"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          maxHeight: '320px',
          minHeight: messages.length === 0 ? '72px' : undefined,
        }}
      >
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
          Hi! Ask me anything about Yassine's work and experience.
        </p>

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '82%',
                padding: '0.55rem 0.85rem',
                borderRadius: msg.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #6c63ff, #00d4ff)'
                  : 'var(--bg-tertiary)',
                border: msg.role === 'user' ? 'none' : '1px solid rgba(108,99,255,0.15)',
                color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                fontSize: '0.87rem',
                lineHeight: 1.6,
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
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
                padding: '0.5rem 0.85rem',
                borderRadius: '14px 14px 14px 3px',
                background: 'var(--bg-tertiary)',
                border: '1px solid rgba(108,99,255,0.15)',
              }}
            >
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem',
          borderTop: '1px solid rgba(108,99,255,0.12)',
          alignItems: 'flex-end',
          background: 'var(--bg-secondary)',
        }}
      >
        <textarea
          ref={inputRef}
          className="cw-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          disabled={loading}
          rows={1}
          style={{
            flex: 1,
            background: 'var(--bg-tertiary)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: '10px',
            padding: '0.55rem 0.75rem',
            fontSize: '0.87rem',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            resize: 'none',
            minHeight: '38px',
            maxHeight: '96px',
            lineHeight: 1.55,
            transition: 'border-color 0.15s',
            overflowY: 'auto',
          }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
          }}
        />
        <button
          className="cw-send"
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          aria-label="Send"
          style={{
            background: 'linear-gradient(135deg, #6c63ff, #00d4ff)',
            border: 'none',
            borderRadius: '10px',
            width: '38px',
            height: '38px',
            flexShrink: 0,
            cursor: 'pointer',
            color: '#fff',
            fontSize: '1.05rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.15s',
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
