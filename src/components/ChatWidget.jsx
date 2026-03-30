import { useState, useRef, useEffect } from 'react';

const WIDGET_TOKEN = import.meta.env.VITE_APP_SECRET_TOKEN || '';

// Inject keyframe animations once
if (typeof document !== 'undefined' && !document.getElementById('cw-styles')) {
  const s = document.createElement('style');
  s.id = 'cw-styles';
  s.textContent = `
    @keyframes cw-fade-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes cw-dot {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40%            { transform: translateY(-4px); opacity: 1; }
    }
    .cw-dot { animation: cw-dot 1.2s infinite ease-in-out; }
    .cw-dot:nth-child(2) { animation-delay: 0.15s; }
    .cw-dot:nth-child(3) { animation-delay: 0.3s; }

    .cw-messages::-webkit-scrollbar { width: 4px; }
    .cw-messages::-webkit-scrollbar-track { background: transparent; }
    .cw-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

    .cw-input:focus { outline: none; border-color: var(--accent) !important; }
    .cw-input::placeholder { color: var(--text-muted); }
    .cw-send:disabled { opacity: 0.35; cursor: not-allowed; }
    .cw-send:not(:disabled):hover { background: var(--accent-hover) !important; }

    @keyframes cw-pulse-border {
      0%, 100% { box-shadow: 0 0 0 0px color-mix(in srgb, var(--accent) 30%, transparent); border-color: var(--border); }
      50% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent); border-color: var(--accent); }
    }
    @keyframes cw-sparkle {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
      50% { transform: scale(1.3) rotate(20deg); opacity: 1; }
    }
    @keyframes cw-cursor-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .cw-pill {
      animation: cw-pulse-border 2.8s ease-in-out infinite;
    }
    .cw-pill:hover {
      animation: none !important;
    }
    .cw-sparkle {
      animation: cw-sparkle 2.8s ease-in-out infinite;
      display: inline-block;
    }
    .cw-cursor {
      animation: cw-cursor-blink 0.9s step-end infinite;
      margin-left: 1px;
      font-weight: 300;
    }
  `;
  document.head.appendChild(s);
}

function TypingDots() {
  const dot = {
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
    margin: '0 2px',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '6px 2px' }}>
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
  const charIdx = useRef(0);
  const deleting = useRef(false);

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
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', content }
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const typedText = useTypewriter(PROMPTS);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, open]);

  function handleOpen() {
    setOpen(true);
    // Focus input on next tick after expand animation
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
          content: res.ok && data.reply ? data.reply : (data.error || 'Something went wrong, please try again.'),
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

  // ── Collapsed: pill input bar ──────────────────────────────────────────────
  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="cw-pill"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          width: '100%',
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'var(--bg-alt)',
          border: '1px solid var(--border)',
          borderRadius: '999px',
          cursor: 'text',
          fontFamily: 'inherit',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.background = 'var(--card-bg-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.background = 'var(--bg-alt)';
        }}
        aria-label="Open AI chat"
      >
        <span className="cw-sparkle" style={{ fontSize: '1rem', flexShrink: 0, color: 'var(--accent)' }}>✦</span>
        <span style={{ flex: 1, textAlign: 'left', minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {typedText || '\u00A0'}
          <span className="cw-cursor" style={{ color: 'var(--accent)' }}>|</span>
        </span>
      </button>
    );
  }

  // ── Expanded: chat panel ───────────────────────────────────────────────────
  return (
    <div
      style={{
        marginTop: '1.25rem',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        background: 'var(--bg-alt)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'cw-fade-in 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span style={{ fontSize: '1rem', color: 'var(--accent)' }}>✦</span>
        <span style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text)', flex: 1 }}>
          Ask about Yassine
        </span>
        <button
          onClick={() => setOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '2px 6px',
            borderRadius: '6px',
            fontFamily: 'inherit',
            lineHeight: 1,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          aria-label="Close chat"
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
          padding: '0.75rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          maxHeight: '340px',
          minHeight: messages.length === 0 ? '64px' : undefined,
        }}
      >
        {/* Welcome */}
        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>
          Hi! Ask me anything about Yassine 👋
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
                padding: '0.5rem 0.8rem',
                borderRadius: msg.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                background: msg.role === 'user' ? 'var(--accent)' : 'var(--card-bg-hover)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                color: msg.role === 'user' ? '#fff' : 'var(--text)',
                fontSize: '0.87rem',
                lineHeight: 1.55,
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
                padding: '0.5rem 0.8rem',
                borderRadius: '14px 14px 14px 3px',
                background: 'var(--card-bg-hover)',
                border: '1px solid var(--border)',
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
          padding: '0.65rem 0.75rem',
          borderTop: '1px solid var(--border)',
          alignItems: 'flex-end',
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
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '0.5rem 0.75rem',
            fontSize: '0.87rem',
            color: 'var(--text)',
            fontFamily: 'inherit',
            resize: 'none',
            minHeight: '36px',
            maxHeight: '96px',
            lineHeight: 1.5,
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
          style={{
            background: 'var(--accent)',
            border: 'none',
            borderRadius: '10px',
            width: '36px',
            height: '36px',
            flexShrink: 0,
            cursor: 'pointer',
            color: '#fff',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          aria-label="Send"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
