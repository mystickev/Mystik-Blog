import { useState } from 'react'
import { S, COLORS, FONTS } from '../theme'
import { genId } from '../utils/helpers'

const CATEGORIES = ['Reversing & Analysis', 'Threat Intelligence', 'Detection Engineering', 'Learning & Reference']

const EMPTY = { name: '', desc: '', url: '', icon: '🔗', category: CATEGORIES[0] }

export default function ResourceEditor({ resources, onSave }) {
  const [items, setItems]     = useState(resources)
  const [editing, setEditing] = useState(null)  // id or null
  const [form, setForm]       = useState(EMPTY)
  const [saved, setSaved]     = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const commit = () => {
    const updated = editing
      ? items.map(r => r.id === editing ? { ...form, id: editing } : r)
      : [...items, { ...form, id: genId() }]
    setItems(updated)
    onSave(updated)
    setEditing(null)
    setForm(EMPTY)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const startEdit = (r) => { setEditing(r.id); setForm(r) }
  const cancelEdit = () => { setEditing(null); setForm(EMPTY) }
  const deleteItem = (id) => {
    if (!confirm('Delete this resource?')) return
    const updated = items.filter(r => r.id !== id)
    setItems(updated)
    onSave(updated)
  }

  return (
    <div>
      <div style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 600, letterSpacing: -0.3, marginBottom: 28 }}>Resources</div>
      {saved && <div style={S.alert('success')}>✓ Resources saved</div>}

      {/* Form */}
      <div style={{ ...S.card, marginBottom: 28 }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.accent, marginBottom: 18, letterSpacing: '0.1em' }}>
          {editing ? '// EDITING RESOURCE' : '// ADD NEW RESOURCE'}
        </div>
        <div style={S.grid2}>
          <div><label style={S.label}>Name</label><input style={S.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tool name" /></div>
          <div><label style={S.label}>Icon (emoji)</label><input style={S.input} value={form.icon} onChange={e => set('icon', e.target.value)} /></div>
        </div>
        <label style={S.label}>URL</label>
        <input style={S.input} value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://example.com" />
        <label style={S.label}>Description</label>
        <input style={S.input} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Short description..." />
        <label style={S.label}>Category</label>
        <select style={S.select} value={form.category} onChange={e => set('category', e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnPrimary} onClick={commit}>{editing ? 'Save Changes' : 'Add Resource'}</button>
          {editing && <button style={S.btnSecondary} onClick={cancelEdit}>Cancel</button>}
        </div>
      </div>

      {/* List */}
      {items.map(r => (
        <div key={r.id} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 20 }}>{r.icon}</span>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14, color: COLORS.text }}>{r.name}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted }}>{r.category} · {r.url}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={S.btnSecondary} onClick={() => startEdit(r)}>Edit</button>
            <button style={S.btnDanger} onClick={() => deleteItem(r.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
