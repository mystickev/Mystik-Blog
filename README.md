# Mystik Blog

Personal malware analysis and threat research blog.

---

## Quick Start

```bash
npm install
npm run dev        # local dev server at http://localhost:5173
npm run build      # production build → ./dist
npm run preview    # preview the build locally
```

---

## Accessing the Admin Dashboard

Navigate to **`/#admin`** in your URL — e.g. `https://mystikev.co.ke/#admin`

This route is not linked anywhere on the public site.

**Default password:** `mystik2025`

---

## Changing the Admin Password

1. Open your browser console and run:
```js
crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourNewPassword'))
  .then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
```
2. Copy the resulting hash string
3. Open `src/utils/auth.js`
4. Replace the value of `ADMIN_PASSWORD_HASH` with your new hash

---

## Security Notes

This is a **static site** — authentication is entirely client-side.

**What is protected:**
- Password is stored as a SHA-256 hash (not plaintext)
- Admin UI is in a separate lazy-loaded JS chunk — not in the main bundle
- Admin route (`/#admin`) is not linked or mentioned anywhere publicly
- Session token uses sessionStorage (cleared when the browser tab closes)

**What is NOT protected:**
- A determined attacker who audits the compiled JS can find the admin route and hash
- Client-side auth on a static site cannot be made truly server-secure
- For production security, add Cloudflare Access in front of the `/#admin` route (free tier works), or migrate to a CMS with a real backend (Netlify CMS, Ghost, etc.)

---

## Deployment

### GitHub Pages (with custom domain)
```bash
# Option 1: GitHub Actions (recommended — runs on every git push)
git push origin main   # triggers .github/workflows/deploy.yml automatically

# Option 2: Manual deploy
npm run deploy         # builds and pushes dist/ to gh-pages branch
```

Then in GitHub repo Settings → Pages → set source to `gh-pages` branch.
The `public/CNAME` file handles the custom domain automatically.

**DNS settings for mystikev.co.ke:**
Add these records at your registrar/Cloudflare:
```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  yourusername.github.io
```

---

### Netlify / Vercel
1. Connect your GitHub repo
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy — done. Custom domain configured in the platform dashboard.

---

### cPanel / Shared Hosting
```bash
npm run build
# Upload the entire contents of ./dist to public_html/ via FTP or File Manager
# That's it — it's just static files
```

---

### Local Apache Server
```bash
npm run build
# Copy ./dist contents to your Apache document root:
sudo cp -r dist/* /var/www/html/

# For clean URL routing (/#admin uses hash routing, so no Apache config needed)
# But if you add react-router later, add this to .htaccess:
# RewriteEngine On
# RewriteCond %{REQUEST_FILENAME} !-f
# RewriteRule ^ /index.html [L]
```

---

### Local dev (no Apache)
```bash
npm run dev   # Vite dev server handles everything
```

---

## Project Structure

```
mystik-blog/
├── public/
│   ├── CNAME              # Custom domain for GitHub Pages
│   └── 404.html           # SPA fallback for GitHub Pages
├── src/
│   ├── admin/             # Admin dashboard (lazy-loaded, separate bundle)
│   │   ├── Dashboard.jsx  # Main admin layout + post list
│   │   ├── Login.jsx      # Password screen
│   │   ├── PostEditor.jsx # Create/edit posts with Markdown + preview
│   │   ├── ResourceEditor.jsx
│   │   └── AboutEditor.jsx
│   ├── components/        # Shared UI components
│   │   ├── Nav.jsx
│   │   ├── Footer.jsx
│   │   └── BlogCard.jsx
│   ├── pages/             # Public pages
│   │   ├── Home.jsx
│   │   ├── Blog.jsx
│   │   ├── About.jsx
│   │   ├── Resources.jsx
│   │   └── PostView.jsx
│   ├── hooks/
│   │   └── useData.js     # Data management + storage
│   ├── utils/
│   │   ├── auth.js        # SHA-256 password hashing + session
│   │   ├── storage.js     # Persistent storage (localStorage fallback)
│   │   ├── markdown.js    # Markdown → HTML renderer
│   │   └── helpers.js     # Date formatting, ID generation
│   ├── data/
│   │   └── defaults.js    # Seed content (posts, resources, about)
│   ├── theme.js           # All colours, fonts, shared styles
│   ├── App.jsx            # Root component + routing
│   └── main.jsx           # Entry point
├── .github/workflows/
│   └── deploy.yml         # Auto-deploy to GitHub Pages on push
├── index.html
├── vite.config.js
└── package.json
```

---

## Content Management

Everything is managed from `/#admin`:

| Section | What you can do |
|---------|----------------|
| **Posts** | Create, edit, delete blog posts. Write in Markdown with live preview. Set category, date, read time, MITRE techniques. |
| **Resources** | Add/edit/remove resource cards. Set name, URL, description, emoji icon, category. |
| **About** | Edit bio, tagline, skills, tools, certs, and "open to" section. |

All changes persist in browser storage automatically.
