# TOEFL ITP Prep App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a phone-first, offline, installable web app that drives a 12-week TOEFL ITP grammar and vocabulary plan. The first release ships checked content for weeks 1–2, mock form 1 and the first 150 AWL words.

**Architecture:**
- **Pure TypeScript domain modules** (SRS scheduler, plan engine, pattern stats, generator, session builders, score estimate). Each one is unit-tested with no DOM.
- **A thin storage layer** over IndexedDB, with an in-memory fallback.
- **A React UI** with hash routing.
- **Content as JSON files** in the repo, checked by a schema validator that runs in the tests.
- **Packaging:** Vite builds a static site, and `vite-plugin-pwa` makes it an offline PWA.

**Tech Stack:** Vite 5, React 18, TypeScript 5 (strict), Vitest + @testing-library/react + fake-indexeddb, `idb` (IndexedDB wrapper), `vite-plugin-pwa`. No backend.

**Spec:** `docs/superpowers/specs/2026-11-08-toefl-itp-prep-design.md`

## Global Constraints

- Works offline after first load. No network calls at runtime, no backend, no paid services.
- Phone-first: usable at 360px width with no horizontal scroll and tap targets ≥ 44px. Light and dark mode via `prefers-color-scheme`.
- All UI and content are in English.
- Structure & Written Expression format:
  - 4 options per question
  - mock = 40 questions in 25 minutes: Q1–15 Structure, Q16–40 Written Expression
  - target pace 37 s/question
- The section score estimate is on the 31–68 scale and must be labelled "Estimated". The total-score formula is `(L + S + R) × 10 / 3`.
- **Mock-pool items never appear in drills or New sets.** Generated items never appear in mocks.
- **The plan pauses on missed days:** it never skips ahead automatically. The test date is optional.
- **Defaults:** new words per day = 15 (configurable). Reminders at 07:00 and 16:30.
- **Language:** no AI, no API keys in v1.

## Review Focus

1. **IndexedDB unavailable** (private mode, or storage blocked): the app still runs on the in-memory store and shows a persistent banner "Progress won't be saved on this device". Test in Task 2.
2. **Session interrupted** (phone locked, tab closed mid-session): answered questions are already saved, and reopening offers "Resume session" with the same remaining questions. Test in Task 9.
3. **Timer while the app is in the background:** the elapsed time comes from `Date.now()` timestamps, not by counting ticks, so a 25-minute mock still ends at the right wall-clock time after the phone was locked. Test in Task 9.
4. **Vocabulary backlog after missed days:** due reviews are capped at 100 per session, and no new words are introduced while more than 50 reviews are due. Test in Task 4.
5. **Malformed or wrong-version backup file on import:** it is rejected with a readable error, and the existing data is left untouched. Test in Task 2.

---

## File Structure

```
src/
  domain/types.ts           shared types (Question, Pattern, Word, CardState, Attempt, PlanState, Settings, MockResult)
  content/patterns.ts       25 pattern definitions + 12-week schedule
  content/lessons/Pxx.md    lesson text per pattern
  content/questions/Pxx.json   drill-pool items per pattern
  content/mocks/formN.json  mock forms (40 items each)
  content/awl/words.json    AWL entries
  content/index.ts          loads and exposes content
  content/validate.ts       schema/consistency validator
  storage/store.ts          ProgressStore interface + IndexedDB + memory impls, export/import
  srs/sm2.ts                spaced repetition
  srs/vocabQueue.ts         daily vocab queue (due cap, new-word rule)
  plan/plan.ts              plan engine and pacing
  stats/patternStats.ts     accuracy per pattern, weakest list, weighted sampling
  util/rng.ts               seeded RNG + shuffle
  generator/index.ts        generate(patternId, count, rng)
  generator/templates/Pxx.ts   templates per pattern
  session/build.ts          morning / afternoon / mock / new-set builders
  scoring/estimate.ts       raw→scaled estimate
  settings/ics.ts           calendar reminder file
  ui/…                      React screens and components
tests/                      mirrors src/
```

---

### Task 1: Scaffold, shared types, content validator

