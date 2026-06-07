let _key = null;

const enc = new TextEncoder();
const dec = new TextDecoder();

// Derive AES-256-GCM key from password + mobile as salt (PBKDF2, 100k iterations)
export async function deriveKey(password, mobile) {
  const raw = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  _key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('fv:' + mobile), iterations: 100_000, hash: 'SHA-256' },
    raw,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export function clearKey() { _key = null; }

export async function encryptVault(obj) {
  if (!_key) throw new Error('No key');
  const iv      = crypto.getRandomValues(new Uint8Array(12));
  const encoded = enc.encode(JSON.stringify(obj));
  const cipher  = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, _key, encoded);
  return {
    iv:   _b64(iv),
    data: _b64(new Uint8Array(cipher)),
  };
}

export async function decryptVault(payload) {
  if (!_key) throw new Error('No key');
  const iv     = _unb64(payload.iv);
  const cipher = _unb64(payload.data);
  const plain  = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, _key, cipher);
  return JSON.parse(dec.decode(plain));
}

export const hasKey = () => !!_key;

const _b64   = buf => btoa(String.fromCharCode(...buf));
const _unb64 = str => Uint8Array.from(atob(str), c => c.charCodeAt(0));
