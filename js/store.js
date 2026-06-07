import { fsGet, fsSet, fsDelete } from './firestore-api.js';
import { showToast, downloadJSON } from './utils.js';

// ── STATE ─────────────────────────────────────────────
let _vault       = null;
let _currentUser = null;
let _saveTimer   = null;

// ── GETTERS / SETTERS ─────────────────────────────────
export const getVault       = () => _vault;
export const getCurrentUser = () => _currentUser;
export const setCurrentUser = u  => { _currentUser = u; };
export const isUnsaved      = () => !!_saveTimer;

export const getSec     = sid       => _vault?.sections?.find(s => s.id === sid);
export const getCard    = (sid,cid) => getSec(sid)?.cards.find(c => c.id === cid);
export const getContact = ci        => _vault?.contacts?.find(c => c.id === ci);

// ── LOAD USER VAULT FROM FIRESTORE ────────────────────
export async function loadUserVault(user) {
  _currentUser = user;
  try {
    const data = await fsGet('vaults', user.mobile);
    _vault = data ?? _emptyVault(user);
    if (!data) _persistVault();
  } catch (e) {
    console.error('loadUserVault:', e);
    _vault = _emptyVault(user);
    showToast('Offline — edits will sync when online', 'error');
  }
}

// ── PERSIST TO FIRESTORE ──────────────────────────────
function _persistVault() {
  if (!_currentUser || !_vault) return;
  fsSet('vaults', _currentUser.mobile, _vault)
    .catch(e => console.error('_persistVault:', e));
}

// ── SYNC DOM → _vault ─────────────────────────────────
export function syncFromDOM() {
  document.querySelectorAll('#vault-container [data-prop]').forEach(el => {
    const v = el.textContent.trim();
    const { prop, sid, cid, fi, ni, ci, di } = el.dataset;
    switch (prop) {
      case 'meta-updated': _vault.meta.lastUpdated = v; break;
      case 'meta-author':  _vault.meta.createdBy   = v; break;
      case 'sec-title':  { const s = getSec(sid);       if (s) s.title              = v; break; }
      case 'card-name':  { const c = getCard(sid,cid);  if (c) c.name               = v; break; }
      case 'card-type':  { const c = getCard(sid,cid);  if (c) c.type               = v; break; }
      case 'f-label':    { const c = getCard(sid,cid);  if (c?.fields[fi]) c.fields[fi].label = v; break; }
      case 'f-value':    { const c = getCard(sid,cid);  if (c?.fields[fi]) c.fields[fi].value = v; break; }
      case 'n-label':    { const n = _vault.notes[ni];  if (n) n.label              = v; break; }
      case 'n-value':    { const n = _vault.notes[ni];  if (n) n.value              = v; break; }
      case 'ct-name':    { const t = getContact(ci);    if (t) t.name               = v; break; }
      case 'ct-role':    { const t = getContact(ci);    if (t) t.role               = v; break; }
      case 'ct-detail':  { const t = getContact(ci);    if (t && t.details[di] !== undefined) t.details[di] = v; break; }
    }
  });
}

// ── AUTO-SAVE (debounced 1.5s) ────────────────────────
const _dot = () => document.getElementById('unsaved-dot');

export function markUnsaved() {
  const d = _dot();
  if (d) d.style.display = 'inline';
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(async () => {
    syncFromDOM();
    _persistVault();
    _saveTimer = null;
    const d2 = _dot();
    if (d2) d2.style.display = 'none';
  }, 1500);
}

export function markSaved() {
  clearTimeout(_saveTimer);
  _saveTimer = null;
  const d = _dot();
  if (d) d.style.display = 'none';
}

// ── IMMEDIATE SAVE (used by mutations) ────────────────
export async function flushSave() {
  syncFromDOM();
  _persistVault();
}

// ── EXPORT CURRENT USER VAULT AS JSON ─────────────────
export async function exportJSON() {
  if (!_vault || !_currentUser) return;
  await flushSave();
  const backup = {
    exportDate: new Date().toISOString(),
    version:    '3.0',
    user: {
      mobile: _currentUser.mobile,
      name:   _currentUser.name,
      avatar: _currentUser.avatar,
    },
    vault: _vault,
  };
  downloadJSON(JSON.stringify(backup, null, 2), `vault_${_currentUser.mobile}_${Date.now()}.json`);
  showToast('✓ Exported vault backup', 'success');
}

// ── IMPORT VAULT FROM JSON BACKUP ─────────────────────
export function importJSON(input) {
  const file = input?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const backup = JSON.parse(e.target.result);
      if (!backup.vault) throw new Error('Invalid format');
      _vault = backup.vault;
      _persistVault();
      const { reRender } = await import('./render.js');
      reRender();
      showToast('✓ Vault restored from backup', 'success');
    } catch (_) {
      showToast('Invalid backup file', 'error');
    }
    input.value = '';
  };
  reader.readAsText(file);
}

// ── DELETE VAULT (used by auth when deleting member) ──
export async function deleteVault(mobile) {
  try { await fsDelete('vaults', mobile); } catch (_) {}
}

// ── EMPTY VAULT TEMPLATE ──────────────────────────────
function _emptyVault(user) {
  return {
    config: {
      title:            user.name + "'s Vault",
      subtitle:         'Keep this file safe.',
      emergencyMessage: 'This vault belongs to ' + user.name + ' (' + user.mobile + '). Keep strictly private.',
    },
    meta:     { lastUpdated: new Date().toLocaleDateString('en-IN'), createdBy: user.name },
    sections: [],
    contacts: [],
    notes:    [],
  };
}
