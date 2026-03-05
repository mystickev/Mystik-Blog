import React from 'react'
import { S, COLORS, FONTS } from '../theme'

export default function Resources({ resources }) {
  const categories = [...new Set(resources.map(r => r.category))]

  return (
    <div className="mystik-container" style={S.container}>
      <div className="section-header" style={S.sectionHeader}>
        <div className="section-title" style={S.sectionTitle}>Resources</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted }}>
          Curated tools & references
        </div>
      </div>

      <div
        className="resources-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, paddingBottom: 80 }}
      >
        {categories.map(cat => (
          <React.Fragment key={cat}>
            {/* Category header — spans full width */}
            <div style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: COLORS.textMuted,
              gridColumn: '1 / -1',
              padding: '6px 0 2px',
              borderBottom: `1px solid ${COLORS.border}`,
              marginTop: 8,
            }}>
              {cat}
            </div>

            {/* Resource cards */}
            {resources.filter(r => r.category === cat).map(r => (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="resource-card"
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border2}`,
                  borderRadius: 10,
                  padding: 22,
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                  marginBottom: 14,
                  background: 'rgba(94,245,184,0.08)',
                }}>
                  {r.icon}
                </div>

                {/* Name */}
                <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 5, color: COLORS.text }}>
                  {r.name}
                </div>

                {/* Description */}
                <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 12 }}>
                  {r.desc}
                </div>

                {/* URL */}
                <div
                  className="resource-url"
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 10,
                    color: COLORS.textMuted,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    transition: 'color 0.2s',
                  }}
                >
                  {r.url.replace('https://', '').replace('http://', '')} {'↗'}
                </div>
              </a>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
