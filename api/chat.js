import { GoogleGenAI } from '@google/genai';

const GOOGLE_DOC_URL =
  'https://docs.google.com/document/d/1W4fh5vrbKBtetpF7Eks6GJQmVsqtRpPSLNDxoQ_bABs/export?format=txt';

// In-memory cache
let contextCache = null;
let contextCachedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

async function fetchContext() {
  const now = Date.now();
  if (contextCache && now - contextCachedAt < CACHE_TTL_MS) {
    return contextCache;
  }
  const res = await fetch(GOOGLE_DOC_URL);
  if (!res.ok) throw new Error(`Failed to fetch context doc: ${res.status}`);
  const text = await res.text();
  contextCache = text;
  contextCachedAt = now;
  return text;
}

export default async function handler(req, res) {
  // ── CORS ────────────────────────────────────────────────────────────────
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin === '*' ? '*' : origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-app-token');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Auth ─────────────────────────────────────────────────────────────────
  const token = req.headers['x-app-token'];
  const expectedToken = process.env.APP_SECRET_TOKEN;

  if (!expectedToken) {
    console.error('APP_SECRET_TOKEN is not set');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }
  if (!token || token !== expectedToken) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // ── Validate body ────────────────────────────────────────────────────────
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // ── Validate Gemini key ──────────────────────────────────────────────────
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error('GEMINI_API_KEY is not set');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  // ── Fetch context ────────────────────────────────────────────────────────
  let context;
  try {
    context = await fetchContext();
  } catch (err) {
    console.error('Context fetch error:', err.message);
    return res.status(502).json({ error: 'Failed to load context' });
  }

  // ── Build chat history ───────────────────────────────────────────────────
  // Gemini requires strictly alternating user/model roles
  const contents = [];
  for (const m of messages) {
    const role = m.role === 'assistant' ? 'model' : 'user';
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      // Merge consecutive same-role messages
      contents[contents.length - 1].parts[0].text += '\n' + m.content;
    } else {
      contents.push({ role, parts: [{ text: m.content }] });
    }
  }

  // ── Call Gemini via official SDK ─────────────────────────────────────────
  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: context,
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const reply = response.text ?? 'No response';
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Gemini SDK error:', err.message);
    return res.status(502).json({
      error: 'AI service error',
      detail: err.message,
    });
  }
}