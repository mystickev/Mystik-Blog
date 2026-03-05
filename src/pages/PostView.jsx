import { useEffect } from 'react'
import { S, COLORS, FONTS } from '../theme'
import { TagBadge } from '../components/BlogCard'
import { renderMarkdown } from '../utils/markdown'
import { fmtDate } from '../utils/helpers'

export default function PostView({ post, onBack }) {
  // Handle browser back button — pressing back should go to post list
  useEffect(() => {
    const handlePopState = () => onBack()
    window.history.pushState({ post: true }, '')
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [onBack])

  // Activate lazy-loaded images after render
  useEffect(() => {
    const imgs = document.querySelectorAll('.post-body img')
    imgs.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded')
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'))
        img.addEventListener('error', () => img.classList.add('loaded')) // show broken img too
      }
    })
  }, [post])

  return (
    <div className="mystik-container" style={S.container}>
      {/* Back button */}
      <div
        className="back-btn"
        style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted, cursor: 'pointer', margin: '36px 0 44px', letterSpacing: '0.08em' }}
        onClick={onBack}
      >
        {'←'} back to write-ups
      </div>

      {/* Tag */}
      <TagBadge tag={post.tag} />

      {/* Title */}
      <div className="post-title" style={S.postTitle}>{post.title}</div>

      {/* Meta row */}
      <div style={S.postInfo}>
        <span>{fmtDate(post.date)}</span>
        <span>{post.readTime} read</span>
        {post.mitre?.map(m => (
          <span
            key={m}
            style={{
              background: 'rgba(245,144,74,0.1)',
              color: '#f5904a',
              padding: '2px 8px',
              borderRadius: 3,
              fontSize: 10,
              fontFamily: FONTS.mono,
              letterSpacing: '0.06em',
            }}
          >
            {m}
          </span>
        ))}
      </div>

      {/* Post body */}
      <div
        className="post-body"
        style={S.postBody}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />
    </div>
  )
}
