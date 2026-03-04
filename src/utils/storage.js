// ── Persistent storage helpers ────────────────────────────────────────────
// Uses window.storage (Claude artifact storage) when available,
// falls back to localStorage for non-Claude environments
// (e.g. when self-hosting on Apache, cPanel, Netlify, etc.)

const useClaudeStorage = () => typeof window !== 'undefined' && window.storage

export async function storageGet(key) {
  try {
    if (useClaudeStorage()) {
      const r = await window.storage.get(key)
      return r ? JSON.parse(r.value) : null
    } else {
      const val = localStorage.getItem(key)
      return val ? JSON.parse(val) : null
    }
  } catch {
    return null
  }
}

export async function storageSet(key, val) {
  try {
    const serialized = JSON.stringify(val)
    if (useClaudeStorage()) {
      await window.storage.set(key, serialized)
    } else {
      localStorage.setItem(key, serialized)
    }
  } catch (e) {
    console.warn('Storage write failed:', e)
  }
}

export async function storageDelete(key) {
  try {
    if (useClaudeStorage()) {
      await window.storage.delete(key)
    } else {
      localStorage.removeItem(key)
    }
  } catch {}
}