**Files:**
- Create: the Vite React-TS project at the repo root (`package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`), `src/domain/types.ts`, `src/content/validate.ts`, `src/content/patterns.ts`
- Test: `tests/content/validate.test.ts`

**Interfaces:**
- Produces (`src/domain/types.ts`):
  ```ts
  type PatternId = `P${'0'|'1'|'2'}${number}`; // 'P01'..'P25'
  type QuestionType = 'structure' | 'written-expression';
  type Source = 'drill' | 'mock' | 'generated';
  interface Question {
    id: string; patternId: PatternId; type: QuestionType; source: Source;
    stem: string;          // structure: contains exactly one "____"; WE: contains {0}{1}{2}{3} marking the 4 underlined parts
    options: [string, string, string, string];
    answerIndex: 0 | 1 | 2 | 3;
    explanation: string;
    mockForm?: number;     // 1..6, required iff source === 'mock'
  }
  interface Pattern { id: PatternId; title: string; week: number; dayInWeek: number; hasGenerator: boolean }
  interface Word { id: string; headword: string; pos: string; definition: string; examples: string[]; forms: string[]; sublist: number }
  ```
- Produces: `validateContent(c: { patterns: Pattern[]; questions: Question[]; words: Word[] }): string[]`. It returns a list of error messages, and an empty list means valid.
- Produces: `PATTERNS: Pattern[]` in `src/content/patterns.ts`. These are the 25 patterns from spec §7 in order.
  - Weeks 1–8 have about 3 patterns per week.
  - `hasGenerator` is false for P18, P19, P21 and P22.

- [ ] **Step 1: Scaffold.**
  - Run `git init` and `npm create vite@latest . -- --template react-ts`.
  - Add the dev dependencies `vitest @testing-library/react @testing-library/jest-dom jsdom fake-indexeddb` and the dependencies `idb vite-plugin-pwa`.
  - Set `"test": "vitest run"`.
  - Turn on `strict: true`.
- [ ] **Step 2: Write the failing tests** in `tests/content/validate.test.ts`:
  - `rejects answerIndex outside 0..3`
  - `rejects duplicate question ids`
  - `rejects duplicate options within a question`
  - `rejects structure stem without exactly one "____"`
  - `rejects WE stem missing any of {0}..{3}`
  - `rejects mock item without mockForm, and drill item with mockForm`
  - `rejects unknown patternId`
  - `accepts a minimal valid set`

  Each test asserts `validateContent(...)` contains an error that mentions the offending id, or that the result is `[]` for the valid case.
- [ ] **Step 3: Run** `npm test`. Expected: FAIL (module not found).
- [ ] **Step 4: Implement** `types.ts`, `patterns.ts` and `validateContent`.
- [ ] **Step 5: Run** `npm test`. Expected: PASS. Also run `npm run build`, which should succeed.
- [ ] **Step 6: Commit.** `git add -A && git commit -m "chore: scaffold app, types, content validator"`

### Task 2: Storage layer, backup export/import

**Files:**
- Create: `src/storage/store.ts`
- Test: `tests/storage/store.test.ts`. It uses `import 'fake-indexeddb/auto'`.

