import { S, COLORS, FONTS } from '../theme'

export default function Footer({ onNavigate }) {
  return (
    <footer style={{ borderTop: `1px solid ${COLORS.border}`, padding: '28px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ ...S.container, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted }}>
          © {new Date().getFullYear()} Mystik · All rights reserved
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['blog', 'about', 'resources'].map(p => (
            <span
              key={p}
              style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted, cursor: 'pointer' }}
              onClick={() => onNavigate(p)}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
