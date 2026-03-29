const GOOGLE_DOC_URL =
  'https://docs.google.com/document/d/1W4fh5vrbKBtetpF7Eks6GJQmVsqtRpPSLNDxoQ_bABs/export?format=txt';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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
  // ── CORS ──────────────────────────────────────────────────────────────────
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin === '*' ? '*' : origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-app-token');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Auth ──────────────────────────────────────────────────────────────────
  const token = req.headers['x-app-token'];
  const expectedToken = process.env.APP_SECRET_TOKEN;

  if (!expectedToken) {
    console.error('APP_SECRET_TOKEN env var is not set');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }
  if (!token || token !== expectedToken) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // ── Validate body ─────────────────────────────────────────────────────────
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // ── Fetch context ─────────────────────────────────────────────────────────
  let context;
  try {
    context = await fetchContext();
  } catch (err) {
    console.error('Context fetch error:', err.message);
    return res.status(502).json({ error: 'Failed to load context' });
  }

  // ── Validate Gemini key ───────────────────────────────────────────────────
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error('GEMINI_API_KEY env var is not set');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  // ── Build Gemini payload ──────────────────────────────────────────────────
  // Gemini requires alternating user/model roles — no two consecutive same roles
  const contents = [];
  for (const m of messages) {
    const role = m.role === 'assistant' ? 'model' : 'user';
    // Merge consecutive same-role messages
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += '\n' + m.content;
    } else {
      contents.push({ role, parts: [{ text: m.content }] });
    }
  }

  // Gemini requires the last message to be from user
  if (contents[contents.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Last message must be from user' });
  }

  const geminiPayload = {
    system_instruction: {
      parts: [{ text: context }],
    },
    contents,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
  };

  // ── Call Gemini ───────────────────────────────────────────────────────────
  try {
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      // Log the full Gemini error so you can see it in Vercel logs
      console.error('Gemini API error:', JSON.stringify(data, null, 2));
      return res.status(502).json({
        error: 'AI service error',
        detail: data?.error?.message || 'Unknown Gemini error',
      });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response';
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Gemini request failed:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}