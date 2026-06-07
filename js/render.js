import { getVault } from './store.js';
import { esc, clr, CLRS } from './utils.js';

// ── ROOT RE-RENDER ────────────────────────────────────
export function reRender() {
  const y = window.scrollY;
  document.getElementById('vault-container').innerHTML = buildVault();
  window.scrollTo(0, y);
}

// ── VAULT ROOT ────────────────────────────────────────
export function buildVault() {
  const d = getVault();
  return `
    <div class="emergency-banner">
      <span class="icon">⚠️</span>
      <div>
        <h3>Emergency Information for Family</h3>
        <p>${esc(d.config.emergencyMessage)}</p>
      </div>
    </div>
    <div class="instructions">
      <strong>How to edit:</strong> Click any value to edit inline.
      Use <strong>＋ Add Card / ＋ Add Section</strong> for new entries.
      Hover rows/cards for <strong>✕</strong> delete. Click <strong>💾 Save JSON</strong> to export.
    </div>
    ${d.sections.map(buildSection).join('')}
    ${buildContactsSection(d)}
    ${buildNotesSection(d)}
    ${buildMeta(d)}
    <div class="add-section-row">
      <button class="btn-add-section" id="btn-add-section">＋ Add Section</button>
    </div>`;
}

// ── SECTION ───────────────────────────────────────────
export function buildSection(sec) {
  const c = clr(sec.color);
  const n = sec.cards.length;
  return `
  <div class="section" data-sid="${sec.id}">
    <div class="section-header">
      <div class="section-icon" style="background:${c.bg};color:${c.fg}">${esc(sec.icon)}</div>
      <h2 contenteditable="true" spellcheck="false" data-prop="sec-title" data-sid="${sec.id}">${esc(sec.title)}</h2>
      <span class="count">${n} card${n !== 1 ? 's' : ''}</span>
      <div class="section-actions">
        ${buildColorDots(sec.color, 'sec-color', sec.id)}
        <button class="btn-icon" data-action="del-section" data-sid="${sec.id}" title="Delete section">✕</button>
      </div>
    </div>
    <div class="cards-grid">
      ${sec.cards.map(card => buildCard(card, sec.id)).join('')}
      <div class="add-card-tile" data-action="add-card" data-sid="${sec.id}">
        <div class="add-card-inner">＋ Add Card</div>
      </div>
    </div>
  </div>`;
}

// ── CARD ──────────────────────────────────────────────
export function buildCard(card, sid) {
  const c = clr(card.color);
  return `
  <div class="cred-card" data-cid="${card.id}" data-sid="${sid}">
    <div class="cred-card-header">
      <div class="cred-avatar" style="background:${c.bg};color:${c.fg}">${esc(card.icon)}</div>
      <div style="flex:1;min-width:0">
        <div class="cred-name" contenteditable="true" spellcheck="false" data-prop="card-name" data-sid="${sid}" data-cid="${card.id}">${esc(card.name)}</div>
        <div class="cred-type" contenteditable="true" spellcheck="false" data-prop="card-type" data-sid="${sid}" data-cid="${card.id}">${esc(card.type)}</div>
      </div>
      <div class="card-actions">
        ${buildColorDots(card.color, 'card-color', sid, card.id)}
        <button class="btn-icon" data-action="del-card" data-sid="${sid}" data-cid="${card.id}" title="Delete card">✕</button>
      </div>
    </div>
    <div class="cred-fields">
      ${card.fields.map((f, fi) => buildField(f, fi, sid, card.id)).join('')}
      <div class="add-field-row">
        <button class="btn-add-field" data-action="add-field" data-sid="${sid}" data-cid="${card.id}">＋ Add Field</button>
      </div>
    </div>
  </div>`;
}

// ── FIELD ROW ─────────────────────────────────────────
export function buildField(f, fi, sid, cid) {
  const vc = f.highlight ? 'field-value highlight' : 'field-value';
  return `
  <div class="field-row" data-fi="${fi}">
    <span class="field-label" contenteditable="true" spellcheck="false"
          data-prop="f-label" data-sid="${sid}" data-cid="${cid}" data-fi="${fi}">${esc(f.label)}</span>
    <span class="${vc}" contenteditable="true" spellcheck="false"
          data-prop="f-value" data-sid="${sid}" data-cid="${cid}" data-fi="${fi}">${esc(f.value)}</span>
    <button class="btn-icon" data-action="del-field" data-sid="${sid}" data-cid="${cid}" data-fi="${fi}" title="Delete field">✕</button>
  </div>`;
}

