import type { ReactNode } from 'react';

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>);
}

/** Minimal Markdown: #/##/### headings, "- " bullets, **bold**, paragraphs. */
export function Markdown({ source }: { source: string }) {
  const blocks = source.replace(/\r/g, '').split(/\n\s*\n/);
  return (
    <div className="lesson">
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter((l) => l.trim());
        if (!lines.length) return null;
        const h = lines[0].match(/^(#{1,3})\s+(.*)$/);
        if (h && lines.length === 1) {
          const level = h[1].length;
          return level === 1 ? <h2 key={i}>{inline(h[2])}</h2> : <h3 key={i}>{inline(h[2])}</h3>;
        }
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*]\s+/, ''))}</li>)}</ul>;
        }
        return (
          <div key={i}>
            {lines.map((l, j) => {
              const hh = l.match(/^(#{1,3})\s+(.*)$/);
              if (hh) return <h3 key={j}>{inline(hh[2])}</h3>;
              if (/^\s*[-*]\s+/.test(l)) return <ul key={j}><li>{inline(l.replace(/^\s*[-*]\s+/, ''))}</li></ul>;
              return <p key={j}>{inline(l)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}
