# TOEFL ITP Prep App — Design

Date: 2026-11-08
Status: Draft for approval

## 1. Intent and why

A personal web app, used on a phone, to help one learner raise their **TOEFL ITP (Level 1)** score from about **450 to at least 600** in about **3 months** (test around early February 2027).

The learner's main worries are **grammar and vocabulary**. On TOEFL ITP these show up as:
- **Section 2: Structure & Written Expression.** It has 40 four-option multiple-choice questions in 25 minutes, so about 37 seconds each.
  - Q1–15 are *Structure*: complete the sentence.
  - Q16–40 are *Written Expression*: choose the underlined part that is wrong.
  - The section is scored 31–68.
- **Academic vocabulary.** It is needed mainly for Section 3 (Reading).

**Score context:** the total score is the sum of the three section scores × 10 / 3. A score of 450 means an average of about 45 per section, and 600 needs about 60 per section. Structure is the fastest section to raise, because it tests a limited, recurring set of grammar patterns (about 25). Many of its traps are distracting phrases that hide the real subject or verb.

**Why the app is shaped this way:**
- The learner has two fixed daily study windows, **07:00–08:00** and **16:30–17:30**, on their **phone**. The app should feel like a daily routine with a clear "today's session", not a question bank to browse.
- Vocabulary learning uses **spaced retrieval**: the learner tries to recall a word, then sees it again over increasing intervals. Research supports retrieval spread over 3 or more sessions over rereading. Choosing the Academic Word List (AWL) as the word source is a judgment call, not a research finding.
- Speed matters as much as accuracy (37 seconds per question), so timed practice is a first-class feature.

## 2. Goals

1. A **12-week plan** that walks through all the core grammar patterns, then moves to mixed timed practice and drilling the weakest patterns.
2. **Daily sessions** matched to the two time windows:
   - **Morning session (about 45–60 min):**
     1. Vocabulary reviews due today, then new words. The daily new-word limit has a default of 15 and can be changed in Settings.
     2. Today's grammar pattern: a short English explanation with examples, then about 15 drill questions on that pattern.
   - **Afternoon session (about 45–60 min):**
     1. A timed mixed grammar set in the real test format and pace, built from patterns already studied, with the weakest patterns weighted higher.
     2. A mistake review with an explanation for every wrong answer.
   - **Weekly mock (replaces one afternoon session per week, user can trigger anytime):** a full 40-question Structure & Written Expression section in 25 minutes, taken only from the hand-written bank. The result is an **estimated section score on the 31–68 scale**.
3. **Two question sources, both free and offline:**
   - **Built-in bank (hand-written):** about 400 grammar questions, with about 16 per pattern across about 25 patterns. They cover both Structure and Written Expression formats, and each has a correct answer, the pattern it tests, and an English explanation.
   - **"New set" generator (template-based):** for each pattern, sentence templates with slots (subjects, verbs, distracting phrases, tenses and so on) plus rules that build the correct answer and plausible wrong options. Choices are shuffled. The learner can press **"New set"** anytime to get fresh practice for a chosen pattern or a mixed set. Generated questions are clearly drill-quality and are **never used in mock tests**.
4. **Vocabulary:** the about 570 AWL headword families. Each entry has:
   - the headword and its part of speech
   - a short English definition
   - 1–2 academic example sentences
   - the common word-family forms (for example analyse / analysis / analytical)

   Card types are word → meaning, meaning → word, and fill in the blank in a sentence. Learners grade themselves (Again / Hard / Good / Easy), and a spaced-repetition scheduler sets the next review.
5. **Progress view:**
   - an estimated Structure score over time from the weekly mocks, with a target line at 60
   - a day streak
   - accuracy for each grammar pattern, with a "weakest patterns" list
   - words learned and words due
   - average seconds per question compared with the 37-second target
6. **Feedback loop:** the weakest patterns (lowest recent accuracy) get more weight in afternoon sets and are suggested for "New set" drills.
7. **Works offline on a phone:** it installs to the home screen as a Progressive Web App (PWA), and all content and logic run on the device.

## 3. Non-goals (version 1)

- No Listening or Reading section practice. The data model and navigation leave room to add them later.
- No AI-generated questions. A future optional "Generate with AI" button would need the user's own API key, and nothing in v1 depends on it.
- No accounts, login, server, or cloud sync. Progress lives on the device.
- No multi-user, teacher, or class features.
- No Thai-language explanations. All learning content is in English.
- No full-length three-section mock tests.

## 4. Anti-goals (would make it a failure even if it "works")

- **Inaccurate content.** A wrong answer key or a grammatically incorrect "correct" sentence teaches the wrong thing. Every hand-written item must be checked, and generated items must come from templates that are correct by construction.
- **Generated questions that look nothing like the test.** For example, nonsense sentences or obviously absurd distractors.
- **Friction on a phone.** Tiny tap targets, horizontal scrolling, needing a desktop, or needing a connection to study.
- **Losing progress** without warning, for example when the browser clears storage.
- **Pretending precision.** The score estimate must be labelled as an *estimate*, because ETS does not publish an official raw-to-scaled conversion table for ITP.

## 5. Constraints

- **Device:** a modern phone browser (iOS Safari and Android Chrome) at phone width. A laptop should also work.
- **Offline:** after the first load, everything works with no network.
- **Cost:** free to run. The app is a static site with no paid services.
- **Timeline:** the test is about 3 months away, so the first usable version should arrive quickly, ideally within days. Content can keep growing after that.
- **Language:** English UI and content.

## 6. Decisions already made

