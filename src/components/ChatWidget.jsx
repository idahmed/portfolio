import { useState, useRef, useEffect } from 'react';

const WIDGET_TOKEN = import.meta.env.VITE_APP_SECRET_TOKEN || '';

const styles = {
  // Floating button
  fab: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
    zIndex: 1000,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    color: '#fff',
    fontSize: '22px',
  },
  fabHover: {
    transform: 'scale(1.08)',
    boxShadow: '0 6px 28px rgba(99,102,241,0.65)',
  },
  // Panel
  panel: {
    position: 'fixed',
    bottom: '88px',
    right: '24px',
    width: '360px',
    maxWidth: 'calc(100vw - 48px)',
    height: '500px',
    maxHeight: 'calc(100vh - 120px)',
    background: '#0f0f13',
    border: '1px solid #1e1e2e',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
    zIndex: 999,
    overflow: 'hidden',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  },
  panelHidden: {
    opacity: 0,
    transform: 'translateY(12px) scale(0.97)',
    pointerEvents: 'none',
  },
  panelVisible: {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
  },
  // Header
  header: {
    padding: '14px 16px',
    borderBottom: '1px solid #1e1e2e',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#13131a',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#e2e8f0',
    lineHeight: 1.2,
  },
  headerSub: {
    fontSize: '11px',
    color: '#64748b',
    lineHeight: 1.2,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '2px 6px',
    borderRadius: '6px',
    lineHeight: 1,
    transition: 'color 0.15s',
  },
  // Messages
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#1e1e2e transparent',
  },
  // System message
  systemMsg: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    background: '#1a1a2e',
    border: '1px solid #1e1e2e',
    borderRadius: '12px 12px 12px 2px',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: 1.5,
  },
  // Bubble base
  bubbleWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: '12px 12px 2px 12px',
    padding: '9px 13px',
    fontSize: '13px',
    color: '#fff',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    background: '#1a1a2e',
    border: '1px solid #1e1e2e',
    borderRadius: '12px 12px 12px 2px',
    padding: '9px 13px',
    fontSize: '13px',
    color: '#cbd5e1',
    lineHeight: 1.5,
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  // Typing indicator
  typingDot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#6366f1',
    margin: '0 2px',
    animation: 'bounce 1.2s infinite ease-in-out',
  },
  // Input area
  inputArea: {
    padding: '10px 12px',
    borderTop: '1px solid #1e1e2e',
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
    background: '#0f0f13',
  },
  input: {
    flex: 1,
    background: '#1a1a2e',
    border: '1px solid #1e1e2e',
    borderRadius: '10px',
    padding: '9px 12px',
    fontSize: '13px',
    color: '#e2e8f0',
    outline: 'none',
    resize: 'none',
    minHeight: '38px',
    maxHeight: '100px',
    lineHeight: 1.5,
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  },
  inputFocus: {
    borderColor: '#6366f1',
  },
  sendBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: '10px',
    width: '38px',
    height: '38px',
    flexShrink: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '16px',
    transition: 'opacity 0.15s',
  },
  sendBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
};

// Inject keyframe animation once
if (typeof document !== 'undefined' && !document.getElementById('cw-anim')) {
  const style = document.createElement('style');
  style.id = 'cw-anim';
  style.textContent = `
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-5px); }
    }
    @keyframes cw-bounce-1 { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
    .cw-dot-1 { animation-delay: 0s !important; }
    .cw-dot-2 { animation-delay: 0.2s !important; }
    .cw-dot-3 { animation-delay: 0.4s !important; }
  `;
  document.head.appendChild(style);
}

function TypingIndicator() {
  return (
    <div style={styles.aiBubble}>
      <span className="cw-dot-1" style={styles.typingDot} />
      <span className="cw-dot-2" style={styles.typingDot} />
      <span className="cw-dot-3" style={styles.typingDot} />
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', content: string }
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fabHover, setFabHover] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, open]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  }, [input]);

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
      if (!res.ok || data.error) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.error || 'Something went wrong. Please try again.' },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      }
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

  const canSend = input.trim().length > 0 && !loading;

  return (
    <>
      {/* Chat panel */}
      <div
        style={{
          ...styles.panel,
          ...(open ? styles.panelVisible : styles.panelHidden),
        }}
        aria-hidden={!open}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.avatar}>Y</div>
          <div style={styles.headerText}>
            <div style={styles.headerTitle}>Ask about Yassine</div>
            <div style={styles.headerSub}>AI-powered · usually replies instantly</div>
          </div>
          <button
            style={styles.closeBtn}
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div style={styles.messages}>
          {/* System welcome */}
          <div style={styles.systemMsg}>Hi! Ask me anything about Yassine 👋</div>

          {messages.map((msg, i) => (
            <div key={i} style={styles.bubbleWrapper}>
              <div style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={styles.inputArea}>
          <textarea
            ref={textareaRef}
            style={{
              ...styles.input,
              ...(inputFocus ? styles.inputFocus : {}),
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            placeholder="Type a message…"
            rows={1}
            aria-label="Chat message"
            disabled={loading}
          />
          <button
            style={{
              ...styles.sendBtn,
              ...(canSend ? {} : styles.sendBtnDisabled),
            }}
            onClick={sendMessage}
            disabled={!canSend}
            aria-label="Send message"
          >
            ↑
          </button>
        </div>
      </div>

      {/* FAB */}
      <button
        style={{
          ...styles.fab,
          ...(fabHover ? styles.fabHover : {}),
        }}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setFabHover(true)}
        onMouseLeave={() => setFabHover(false)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? '×' : '💬'}
      </button>
    </>
  );
}