**Interfaces:**
- Consumes: the types from Task 1.
- Produces:
  ```ts
  interface Attempt { questionId: string; patternId: PatternId; correct: boolean; ms: number; at: number; source: Source; sessionKind: SessionKind }
  type SessionKind = 'morning' | 'afternoon' | 'mock' | 'newset';
  interface CardState { wordId: string; ease: number; intervalDays: number; reps: number; dueAt: number; lapses: number }
  interface PlanState { startDate: string; planDay: number; lastCompletedDate: string | null } // planDay 1..84, dates 'YYYY-MM-DD' local
  interface Settings { newWordsPerDay: number; testDate: string | null }
  interface MockResult { form: number; raw: number; scaled: number; repeat: boolean; at: number }
  interface SessionDraft { kind: SessionKind; questionIds: string[]; answered: Record<string, number>; startedAt: number; deadlineAt: number | null }
  interface BackupV1 { version: 1; exportedAt: number; attempts: Attempt[]; cards: CardState[]; plan: PlanState | null; settings: Settings; mocks: MockResult[] }
  interface ProgressStore {
    persistent: boolean;
    getSettings(): Promise<Settings>; saveSettings(s: Settings): Promise<void>;
    recordAttempt(a: Attempt): Promise<void>; getAttempts(): Promise<Attempt[]>;
    getCards(): Promise<CardState[]>; saveCard(c: CardState): Promise<void>;
    getPlan(): Promise<PlanState | null>; savePlan(p: PlanState): Promise<void>;
    addMockResult(m: MockResult): Promise<void>; getMockResults(): Promise<MockResult[]>;
    getDraft(): Promise<SessionDraft | null>; saveDraft(d: SessionDraft): Promise<void>; clearDraft(): Promise<void>;
    exportAll(): Promise<BackupV1>;
    importAll(data: unknown): Promise<void>; // throws ImportError on invalid; existing data untouched on failure
  }
  function openStore(): Promise<ProgressStore>; // IndexedDB, falls back to memory store with persistent=false
  function createMemoryStore(): ProgressStore;
  class ImportError extends Error {}
  ```
  The default settings are `{ newWordsPerDay: 15, testDate: null }`.

- [ ] **Step 1: Write the failing tests:**
  - `round-trips settings, attempts, cards, plan, mocks, draft`
  - `exportAll then importAll into a fresh store reproduces the same data`
  - `importAll rejects {version: 2} with ImportError and leaves existing attempts unchanged`
  - `importAll rejects non-JSON-shaped input (e.g. "hello", {attempts: "x"})`
  - `openStore falls back to memory with persistent === false when indexedDB is undefined`. To set this up, delete `globalThis.indexedDB` in the test.
- [ ] **Step 2: Run** `npm test -- store`. Expected: FAIL.
- [ ] **Step 3: Implement** with `idb`.
  - Use one DB, `toefl-itp`, at version 1, with these stores: `kv` (settings, plan, draft), `attempts` (autoIncrement), `cards` (key `wordId`) and `mocks` (autoIncrement).
  - `importAll` validates the whole payload first, then clears and writes everything in a single transaction.
- [ ] **Step 4: Run** `npm test -- store`. Expected: PASS.
- [ ] **Step 5: Commit.** `git commit -am "feat: progress store with backup export/import"`

### Task 3: Seeded RNG, SM-2 scheduler

**Files:**
- Create: `src/util/rng.ts`, `src/srs/sm2.ts`
- Test: `tests/util/rng.test.ts`, `tests/srs/sm2.test.ts`

**Interfaces:**
- Produces:
  - `createRng(seed: number): () => number` (mulberry32)
  - `shuffle<T>(arr: T[], rng): T[]` (returns a copy)
  - `pick<T>(arr: T[], n: number, rng): T[]`
- Produces:
  - `type Grade = 'again' | 'hard' | 'good' | 'easy'`
  - `newCard(wordId: string, now: number): CardState`
  - `review(card: CardState, grade: Grade, now: number): CardState`

- [ ] **Step 1: Write the failing tests.**

  RNG tests:
  - same seed gives the same sequence
  - `shuffle` keeps all elements and does not mutate its input

  SM-2 tests:
  - new card ease 2.5, reps 0, dueAt = now
  - `good` on a new card gives interval 1 day, then 3 days, then about 3 × ease
  - `again` resets reps to 0, sets interval to 0 so the card is due in 10 min, adds 1 to lapses, and lowers ease by 0.2
  - ease never goes below 1.3
  - `easy` gives an interval greater than `good` from the same state
  - `hard` gives an interval no greater than `good`
- [ ] **Step 2: Run** `npm test -- rng sm2`. Expected: FAIL.
- [ ] **Step 3: Implement.** SM-2 maps the grades as again = q2, hard = q3, good = q4, easy = q5, and the ease update is `ease + (0.1 - (5-q)*(0.08+(5-q)*0.02))`. The intervals are `reps==0→1`, `reps==1→3`, otherwise `round(prev*ease)`. Easy multiplies by 1.3, and hard uses `max(1, round(prev*1.2))`.
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Commit.** `git commit -am "feat: seeded rng and SM-2 scheduler"`

### Task 4: Vocabulary queue

