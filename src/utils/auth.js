// ── Authentication ────────────────────────────────────────────────────────
//
// SECURITY NOTES (read this):
//
// 1. This is CLIENT-SIDE auth — meaning a determined attacker who reads the
//    compiled JS bundle CAN reverse-engineer access to the admin UI.
//    This is a fundamental limitation of any static site (GitHub Pages,
//    Netlify, Apache, cPanel). There is NO server to protect secrets.
//
// 2. What we DO to make it harder:
//    - The password is stored as a SHA-256 hash, not plaintext.
//    - The admin route is not linked anywhere in the public UI.
//    - The admin bundle is code-split (loaded separately, not in main JS).
//    - There is no visible "admin" link, button, or hint in the public site.
//
// 3. What this protects you from:
//    - Casual visitors, bots, and script kiddies who skim source.
//    - Anyone who doesn't know the entry method (URL path).
//
// 4. What it does NOT protect against:
//    - A determined attacker who audits your compiled JS thoroughly.
//    - For real server-side protection, you need a backend (Supabase,
//      Firebase Auth, a Node/PHP API, etc.) — which GitHub Pages can't do.
//
// HOW TO CHANGE YOUR PASSWORD:
//    Run this in your browser console to get a new hash:
//    crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourNewPassword'))
//      .then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
//    Then paste the resulting hash into ADMIN_PASSWORD_HASH below.

// SHA-256 hash of "mystik2025" — change this to your own hash
export const ADMIN_PASSWORD_HASH = '04f6c575ecb96129bbc417bf7bae9e051f008a715015ff5ec535116d4cee5e41'

// The admin is accessed via /#/admin — not linked anywhere publicly
export const ADMIN_ROUTE = '/admin'

/**
 * Hash a plaintext password using SHA-256 via Web Crypto API
 */
export async function hashPassword(plaintext) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plaintext)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Verify a plaintext password against the stored hash
 */
export async function verifyPassword(plaintext) {
  const hash = await hashPassword(plaintext)
  return hash === ADMIN_PASSWORD_HASH
}

/**
 * Session token — stored in sessionStorage only (clears when tab closes)
 * Never written to localStorage or cookies
 */
const SESSION_KEY = '_mstk_session'

export function setAdminSession() {
  sessionStorage.setItem(SESSION_KEY, '1')
}

export function clearAdminSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function hasAdminSession() {
  return sessionStorage.getItem(SESSION_KEY) === '1'
}
