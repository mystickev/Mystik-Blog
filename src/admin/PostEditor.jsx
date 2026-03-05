import { useState, useEffect } from 'react'
import { S, COLORS, FONTS } from '../theme'
import { ALL_TAGS } from '../data/defaults'
import { renderMarkdown } from '../utils/markdown'
import { todayISO } from '../utils/helpers'

// -- Templates -------------------------------------------------------------
const TEMPLATES = {
  blank: {
    label: 'Blank', icon: '?', tag: ALL_TAGS[0], content: '',
  },
  ctf: {
    label: 'CTF Writeup', icon: '?', tag: 'CTF',
    content: `## Challenge Overview\n\n**Event:** CTF Name Here\n**Category:** Category\n**Points:** 100\n**Difficulty:** Medium\n\nBrief description of the challenge.\n\n## Challenge Description\n\n> Paste the challenge prompt here.\n\n## Solution\n\n### Step 1 -- Initial Recon\n\nDescribe your first steps here.\n\n### Step 2 -- Analysis\n\nWalk through your analysis.\n\n### Step 3 -- Exploitation / Solution\n\nDetail the solution.\n\n\`\`\`bash\n# commands used\n\`\`\`\n\n## Flag\n\n\`flag{your_flag_here}\`\n\n## Lessons Learned\n\nWhat did this challenge teach you?\n\n## References\n\n- [Reference 1](https://example.com)`,
  },
  malware: {
    label: 'Malware Analysis', icon: '?', tag: 'Malware Analysis',
    content: `## Overview\n\nBrief description of the malware sample and threat context.\n\n## Sample Information\n\n- **MD5:** \`hash_here\`\n- **SHA256:** \`hash_here\`\n- **File Type:** PE32 / DLL / Script\n- **Size:** X bytes\n- **First Seen:** YYYY-MM-DD\n\n## Static Analysis\n\n### Strings of Interest\n\nNotable strings extracted from the binary.\n\n### Imports\n\nKey imports and what they suggest about capability.\n\n## Dynamic Analysis\n\n### Execution Behaviour\n\nWhat happens when the sample runs.\n\n### Network Activity\n\nC2 communication, DNS queries, HTTP requests.\n\n### Persistence Mechanism\n\nHow the malware maintains persistence.\n\n## Detection\n\n### YARA Rule\n\n\`\`\`yara\nrule MalwareName {\n  meta:\n    author = "Mystik"\n    description = ""\n  strings:\n    $s1 = ""\n  condition:\n    all of them\n}\n\`\`\`\n\n## MITRE ATT&CK\n\n- T1XXX -- Technique Name\n\n## IOCs\n\n| Type | Value |\n|------|-------|\n| MD5  | hash  |\n| Domain | domain.com |\n\n## References\n\n- [Reference](https://example.com)`,
  },
  hunt: {
    label: 'Threat Hunt', icon: '?', tag: 'Threat Hunting',
    content: `## Hypothesis\n\n> State your hunting hypothesis clearly.\n\n**Hypothesis:** In our environment, [process/behaviour] should never [action] unless [condition]. Any instance warrants investigation.\n\n## Background\n\nWhy this technique is worth hunting.\n\n## Hunt Queries\n\n### Kibana / KQL\n\n\`\`\`\nevent.code: "1" AND\nwinlog.event_data.Image: (*suspicious*)\n\`\`\`\n\n### Wazuh Rule\n\n\`\`\`xml\n<rule id="100xxx" level="10">\n  <description>Hunt rule description</description>\n  <mitre>\n    <id>T1XXX</id>\n  </mitre>\n</rule>\n\`\`\`\n\n## Results\n\n### True Positives\n\nConfirmed malicious activity.\n\n### False Positives\n\nLegitimate activity to baseline and exclude.\n\n## MITRE ATT&CK\n\n- T1XXX -- Technique Name\n\n## References\n\n- [Reference](https://example.com)`,
  },
  forensics: {
    label: 'Forensics', icon: '?', tag: 'Forensics',
    content: `## Case Overview\n\nBrief description of the forensics scenario.\n\n## Evidence Collected\n\n- Memory dump: \`filename.mem\`\n- Disk image: \`filename.E01\`\n- Network capture: \`filename.pcap\`\n\n## Analysis\n\n### Memory Analysis\n\n\`\`\`bash\nvol.py -f memory.mem imageinfo\nvol.py -f memory.mem --profile=Win10x64 pslist\n\`\`\`\n\n### Network Analysis\n\nPCAP analysis findings.\n\n## Timeline\n\n| Time (UTC) | Event |\n|------------|-------|\n| 00:00:00   | Event description |\n\n## IOCs\n\n- IP: \`x.x.x.x\`\n- Domain: \`malicious.domain\`\n\n## Conclusion\n\nWhat happened, who did it, how.\n\n## References\n\n- [Tool/Reference](https://example.com)`,
  },
}

