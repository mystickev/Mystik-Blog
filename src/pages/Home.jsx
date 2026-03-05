import { S, COLORS, FONTS } from '../theme'
import BlogCard from '../components/BlogCard'

export default function Home({ posts, onViewAll, onPost }) {
  const mitreCount = [...new Set(posts.flatMap(p => p.mitre || []))].length

  return (
    <div style={S.container}>
      {/* Hero */}
      <div style={{ padding: '80px 0 64px', borderBottom: `1px solid ${COLORS.border}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, left: -80, width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(94,245,184,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.accent, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          Threat Research | Malware Analysis | Malware Development
        </div>
	<h1 style={{ fontFamily: FONTS.display, fontSize: 'clamp(38px,5.5vw,66px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5, marginBottom: 20, maxWidth: 640 }}>
	  Where  <em style={{ fontStyle: 'italic', color: COLORS.accent }}> offensive techniques </em> meet <em style={{ fontStyle: 'italic', color: COLORS.accent }}>defensive logic.</em>
	</h1>
        <p style={{ maxWidth: 460, color: COLORS.textDim, fontSize: 15, lineHeight: 1.75, marginBottom: 32 }}>
          Field notes, write-ups, and technical deep-dives in everything Cyber Security.
        </p>
        <div style={{ display: 'flex', gap: 40 }}>
          {[
            { num: posts.length, label: 'Write-ups' },
            { num: mitreCount,   label: 'Techniques' },
            { num: 'MITRE',      label: 'ATT&CK Mapped' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>{s.num}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent posts */}
      <div style={S.sectionHeader}>
        <div style={S.sectionTitle}>Recent Write-ups</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.accent, cursor: 'pointer' }} onClick={onViewAll}>view all {'->'}</div>
      </div>
      <div style={S.blogGrid}>
        {posts.slice(0, 4).map(p => (
          <BlogCard key={p.id} post={p} onClick={() => onPost(p)} />
        ))}
      </div>
    </div>
  )
}