**Files:**
- Create: `src/srs/vocabQueue.ts`
- Test: `tests/srs/vocabQueue.test.ts`

**Interfaces:**
- Consumes: `CardState`, `Word`, `newCard`.
- Produces: `buildVocabQueue(args: { words: Word[]; cards: CardState[]; now: number; newWordsPerDay: number; newIntroducedToday: number }): { reviews: CardState[]; newWords: Word[] }`
  - Reviews are the due cards, oldest first, capped at **100**.
  - New words are the unseen words in `words` order (that order is AWL sublist order). There are `max(0, newWordsPerDay - newIntroducedToday)` of them, or **0 if more than 50 cards are due**.
- Produces: `type CardKind = 'word-to-meaning' | 'meaning-to-word' | 'cloze'` and `cardKindFor(card: CardState): CardKind`. The rule is reps 0 → word-to-meaning, reps 1 → meaning-to-word, and reps ≥ 2 → cloze.

- [ ] **Step 1: Write the failing tests:**
  - `returns due cards oldest first`
  - `caps reviews at 100 when 130 are due`
  - `introduces 0 new words when 51 are due`
  - `introduces newWordsPerDay minus already-introduced-today`
  - `never re-introduces a word that already has a card`
  - `cardKindFor follows reps`
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Commit.** `git commit -am "feat: daily vocabulary queue with backlog cap"`

### Task 5: Plan engine and pacing

**Files:**
- Create: `src/plan/plan.ts`
- Test: `tests/plan/plan.test.ts`

**Interfaces:**
- Consumes: `PlanState`, `PATTERNS`.
- Produces:
  - `startPlan(today: string): PlanState` gives `{ startDate: today, planDay: 1, lastCompletedDate: null }`.
  - `todayPlan(state: PlanState, today: string): { planDay: number; week: number; phase: 'learn' | 'review' | 'mixed'; patternId: PatternId | null; morningAvailable: boolean }`. The rules are:
    - Weeks 1–8 (planDay 1–56) are the `learn` phase on days with a pattern from `PATTERNS`, and `review` on the other days.
    - Weeks 9–12 are `mixed`, with `patternId` null.
    - `morningAvailable` is false when `lastCompletedDate === today`.
  - `completeMorning(state: PlanState, today: string): PlanState` adds 1 to planDay (capped at 84) and sets `lastCompletedDate = today`. **It never advances by more than 1, no matter how many days were missed.**
  - `pace(state: PlanState, today: string, testDate: string | null): { projectedFinishWeek8: string; daysUntilTest: number; onPace: boolean } | null`. It returns null when `testDate` is null. Otherwise:
    - `projectedFinishWeek8` = today + (56 − planDay) days, assuming one plan day per calendar day
    - `onPace` is true when that date is on or before the test date

- [ ] **Step 1: Write the failing tests:**
  - `day 1 of week 1 is learn phase with P01`
  - `day 57 is mixed with patternId null`
  - `completeMorning advances exactly one day after a 5-day gap`
  - `morning unavailable twice on the same date`
  - `planDay never exceeds 84`
  - `pace returns null without test date`
  - `pace onPace false when projected week-8 finish is after test date`
  - `every pattern P01–P25 appears exactly once as a learn day in weeks 1–8`
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.** Dates are local `YYYY-MM-DD` strings. Use date arithmetic that is safe across daylight-saving changes, via UTC-midnight `Date`.
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Commit.** `git commit -am "feat: pause-on-miss 12-week plan engine with pacing"`

### Task 6: Pattern stats and score estimate

**Files:**
- Create: `src/stats/patternStats.ts`, `src/scoring/estimate.ts`
- Test: `tests/stats/patternStats.test.ts`, `tests/scoring/estimate.test.ts`

