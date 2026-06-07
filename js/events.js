import { syncFromDOM, getSec, getCard, markUnsaved, flushSave } from './store.js';
import { reRender } from './render.js';
import * as M from './mutations.js';

export function setupEvents() {
  const container = document.getElementById('vault-container');

  // ── Inline text edits → mark unsaved ──────────────
  container.addEventListener('input', e => {
    if (e.target.dataset.prop) markUnsaved();
  });

  // ── Button actions (event delegation) ─────────────
  container.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const { action, sid, cid, fi, ni, ci, di, color } = btn.dataset;

    switch (action) {
      case 'del-section':    M.delSection(sid);          break;
      case 'add-card':       M.addCard(sid);             break;
      case 'del-card':       M.delCard(sid, cid);        break;
      case 'add-field':      M.addField(sid, cid);       break;
      case 'del-field':      M.delField(sid, cid, +fi);  break;
      case 'add-contact':    M.addContact();              break;
      case 'del-contact':    M.delContact(ci);            break;
      case 'add-ct-detail':  M.addCtDetail(ci);           break;
      case 'del-ct-detail':  M.delCtDetail(ci, +di);      break;
      case 'add-note':       M.addNote();                 break;
      case 'del-note':       M.delNote(+ni);              break;

      case 'sec-color': {
        const s = getSec(sid);
        if (s) { syncFromDOM(); s.color = color; flushSave(); reRender(); }
        break;
      }
      case 'card-color': {
        const c = getCard(sid, cid);
        if (c) { syncFromDOM(); c.color = color; flushSave(); reRender(); }
        break;
      }
    }
  });

  // ── Add Section button (outside vault-container) ──
  document.addEventListener('click', e => {
    if (e.target.id === 'btn-add-section') M.addSection();
  });
}
