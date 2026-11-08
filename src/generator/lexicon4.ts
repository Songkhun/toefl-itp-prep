/*
 * Lexicon for patterns P20, P23, P24, P25. Notation: [text] marks an optional underline candidate.
 * Facts stated as true must be true; keep wording cautious.
 */
import { V, type Verb } from './build';

/* ---------- P20 adjectives versus adverbs ---------- */
/** adj / adv / noun of one word family. Adjectives here are never used as "flat" adverbs. */
export interface AdvFact { subj: string; verb: string; adj: string; adv: string; noun: string; rest: string }
/** An action verb, modified by an adverb. */
export const ADV_AFTER_VERB: AdvFact[] = [
  { subj: 'The [population] of the [city]', verb: 'increased', adj: 'rapid', adv: 'rapidly', noun: 'rapidity', rest: '[after] the [war]' },
  { subj: 'The [surgeon]', verb: 'operated', adj: 'careful', adv: 'carefully', noun: 'care', rest: '[on] the injured [patient]' },
  { subj: 'Food [prices]', verb: 'rose', adj: 'sharp', adv: 'sharply', noun: 'sharpness', rest: '[during] the [drought]' },
  { subj: 'The [witness]', verb: 'answered', adj: 'calm', adv: 'calmly', noun: 'calmness', rest: '[during] the [trial]' },
  { subj: 'The new [engine]', verb: 'runs', adj: 'efficient', adv: 'efficiently', noun: 'efficiency', rest: '[in] cold [weather]' },
  { subj: 'The [volcano]', verb: 'erupts', adj: 'frequent', adv: 'frequently', noun: 'frequency', rest: '[but] rarely [causes] damage' },
  { subj: 'The island [economy]', verb: 'depends', adj: 'heavy', adv: 'heavily', noun: 'heaviness', rest: '[on] [tourism]' },
];
/** A linking verb, followed by an adjective. */
export const ADJ_AFTER_LINK: AdvFact[] = [
  { subj: 'The [water] in the mountain [lake]', verb: 'looks', adj: 'clear', adv: 'clearly', noun: 'clarity', rest: '[even] in [winter]' },
  { subj: 'The [results] of the [survey]', verb: 'seemed', adj: 'surprising', adv: 'surprisingly', noun: 'surprise', rest: '[to] most [economists]' },
  { subj: 'The old [bridge]', verb: 'remains', adj: 'safe', adv: 'safely', noun: 'safety', rest: '[for] light [traffic]' },
  { subj: 'The [air] in the [desert]', verb: 'feels', adj: 'cool', adv: 'coolly', noun: 'coolness', rest: '[at] [night]' },
  { subj: 'The [patient]', verb: 'became', adj: 'calm', adv: 'calmly', noun: 'calmness', rest: '[after] the [treatment]' },
  { subj: 'The [explanation] in the [textbook]', verb: 'sounds', adj: 'reasonable', adv: 'reasonably', noun: 'reason', rest: '[to] most [readers]' },
];

/* ---------- P23 paired conjunctions ---------- */
export type PairKind = 'both' | 'either' | 'neither' | 'notOnly';
export interface Pair { kind: PairKind; pre: string; x: string; y: string }
export const PAIRS: Pair[] = [
  { kind: 'both', pre: 'The [region] is famous', x: 'for its [wine]', y: '[for] its [cheese]' },
  { kind: 'both', pre: 'The [disease] [affects]', x: 'young [children]', y: '[older] [adults]' },
  { kind: 'both', pre: 'The [gallery] [displays]', x: '[paintings]', y: '[sculptures]' },
  { kind: 'either', pre: 'Visitors [can] [enter]', x: 'through the main [gate]', y: 'through the [side] [door]' },
  { kind: 'either', pre: 'Applications [may] be [submitted]', x: '[online]', y: '[by] [mail]' },
  { kind: 'either', pre: 'The [experiment] [can] be done', x: 'in the [morning]', y: 'in the [evening]' },
  { kind: 'neither', pre: 'The early [settlers] [had]', x: '[electricity]', y: '[running] [water]' },
  { kind: 'neither', pre: 'The new [drug] [is]', x: '[cheap]', y: 'widely [available]' },
  { kind: 'notOnly', pre: '[Bamboo] [is]', x: '[strong]', y: '[flexible]' },
  { kind: 'notOnly', pre: '[Honeybees] [provide]', x: '[honey]', y: '[pollination] for many crops' },
  { kind: 'notOnly', pre: 'The [festival] [attracts]', x: 'local [residents]', y: '[tourists] from [abroad]' },
];
export const PAIR_WORDS: Record<PairKind, { first: string; second: string; wrong: [string, string, string]; rule: string }> = {
  both: { first: 'both', second: 'and', wrong: ['or', 'nor', 'but'], rule: '"Both" is always paired with "and"' },
  either: { first: 'either', second: 'or', wrong: ['and', 'nor', 'but also'], rule: '"Either" is always paired with "or"' },
  neither: { first: 'neither', second: 'nor', wrong: ['or', 'and', 'but'], rule: '"Neither" is always paired with "nor"' },
  notOnly: { first: 'not only', second: 'but also', wrong: ['and also', 'or also', 'nor'], rule: '"Not only" is paired with "but (also)"' },
};

