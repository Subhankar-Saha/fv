import { loadUsers, unlock, lockVault, selectUser, addUser, deleteUser, toggleAddUserForm } from './auth.js';
import { exportJSON, importJSON } from './store.js';

// ── EXPOSE TO HTML onclick HANDLERS ──────────────────
window.unlock            = unlock;
window.lockVault         = lockVault;
window.selectUser        = selectUser;
window.addUser           = addUser;
window.deleteUser        = deleteUser;
window.toggleAddUserForm = toggleAddUserForm;
window.exportJSON        = exportJSON;
window.importJSON        = file => importJSON(file);

// ── INIT ──────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  loadUsers();

  document.getElementById('pwd-input')
    ?.addEventListener('keydown', e => { if (e.key === 'Enter') unlock(); });
});