// -- Helpers ----------------------------------------------------------------
function calcReadTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min`
}

function calcWordCount(content) {
  return content.trim().split(/\s+/).filter(Boolean).length
}

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled'
}

function extractHeadings(content) {
  return content.split('\n')
    .filter(l => l.startsWith('## ') || l.startsWith('### '))
    .map(l => ({ level: l.startsWith('### ') ? 3 : 2, text: l.replace(/^#{2,3} /, '') }))
}

function generateFrontmatter(form, mitreInput) {
  return `---\ntitle: ${form.title}\ntag: ${form.tag}\ndate: ${form.date}\nreadTime: ${form.readTime}\nexcerpt: ${form.excerpt}\nmitre: ${mitreInput}\n---`
}

function downloadMd(form, mitreInput) {
  const full = `${generateFrontmatter(form, mitreInput)}\n\n${form.content}`
  const blob = new Blob([full], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${generateSlug(form.title)}.md`
  a.click()
  URL.revokeObjectURL(url)
}

async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text)
}

// -- Styles -----------------------------------------------------------------
const pill = (active, color = COLORS.accent) => ({
  fontFamily: FONTS.mono, fontSize: 11, padding: '5px 12px', borderRadius: 4,
  border: active ? `1px solid ${color}40` : `1px solid ${COLORS.border2}`,
  background: active ? `${color}18` : 'transparent',
  color: active ? color : COLORS.textMuted,
  cursor: 'pointer', letterSpacing: '0.06em', whiteSpace: 'nowrap',
})

const badge = (color) => ({
  fontFamily: FONTS.mono, fontSize: 10, padding: '2px 8px', borderRadius: 3,
  background: `${color}18`, color, letterSpacing: '0.08em',
})

