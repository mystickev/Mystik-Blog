import { useState } from 'react'
import { S, FONTS } from '../theme'

export default function AboutEditor({ about, onSave }) {
  const [form, setForm] = useState(about)
  const [saved, setSaved] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = () => { onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 600, letterSpacing: -0.3 }}>About Page</div>
        <button style={S.btnPrimary} onClick={save}>Save Changes</button>
      </div>
      {saved && <div style={S.alert('success')}>✓ About page saved</div>}

      <label style={S.label}>Tagline / Quote</label>
      <input style={S.input} value={form.tagline} onChange={e => set('tagline', e.target.value)} />

      <label style={S.label}>Bio (use blank line between paragraphs)</label>
      <textarea style={{ ...S.textarea, height: 160 }} value={form.bio} onChange={e => set('bio', e.target.value)} />

      <label style={S.label}>Focus Areas (comma-separated)</label>
      <textarea style={{ ...S.textarea, height: 80 }} value={form.skills} onChange={e => set('skills', e.target.value)} />

      <label style={S.label}>Tools & Stack</label>
      <input style={S.input} value={form.tools} onChange={e => set('tools', e.target.value)} />

      <label style={S.label}>Certifications (comma-separated)</label>
      <input style={S.input} value={form.certs} onChange={e => set('certs', e.target.value)} />

      <label style={S.label}>Open To</label>
      <input style={S.input} value={form.openTo} onChange={e => set('openTo', e.target.value)} />
    </div>
  )
}
