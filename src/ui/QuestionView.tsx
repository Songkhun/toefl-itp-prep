import type { Question } from '../domain/types';

const LETTERS = 'ABCD';

export function Stem({ q }: { q: Question }) {
  if (q.type === 'structure') {
    const [before, after] = q.stem.split('____');
    return <p className="stem">{before}<span className="blank" aria-label="blank">______</span>{after}</p>;
  }
  const parts = q.stem.split(/\{([0-3])\}/);
  return (
    <p className="stem">
      {parts.map((part, i) => (i % 2 === 1
        ? <u key={i} className="we-part">{q.options[+part]}<sub>{LETTERS[+part]}</sub></u>
        : <span key={i}>{part}</span>))}
    </p>
  );
}

export function optionLabel(q: Question, i: number): string {
  return `${LETTERS[i]}. ${q.options[i]}`;
}

export function QuestionView({ q, onChoose, chosen, disabled }: { q: Question; onChoose: (i: number) => void; chosen?: number; disabled?: boolean }) {
  return (
    <div className="question">
      <div className="qtype">{q.type === 'structure' ? 'Structure — choose the answer that completes the sentence' : 'Written Expression — choose the underlined part that is wrong'}</div>
      <Stem q={q} />
      <div className="options">
        {q.options.map((_, i) => {
          const state = chosen === undefined ? '' : i === q.answerIndex ? 'correct' : i === chosen ? 'wrong' : '';
          return (
            <button key={i} className={`option ${state}`} disabled={disabled} onClick={() => onChoose(i)}>
              {optionLabel(q, i)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