// -- Component --------------------------------------------------------------
export default function PostEditor({ post, onSave, onCancel }) {
  const isNew = !post?.id

  const [form, setForm] = useState(post || {
    title: '', excerpt: '', tag: ALL_TAGS[0],
    date: todayISO(), readTime: '5 min', mitre: [], content: '',
  })
  const [mitreInput, setMitreInput]       = useState(form.mitre?.join(', ') || '')
  const [view, setView]                   = useState('edit')
  const [activePanel, setActivePanel]     = useState('content')
  const [copied, setCopied]               = useState('')
  const [downloaded, setDownloaded]       = useState(false)
  const [showTemplates, setShowTemplates] = useState(isNew)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Auto-calculate read time as content changes
  useEffect(() => {
    if (form.content) set('readTime', calcReadTime(form.content))
  }, [form.content])

  const wordCount  = calcWordCount(form.content)
  const slug       = generateSlug(form.title)
  const headings   = extractHeadings(form.content)
  const excerptLen = form.excerpt.length

  const applyTemplate = (key) => {
    const t = TEMPLATES[key]
    setForm(f => ({ ...f, tag: t.tag, content: t.content, readTime: t.content ? calcReadTime(t.content) : '5 min' }))
    setShowTemplates(false)
  }

  const handleDownload = () => { downloadMd(form, mitreInput); setDownloaded(true); setTimeout(() => setDownloaded(false), 3000) }
  const handleCopyFrontmatter = async () => { await copyToClipboard(generateFrontmatter(form, mitreInput)); setCopied('frontmatter'); setTimeout(() => setCopied(''), 2000) }
  const handleCopyContent = async () => { await copyToClipboard(form.content); setCopied('content'); setTimeout(() => setCopied(''), 2000) }
  const handleSave = () => onSave({ ...form, mitre: mitreInput.split(',').map(s => s.trim()).filter(Boolean) })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 600, letterSpacing: -0.3 }}>
            {isNew ? 'New Post' : 'Edit Post'}
          </div>
          {form.title && (
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>
              -> will save as <span style={{ color: COLORS.accent }}>{slug}.md</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={pill(false)} onClick={onCancel}>Cancel</button>
          <button style={pill(false)} onClick={handleCopyFrontmatter}>{copied === 'frontmatter' ? '? Copied' : 'Copy Frontmatter'}</button>
          <button style={{ ...pill(true), background: 'rgba(94,245,184,0.1)', color: COLORS.accent, border: '1px solid rgba(94,245,184,0.3)' }} onClick={handleDownload}>
            {downloaded ? '? Downloaded!' : '? Download .md'}
          </button>
          <button style={{ ...S.btnPrimary, fontSize: 12 }} onClick={handleSave}>Save to Dashboard</button>
        </div>
      </div>

      {/* Workflow banner */}
      <div style={{ ...S.card, background: 'rgba(94,245,184,0.03)', borderColor: 'rgba(94,245,184,0.15)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 18 }}>?</span>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted, lineHeight: 1.7 }}>
          <span style={{ color: COLORS.accent }}>Workflow:</span> Write post -> <strong style={{ color: COLORS.text }}>? Download .md</strong> -> Move to{' '}
          <code style={{ color: COLORS.accent, background: COLORS.surface, padding: '1px 6px', borderRadius: 3 }}>src/posts/</code> ->{' '}
          <code style={{ color: COLORS.accent, background: COLORS.surface, padding: '1px 6px', borderRadius: 3 }}>git add . && git commit && git push</code> -> Live in ~2 mins
        </div>
      </div>

      {/* Template picker */}
      {showTemplates && (
        <div style={{ ...S.card, marginBottom: 24 }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.accent, marginBottom: 14, letterSpacing: '0.1em' }}>// START FROM A TEMPLATE</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <button key={key} style={{ ...pill(false), display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 12 }} onClick={() => applyTemplate(key)}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted, marginTop: 10 }}>
            Templates pre-fill structure and set the appropriate tag.{' '}
            <span style={{ color: COLORS.accent, cursor: 'pointer' }} onClick={() => setShowTemplates(false)}>dismiss ×</span>
          </div>
        </div>
      )}

      {/* Panel tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 12 }}>
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {[['content', '? Content'], ['meta', '? Metadata']].map(([p, label]) => (
            <button key={p} style={pill(activePanel === p)} onClick={() => setActivePanel(p)}>{label}</button>
          ))}
        </div>
        {activePanel === 'content' && (
          <div style={{ display: 'flex', gap: 4 }}>
            {[['edit', '? Edit'], ['preview', '? Preview'], ['outline', '? Outline']].map(([v, label]) => (
              <button key={v} style={pill(view === v)} onClick={() => setView(v)}>{label}</button>
            ))}
          </div>
        )}
      </div>

      {/* -- META PANEL -- */}
      {activePanel === 'meta' && (
        <div>
          <label style={S.label}>Title</label>
          <input style={S.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Post title..." />

          <div style={S.grid2}>
            <div>
              <label style={S.label}>Category / Tag</label>
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
              <label style={S.label}>Read Time <span style={{ color: COLORS.accent, fontWeight: 400 }}>(auto: {calcReadTime(form.content)})</span></label>
              <input style={S.input} value={form.readTime} onChange={e => set('readTime', e.target.value)} placeholder="e.g. 10 min" />
            </div>
            <div>
              <label style={S.label}>Output Filename</label>
              <div style={{ ...S.input, color: COLORS.accent, fontFamily: FONTS.mono, fontSize: 12, cursor: 'default', marginBottom: 14 }}>{slug}.md</div>
            </div>
          </div>

          <label style={S.label}>
            Excerpt <span style={{ color: excerptLen > 160 ? COLORS.red : COLORS.textMuted, fontWeight: 400 }}>{excerptLen}/160 chars</span>
          </label>
          <textarea style={{ ...S.textarea, height: 80 }} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Short description shown in the post list (keep under 160 chars)..." />

          <label style={S.label}>MITRE Techniques (comma-separated)</label>
          <input style={S.input} value={mitreInput} onChange={e => setMitreInput(e.target.value)} placeholder="T1055 - Process Injection, T1106 - Native API" />
          {mitreInput && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: -8, marginBottom: 14 }}>
              {mitreInput.split(',').map(m => m.trim()).filter(Boolean).map(m => (
                <span key={m} style={badge('#f5904a')}>{m}</span>
              ))}
            </div>
          )}

          {/* Frontmatter preview */}
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.accent, letterSpacing: '0.1em' }}>// FRONTMATTER PREVIEW</div>
              <button style={{ ...pill(false), fontSize: 10, padding: '3px 10px' }} onClick={handleCopyFrontmatter}>
                {copied === 'frontmatter' ? '? Copied' : 'Copy'}
              </button>
            </div>
            <pre style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textDim, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
              {generateFrontmatter(form, mitreInput)}
            </pre>
          </div>
        </div>
      )}

      {/* -- CONTENT PANEL -- */}
      {activePanel === 'content' && (
        <div>
          {/* Stats bar */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 12, fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted }}>
            <span>Words: <span style={{ color: COLORS.text }}>{wordCount}</span></span>
            <span>Read time: <span style={{ color: COLORS.accent }}>{calcReadTime(form.content)}</span></span>
            <span>Headings: <span style={{ color: COLORS.text }}>{headings.length}</span></span>
            <span style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={() => setShowTemplates(true)}>+ templates</span>
            <span style={{ cursor: 'pointer', color: copied === 'content' ? COLORS.accent : COLORS.textMuted }} onClick={handleCopyContent}>
              {copied === 'content' ? '? copied' : 'copy content'}
            </span>
          </div>

          {/* Edit */}
          {view === 'edit' && (
            <>
              <textarea
                style={{ ...S.textarea, height: 520, fontSize: 13 }}
                value={form.content}
                onChange={e => set('content', e.target.value)}
                placeholder={'## Overview\n\nWrite your post in Markdown.\n\n## Analysis\n\nUse **bold**, `code`, headings.\n\n```bash\n# fenced code blocks\n```\n\n> Blockquotes for callouts\n\n- List items\n\n![Alt text](/images/screenshot.png)\n\n## MITRE\n\nT1055, T1106'}
              />
              <div style={{ ...S.card, background: 'rgba(94,245,184,0.02)', borderColor: 'rgba(94,245,184,0.1)', fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.mono, lineHeight: 2, marginTop: 8 }}>
                <div style={{ color: COLORS.accent, marginBottom: 4 }}>// Markdown reference</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                  <span>## Heading 2 | ### Heading 3</span>
                  <span>**bold** | *italic*</span>
                  <span>`inline code` | ```lang block```</span>
                  <span>- list | 1. numbered</span>
                  <span>![alt](/images/file.png)</span>
                  <span>[text](https://url) -- link</span>
                  <span>&gt; blockquote</span>
                  <span>--- horizontal rule</span>
                </div>
              </div>
            </>
          )}

          {/* Preview */}
          {view === 'preview' && (
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border2}`, borderRadius: 8, padding: '32px 40px', minHeight: 520 }}>
              {form.title && (
                <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted, marginBottom: 10, letterSpacing: '0.1em' }}>
                    {form.tag} · {form.date} · {form.readTime} read
                  </div>
                  <div style={{ fontFamily: FONTS.display, fontSize: 32, fontWeight: 700, lineHeight: 1.15, letterSpacing: -0.8, color: COLORS.text }}>
                    {form.title}
                  </div>
                </div>
              )}
              {form.content
                ? <div dangerouslySetInnerHTML={{ __html: renderMarkdown(form.content) }} />
                : <div style={{ color: COLORS.textMuted, fontFamily: FONTS.mono, fontSize: 12 }}>// nothing to preview yet</div>
              }
            </div>
          )}

          {/* Outline */}
          {view === 'outline' && (
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border2}`, borderRadius: 8, padding: 24, minHeight: 520 }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.accent, marginBottom: 20, letterSpacing: '0.1em' }}>
                // POST OUTLINE -- {headings.length} headings
              </div>
              {headings.length === 0
                ? <div style={{ color: COLORS.textMuted, fontFamily: FONTS.mono, fontSize: 12 }}>// no ## or ### headings found yet</div>
                : headings.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: h.level === 2 ? COLORS.accent : COLORS.textMuted, width: 24, flexShrink: 0 }}>H{h.level}</span>
                    <div style={{ width: h.level === 3 ? 16 : 0, flexShrink: 0 }} />
                    <span style={{ color: h.level === 2 ? COLORS.text : COLORS.textDim, fontSize: h.level === 2 ? 15 : 13 }}>{h.text}</span>
                  </div>
                ))
              }
              <div style={{ marginTop: 28, padding: 16, background: COLORS.surface2, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted, marginBottom: 12, letterSpacing: '0.1em' }}>// STATS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    ['Word Count', wordCount],
                    ['Read Time', calcReadTime(form.content)],
                    ['Headings', headings.length],
                    ['Excerpt', `${excerptLen} chars`],
                    ['Filename', `${slug}.md`],
                    ['MITRE Tags', mitreInput.split(',').filter(Boolean).length],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.mono, fontSize: 11 }}>
                      <span style={{ color: COLORS.textMuted }}>{label}</span>
                      <span style={{ color: COLORS.accent }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, padding: '16px 0', borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted }}>
          After downloading, move <span style={{ color: COLORS.accent }}>{slug}.md</span> to <span style={{ color: COLORS.accent }}>src/posts/</span> then push to GitHub.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={pill(false)} onClick={onCancel}>Cancel</button>
          <button style={{ ...pill(true), background: 'rgba(94,245,184,0.1)', color: COLORS.accent, border: '1px solid rgba(94,245,184,0.3)', padding: '8px 20px' }} onClick={handleDownload}>
            {downloaded ? '? Downloaded!' : '? Download .md'}
          </button>
          <button style={{ ...S.btnPrimary, fontSize: 12 }} onClick={handleSave}>Save to Dashboard</button>
        </div>
      </div>
    </div>
  )
}