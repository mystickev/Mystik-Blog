import { useState } from 'react'
import { S, COLORS } from '../theme'
import { TAG_STYLES } from '../data/defaults'
import { fmtDate } from '../utils/helpers'

export function TagBadge({ tag }) {
  return (
    <span style={S.cardTag(tag, TAG_STYLES)}>{tag}</span>
  )
}

export default function BlogCard({ post, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{ background: hov ? COLORS.surface : COLORS.bg, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: 20, padding: '28px 0', cursor: 'pointer' }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div>
        <TagBadge tag={post.tag} />
        <div style={{ ...S.cardTitle, color: hov ? COLORS.accent : COLORS.text }}>{post.title}</div>
        <div style={S.cardExcerpt}>{post.excerpt}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={S.cardMeta}>{fmtDate(post.date)}</div>
        <div style={{ ...S.cardMeta, marginTop: 4, fontSize: 10 }}>{post.readTime} read</div>
      </div>
    </div>
  )
}