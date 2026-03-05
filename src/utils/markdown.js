// -- Lightweight Markdown -> HTML renderer ---------------------------------
// Supports: ## headings, **bold**, `inline code`, images, links,
// - lists, 1. numbered lists, paragraphs, and double-newline paragraph breaks.
// For richer Markdown (tables, fenced code blocks), swap this for
// the 'marked' or 'react-markdown' npm packages.

export function renderMarkdown(text) {
  if (!text) return ''

  let html = text
    // Escape HTML entities first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

    // Headings
    .replace(/^## (.+)$/gm,
      '<h2 style="font-family:\'Playfair Display\',serif;font-size:22px;font-weight:600;margin:36px 0 12px;letter-spacing:-0.3px;color:#dddde8;">$1</h2>')
    .replace(/^### (.+)$/gm,
      '<h3 style="font-family:\'DM Sans\',sans-serif;font-size:13px;font-weight:500;color:#8888a8;text-transform:uppercase;letter-spacing:0.1em;margin:24px 0 8px;">$1</h3>')

    // Images -- must come BEFORE links so ![...](...) is not consumed by link regex
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:16px 0;border:1px solid #25253a;display:block;" />')

    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer" style="color:#5ef5b8;border-bottom:1px solid rgba(94,245,184,0.3);text-decoration:none;">$1</a>')

    // Inline bold -- must come before code to avoid consuming asterisks inside code
    .replace(/\*\*(.+?)\*\*/g,
      '<strong style="color:#dddde8;font-weight:500;">$1</strong>')

    // Inline code
    .replace(/`([^`]+)`/g,
      '<code style="font-family:\'JetBrains Mono\',monospace;font-size:12px;background:#0f0f14;border:1px solid #25253a;padding:2px 6px;border-radius:4px;color:#5ef5b8;">$1</code>')

    // Lists -- numbered
    .replace(/^(\d+)\. (.+)$/gm,
      '<li style="margin-bottom:6px;color:#8888a8;">$2</li>')

    // Lists -- unordered
    .replace(/^[-*] (.+)$/gm,
      '<li style="margin-bottom:6px;color:#8888a8;">$1</li>')

    // Wrap consecutive <li> items in <ul>
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g,
      m => `<ul style="padding-left:20px;margin:12px 0;">${m}</ul>`)

  // Paragraphs: split on double newlines
  html = html
    .split(/\n\n+/)
    .map(block => {
      block = block.trim()
      if (!block) return ''
      // Don't wrap block-level elements in <p>
      if (/^<(h[1-6]|ul|ol|li|blockquote|img)/.test(block)) return block
      // Wrap single newlines in <br>
      return `<p style="margin-bottom:18px;color:#8888a8;font-size:15px;line-height:1.8;">${block.replace(/\n/g, '<br/>')}</p>`
    })
    .join('\n')

  return html
}