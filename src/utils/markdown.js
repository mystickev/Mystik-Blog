// -- Markdown -> HTML renderer ----------------------------------------------
// Supports: headings (h1-h3), **bold**, *italic*, `inline code`,
// fenced code blocks, images with captions, links, blockquotes,
// horizontal rules, unordered lists, numbered lists, paragraphs.

export function renderMarkdown(text) {
  if (!text) return ''

  let html = text
    // -- Escape HTML entities first -------------------------------------
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

    // -- Fenced code blocks (``` lang\n...\n```) ------------------------
    // Must come BEFORE inline code to avoid conflict
    .replace(/```(\w*)\n([\s\S]*?)```/gm, (_, lang, code) => `
      <div style="background:#0f0f14;border:1px solid #25253a;border-radius:8px;margin:24px 0;overflow:hidden;">
        ${lang ? `<div style="padding:8px 16px;background:#161620;border-bottom:1px solid #25253a;font-family:'JetBrains Mono',monospace;font-size:10px;color:#5a5a78;letter-spacing:0.1em;text-transform:uppercase;">${lang}</div>` : ''}
        <pre style="padding:20px;overflow-x:auto;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.7;color:#c8d0e8;margin:0;">${code.trim()}</pre>
      </div>`)

    // -- Headings -------------------------------------------------------
    .replace(/^# (.+)$/gm,
      '<h1 style="font-family:\'Playfair Display\',serif;font-size:32px;font-weight:700;margin:48px 0 16px;letter-spacing:-0.5px;color:#dddde8;line-height:1.2;">$1</h1>')
    .replace(/^## (.+)$/gm,
      '<h2 style="font-family:\'Playfair Display\',serif;font-size:22px;font-weight:600;margin:36px 0 12px;letter-spacing:-0.3px;color:#dddde8;padding-bottom:8px;border-bottom:1px solid #1c1c28;">$1</h2>')
    .replace(/^### (.+)$/gm,
      '<h3 style="font-family:\'DM Sans\',sans-serif;font-size:13px;font-weight:500;color:#5ef5b8;text-transform:uppercase;letter-spacing:0.12em;margin:28px 0 10px;">$1</h3>')

    // -- Horizontal rule ------------------------------------------------
    .replace(/^---$/gm,
      '<hr style="border:none;border-top:1px solid #25253a;margin:36px 0;" />')

    // -- Blockquote -----------------------------------------------------
    .replace(/^&gt; (.+)$/gm,
      '<blockquote style="border-left:3px solid #5ef5b8;background:rgba(94,245,184,0.04);padding:14px 20px;border-radius:0 6px 6px 0;margin:20px 0;font-family:\'DM Sans\',sans-serif;font-size:14px;color:#8888a8;font-style:italic;">$1</blockquote>')

    // -- Images -- BEFORE links so ![...](...) is not consumed -----------
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `
      <figure style="margin:28px 0;">
        <img src="${src}" alt="${alt}" style="max-width:100%;border-radius:8px;border:1px solid #25253a;display:block;" />
        ${alt && alt !== 'Alt text' ? `<figcaption style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#5a5a78;margin-top:8px;letter-spacing:0.04em;">${alt}</figcaption>` : ''}
      </figure>`)

    // -- Links ----------------------------------------------------------
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer" style="color:#5ef5b8;border-bottom:1px solid rgba(94,245,184,0.3);text-decoration:none;transition:border-color 0.2s;">$1</a>')

    // -- Bold -- before italic to avoid conflict -------------------------
    .replace(/\*\*(.+?)\*\*/g,
      '<strong style="color:#dddde8;font-weight:600;">$1</strong>')

    // -- Italic ---------------------------------------------------------
    .replace(/\*([^*]+)\*/g,
      '<em style="color:#c8c8d8;font-style:italic;">$1</em>')

    // -- Inline code ----------------------------------------------------
    .replace(/`([^`]+)`/g,
      '<code style="font-family:\'JetBrains Mono\',monospace;font-size:12px;background:#0f0f14;border:1px solid #25253a;padding:2px 7px;border-radius:4px;color:#5ef5b8;">$1</code>')

    // -- Numbered lists -------------------------------------------------
    .replace(/^(\d+)\. (.+)$/gm,
      '<li style="margin-bottom:8px;color:#dddde8;font-size:15px;line-height:1.7;">$2</li>')

    // -- Unordered lists ------------------------------------------------
    .replace(/^[-*] (.+)$/gm,
      '<li style="margin-bottom:8px;color:#dddde8;font-size:15px;line-height:1.7;">$1</li>')

    // -- Wrap consecutive <li> in <ul> ----------------------------------
    .replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g,
      m => `<ul style="padding-left:22px;margin:16px 0;list-style:none;">
        ${m.replace(/<li/g, '<li style="margin-bottom:8px;color:#dddde8;font-size:15px;line-height:1.7;display:flex;gap:10px;align-items:baseline;"><span style="color:#5ef5b8;flex-shrink:0;">-></span><span')}
        </ul>`.replace(/<\/li>/g, '</span></li>'))

  // -- Paragraphs ---------------------------------------------------------
  html = html
    .split(/\n\n+/)
    .map(block => {
      block = block.trim()
      if (!block) return ''
      if (/^<(h[1-6]|ul|ol|li|blockquote|hr|figure|div|pre)/.test(block)) return block
      return `<p style="margin-bottom:20px;color:#dddde8;font-size:15.5px;line-height:1.85;font-family:'DM Sans',sans-serif;">${block.replace(/\n/g, '<br/>')}</p>`
    })
    .join('\n')

  return html
}