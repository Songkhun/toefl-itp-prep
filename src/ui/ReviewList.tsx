import type { Question } from '../domain/types';
import { Stem, optionLabel } from './QuestionView';

export function ReviewList({ questions, answers }: { questions: Question[]; answers: Record<string, number> }) {
  const wrong = questions.filter((q) => answers[q.id] !== q.answerIndex);
  if (!wrong.length) return <p className="card ok">No mistakes. Excellent work!</p>;
  return (
    <section>
      <h2>Review your mistakes ({wrong.length})</h2>
      {wrong.map((q) => (
        <article key={q.id} className="card review">
          <Stem q={q} />
          <p className="your">Your answer: {answers[q.id] === undefined ? 'No answer' : optionLabel(q, answers[q.id])}</p>
          <p className="right">Correct: {optionLabel(q, q.answerIndex)}</p>
          <p className="why">{q.explanation}</p>
        </article>
      ))}
    </section>
  );
}
