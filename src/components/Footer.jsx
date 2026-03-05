import { COLORS, FONTS, S } from '../theme'

export default function Footer({ onNavigate }) {
  return (
    <footer style={{ borderTop: `1px solid ${COLORS.border}`, padding: '28px 0', position: 'relative', zIndex: 1 }}>
      <div className="mystik-container footer-inner" style={{ maxWidth: 1080, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted }}>
          © {new Date().getFullYear()} Mystik · All rights reserved
        </div>
        <div className="footer-links">
          {['blog', 'about', 'resources'].map(p => (
            <span
              key={p}
              className="footer-link"
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
