import { getVault, getSec, getCard, getContact, syncFromDOM, markUnsaved, flushSave } from './store.js';
import { uid } from './utils.js';
import { reRender } from './render.js';

// ── HELPER: sync → mutate → save → re-render ──────────
async function mutate(fn) {
  syncFromDOM();
  fn();
  await flushSave();
  markUnsaved();
  reRender();
}

// ── SECTIONS ──────────────────────────────────────────
export function addSection() {
  mutate(() => {
    getVault().sections.push({ id: uid(), title: 'New Section', icon: '📁', color: 'accent', cards: [] });
  });
}

export function delSection(sid) {
  if (!confirm('Delete this section and all its cards?')) return;
  mutate(() => {
    const d = getVault();
    d.sections = d.sections.filter(s => s.id !== sid);
  });
}

// ── CARDS ─────────────────────────────────────────────
export function addCard(sid) {
  mutate(() => {
    const s = getSec(sid);
    if (!s) return;
    s.cards.push({
      id:     uid(),
      name:   'New Account',
      type:   'Account Type',
      icon:   '📄',
      color:  s.color,
      fields: [
        { label: 'Username', value: 'Enter username', highlight: false },
        { label: 'Password', value: 'Enter password', highlight: true  },
      ],
    });
  });
}

export function delCard(sid, cid) {
  if (!confirm('Delete this card?')) return;
  mutate(() => {
    const s = getSec(sid);
    if (s) s.cards = s.cards.filter(c => c.id !== cid);
  });
}

// ── FIELDS ────────────────────────────────────────────
export function addField(sid, cid) {
  mutate(() => {
    const c = getCard(sid, cid);
    if (c) c.fields.push({ label: 'Label', value: 'Value', highlight: false });
  });
}

export function delField(sid, cid, fi) {
  mutate(() => {
    const c = getCard(sid, cid);
    if (c) c.fields.splice(fi, 1);
  });
}

// ── CONTACTS ──────────────────────────────────────────
export function addContact() {
  mutate(() => {
    getVault().contacts.push({ id: uid(), name: 'New Contact', role: 'Role / Relation', details: ['📞 +91 XXXXXXXXXX'] });
  });
}

export function delContact(ci) {
  if (!confirm('Delete this contact?')) return;
  mutate(() => {
    const d = getVault();
    d.contacts = d.contacts.filter(c => c.id !== ci);
  });
}

export function addCtDetail(ci) {
  mutate(() => {
    const t = getContact(ci);
    if (t) t.details.push('Detail');
  });
}

export function delCtDetail(ci, di) {
  mutate(() => {
    const t = getContact(ci);
    if (t) t.details.splice(di, 1);
  });
}

// ── NOTES ─────────────────────────────────────────────
export function addNote() {
  mutate(() => {
    getVault().notes.push({ label: 'Label', value: 'Value', highlight: false });
  });
}

export function delNote(ni) {
  mutate(() => {
    getVault().notes.splice(ni, 1);
  });
}
