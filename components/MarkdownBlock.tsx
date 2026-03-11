'use client';

/**
 * Lightweight markdown renderer for engine doctrine responses.
 * Handles: headers, bold, italic, lists, code blocks, horizontal rules, links.
 * Content comes from our own Engine Runtime — no user-generated content.
 */

interface MarkdownBlockProps {
  content: string;
  className?: string;
}

function markdownToHtml(md: string): string {
  let html = md;

  // Escape HTML entities (basic XSS prevention even though content is trusted)
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Fenced code blocks (```lang\n...\n```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    const cls = lang ? ` class="lang-${lang}"` : '';
    return `<pre class="md-pre"><code${cls}>${code.trim()}</code></pre>`;
  });

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

  // Headers (must be at line start)
  html = html.replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>');

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr class="md-hr"/>');

  // Bold + Italic (***text***)
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');

  // Bold (**text**)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="md-bold">$1</strong>');

  // Italic (*text*) — but not inside already-processed tags
  html = html.replace(/(?<![*\\])\*([^*\n]+?)\*(?!\*)/g, '<em class="md-italic">$1</em>');

  // Numbered list items
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="md-li md-ol-li">$1</li>');

  // Bullet list items (- item)
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li class="md-li md-ul-li">$1</li>');

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/((?:<li class="md-li md-ul-li">.*?<\/li>\n?)+)/g, '<ul class="md-ul">$1</ul>');
  html = html.replace(/((?:<li class="md-li md-ol-li">.*?<\/li>\n?)+)/g, '<ol class="md-ol">$1</ol>');

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>');

  // Line breaks: double newline → paragraph break
  html = html.replace(/\n\n+/g, '</p><p class="md-p">');

  // Single newlines within text → <br/>
  // But not after block elements
  html = html.replace(/(?<!\>)\n(?!\<)/g, '<br/>');

  // Wrap in paragraph
  html = `<p class="md-p">${html}</p>`;

  // Clean up empty paragraphs
  html = html.replace(/<p class="md-p">\s*<\/p>/g, '');

  // Don't wrap block elements in paragraphs
  html = html.replace(/<p class="md-p">\s*(<(?:h[1-4]|ul|ol|pre|hr|div)[^>]*>)/g, '$1');
  html = html.replace(/(<\/(?:h[1-4]|ul|ol|pre|hr|div)>)\s*<\/p>/g, '$1');

  return html;
}

export default function MarkdownBlock({ content, className }: MarkdownBlockProps) {
  const html = markdownToHtml(content);

  return (
    <div
      className={`md-block ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ fontSize: '0.875rem', lineHeight: '1.7' }}
    />
  );
}
