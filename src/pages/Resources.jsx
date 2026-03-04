import { S, COLORS, FONTS } from '../theme'

export default function Resources({ resources }) {
  const categories = [...new Set(resources.map(r => r.category))]

  return (
    <div style={S.container}>
      <div style={S.sectionHeader}>
        <div style={S.sectionTitle}>Resources</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted }}>Curated tools & references</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 14, paddingBottom: 80 }}>
        {categories.map(cat => (
          <>
            <div key={`cat-${cat}`} style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.textMuted, gridColumn: '1/-1', padding: '6px 0 2px', borderBottom: `1px solid ${COLORS.border}`, marginTop: 8 }}>
              {cat}
            </div>
            {resources.filter(r => r.category === cat).map(r => (
              <a key={r.id} href={r.url} target="_blank" rel="noreferrer"
                style={{ background: COLORS.surface, border: `1px solid ${COLORS.border2}`, borderRadius: 10, padding: 22, cursor: 'pointer', textDecoration: 'none', display: 'block' }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 14, background: 'rgba(94,245,184,0.08)' }}>
                  {r.icon}
                </div>
                <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 5, color: COLORS.text }}>{r.name}</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 12 }}>{r.desc}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {r.url.replace('https://', '')} ↗
                </div>
              </a>
            ))}
          </>
        ))}
      </div>
    </div>
  )
}
