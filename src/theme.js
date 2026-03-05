// -- Design Tokens ---------------------------------------------------------
// Single source of truth for all colours, fonts, and shared style objects.
// Change a value here and it updates everywhere.

export const COLORS = {
  bg:         '#09090c',
  surface:    '#0f0f14',
  surface2:   '#161620',
  border:     '#1c1c28',
  border2:    '#25253a',
  text:       '#dddde8',
  textMuted:  '#5a5a78',
  textDim:    '#8888a8',
  accent:     '#5ef5b8',
  accentDim:  'rgba(94,245,184,0.12)',
  accentGlow: 'rgba(94,245,184,0.06)',
  red:        '#f0604a',
  redDim:     'rgba(240,96,74,0.1)',
  yellow:     '#f5c842',
}

export const FONTS = {
  display: "'Playfair Display', serif",
  body:    "'DM Sans', sans-serif",
  mono:    "'JetBrains Mono', monospace",
}

// -- Shared style objects ---------------------------------------------------
export const S = {
  page:      { fontFamily: FONTS.body, background: COLORS.bg, color: COLORS.text, minHeight: '100vh', fontWeight: 300 },
  container: { maxWidth: 1080, margin: '0 auto', padding: '0 28px' },

  // Nav
  nav:      { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(9,9,12,0.92)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${COLORS.border}` },
  navInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, maxWidth: 1080, margin: '0 auto', padding: '0 28px' },
  logo:     { fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, letterSpacing: -0.3, color: COLORS.text, userSelect: 'none' },
  logoDot:  { width: 8, height: 8, borderRadius: '50%', background: COLORS.accent, boxShadow: `0 0 10px ${COLORS.accent}`, animation: 'pulse 2.5s ease-in-out infinite', flexShrink: 0 },
  navLink:  (active) => ({ fontFamily: FONTS.mono, fontSize: 12, color: active ? COLORS.accent : COLORS.textMuted, padding: '6px 14px', borderRadius: 6, cursor: 'pointer', border: active ? `1px solid ${COLORS.border2}` : '1px solid transparent', background: active ? COLORS.accentDim : 'transparent', letterSpacing: '0.04em' }),

  // Sections
  sectionHeader: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '48px 0 24px', borderBottom: `1px solid ${COLORS.border}`, marginBottom: 36 },
  sectionTitle:  { fontFamily: FONTS.display, fontSize: 30, fontWeight: 600, letterSpacing: -0.5 },

  // Blog
  blogGrid: { display: 'grid', gap: 1, background: COLORS.border, borderTop: `1px solid ${COLORS.border}` },
  cardTag:  (tag, TAG_STYLES) => ({ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 3, display: 'inline-block', marginBottom: 8, color: TAG_STYLES[tag]?.color || COLORS.textMuted, background: TAG_STYLES[tag]?.bg || 'rgba(90,90,120,0.12)' }),
  cardTitle:   { fontFamily: FONTS.display, fontSize: 19, fontWeight: 600, lineHeight: 1.3, letterSpacing: -0.2, marginBottom: 6 },
  cardExcerpt: { color: COLORS.textDim, fontSize: 14, lineHeight: 1.65 },
  cardMeta:    { fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted, letterSpacing: '0.06em', whiteSpace: 'nowrap' },

  // Post
  postTitle: { fontFamily: FONTS.display, fontSize: 'clamp(28px,4vw,46px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: -1, marginBottom: 18 },
  postInfo:  { display: 'flex', gap: 20, fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted, letterSpacing: '0.08em', marginBottom: 40, paddingBottom: 32, borderBottom: `1px solid ${COLORS.border}`, flexWrap: 'wrap' },
  postBody:  { maxWidth: 700, paddingBottom: 80 },

  // Forms (admin)
  input:    { width: '100%', background: COLORS.surface, border: `1px solid ${COLORS.border2}`, borderRadius: 7, padding: '10px 14px', color: COLORS.text, fontFamily: FONTS.body, fontSize: 14, outline: 'none', marginBottom: 14, boxSizing: 'border-box' },
  textarea: { width: '100%', background: COLORS.surface, border: `1px solid ${COLORS.border2}`, borderRadius: 7, padding: '12px 14px', color: COLORS.text, fontFamily: FONTS.mono, fontSize: 12, outline: 'none', marginBottom: 14, boxSizing: 'border-box', lineHeight: 1.7, resize: 'vertical' },
  select:   { background: COLORS.surface, border: `1px solid ${COLORS.border2}`, borderRadius: 7, padding: '10px 14px', color: COLORS.text, fontFamily: FONTS.mono, fontSize: 12, outline: 'none', marginBottom: 14, width: '100%' },
  label:    { fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 },

  // Buttons
  btnPrimary:   { background: COLORS.accent, color: COLORS.bg, border: 'none', borderRadius: 6, padding: '9px 20px', fontFamily: FONTS.mono, fontSize: 12, fontWeight: 500, cursor: 'pointer', letterSpacing: '0.06em' },
  btnSecondary: { background: 'transparent', color: COLORS.textMuted, border: `1px solid ${COLORS.border2}`, borderRadius: 6, padding: '9px 20px', fontFamily: FONTS.mono, fontSize: 12, cursor: 'pointer', letterSpacing: '0.06em' },
  btnDanger:    { background: 'rgba(240,96,74,0.1)', color: '#f0604a', border: '1px solid rgba(240,96,74,0.25)', borderRadius: 6, padding: '7px 14px', fontFamily: FONTS.mono, fontSize: 11, cursor: 'pointer' },

  // Misc
  card:    { background: COLORS.surface, border: `1px solid ${COLORS.border2}`, borderRadius: 10, padding: 20, marginBottom: 12 },
  grid2:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  divider: { height: 1, background: COLORS.border, margin: '24px 0' },
  alert:   (type) => ({ padding: '12px 16px', borderRadius: 7, border: `1px solid ${type === 'success' ? 'rgba(94,245,184,0.3)' : 'rgba(240,96,74,0.3)'}`, background: type === 'success' ? 'rgba(94,245,184,0.06)' : 'rgba(240,96,74,0.06)', fontFamily: FONTS.mono, fontSize: 12, color: type === 'success' ? COLORS.accent : COLORS.red, marginBottom: 20 }),

  // Admin sidebar
  adminSideItem: (active) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', cursor: 'pointer', fontFamily: FONTS.mono, fontSize: 12, letterSpacing: '0.06em', color: active ? COLORS.accent : COLORS.textMuted, background: active ? 'rgba(94,245,184,0.08)' : 'transparent', borderLeft: active ? `2px solid ${COLORS.accent}` : '2px solid transparent' }),
}