**Interfaces:**
- Produces: `patternAccuracy(attempts: Attempt[], window = 30): Map<PatternId, { accuracy: number; n: number; avgMs: number }>`. It uses the last `window` attempts for each pattern, from every source, mock attempts included, because mocks are real evidence.
- Produces: `weakestPatterns(stats, studied: PatternId[], k: number): PatternId[]`. It returns the `k` lowest-accuracy patterns among `studied` that have n ≥ 5. Studied patterns with n < 5 sort first, as "unknown, needs practice".
- Produces: `weightedPatternSample(studied: PatternId[], stats, n: number, rng): PatternId[]`. The weight is `1.5 - accuracy` (unknown counts as 1.0), so weaker patterns are drawn more often.
- Produces: `rawToScaledStructure(raw: number): number`. It uses an approximate conversion table built from published prep-book tables. Pin these points and interpolate linearly, rounding, between them:
  | raw | 0 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 38 | 40 |
  |---|---|---|---|---|---|---|---|---|---|---|
  | scaled | 31 | 31 | 35 | 40 | 44 | 49 | 54 | 60 | 65 | 68 |
- Produces: `estimateTotal(l: number, s: number, r: number): number` = `Math.round((l + s + r) * 10 / 3)`.

- [ ] **Step 1: Write the failing tests.**

  Stats tests:
  - accuracy uses only the last 30 attempts per pattern
  - weakest ordering
  - patterns with n < 5 are listed first
  - over 10,000 samples, a pattern at 40% accuracy is drawn more often than one at 90%

  Score tests:
  - `rawToScaledStructure(40) === 68`, `(35) === 60`, `(0) === 31`
  - the function is non-decreasing over 0..40
  - `estimateTotal(45,45,45) === 450`, `estimateTotal(60,60,60) === 600`
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Commit.** `git commit -am "feat: pattern stats, weakest-pattern weighting, score estimate"`

### Task 7: Question generator (framework + weeks 1–2 patterns)

**Files:**
- Create: `src/generator/index.ts`, `src/generator/lexicon.ts` (shared slot fillers with agreement metadata), and `src/generator/templates/P01.ts`…`P06.ts`
- Test: `tests/generator/generator.test.ts`

**Interfaces:**
- Consumes: `Question`, `createRng`, `shuffle`, `validateContent`.
- Produces:
  - `interface Template { patternId: PatternId; type: QuestionType; build(rng: () => number): Omit<Question, 'id' | 'source'> }`. Each template builds the correct sentence and the distractors from structured slots, so the answer is correct by construction.
  - `hasGenerator(p: PatternId): boolean`
  - `generate(patternId: PatternId, count: number, seed: number): Question[]`. The ids are `gen-<patternId>-<seed>-<i>`, the source is `'generated'`, and it throws for patterns with no generator.
- Lexicon slots are academic-register nouns, verbs and phrases with number, tense and countability tags, so agreement can be computed rather than guessed.

- [ ] **Step 1: Write the failing tests.** For every pattern where `hasGenerator` is true in P01–P06, across 200 seeds:
  - the output passes `validateContent`
  - the 4 options are distinct
  - the stem has no leftover `{slot}` tokens other than the WE markers
  - the same seed produces the same output
  - both `structure` and `written-expression` items are produced across seeds
  - `generate('P18', …)` throws

  There is also a snapshot test that prints 3 sample items per pattern into a review file at `tests/generator/__samples__.txt`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement** the framework and templates for P01–P06. Aim for at least 3 Structure templates and 3 WE templates per pattern. Distractors must be the classic ITP traps for that pattern, for example a missing verb, a doubled subject, wrong agreement with a distracting phrase, or a wrong tense with a time expression.
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Quality gate.** Dispatch a fresh reviewer agent to read `__samples__.txt` (regenerate it with 20 samples per pattern). The reviewer flags any item that is ungrammatical where it should be correct, has more than one defensible answer, or reads as absurd. Fix the templates, then re-run until no flags remain.
- [ ] **Step 6: Commit.** `git commit -am "feat: template question generator for P01-P06"`

### Task 8: Session builders

**Files:**
- Create: `src/session/build.ts`
- Test: `tests/session/build.test.ts`

