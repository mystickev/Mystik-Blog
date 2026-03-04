import { useState } from 'react'
import { S, COLORS, FONTS } from '../theme'
import { verifyPassword, setAdminSession } from '../utils/auth'

// ── Admin Login ───────────────────────────────────────────────────────────
// Accessed via /#admin in the URL — not linked anywhere in the public UI.
// Uses SHA-256 hash comparison (see src/utils/auth.js for details on
// security tradeoffs and how to change the password).

export default function Login({ onSuccess }) {
  const [pw, setPw]       = useState('')
  const [err, setErr]     = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    const ok = await verifyPassword(pw)
    setLoading(false)
    if (ok) {
      setAdminSession()
      onSuccess()
    } else {
      setErr(true)
      setPw('')
      setTimeout(() => setErr(false), 2500)
    }
  }

  return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border2}`, borderRadius: 12, padding: '40px 48px', width: 360 }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Admin Access</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted, marginBottom: 28, letterSpacing: '0.08em' }}>mystikev.co.ke</div>
        {err && <div style={S.alert('error')}>✗ Incorrect password</div>}
        <label style={S.label}>Password</label>
        <input
          style={{ ...S.input, marginBottom: 20 }}
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Enter admin password"
          autoFocus
        />
        <button style={{ ...S.btnPrimary, width: '100%', opacity: loading ? 0.6 : 1 }} onClick={submit} disabled={loading}>
          {loading ? 'Verifying...' : 'Enter Dashboard →'}
        </button>
      </div>
    </div>
  )
}