// ── CONTACTS SECTION ──────────────────────────────────
export function buildContactsSection(d) {
  const n = d.contacts.length;
  return `
  <div class="section" id="contacts-section">
    <div class="section-header">
      <div class="section-icon" style="background:var(--green-dim);color:var(--green)">📞</div>
      <h2>Important Contacts</h2>
      <span class="count">${n} contact${n !== 1 ? 's' : ''}</span>
    </div>
    <div class="contacts-grid">
      ${d.contacts.map(buildContact).join('')}
      <div class="add-contact-tile" data-action="add-contact">
        <div class="add-card-inner">＋ Add Contact</div>
      </div>
    </div>
  </div>`;
}

// ── CONTACT CARD ──────────────────────────────────────
export function buildContact(ct) {
  return `
  <div class="contact-card" data-ci="${ct.id}">
    <button class="btn-icon" style="position:absolute;top:8px;right:8px;opacity:0"
            data-action="del-contact" data-ci="${ct.id}" title="Delete contact">✕</button>
    <div class="contact-name" contenteditable="true" spellcheck="false"
         data-prop="ct-name" data-ci="${ct.id}">${esc(ct.name)}</div>
    <div class="contact-role" contenteditable="true" spellcheck="false"
         data-prop="ct-role" data-ci="${ct.id}">${esc(ct.role)}</div>
    ${ct.details.map((d, di) => `
      <div class="contact-detail-row">
        <div class="contact-detail" contenteditable="true" spellcheck="false"
             data-prop="ct-detail" data-ci="${ct.id}" data-di="${di}">${esc(d)}</div>
        <button class="btn-icon" data-action="del-ct-detail" data-ci="${ct.id}" data-di="${di}" title="Delete">✕</button>
      </div>`).join('')}
    <button class="btn-add-field" data-action="add-ct-detail" data-ci="${ct.id}">＋ Add detail</button>
  </div>`;
}

// ── NOTES SECTION ─────────────────────────────────────
export function buildNotesSection(d) {
  return `
  <div class="section" id="notes-section">
    <div class="section-header">
      <div class="section-icon" style="background:var(--amber-dim);color:var(--amber)">📝</div>
      <h2>Additional Notes / Property / Locker</h2>
    </div>
    <div class="cred-card" style="max-width:100%">
      <div class="cred-fields">
        ${d.notes.map((n, ni) => `
          <div class="field-row" data-ni="${ni}">
            <span class="field-label" contenteditable="true" spellcheck="false"
                  data-prop="n-label" data-ni="${ni}">${esc(n.label)}</span>
            <span class="${n.highlight ? 'field-value highlight' : 'field-value'}" contenteditable="true" spellcheck="false"
                  data-prop="n-value" data-ni="${ni}">${esc(n.value)}</span>
            <button class="btn-icon" data-action="del-note" data-ni="${ni}" title="Delete">✕</button>
          </div>`).join('')}
        <div class="add-field-row">
          <button class="btn-add-field" data-action="add-note">＋ Add Note</button>
        </div>
      </div>
    </div>
  </div>`;
}

// ── META FOOTER ───────────────────────────────────────
export function buildMeta(d) {
  return `
  <div class="vault-meta">
    <p>Last updated:
      <strong contenteditable="true" spellcheck="false" data-prop="meta-updated">${esc(d.meta.lastUpdated)}</strong>
      &nbsp;·&nbsp; Created by:
      <strong contenteditable="true" spellcheck="false" data-prop="meta-author">${esc(d.meta.createdBy)}</strong>
    </p>
    <p style="margin-top:8px">⚠️ Keep this file encrypted or printed and locked in a physical safe.</p>
  </div>`;
}

// ── COLOUR DOTS ───────────────────────────────────────
export function buildColorDots(current, action, sid, cid) {
  return `<div class="color-picker">${
    Object.keys(CLRS).map(col => {
      const attrs = [
        `data-action="${action}"`,
        `data-color="${col}"`,
        sid ? `data-sid="${sid}"` : '',
        cid ? `data-cid="${cid}"` : '',
      ].filter(Boolean).join(' ');
      return `<span class="cdot${col === current ? ' active' : ''}" style="background:${clr(col).fg}" ${attrs} title="${col}"></span>`;
    }).join('')
  }</div>`;
}