| Decision | Made by |
|---|---|
| TOEFL ITP Level 1, 450 → 600, test in about 3 months | User |
| Focus on grammar (Structure & Written Expression) and vocabulary | User |
| Phone, used 07:00–08:00 and 16:30–17:30 | User |
| Built-in hand-written bank plus a free template "New set" generator, no AI in v1 | User |
| Explanations in English | User |
| Listening/Reading out of v1 | Claude's call, user did not object |
| Installable offline PWA, data stored on device, no login | Claude's call, user did not object |
| AWL as the vocabulary source | Claude's call |
| Weekly mock uses hand-written items only | Claude's call |

## 7. Grammar pattern list (starting point)

Roughly ordered for the 12-week plan. The builder may merge or split patterns but should keep about 25.

1. Subject + verb: missing subject or missing verb
2. Subject–verb agreement, including distracting phrases between them
3. Verb tenses and time expressions
4. Passive voice
5. Adjective clauses (who / which / that / whose; reduced clauses)
6. Noun clauses (that / what / whether / wh-)
7. Adverb clauses and connectors (although, because, despite / in spite of)
8. Reduced adverb clauses and participle phrases
9. Appositives
10. Parallel structure
11. Comparatives and superlatives
12. Inverted subject–verb order (after negatives, "only", "so/neither", conditionals without "if")
13. Conditionals and wishes
14. Gerunds versus infinitives
15. Modals and verb forms after modals
16. Pronouns (form, agreement, and reference)
17. Singular/plural nouns and countable/uncountable nouns
18. Articles (a / an / the)
19. Word form: noun, verb, adjective, or adverb
20. Adjectives versus adverbs
21. Prepositions and fixed phrases
22. Redundancy and wrong word (do versus make, like versus alike)
23. Coordinate and paired conjunctions (both…and, either…or, not only…but also)
24. Causatives and "make/let/have"
25. Subjunctive (recommend that he *go*)

**Plan:**
- **Weeks 1–8:** introduce about 3 patterns per week, one per morning, with the rest of the days used for review.
- **Weeks 9–12:** mixed timed practice, focused on the weakest patterns, plus extra mocks.

## 8. Content, sources and rollout (Claude's calls after builder review)

- **Who writes and checks content.** Claude drafts all hand-written items and AWL entries. Every batch then gets an **independent verification pass** by a separate reviewer agent, which checks:
  - each answer key
  - that exactly one option is correct
  - that the correct sentence is grammatical
  - that the explanation is accurate

  Items that fail are fixed or dropped. The learner is not expected to check grammar themselves, since they are the one learning it.
- **Rollout in slices.** The first usable release ships the app plus checked content for weeks 1–2 (about 6 patterns) and the first about 150 AWL words. The remaining content is added week by week, always at least one week ahead of the plan.
- **Bank split.** The hand-written bank is split into two pools:
  - **Drill pool:** about 10 items per pattern, so about 250.
  - **Mock-only pool:** about 240 items, which is 6 distinct 40-item mock forms balanced across patterns and question types.

  Mock items never appear in drills. Weekly mocks rotate through the 6 forms. After all 6 have been used, forms repeat, and a repeated mock is marked "repeat form" on the score chart, so you know it may be inflated.
- **Where each session's questions come from:**
  - **Morning drill (about 15):** about 5 from the drill pool for today's pattern, plus about 10 from the generator.
  - **Afternoon timed set:** a mix of drill-pool and generated items from patterns already studied, weighted toward the weakest.
  - **Fallback:** for patterns with no generator, all drill items come from the drill pool, and that pattern gets about 16 drill items instead of 10.
- **Generator coverage.** The generator ships only for patterns where templates are reliably correct. Patterns 18 (Articles), 21 (Prepositions/fixed phrases), 22 (Redundancy/wrong word) and possibly 19 (Word form) may have no generator. For those, "New set" reshuffles drill-pool items instead.
- **Reminders.** No push notifications, since those need a server. Instead, Settings offers a one-tap **calendar file (.ics)** with daily repeating reminders at 07:00 and 16:30, which the user adds to their phone calendar.

## 9. Plan pacing (user decision)

- **The plan advances one study day at a time and pauses when days are missed** (user's decision). Missed days are never skipped, and no content is lost.
- **Test date:** the exact date is unknown for now, so it is an *optional* field in Settings.
  - **Claude's call:** once a test date is set, the Home screen shows whether you are on pace. For example: "At this pace you'll finish week 8 on Jan 20; the test is Feb 5." This is only a message. It never skips ahead on its own.
- **Stored state:** the plan start date, the current plan day, and the optional test date.

## 10. Left to the builder

- **Framework and tooling.** One suggestion: a static site built with Vite and TypeScript (React or none), on-device storage in IndexedDB, and a service worker for offline use. Any equivalent works if it meets the constraints.
- **Spaced-repetition algorithm.** SM-2 or FSRS are both fine.
- **Score estimation method.** Map raw correct answers out of 40 to an estimated 31–68 score using a reasonable approximation. Published prep-book conversion tables are an acceptable basis. Label it as an estimate.
- **Template design for the generator,** for each pattern.
- **Visual design,** within the phone-first and accessibility expectations (large tap targets, readable type, light and dark mode).
- **Hosting.** A free static host such as GitHub Pages, Netlify, or Cloudflare Pages. Pick one, and document the steps for the user to deploy and install it on their phone.
- **Backup.** Export and import of progress as a JSON file from Settings, to guard against browser storage being cleared.
- **Timer details,** such as showing a countdown and per-question pace in timed sets.