**Interfaces:**
- Consumes: `todayPlan`, `weightedPatternSample`, `generate`, `hasGenerator`, `pick` and `shuffle`, plus content from `src/content/index.ts`. That module exports `drillItems(p: PatternId): Question[]`, `mockForm(n: number): Question[]`, `availableMockForms(): number[]`, `allWords(): Word[]` and `lesson(p: PatternId): string`.
- Produces:
  - `buildMorningDrill(p: PatternId, seed: number): Question[]`. It returns 15 items: 5 from the drill pool plus 10 generated. If the pattern has no generator, all 15 come from the drill pool (or as many as exist).
  - `buildAfternoonSet(studied: PatternId[], stats, seed: number): { questions: Question[]; timeLimitMs: number }`. It returns 20 items in real order (Structure first, then WE), drawn by weighted sample from drill and generated items, with `timeLimitMs = 20 × 37_000`.
    - **Weeks 9–12:** studied = all patterns.
    - **If studied is empty** (the afternoon of day 1): use P01.
  - `buildMock(history: MockResult[]): { form: number; questions: Question[]; repeat: boolean; timeLimitMs: 1_500_000 }`. It picks the lowest-numbered form not yet taken. When every available form has been taken, it picks the least recently taken form and sets `repeat: true`.
  - `buildNewSet(p: PatternId | 'mixed', studied: PatternId[], seed: number): Question[]`. It returns 15 items, all generated when possible. Patterns with no generator get shuffled drill-pool items.
  - **Every builder except `buildMock` must never return a `source === 'mock'` item.**

- [ ] **Step 1: Write the failing tests:**
  - morning drill has 15 items with 5 drill and 10 generated
  - a no-generator pattern gets drill items only
  - the afternoon set puts Structure before WE and has a time limit of 740,000 ms
  - `buildMock` rotates forms 1, 2, … and then sets the repeat flag
  - the mock has 40 items, Q1–15 Structure and Q16–40 WE
  - across 500 seeds, no drill, afternoon or new-set output contains a mock item
  - day-1 afternoon with no studied patterns falls back to P01
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.** Use small fixture content injected through a `content` parameter, defaulting to the real content index, so the tests don't depend on the final bank size.
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Commit.** `git commit -am "feat: session builders for morning, afternoon, mock, new set"`

### Task 9: Question player and timer (UI core)

**Files:**
- Create: `src/ui/QuestionPlayer.tsx`, `src/ui/useDeadline.ts`, `src/ui/QuestionView.tsx` (renders `____` as a blank, and `{0}`–`{3}` as underlined parts labelled A–D), `src/ui/ReviewList.tsx`, `src/ui/styles.css`
- Test: `tests/ui/QuestionPlayer.test.tsx`, `tests/ui/useDeadline.test.ts`

**Interfaces:**
- Consumes: `ProgressStore` (`recordAttempt`, `saveDraft`, `clearDraft`) and `Question`.
- Produces: `<QuestionPlayer store kind questions timeLimitMs? draft? onFinish={(r: { answers: Record<string, number>; correct: number; total: number; ms: number }) => void} />`. It:
  - shows one question at a time with 4 large option buttons
  - records an `Attempt` on each answer, saving the draft after every answer
  - shows a countdown and the per-question pace against 37 s when there is a time limit
  - when time runs out, counts unanswered questions as wrong and finishes
- Produces: `useDeadline(deadlineAt: number | null): { remainingMs: number; expired: boolean }`. It computes from `Date.now()` on every tick and on `visibilitychange`.
- Produces: `<ReviewList questions answers />`. It shows the wrong answers with the correct option and the explanation.

- [ ] **Step 1: Write the failing tests:**
  - `records an attempt and saves draft after each answer`
  - `resuming with a draft starts at the first unanswered question`
  - `useDeadline reports expired after system time jumps past deadline while hidden`, using `vi.setSystemTime` with no timer ticks in between
  - `on expiry, unanswered count as wrong and onFinish fires`
  - `ReviewList shows explanation for each wrong answer`
  - `WE stem renders four underlined labelled parts`
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.** Use mobile-first CSS: a single column, max-width 640px, buttons at least 48px tall, and colour tokens in `:root` with a dark-mode override.
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Commit.** `git commit -am "feat: question player with resumable drafts and wall-clock timer"`

### Task 10: Screens, routing, vocab review, progress, settings, .ics