/* ---------- P24 causatives ---------- */
/** make / let / have + object + base verb. */
export interface Causative { subj: string; verb: string; obj: string; comp: Verb; rest: string }
export const CAUS_BASE: Causative[] = [
  { subj: 'The [professor]', verb: 'made', obj: 'the [students]', comp: V('rewrite', 'rewrites', 'rewrote', 'rewritten', 'rewriting'), rest: 'their [essays] [twice]' },
  { subj: 'The [zookeepers]', verb: 'let', obj: 'the [visitors]', comp: V('feed', 'feeds', 'fed', 'fed', 'feeding'), rest: 'the [goats] [by] hand' },
  { subj: 'The [teacher]', verb: 'had', obj: 'each [student]', comp: V('recite', 'recites', 'recited', 'recited', 'reciting'), rest: 'a [poem] [aloud]' },
  { subj: 'The [coach]', verb: 'made', obj: 'the [players]', comp: V('run', 'runs', 'ran', 'run', 'running'), rest: 'extra [laps] [after] practice' },
  { subj: 'Some [parents]', verb: 'let', obj: 'their [children]', comp: V('choose', 'chooses', 'chose', 'chosen', 'choosing'), rest: 'their own [books]' },
  { subj: 'The [doctor]', verb: 'had', obj: 'the [patient]', comp: V('describe', 'describes', 'described', 'described', 'describing'), rest: 'the [pain] [carefully]' },
];
/** get + object + to-infinitive. */
export const CAUS_GET: Causative[] = [
  { subj: 'The [residents]', verb: 'got', obj: 'the [city]', comp: V('repair', 'repairs', 'repaired', 'repaired', 'repairing'), rest: 'the [broken] [streetlights]' },
  { subj: 'The [manager]', verb: 'got', obj: 'the [workers]', comp: V('accept', 'accepts', 'accepted', 'accepted', 'accepting'), rest: 'the new [schedule]' },
  { subj: 'The [author]', verb: 'got', obj: 'a famous [scientist]', comp: V('write', 'writes', 'wrote', 'written', 'writing'), rest: 'the [introduction] [to] the book' },
];
/** have + thing + past participle. The thing can never do the action itself. */
export const CAUS_PASSIVE: Causative[] = [
  { subj: 'The [owners]', verb: 'had', obj: 'the [roof]', comp: V('repair', 'repairs', 'repaired', 'repaired', 'repairing'), rest: '[after] the [storm]' },
  { subj: 'The [gallery]', verb: 'had', obj: 'the old [painting]', comp: V('restore', 'restores', 'restored', 'restored', 'restoring'), rest: 'by an [expert]' },
  { subj: 'The [driver]', verb: 'had', obj: 'the [brakes]', comp: V('check', 'checks', 'checked', 'checked', 'checking'), rest: '[before] the long [trip]' },
  { subj: 'The [publisher]', verb: 'had', obj: 'the [novel]', comp: V('translate', 'translates', 'translated', 'translated', 'translating'), rest: 'into [Spanish]' },
];

/* ---------- P25 subjunctive ---------- */
/** Triggers that take only a subjunctive (never a factual) that-clause. Subjects are singular, so the base form is visible. */
export interface Subjunctive { trigger: string; subj: string; verb: Verb; rest: string }
export const SUBJUNCTIVE: Subjunctive[] = [
  { trigger: 'The [doctor] [recommended] that', subj: 'the [patient]', verb: V('drink', 'drinks', 'drank', 'drunk', 'drinking'), rest: '[more] [water]' },
  { trigger: 'It is [essential] that', subj: 'every [applicant]', verb: V('submit', 'submits', 'submitted', 'submitted', 'submitting'), rest: '[two] [photographs]' },
  { trigger: 'The [law] [requires] that', subj: 'each [driver]', verb: V('carry', 'carries', 'carried', 'carried', 'carrying'), rest: 'a [valid] [license]' },
  { trigger: 'It is [imperative] that', subj: 'the [sample]', verb: V('be', 'is', 'was', 'been', 'being'), rest: '[kept] [cold]' },
  { trigger: 'The [manager] [demanded] that', subj: 'the [report]', verb: V('be', 'is', 'was', 'been', 'being'), rest: '[finished] by [Friday]' },
  { trigger: 'The pool [rules] [require] that', subj: 'every [swimmer]', verb: V('wear', 'wears', 'wore', 'worn', 'wearing'), rest: 'a [cap]' },
  { trigger: 'It is [necessary] that', subj: 'each [visitor]', verb: V('register', 'registers', 'registered', 'registered', 'registering'), rest: '[at] the front [desk]' },
  { trigger: 'The [committee] [proposed] that', subj: 'the [city]', verb: V('build', 'builds', 'built', 'built', 'building'), rest: 'a [new] [library]' },
  { trigger: 'The [teacher] [asked] that', subj: 'each [student]', verb: V('bring', 'brings', 'brought', 'brought', 'bringing'), rest: 'a [dictionary] to class' },
  { trigger: 'It is [vital] that', subj: 'a [pilot]', verb: V('follow', 'follows', 'followed', 'followed', 'following'), rest: 'the safety [checklist]' },
  { trigger: 'The [judge] [ordered] that', subj: 'the [tenant]', verb: V('pay', 'pays', 'paid', 'paid', 'paying'), rest: 'the [rent] [immediately]' },
  { trigger: 'The [coach] [advised] that', subj: 'every [athlete]', verb: V('rest', 'rests', 'rested', 'rested', 'resting'), rest: 'before the [race]' },
  { trigger: 'It is [advisable] that', subj: 'a [traveler]', verb: V('carry', 'carries', 'carried', 'carried', 'carrying'), rest: 'some local [currency]' },
];
