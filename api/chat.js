const GOOGLE_DOC_URL =
  'https://docs.google.com/document/d/1W4fh5vrbKBtetpF7Eks6GJQmVsqtRpPSLNDxoQ_bABs/export?format=txt';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// In-memory cache for the Google Doc context
let contextCache = null;
let contextCachedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function fetchContext() {
  const now = Date.now();
  if (contextCache && now - contextCachedAt < CACHE_TTL_MS) {
    return contextCache;
  }
  const res = await fetch(GOOGLE_DOC_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch context doc: ${res.status}`);
  }
  const text = await res.text();
  contextCache = text;
  contextCachedAt = now;
  return text;
}

export default async function handler(req, res) {
  // CORS
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '';
  const origin = req.headers.origin || '';
  if (allowedOrigin && origin !== allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-app-token');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth
  const token = req.headers['x-app-token'];
  if (!token || token !== process.env.APP_SECRET_TOKEN) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  let context;
  try {
    context = await fetchContext();
  } catch (err) {
    console.error('Context fetch error:', err.message);
    return res.status(502).json({ error: 'Failed to load context' });
  }

  // Map messages to Gemini contents format
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

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

  try {
    const geminiRes = await fetch(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
      }
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errBody);
      return res.status(502).json({ error: 'AI service error' });
    }

    const data = await geminiRes.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response';
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Gemini request failed:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