**Files:**
- Create:
  - `src/ui/App.tsx` (hash router: `#/`, `#/morning`, `#/afternoon`, `#/mock`, `#/newset`, `#/vocab`, `#/progress`, `#/settings`)
  - `src/ui/screens/Home.tsx`, `Morning.tsx`, `Afternoon.tsx`, `Mock.tsx`, `NewSet.tsx`, `Vocab.tsx`, `Progress.tsx`, `Settings.tsx`
  - `src/settings/ics.ts`
- Test: `tests/settings/ics.test.ts`, `tests/ui/screens.test.tsx`

**Interfaces:**
- Consumes: everything above.
- Produces: `buildReminderIcs(now: Date): string`. It is a VCALENDAR with two VEVENTs, `RRULE:FREQ=DAILY` at local 07:00 and 16:30, a 60-minute duration, a VALARM at 0 minutes, and the summaries "TOEFL morning session" and "TOEFL afternoon session".
- Screen behaviour:
  - **Home:**
    - shows "Day N · Week W", today's pattern title and the morning, afternoon and vocab cards with a done state
    - shows "Resume session" if a draft exists
    - shows the pace message from `pace()` when a test date is set, for example "At this pace you'll finish week 8 on …; the test is …"
    - shows the non-persistent storage banner when `store.persistent` is false
  - **Morning:**
    1. the vocab queue (Task 4) with Again/Hard/Good/Easy buttons
    2. the lesson (rendered markdown)
    3. the morning drill (QuestionPlayer)
    4. ReviewList, then `completeMorning`

    In the `review` phase the lesson is skipped and the drill comes from `buildNewSet('mixed', …)`.
  - **Afternoon:** the timed set, then ReviewList. In plan week ≥ 2, it shows a "Take weekly mock instead" option when no mock has been taken in the past 7 days.
  - **Mock:**
    - a start screen explaining 40 questions in 25 minutes
    - the QuestionPlayer
    - a result screen showing raw/40, "Estimated Structure score: X (31–68)" and the repeat-form note when it applies
    - it stores a `MockResult` and shows the ReviewList
  - **NewSet:** pick a studied pattern or "Mixed", then play 15.
  - **Progress:**
    - a line chart (inline SVG, no chart library) of the scaled mock scores with a target line at 60, where repeat forms use a hollow marker
    - the streak, which counts consecutive local dates with any attempt
    - the per-pattern accuracy table with the weakest 3 highlighted
    - words learned (reps ≥ 1) and words due
    - average seconds per question against 37
  - **Settings:**
    - new words per day (5–40)
    - test date (optional, can be cleared)
    - Export backup (downloads JSON) and Import backup (file input, showing the ImportError message)
    - Add reminders to calendar (downloads `.ics`)

- [ ] **Step 1: Write the failing tests.**

  Calendar test: the output contains two `RRULE:FREQ=DAILY` lines and `DTSTART` times ending `T070000` and `T163000`.

  Screen tests:
  - Home shows "Day 1 · Week 1" and the P01 title on first run
  - Home shows the storage banner with the memory store
  - Home shows "Resume session" when a draft exists
  - the Settings import of an invalid file shows an error and keeps the data
  - the Progress chart marks repeat forms
  - completing the morning flow advances to Day 2 only on the next date
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement the screens.**
- [ ] **Step 4: Run** `npm test`. Expected: all PASS. Run `npm run build`, which should succeed.
- [ ] **Step 5: Manual check.**
  1. Run `npm run dev -- --host` and open it at 360px width in browser devtools.
  2. Walk through a morning session, an afternoon set and a mock with the timer.
  3. Confirm there is no horizontal scroll and that dark mode works.
- [ ] **Step 6: Commit.** `git commit -am "feat: screens, progress chart, settings, calendar reminders"`

### Task 11: First-release content (weeks 1–2, mock form 1, 150 words)

**Files:**
- Create:
  - `src/content/lessons/P01.md`…`P06.md`
  - `src/content/questions/P01.json`…`P06.json`. Each has about 10 drill items, roughly half Structure and half WE. Patterns without a generator have about 16.
  - `src/content/mocks/form1.json`. It has 40 items balanced across all 25 patterns, as a baseline diagnostic: 15 Structure then 25 WE.
  - `src/content/awl/words.json`. It holds the first 150 AWL headwords in sublist order, each with its pos, a learner-friendly definition, 2 academic example sentences and its family forms.
  - `src/content/index.ts`
