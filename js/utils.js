// ── COLOUR MAP ────────────────────────────────────────
export const CLRS = {
  accent: { bg: 'var(--accent-dim)', fg: 'var(--accent)' },
  green:  { bg: 'var(--green-dim)',  fg: 'var(--green)'  },
  amber:  { bg: 'var(--amber-dim)',  fg: 'var(--amber)'  },
  red:    { bg: 'var(--red-dim)',    fg: 'var(--red)'    },
  teal:   { bg: 'var(--teal-dim)',   fg: 'var(--teal)'   },
  purple: { bg: 'var(--purple-dim)', fg: 'var(--purple)' },
  pink:   { bg: 'var(--pink-dim)',   fg: 'var(--pink)'   },
  muted:  { bg: 'rgba(122,127,148,0.15)', fg: 'var(--muted)' },
};

export const clr = k => CLRS[k] || CLRS.accent;
export const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
export const uid = () => 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);

// ── TOAST ─────────────────────────────────────────────
let _toastTimer;
export function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { t.className = 'toast'; }, 3500);
}

// ── DOWNLOAD ──────────────────────────────────────────
export function downloadJSON(content, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
