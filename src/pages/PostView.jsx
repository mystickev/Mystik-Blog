import { S, COLORS, FONTS } from '../theme'
import { TagBadge } from '../components/BlogCard'
import { renderMarkdown } from '../utils/markdown'
import { fmtDate } from '../utils/helpers'

export default function PostView({ post, onBack }) {
  return (
    <div style={S.container}>
      <div
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted, cursor: 'pointer', margin: '36px 0 44px', letterSpacing: '0.08em' }}
        onClick={onBack}
      >
        {'<-'} back to write-ups
      </div>
      <TagBadge tag={post.tag} />
      <div style={S.postTitle}>{post.title}</div>
      <div style={S.postInfo}>
        <span>{fmtDate(post.date)}</span>
        <span>{post.readTime} read</span>
        {post.mitre?.map(m => (
          <span
            key={m}
            style={{ background: 'rgba(245,144,74,0.1)', color: '#f5904a', padding: '2px 8px', borderRadius: 3, fontSize: 10, fontFamily: FONTS.mono, letterSpacing: '0.06em' }}
          >
            {m}
          </span>
        ))}
      </div>
      <div
        style={S.postBody}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />
    </div>
  )
}