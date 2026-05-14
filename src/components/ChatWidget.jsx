import { useState, useRef, useEffect } from 'react';

const WIDGET_TOKEN = import.meta.env.VITE_APP_SECRET_TOKEN || '';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

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
          content:
            res.ok && data.reply
              ? data.reply
              : (data.error || 'Something went wrong. Try again.'),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network error. Try again.' },
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

  if (!open) {
    return (
      <div className="chat-widget">
        <button type="button" className="chat-widget-trigger" onClick={handleOpen}>
          <span className="chat-widget-trigger-label">Questions about this site?</span>
          <span className="chat-widget-trigger-action">Open chat</span>
        </button>
      </div>
    );
  }

  return (
    <div className="chat-widget chat-widget--open">
      <div className="chat-widget-panel">
        <div className="chat-widget-head">
          <span className="chat-widget-title">Chat</span>
          <button type="button" className="chat-widget-close" onClick={() => setOpen(false)} aria-label="Close chat">
            ×
          </button>
        </div>
        <div className="chat-widget-body">
          <p className="chat-widget-note">
            Ask about experience, stack, or roles. Replies are generated; verify anything important.
          </p>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-widget-msg chat-widget-msg--${msg.role === 'user' ? 'user' : 'assistant'}`}
            >
              {msg.content}
            </div>
          ))}
          {loading ? (
            <div className="chat-widget-msg chat-widget-msg--assistant chat-widget-msg--typing">
              <span className="chat-widget-dot" />
              <span className="chat-widget-dot" />
              <span className="chat-widget-dot" />
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>
        <div className="chat-widget-foot">
          <textarea
            ref={inputRef}
            className="chat-widget-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message…"
            disabled={loading}
            rows={1}
            onInput={(e) => {
              const el = e.target;
              el.style.height = 'auto';
              el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
            }}
          />
          <button
            type="button"
            className="chat-widget-send"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            aria-label="Send"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
