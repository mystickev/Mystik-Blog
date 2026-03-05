import { useState } from 'react'
import { S, COLORS, FONTS } from '../theme'
import BlogCard from '../components/BlogCard'
import PostView from './PostView'
import { ALL_TAGS } from '../data/defaults'

export default function Blog({ posts }) {
  const [tag, setTag]           = useState('All')
  const [query, setQuery]       = useState('')
  const [activePost, setActive] = useState(null)

  if (activePost) return <PostView post={activePost} onBack={() => setActive(null)} />

  const filtered = posts.filter(p => {
    const matchTag = tag === 'All' || p.tag === tag
    const q = query.toLowerCase()
    const matchQ = !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q) ||
      (p.content && p.content.toLowerCase().includes(q))
    return matchTag && matchQ
  })

  return (
    <div style={S.container}>
      <div style={S.sectionHeader}>
        <div style={S.sectionTitle}>Write-ups</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted }}>
          {filtered.length} post{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: COLORS.textMuted, fontSize: 16 }}>?</span>
        <input
          style={{ ...S.input, paddingLeft: 42, marginBottom: 0 }}
          placeholder="Search posts, techniques, tools..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        {['All', ...ALL_TAGS].map(t => {
          const active = t === tag
          return (
            <button
              key={t}
              style={{ fontFamily: FONTS.mono, fontSize: 11, padding: '5px 12px', borderRadius: 4, border: active ? '1px solid rgba(94,245,184,0.3)' : `1px solid ${COLORS.border2}`, background: active ? 'rgba(94,245,184,0.1)' : 'transparent', color: active ? COLORS.accent : COLORS.textMuted, cursor: 'pointer', letterSpacing: '0.06em' }}
              onClick={() => setTag(t)}
            >
              {t}
            </button>
          )
        })}
      </div>

      {/* Posts */}
      <div style={S.blogGrid}>
        {filtered.length === 0
          ? <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: FONTS.mono, fontSize: 13, color: COLORS.textMuted }}>// no results found</div>
          : filtered.map(p => <BlogCard key={p.id} post={p} onClick={() => setActive(p)} />)
        }
      </div>
    </div>
  )
}