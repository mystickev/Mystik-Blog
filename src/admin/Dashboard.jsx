import { useState } from 'react'
import { S, COLORS, FONTS } from '../theme'
import PostEditor from './PostEditor'
import ResourceEditor from './ResourceEditor'
import AboutEditor from './AboutEditor'
import { TAG_STYLES } from '../data/defaults'
import { fmtDate, genId } from '../utils/helpers'
import { clearAdminSession } from '../utils/auth'

const NAV = [
  { id: 'posts',     icon: '📝', label: 'posts' },
  { id: 'resources', icon: '🔗', label: 'resources' },
  { id: 'about',     icon: '👤', label: 'about page' },
]

function PostsList({ posts, onEdit, onNew, onDelete }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 600, letterSpacing: -0.3 }}>Posts</div>
        <button style={S.btnPrimary} onClick={onNew}>+ New Post</button>
      </div>
      {posts.length === 0 && (
        <div style={{ color: COLORS.textMuted, fontFamily: FONTS.mono, fontSize: 13 }}>// No posts yet. Click "New Post" to get started.</div>
      )}
      {posts.map(p => (
        <div key={p.id} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 10, padding: '3px 8px', borderRadius: 3, color: TAG_STYLES[p.tag]?.color || COLORS.textMuted, background: TAG_STYLES[p.tag]?.bg || 'rgba(90,90,120,0.12)', letterSpacing: '0.1em' }}>
                {p.tag}
              </span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted }}>
                {fmtDate(p.date)} · {p.readTime} read
              </span>
            </div>
            <div style={{ fontFamily: FONTS.display, fontSize: 17, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>{p.title}</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>{p.excerpt}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginLeft: 16, flexShrink: 0 }}>
            <button style={S.btnSecondary} onClick={() => onEdit(p)}>Edit</button>
            <button style={S.btnDanger} onClick={() => onDelete(p.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ posts, resources, about, onSavePosts, onSaveResources, onSaveAbout, onExit }) {
  const [section, setSection]     = useState('posts')
  const [editingPost, setEditing] = useState(null)
  const [creating, setCreating]   = useState(false)

  const savePost = (form) => {
    const updated = form.id
      ? posts.map(p => p.id === form.id ? form : p)
      : [{ ...form, id: genId() }, ...posts]
    onSavePosts(updated)
    setEditing(null)
    setCreating(false)
  }

  const deletePost = (id) => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    onSavePosts(posts.filter(p => p.id !== id))
  }

  const handleExit = () => {
    clearAdminSession()
    onExit()
  }

  return (
    <div style={{ ...S.page, display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ background: '#0a0a0f', borderRight: `1px solid ${COLORS.border}`, padding: '28px 0', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: `1px solid ${COLORS.border}`, marginBottom: 12 }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 2 }}>Mystik</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent, letterSpacing: '0.12em' }}>// ADMIN</div>
        </div>
        <div style={{ flex: 1 }}>
          {NAV.map(item => (
            <div
              key={item.id}
              style={S.adminSideItem(section === item.id)}
              onClick={() => { setSection(item.id); setEditing(null); setCreating(false) }}
            >
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
        </div>
        <div style={{ padding: '0 16px' }}>
          <button style={{ ...S.btnSecondary, width: '100%', fontSize: 11 }} onClick={handleExit}>← exit admin</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ padding: '36px 44px', overflowY: 'auto' }}>
        {section === 'posts' && (
          editingPost ? <PostEditor post={editingPost} onSave={savePost} onCancel={() => setEditing(null)} />
          : creating   ? <PostEditor post={null}        onSave={savePost} onCancel={() => setCreating(false)} />
          : <PostsList posts={posts} onEdit={setEditing} onNew={() => setCreating(true)} onDelete={deletePost} />
        )}
        {section === 'resources' && <ResourceEditor resources={resources} onSave={onSaveResources} />}
        {section === 'about'     && <AboutEditor about={about} onSave={onSaveAbout} />}
      </div>
    </div>
  )
}
