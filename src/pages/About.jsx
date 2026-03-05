import { S, COLORS, FONTS } from '../theme'

export default function About({ about }) {
  const skills   = about.skills.split(',').map(s => s.trim()).filter(Boolean)
  const certs    = about.certs.split(',').map(s => s.trim()).filter(Boolean)
  const projects = about.projects
    ? about.projects.split('||').map(s => s.trim()).filter(Boolean).map(p => {
        const [name, desc, url] = p.split('::').map(s => s.trim())
        return { name, desc, url }
      })
    : []

  return (
    <div style={S.container}>
      <div style={S.sectionHeader}>
        <div style={S.sectionTitle}>About</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted }}>Mystik</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 56, paddingBottom: 80 }}>
        {/* Main column */}
        <div>
          {/* Tagline */}
          <p style={{ fontFamily: FONTS.display, fontSize: 19, color: COLORS.text, lineHeight: 1.6, marginBottom: 28, fontStyle: 'italic' }}>
            "{about.tagline}"
          </p>

          {/* Bio paragraphs */}
          {about.bio.split('\n\n').map((para, i) => (
            <p key={i} style={{ color: COLORS.text, fontSize: 15.5, lineHeight: 1.8, marginBottom: 16 }}>{para}</p>
          ))}

          {/* Focus Areas */}
          <h2 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 600, margin: '36px 0 14px', letterSpacing: -0.3 }}>Focus Areas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {skills.map(s => (
              <div key={s} style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textDim, display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: COLORS.accent }}>{'->'}</span>{s}
              </div>
            ))}
          </div>

          {/* Tools & Stack */}
          <h2 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 600, margin: '36px 0 14px', letterSpacing: -0.3 }}>Tools & Stack</h2>
          <p style={{ color: COLORS.textDim, fontSize: 15, lineHeight: 1.8 }}>{about.tools}</p>

          {/* Projects & Tools */}
          {projects.length > 0 && (
            <>
              <h2 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 600, margin: '36px 0 14px', letterSpacing: -0.3 }}>
                Projects & Tools
              </h2>
              <div style={{ display: 'grid', gap: 12 }}>
		{projects.map((p, i) => (
		  <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border2}`, borderRadius: 8, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
		    <div style={{ flex: 1 }}>
		      <div style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 500, color: COLORS.text, marginBottom: 5 }}>
			{p.name}
		      </div>
		      {p.desc && (
			<div style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.6 }}>{p.desc}</div>
		      )}
		    </div>
		    {p.url && p.url !== 'null' && (
		      <a href={p.url} target="_blank" rel="noreferrer" style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', flexShrink: 0, marginTop: 2 }}>
			view ?
		      </a>
		    )}
		  </div>
		))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ paddingTop: 48 }}>
          {/* Certifications */}
          <div style={S.card}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: 12 }}>
              Certifications
            </div>
            {certs.map(c => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 0', borderBottom: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.textDim }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.accent, flexShrink: 0 }} />{c}
              </div>
            ))}
          </div>

          {/* Open to */}
          <div style={{ ...S.card, background: 'rgba(94,245,184,0.04)', borderColor: 'rgba(94,245,184,0.2)' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.accent, marginBottom: 10 }}>
              Open to
            </div>
            <p style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.6, margin: 0 }}>{about.openTo}</p>
          </div>

          {/* Quick stats */}
          <div style={S.card}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: 12 }}>
              Profile
            </div>
            {[
	      { label: 'WorkPlace',     value: 'SILENSEC AFRICA' },
              { label: 'Role',     value: 'Threat and Vulnerability Management Team Lead' },
              { label: 'Focus',    value: 'Blue + Purple Team' },
              { label: 'Location', value: 'Nairobi, Kenya' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${COLORS.border}`, fontFamily: FONTS.mono, fontSize: 11 }}>
                <span style={{ color: COLORS.textMuted }}>{item.label}</span>
                <span style={{ color: COLORS.text }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}