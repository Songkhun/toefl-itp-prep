import type { Question } from '../domain/types';
import { realContent, type ContentSource } from '../content';
import type { Attempt } from '../storage/store';
import { createRng, shuffle } from '../util/rng';

/** A missed question leaves the review list after this many correct answers since the last miss. */
export const CLEAR_AFTER = 2;
export const REVIEW_SIZE = 20;

export interface Mistake { question: Question; lastAt: number; correctSince: number }

/**
 * Questions answered wrongly and not yet answered correctly CLEAR_AFTER times since the last miss.
 * Fixed mock-form items are excluded so the mock forms stay unseen. Bank items use the current bank
 * text (so corrections apply); generated items use the copy saved with the wrong attempt.
 * Least recently answered first.
 */
export function openMistakes(attempts: Attempt[], content: ContentSource = realContent): Mistake[] {
  const byId = new Map<string, Attempt[]>();
  for (const a of attempts) {
    if (a.source === 'mock') continue;
    const list = byId.get(a.questionId);
    if (list) list.push(a); else byId.set(a.questionId, [a]);
  }
  const bank = new Map<string, Question>();
  const bankFor = (a: Attempt) => {
    if (!bank.has(a.patternId)) for (const q of content.drillItems(a.patternId)) bank.set(q.id, q);
    return bank.get(a.questionId);
  };
  const out: Mistake[] = [];
  for (const list of byId.values()) {
    list.sort((x, y) => x.at - y.at);
    let lastWrong = -1;
    list.forEach((a, i) => { if (!a.correct) lastWrong = i; });
    if (lastWrong < 0) continue;
    const correctSince = list.slice(lastWrong + 1).filter((a) => a.correct).length;
    if (correctSince >= CLEAR_AFTER) continue;
    const saved = [...list].reverse().find((a) => a.question)?.question;
    const question = (list[0].source === 'drill' ? bankFor(list[0]) : undefined) ?? saved;
    if (!question) continue;
    out.push({ question, lastAt: list[list.length - 1].at, correctSince });
  }
  return out.sort((a, b) => a.lastAt - b.lastAt);
}

/** Up to REVIEW_SIZE open mistakes (least recently answered first), shuffled. */
export function buildReview(attempts: Attempt[], seed: number, content: ContentSource = realContent): Question[] {
  return shuffle(openMistakes(attempts, content).slice(0, REVIEW_SIZE).map((m) => m.question), createRng(seed));
}
