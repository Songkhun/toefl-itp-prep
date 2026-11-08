import { useEffect, useMemo, useState } from 'react';
import type { Word } from '../domain/types';
import type { CardState } from '../storage/store';
import { buildVocabQueue, cardKindFor } from '../srs/vocabQueue';
import { newCard, review, type Grade } from '../srs/sm2';
import { localDate } from '../plan/plan';
import { useEnv } from './context';

interface Item { card: CardState; word: Word; isNew: boolean }

function blankOut(sentence: string, word: Word): string {
  const forms = [word.headword, ...word.forms].sort((a, b) => b.length - a.length);
  for (const f of forms) {
    const re = new RegExp(`\\b${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*`, 'i');
    if (re.test(sentence)) return sentence.replace(re, '______');
  }
  return sentence;
}

export function VocabSession({ onDone }: { onDone: () => void }) {
  const { store, content, clock } = useEnv();
  const [items, setItems] = useState<Item[] | null>(null);
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const words = useMemo(() => new Map(content.allWords().map((w) => [w.id, w])), [content]);

  useEffect(() => {
    void (async () => {
      const [cards, settings] = await Promise.all([store.getCards(), store.getSettings()]);
      const now = clock();
      const today = localDate(now);
      const q = buildVocabQueue({
        words: content.allWords(), cards, now: now.getTime(), newWordsPerDay: settings.newWordsPerDay,
        newIntroducedToday: cards.filter((c) => c.introducedOn === today).length,
      });
      const list: Item[] = [
        ...q.reviews.flatMap((c) => (words.get(c.wordId) ? [{ card: c, word: words.get(c.wordId)!, isNew: false }] : [])),
        ...q.newWords.map((w) => ({ card: { ...newCard(w.id, now.getTime()), introducedOn: today }, word: w, isNew: true })),
      ];
      setItems(list);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!items) return <p className="muted">Loading words…</p>;
  if (!items.length || i >= items.length) {
    return (
      <div className="card">
        <p>{items.length ? `Vocabulary done: ${items.length} cards reviewed.` : 'No vocabulary due right now.'}</p>
        <button className="primary" onClick={onDone}>Continue</button>
      </div>
    );
  }

  const { card, word, isNew } = items[i];
  const kind = cardKindFor(card);
  const grade = async (g: Grade) => {
    const next = review(card, g, clock().getTime());
    await store.saveCard(next);
    const again = g === 'again' && !items.slice(i + 1).some((x) => x.word.id === word.id);
    setItems(again ? [...items, { card: next, word, isNew: false }] : items);
    setRevealed(false);
    setI(i + 1);
  };

  return (
    <div className="card flash">
      <div className="muted">Word {i + 1} of {items.length}{isNew ? ' · new' : ''}</div>
      {kind === 'word-to-meaning' && <div className="big">{word.headword} <span className="muted">({word.pos})</span></div>}
      {kind === 'meaning-to-word' && <p>Which word means: <strong>{word.definition}</strong>?</p>}
      {kind === 'cloze' && <p>Fill the gap: {blankOut(word.examples[0] ?? '', word)}</p>}
      {!revealed ? (
        <button className="primary" onClick={() => setRevealed(true)}>Show answer</button>
      ) : (
        <>
          <div className="big">{word.headword}</div>
          <p>{word.definition}</p>
          {word.examples.map((e) => <p key={e} className="muted">“{e}”</p>)}
          {word.forms.length > 0 && <p className="muted">Family: {word.forms.join(', ')}</p>}
          <div className="row">
            {(['again', 'hard', 'good', 'easy'] as Grade[]).map((g) => (
              <button key={g} onClick={() => void grade(g)}>{g[0].toUpperCase() + g.slice(1)}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
