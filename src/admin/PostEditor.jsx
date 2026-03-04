import { useState } from 'react'
import { S, COLORS, FONTS } from '../theme'
import { ALL_TAGS } from '../data/defaults'
import { renderMarkdown } from '../utils/markdown'
import { todayISO } from '../utils/helpers'

export default function PostEditor({ post, onSave, onCancel }) {
  const isNew = !post?.id
  const [form, setForm] = useState(post || {
    title: '', excerpt: '', tag: ALL_TAGS[0],
    date: todayISO(), readTime: '5 min', mitre: [], content: ''
  })
  const [mitreInput, setMitreInput] = useState(form.mitre?.join('\n') || '')
  const [preview, setPreview]       = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    onSave({
      ...form,
      mitre: mitreInput.split('\n').map(s => s.trim()).filter(Boolean)
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 600, letterSpacing: -0.3 }}>
          {isNew ? 'New Post' : 'Edit Post'}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnSecondary} onClick={onCancel}>Cancel</button>
          <button style={S.btnPrimary} onClick={handleSave}>{isNew ? 'Publish' : 'Save Changes'}</button>
        </div>
      </div>

      <label style={S.label}>Title</label>
      <input style={S.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Post title..." />

      <div style={S.grid2}>
        <div>
          <label style={S.label}>Category</label>
          <select style={S.select} value={form.tag} onChange={e => set('tag', e.target.value)}>
            {ALL_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>Date</label>
          <input style={S.input} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
      </div>

      <div style={S.grid2}>
        <div>
          <label style={S.label}>Read Time</label>
          <input style={S.input} value={form.readTime} onChange={e => set('readTime', e.target.value)} placeholder="e.g. 10 min" />
        </div>
        <div>
          <label style={S.label}>MITRE Techniques (one per line)</label>
          <input style={S.input} value={mitreInput} onChange={e => setMitreInput(e.target.value)} placeholder="T1055 – Process Injection" />
        </div>
      </div>

      <label style={S.label}>Excerpt</label>
      <textarea style={{ ...S.textarea, height: 80 }} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Short description shown in post list..." />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <label style={{ ...S.label, marginBottom: 0 }}>Content (Markdown)</label>
        <button style={{ ...S.btnSecondary, fontSize: 10, padding: '4px 10px' }} onClick={() => setPreview(!preview)}>
          {preview ? '✏ Edit' : '👁 Preview'}
        </button>
      </div>

      {preview
        ? <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border2}`, borderRadius: 7, padding: 20, marginBottom: 14, minHeight: 300 }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(form.content) }} />
        : <textarea
            style={{ ...S.textarea, height: 420 }}
            value={form.content}
            onChange={e => set('content', e.target.value)}
            placeholder={`## Overview\n\nWrite your post in Markdown.\n\n## How it Works\n\nUse **bold**, \`code\`, headings, and lists.\n\n## MITRE\n\nT1055, T1106`}
          />
      }

      {/* Markdown cheatsheet */}
      <div style={{ ...S.card, background: 'rgba(94,245,184,0.03)', borderColor: 'rgba(94,245,184,0.15)', fontSize: 12, color: COLORS.textMuted, fontFamily: FONTS.mono, lineHeight: 1.9 }}>
        <div style={{ color: COLORS.accent, marginBottom: 6 }}>// Markdown quick reference</div>
        ## Heading 2 &nbsp;|&nbsp; ### Heading 3 &nbsp;|&nbsp; **bold** &nbsp;|&nbsp; `code` &nbsp;|&nbsp; - list item &nbsp;|&nbsp; 1. numbered
      </div>
    </div>
  )
}