- Test: `tests/content/realContent.test.ts`

**Interfaces:**
- Consumes: `validateContent` and `PATTERNS`.
- Produces: the `src/content/index.ts` exports listed in Task 8.

- [ ] **Step 1: Write the failing test** `real content is valid and complete for release 1`. It asserts that:
  - `validateContent(realContent)` returns `[]`
  - P01–P06 each have at least 10 drill items, and at least 16 if `hasGenerator` is false
  - form 1 has exactly 40 items, with Q1–15 Structure
  - there are at least 150 words with no duplicate headwords
  - each example sentence contains the headword or one of its forms (case-insensitive)
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Write the content and lessons.** Each lesson is under 400 words, with a rule, 3 examples and "TOEFL traps to watch for". Every item has a one-to-three-sentence explanation of why the answer is right and why the trap is wrong.
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Verification pass.**
  - Dispatch a fresh reviewer agent with only the content files. It checks every item for the right answer key, exactly one defensible answer, a grammatical correct version and an accurate explanation, and every word entry for an accurate definition and natural examples.
  - Fix or delete every flagged item.
  - Re-run the reviewer on the changed items until it has nothing left to flag.
  - Re-run `npm test`.
- [ ] **Step 6: Commit.** `git commit -am "content: release 1 (P01-P06, mock form 1, AWL 1-150)"`

### Task 12: PWA offline packaging and deploy guide

**Files:**
- Modify: `vite.config.ts`. Add `VitePWA({ registerType: 'autoUpdate', manifest: { name: 'TOEFL ITP Prep', short_name: 'ITP Prep', display: 'standalone', start_url: '.', icons: [192, 512] }, workbox: { globPatterns: ['**/*.{js,css,html,json,md,svg,png}'] } })` and `base: './'`.
- Create: `public/icon-192.png`, `public/icon-512.png` (a simple generated icon) and `README.md`. The README covers deploying to GitHub Pages, with Netlify drag-and-drop as the alternative, and adding the app to the home screen on iOS Safari and Android Chrome.

- [ ] **Step 1: Build.** Run `npm run build`. Expected: `dist/` contains `manifest.webmanifest` and `sw.js`.
- [ ] **Step 2: Check offline.**
  1. Run `npm run preview -- --host`. Load the app once.
  2. In devtools, set the Network tab to Offline and reload.
  3. Expected: the app loads, and a morning session can be started.
- [ ] **Step 3: Commit.** `git commit -am "feat: installable offline PWA and deploy guide"`

### Task 13 (recurring, one per week ahead of the learner): Content batches 2–8

This repeats Task 11's steps for each later batch. Patterns are scheduled in the order of spec §7:
- **Batch 2:** patterns for weeks 3–4, plus mock form 2 and AWL words 151–300
- **Batch 3:** weeks 5–6, plus form 3 and words 301–450
- **Batch 4:** weeks 7–8, plus form 4 and words 451–570
- **Batches 5–6:** mock forms 5 and 6

Generator templates for each new pattern with `hasGenerator: true` follow the steps of Task 7, including its sample-review quality gate. Each batch extends the `realContent` test's expectations. Each batch must be committed before the learner reaches it, which means at least 7 calendar days ahead of the plan.

---

## Self-review notes

- **Spec coverage:**
  - §2 goals 1–7 → Tasks 5, 8, 10, 7+11, 3+4, 6+10, 12
  - §4 anti-goals → validator (Task 1), generator quality gate (Task 7), content verification (Task 11), Review Focus, "Estimated" label (Task 10)
  - §8 rollout → Tasks 11 and 13
  - §8 reminders → Task 10
  - §9 pacing → Task 5 plus Home
  - Backup → Task 2 plus Settings
- **Types:** `Attempt`, `CardState`, `PlanState`, `Settings`, `MockResult`, `SessionDraft` and `BackupV1` are defined in Task 2 and reused by name. `Question`, `Pattern`, `Word` and `PatternId` are defined in Task 1.
