import { db } from './firebase.js';
import {
  doc, getDocs, setDoc, deleteDoc, collection,
} from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';
import { loadUserVault, setCurrentUser, syncFromDOM, markSaved, deleteVault } from './store.js';
import { reRender } from './render.js';
import { setupEvents } from './events.js';
import { showToast, esc } from './utils.js';

let _users        = [];
let _selectedUser = null;
let _eventsReady  = false;

// ── SHA-256 PASSWORD HASH ─────────────────────────────
async function hashPwd(pwd) {
  const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── LOAD USERS FROM FIRESTORE ─────────────────────────
export async function loadUsers() {
  const grid = document.getElementById('user-grid');
  if (grid) grid.innerHTML = `<p class="no-users">Loading members…</p>`;
  try {
    const snap = await getDocs(collection(db, 'users'));
    _users = snap.docs.map(d => d.data());
  } catch (e) {
    console.error('loadUsers:', e);
    _users = [];
    if (grid) grid.innerHTML = `<p class="no-users">Could not load — check internet connection.</p>`;
    return;
  }
  _renderUserGrid();
}

// ── SELECT USER CARD ──────────────────────────────────
export function selectUser(mobile) {
  _selectedUser = _users.find(u => u.mobile === mobile) || null;
  document.querySelectorAll('.user-card').forEach(c =>
    c.classList.toggle('active', c.dataset.mobile === mobile)
  );
  const pi = document.getElementById('pwd-input');
  if (pi) { pi.value = ''; pi.focus(); }
}

// ── UNLOCK ────────────────────────────────────────────
export async function unlock() {
  if (!_selectedUser) { showToast('Please select a member first', 'error'); return; }

  const input     = document.getElementById('pwd-input');
  const inputHash = await hashPwd(input.value);

  if (inputHash !== _selectedUser.passwordHash) {
    const err = document.getElementById('pwd-error');
    if (err) { err.style.display = 'block'; setTimeout(() => { err.style.display = 'none'; }, 3000); }
    input.value = '';
    input.focus();
    return;
  }

  // Show loading while fetching vault
  const btn = document.querySelector('.lock-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }

  setCurrentUser(_selectedUser);
  await loadUserVault(_selectedUser);

  if (btn) { btn.disabled = false; btn.textContent = 'Unlock Vault'; }

  document.getElementById('lock-screen').style.display = 'none';
  document.getElementById('vault').style.display       = 'block';
  document.getElementById('vault-title').textContent   = _selectedUser.name + "'s Vault";
  document.getElementById('vault-subtitle').textContent = '📱 ' + _selectedUser.mobile;

  reRender();
  if (!_eventsReady) { setupEvents(); _eventsReady = true; }
}

// ── LOCK ──────────────────────────────────────────────
export function lockVault() {
  syncFromDOM();
  document.getElementById('vault').style.display       = 'none';
  document.getElementById('vault-container').innerHTML = '';
  document.getElementById('lock-screen').style.display = 'flex';
  document.getElementById('pwd-input').value           = '';
  _selectedUser = null;
  _eventsReady  = false;
  document.querySelectorAll('.user-card').forEach(c => c.classList.remove('active'));
  markSaved();
}

// ── ADD MEMBER ────────────────────────────────────────
export async function addUser() {
  const name   = document.getElementById('new-user-name').value.trim();
  const mobile = document.getElementById('new-user-mobile').value.trim();
  const pass   = document.getElementById('new-user-pass').value.trim();
  const avatar = document.getElementById('new-user-emoji').value.trim() || '👤';

  if (!name || !mobile || !pass)       { showToast('Name, mobile and password are required', 'error'); return; }
  if (!/^\d{10}$/.test(mobile))        { showToast('Mobile must be exactly 10 digits', 'error'); return; }
  if (_users.find(u => u.mobile === mobile)) { showToast('Mobile ' + mobile + ' already registered', 'error'); return; }
  if (pass.length < 4)                 { showToast('Password must be at least 4 characters', 'error'); return; }

  const btn = document.querySelector('.btn-modal-submit');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  try {
    const passwordHash = await hashPwd(pass);
    const newUser      = { mobile, name, avatar, passwordHash };
    await setDoc(doc(db, 'users', mobile), newUser);
    _users.push(newUser);
    _renderUserGrid();
    _resetForm();
    showToast('✓ Member "' + name + '" added', 'success');
  } catch (e) {
    console.error('addUser:', e);
    showToast('Failed to save — check connection', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Add Member'; }
  }
}

// ── DELETE MEMBER ─────────────────────────────────────
export async function deleteUser(mobile) {
  if (!confirm('Delete member ' + mobile + '? All their vault data will be lost.')) return;
  try {
    await deleteDoc(doc(db, 'users', mobile));
    await deleteVault(mobile);
    _users = _users.filter(u => u.mobile !== mobile);
    _renderUserGrid();
    showToast('Member removed', 'success');
  } catch (e) {
    console.error('deleteUser:', e);
    showToast('Failed to delete — check connection', 'error');
  }
}

// ── TOGGLE ADD-MEMBER MODAL ───────────────────────────
export function toggleAddUserForm() {
  const modal = document.getElementById('member-modal');
  if (!modal) return;
  const hidden = modal.style.display === 'none' || modal.style.display === '';
  modal.style.display = hidden ? 'flex' : 'none';
  if (hidden) setTimeout(() => document.getElementById('new-user-name')?.focus(), 80);
}

// ── RENDER USER GRID ──────────────────────────────────
function _renderUserGrid() {
  const grid = document.getElementById('user-grid');
  if (!grid) return;
  if (_users.length === 0) {
    grid.innerHTML = `<p class="no-users">No members yet.<br>Add your first member below ↓</p>`;
    return;
  }
  grid.innerHTML = _users.map(u => `
    <button class="user-card" data-mobile="${u.mobile}" onclick="window.selectUser('${u.mobile}')">
      <span class="user-avatar">${esc(u.avatar)}</span>
      <span class="user-name">${esc(u.name)}</span>
      <span class="user-mobile">${esc(u.mobile)}</span>
      <span class="user-card-del" onclick="event.stopPropagation();window.deleteUser('${u.mobile}')" title="Remove member">✕</span>
    </button>
  `).join('');
}

function _resetForm() {
  ['new-user-emoji', 'new-user-name', 'new-user-mobile', 'new-user-pass'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const modal = document.getElementById('member-modal');
  if (modal) modal.style.display = 'none';
}
