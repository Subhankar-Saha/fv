# Family Credentials Vault

A secure, Firebase-backed web app for storing and managing family credentials — passwords, accounts, PINs, and notes — with per-user authentication and profile-based access control.

## Features

- **Multi-user profiles** — each family member has their own password-protected account
- **Credential categories** — organise entries by type (banking, social, email, etc.)
- **Firebase Realtime Database** — data synced and persisted in the cloud
- **Lock screen** — vault locks on load; unlock with your profile PIN or password
- **Pure frontend** — no build step, runs directly in the browser

## Tech Stack

- HTML / CSS (SCSS source) / Vanilla JavaScript
- Firebase (Authentication + Realtime Database)

## Project Structure

```
family-vault/
├── index.html          # Entry point & all UI templates
├── styles.css          # Compiled stylesheet
├── styles.scss         # SCSS source
├── js/
│   ├── app.js          # Bootstrap & routing
│   ├── auth.js         # Login / lock-screen logic
│   ├── firebase.js     # Firebase config & SDK init
│   ├── store.js        # In-memory state store
│   ├── mutations.js    # State mutation helpers
│   ├── render.js       # DOM rendering functions
│   ├── events.js       # UI event handlers
│   └── utils.js        # Shared utilities
└── data/
    ├── users.json      # Seed user data (dev only)
    └── vault-family.json
```

## Getting Started

1. Clone the repo
   ```bash
   git clone https://github.com/Subhankar-Saha/fv.git
   cd fv
   ```

2. Add your Firebase config to `js/firebase.js`

3. Open `index.html` directly in a browser, or serve with any static server:
   ```bash
   npx serve .
   ```

## Live Demo

Hosted on GitHub Pages: [https://subhankar-saha.github.io/fv](https://subhankar-saha.github.io/fv)

## License

[MIT](LICENSE)
