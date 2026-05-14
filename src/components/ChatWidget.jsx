import { useState, useRef, useEffect, useLayoutEffect } from 'react';

const WIDGET_TOKEN = import.meta.env.VITE_APP_SECRET_TOKEN || '';

const SUGGESTED_PROMPTS = [
  'What has Yassine built recently?',
  'Summarize his backend experience.',
  'Is he open to new roles?',
  'Which frameworks does he use most?',
];

function focusAndSelectAll(el) {
  if (!el) return;
  el.focus({ preventScroll: true });
  const len = el.value.length;
  try {
    el.setSelectionRange(0, len);
  } catch {
    /* ignore */
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [inputPulse, setInputPulse] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, open]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    setInputPulse(true);
    const clearPulse = window.setTimeout(() => setInputPulse(false), 900);

    function runSelect() {
      focusAndSelectAll(inputRef.current);
    }

    runSelect();
    const r1 = requestAnimationFrame(() => {
      requestAnimationFrame(runSelect);
    });
    const t1 = window.setTimeout(runSelect, 50);
    const t2 = window.setTimeout(runSelect, 200);

    return () => {
      clearTimeout(clearPulse);
      cancelAnimationFrame(r1);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open]);

  useEffect(() => {
    if (open || messages.length > 0) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const t = setInterval(() => {
      setActivePromptIndex((i) => (i + 1) % SUGGESTED_PROMPTS.length);
    }, 3200);
    return () => clearInterval(t);
  }, [open, messages.length]);

  function applySuggestedPrompt(text) {
    setInput(text);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        focusAndSelectAll(inputRef.current);
      });
    });
  }

  function handleOpen() {
    setOpen(true);
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
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          focusAndSelectAll(inputRef.current);
        });
      });
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
          <span className="chat-widget-trigger-label">
            <span className="chat-widget-trigger-rotating" aria-live="polite">
              {SUGGESTED_PROMPTS[activePromptIndex]}
            </span>
          </span>
          <span className="chat-widget-trigger-action">Open chat</span>
        </button>
      </div>
    );
  }

  const showStarters = messages.length === 0 && !loading;

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
            Ask about experience or roles. Replies are generated; verify anything important.
          </p>
          {showStarters ? (
            <div className="chat-widget-suggestions" role="group" aria-label="Suggested questions">
              {SUGGESTED_PROMPTS.map((text) => (
                <button
                  key={text}
                  type="button"
                  className="chat-widget-suggestion"
                  onClick={() => applySuggestedPrompt(text)}
                >
                  {text}
                </button>
              ))}
            </div>
          ) : null}
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
            className={`chat-widget-input${inputPulse ? ' chat-widget-input--pulse' : ''}`}
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
