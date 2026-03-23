'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../../lib/theme-context';
import { type BlogPost, formatDate } from '../blog-data';

function renderMarkdown(md: string) {
  const lines = md.split('\n');
  const elements: React.ReactElement[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeader: string[] = [];
  let listItems: string[] = [];
  let inList = false;

  const flushList = () => {
    if (listItems.length) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-1 my-4" style={{ color: 'var(--ept-text-secondary)' }}>
          {listItems.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (tableRows.length) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {tableHeader.map((h, j) => (
                  <th key={j} className="text-left px-4 py-2 font-semibold border-b" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2 border-b" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      tableHeader = [];
      inTable = false;
    }
  };

  function renderInline(text: string): (string | React.ReactElement)[] {
    const parts: (string | React.ReactElement)[] = [];
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIdx = 0;
    let match;
    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
      parts.push(<strong key={`b-${match.index}`} style={{ color: 'var(--ept-text)' }}>{match[1]}</strong>);
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < text.length) parts.push(text.slice(lastIdx));
    return parts.map((p, i) => {
      if (typeof p !== 'string') return p;
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const linkParts: (string | React.ReactElement)[] = [];
      let li = 0;
      let lm;
      while ((lm = linkRegex.exec(p)) !== null) {
        if (lm.index > li) linkParts.push(p.slice(li, lm.index));
        linkParts.push(<Link key={`l-${lm.index}`} href={lm[2]} className="underline" style={{ color: 'var(--ept-accent)' }}>{lm[1]}</Link>);
        li = lm.index + lm[0].length;
      }
      if (li < p.length) linkParts.push(p.slice(li));
      return linkParts.length > 1 ? <span key={`s-${i}`}>{linkParts}</span> : (linkParts[0] ?? p);
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      const cells = line.split('|').filter(Boolean).map(c => c.trim());
      if (!inTable) {
        tableHeader = cells;
        inTable = true;
      } else if (cells.every(c => /^[-:]+$/.test(c))) {
        // separator row
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      const content = line.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
      listItems.push(content);
      inList = true;
      continue;
    } else if (inList) {
      flushList();
    }

    if (line.startsWith('### ')) {
      elements.push(<h4 key={i} className="text-lg font-bold mt-8 mb-3" style={{ color: 'var(--ept-text)' }}>{line.slice(4)}</h4>);
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={i} className="text-xl font-bold mt-10 mb-4" style={{ color: 'var(--ept-text)' }}>{line.slice(3)}</h3>);
    } else if (line.startsWith('# ')) {
      elements.push(<h2 key={i} className="text-2xl font-bold mt-10 mb-4" style={{ color: 'var(--ept-text)' }}>{line.slice(2)}</h2>);
    } else if (line.startsWith('---')) {
      elements.push(<hr key={i} className="my-8" style={{ borderColor: 'var(--ept-border)' }} />);
    } else if (line.trim() === '') {
      // skip
    } else {
      elements.push(
        <p key={i} className="leading-relaxed mb-4" style={{ color: 'var(--ept-text-secondary)' }}>
          {renderInline(line)}
        </p>
      );
    }
  }
  flushList();
  flushTable();
  return elements;
}

export default function ArticleContent({ post }: { post: BlogPost }) {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-sm font-medium" style={{ color: 'var(--ept-accent)' }}>&larr; Back to Blog</Link>
          <Link href="/engines" className="text-sm font-medium hidden md:block" style={{ color: 'var(--ept-text-secondary)' }}>Engines</Link>
          <Link href="/pricing" className="text-sm font-medium hidden md:block" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: isDark ? '#14b8a620' : '#0d737720', color: 'var(--ept-accent)' }}>
              {post.category}
            </span>
            <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{formatDate(post.date)}</span>
            <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{post.readTime} read</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4" style={{ color: 'var(--ept-text)' }}>
            {post.title}
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{post.excerpt}</p>
        </div>

        <div className="border-t pt-8" style={{ borderColor: 'var(--ept-border)' }}>
          {renderMarkdown(post.content)}
        </div>

        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t" style={{ borderColor: 'var(--ept-border)' }}>
          {post.tags.map(tag => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-muted)' }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl text-center" style={{ backgroundColor: 'var(--ept-surface)', border: '1px solid var(--ept-border)' }}>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Ready to see it in action?</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--ept-text-secondary)' }}>Explore our intelligence engines, try our SDK, or talk to our AI.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/engines" className="px-6 py-3 rounded-xl font-semibold text-sm text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>
              Explore Engines
            </Link>
            <Link href="/sdk" className="px-6 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
              View SDK
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
