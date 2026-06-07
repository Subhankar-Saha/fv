import { FIREBASE_PROJECT_ID, FIREBASE_API_KEY } from './firebase.js';

const BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

// ── JS → Firestore REST format ────────────────────────
function toValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean')        return { booleanValue: v };
  if (typeof v === 'number')         return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string')         return { stringValue: v };
  if (Array.isArray(v))              return { arrayValue: { values: v.map(toValue) } };
  if (typeof v === 'object')         return { mapValue: { fields: _toFields(v) } };
  return { stringValue: String(v) };
}

function _toFields(obj) {
  const out = {};
  for (const [k, val] of Object.entries(obj)) out[k] = toValue(val);
  return out;
}

// ── Firestore REST format → JS ────────────────────────
function fromValue(v) {
  if ('nullValue'    in v) return null;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return parseInt(v.integerValue, 10);
  if ('doubleValue'  in v) return v.doubleValue;
  if ('stringValue'  in v) return v.stringValue;
  if ('arrayValue'   in v) return (v.arrayValue.values || []).map(fromValue);
  if ('mapValue'     in v) return _fromFields(v.mapValue.fields || {});
  return null;
}

function _fromFields(fields) {
  const out = {};
  for (const [k, val] of Object.entries(fields)) out[k] = fromValue(val);
  return out;
}

// ── GET single document ───────────────────────────────
export async function fsGet(col, id) {
  const res = await fetch(`${BASE}/${col}/${id}?key=${FIREBASE_API_KEY}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`fsGet ${col}/${id} → ${res.status}`);
  const doc = await res.json();
  return _fromFields(doc.fields || {});
}

// ── SET (create or overwrite) document ────────────────
export async function fsSet(col, id, data) {
  const res = await fetch(`${BASE}/${col}/${id}?key=${FIREBASE_API_KEY}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ fields: _toFields(data) }),
  });
  if (!res.ok) throw new Error(`fsSet ${col}/${id} → ${res.status}`);
}

// ── LIST all documents in a collection ────────────────
export async function fsGetAll(col) {
  const res = await fetch(`${BASE}/${col}?key=${FIREBASE_API_KEY}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error(`fsGetAll ${col} → ${res.status}`, err);
    throw new Error(`fsGetAll ${col} → ${res.status}: ${err?.error?.message ?? ''}`);
  }
  const json = await res.json();
  return (json.documents || []).map(doc => _fromFields(doc.fields || {}));
}

// ── DELETE document ───────────────────────────────────
export async function fsDelete(col, id) {
  const res = await fetch(`${BASE}/${col}/${id}?key=${FIREBASE_API_KEY}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`fsDelete ${col}/${id} → ${res.status}`);
}
