import { V, type Verb } from './build';

/*
 * Notation: [text] marks a word that may be underlined in Written Expression items.
 * Facts are chosen so that sentences read naturally with the frames that use them.
 */

/** Habitual "institution does something" facts (present simple, no time phrase). */
export interface ActiveFact { sg: string; pl: string; verb: Verb; rest: string }
export const ACTIVE_FACTS: ActiveFact[] = [
  { sg: 'The [library]', pl: '[Libraries]', verb: V('offer', 'offers', 'offered', 'offered', 'offering'), rest: 'free [courses] [in] computer skills' },
  { sg: 'The [museum]', pl: '[Museums]', verb: V('attract', 'attracts', 'attracted', 'attracted', 'attracting'), rest: 'large [numbers] of [visitors]' },
  { sg: 'The [company]', pl: '[Companies]', verb: V('export', 'exports', 'exported', 'exported', 'exporting'), rest: 'electronic [equipment] [to] Asia' },
  { sg: 'The [hospital]', pl: '[Hospitals]', verb: V('train', 'trains', 'trained', 'trained', 'training'), rest: 'nurses [in] [emergency] care' },
  { sg: 'The [university]', pl: '[Universities]', verb: V('fund', 'funds', 'funded', 'funded', 'funding'), rest: 'medical [research] [projects]' },
  { sg: 'The [farmer]', pl: '[Farmers]', verb: V('grow', 'grows', 'grew', 'grown', 'growing'), rest: 'rice [in] the river [valley]' },
  { sg: 'The [school]', pl: '[Schools]', verb: V('teach', 'teaches', 'taught', 'taught', 'teaching'), rest: 'students [about] local [history]' },
  { sg: 'The [newspaper]', pl: '[Newspapers]', verb: V('report', 'reports', 'reported', 'reported', 'reporting'), rest: '[on] economic [news]' },
  { sg: 'The [bakery]', pl: '[Bakeries]', verb: V('sell', 'sells', 'sold', 'sold', 'selling'), rest: 'fresh [bread] [every] morning' },
  { sg: 'The [river]', pl: '[Rivers]', verb: V('carry', 'carries', 'carried', 'carried', 'carrying'), rest: '[sediment] [toward] the sea' },
];
export const P01_FRONTS = (plural: boolean) => (plural ? ['[Today],', 'In [general],', 'In many [countries],'] : ['[Today],', 'These [days],']);

/** One-time past events (simple past with a finished time). */
export const EVENT_FACTS: ActiveFact[] = [
  { sg: 'The city [council]', pl: 'Several city [councils]', verb: V('approve', 'approves', 'approved', 'approved', 'approving'), rest: 'a new [plan] [for] the city\'s main park' },
  { sg: 'The [company]', pl: 'Both [companies]', verb: V('open', 'opens', 'opened', 'opened', 'opening'), rest: 'new [factories] [in] Asia' },
  { sg: 'The [university]', pl: 'Several [universities]', verb: V('launch', 'launches', 'launched', 'launched', 'launching'), rest: 'online [degree] [programs]' },
  { sg: 'The [government]', pl: 'Many [governments]', verb: V('introduce', 'introduces', 'introduced', 'introduced', 'introducing'), rest: 'a [tax] [on] plastic bags' },
  { sg: 'The [hospital]', pl: 'Both [hospitals]', verb: V('hire', 'hires', 'hired', 'hired', 'hiring'), rest: 'twenty new [nurses] [from] abroad' },
  { sg: 'The [museum]', pl: 'Two [museums]', verb: V('acquire', 'acquires', 'acquired', 'acquired', 'acquiring'), rest: 'a famous [painting] [by] Monet' },
];
export const PAST_TIMES = ['in 2015', 'two years ago', 'last year', 'in 2019'];

/** Ongoing states with a plausible start point (present perfect with "since"). */
export const STATE_FACTS: ActiveFact[] = [
  { sg: 'The [museum]', pl: 'These [museums]', verb: V('attract', 'attracts', 'attracted', 'attracted', 'attracting'), rest: 'visitors [from] many [countries]' },
  { sg: 'The [library]', pl: 'These [libraries]', verb: V('offer', 'offers', 'offered', 'offered', 'offering'), rest: 'free [courses] [in] computer skills' },
  { sg: 'The [hospital]', pl: 'These [hospitals]', verb: V('train', 'trains', 'trained', 'trained', 'training'), rest: 'nurses [in] [emergency] care' },
  { sg: 'The [school]', pl: 'These [schools]', verb: V('teach', 'teaches', 'taught', 'taught', 'teaching'), rest: 'students [about] local [history]' },
  { sg: 'The [company]', pl: 'These [companies]', verb: V('export', 'exports', 'exported', 'exported', 'exporting'), rest: 'electronic [equipment] [to] Asia' },
];
export const SINCE_TIMES = (plural: boolean) => (plural ? ['since the early 1990s', 'for more than twenty years'] : ['since it opened in 2005', 'since it was founded in 1998', 'since the early 1990s']);
export const REPORT_FRONTS = ['According to official [records],', 'According to the [report],'];

/** Subject–verb agreement facts: head noun, distracting phrase with the opposite number, verb options. */
export interface AgreementFact { head: string; plural: boolean; dist: string; distNoun: string; ok: string; bad: string; other: [string, string]; rest: string }
export const AGREEMENT_FACTS: AgreementFact[] = [
  { head: 'The [quality]', plural: false, dist: 'of the local [schools]', distNoun: 'schools', ok: 'has improved', bad: 'have improved', other: ['improving', 'to improve'], rest: '[greatly] in recent [years]' },
  { head: 'The [members]', plural: true, dist: 'of the planning [committee]', distNoun: 'committee', ok: 'meet', bad: 'meets', other: ['meeting', 'to meet'], rest: '[every] Thursday [morning]' },
  { head: 'The [number]', plural: false, dist: 'of international [students]', distNoun: 'students', ok: 'has increased', bad: 'have increased', other: ['increasing', 'to increase'], rest: '[steadily] since [2010]' },
  { head: 'The [results]', plural: true, dist: 'of the recent [survey]', distNoun: 'survey', ok: 'show', bad: 'shows', other: ['showing', 'to show'], rest: 'a clear [change] [in] public opinion' },
  { head: 'The [price]', plural: false, dist: 'of fresh [vegetables]', distNoun: 'vegetables', ok: 'rises', bad: 'rise', other: ['rising', 'to rise'], rest: '[sharply] in the [winter]' },
  { head: 'The [walls]', plural: true, dist: 'of the ancient [temple]', distNoun: 'temple', ok: 'are', bad: 'is', other: ['being', 'to be'], rest: 'covered [with] detailed [paintings]' },
  { head: 'A [list]', plural: false, dist: 'of the required [books]', distNoun: 'books', ok: 'is', bad: 'are', other: ['being', 'to be'], rest: 'available [at] the [library]' },
  { head: 'The [causes]', plural: true, dist: 'of the [disease]', distNoun: 'disease', ok: 'remain', bad: 'remains', other: ['remaining', 'to remain'], rest: '[largely] [unknown]' },
  { head: 'The [effect]', plural: false, dist: 'of these new [policies]', distNoun: 'policies', ok: 'is', bad: 'are', other: ['being', 'to be'], rest: '[difficult] to [measure]' },
  { head: 'The [leaders]', plural: true, dist: 'of the [organization]', distNoun: 'organization', ok: 'have agreed', bad: 'has agreed', other: ['agreeing', 'to agree'], rest: 'to [meet] again [next] year' },
];

/** Passive facts: a thing that receives the action. Verbs must not be usable without an object. */
export interface PassiveFact { subj: string; plural: boolean; verb: Verb; rest: string }
export const PASSIVE_FACTS: PassiveFact[] = [
  { subj: 'The [vaccine]', plural: false, verb: V('test', 'tests', 'tested', 'tested', 'testing'), rest: '[in] several [hospitals]' },
  { subj: 'The ancient [manuscripts]', plural: true, verb: V('discover', 'discovers', 'discovered', 'discovered', 'discovering'), rest: '[in] a [cave] near the coast' },
  { subj: 'The [bridge]', plural: false, verb: V('build', 'builds', 'built', 'built', 'building'), rest: '[across] the [river]' },
  { subj: 'The test [results]', plural: true, verb: V('publish', 'publishes', 'published', 'published', 'publishing'), rest: '[in] a scientific [journal]' },
  { subj: 'The music [festival]', plural: false, verb: V('hold', 'holds', 'held', 'held', 'holding'), rest: '[in] the main [square]' },
  { subj: 'The [paintings]', plural: true, verb: V('steal', 'steals', 'stole', 'stolen', 'stealing'), rest: '[from] a [gallery] in London' },
  { subj: 'The new [law]', plural: false, verb: V('approve', 'approves', 'approved', 'approved', 'approving'), rest: '[by] the national [parliament]' },
  { subj: 'Several new [species]', plural: true, verb: V('identify', 'identifies', 'identified', 'identified', 'identifying'), rest: '[in] the [rainforest]' },
  { subj: 'The old [factory]', plural: false, verb: V('demolish', 'demolishes', 'demolished', 'demolished', 'demolishing'), rest: '[to] make room [for] new housing' },
  { subj: 'The [letters]', plural: true, verb: V('donate', 'donates', 'donated', 'donated', 'donating'), rest: '[to] the city [museum]' },
  { subj: 'The [castle]', plural: false, verb: V('restore', 'restores', 'restored', 'restored', 'restoring'), rest: '[with] money [from] private donors' },
  { subj: 'The [documents]', plural: true, verb: V('translate', 'translates', 'translated', 'translated', 'translating'), rest: '[into] several [languages]' },
];

/** Adjective-clause facts. clause starts with its verb; clause and main carry [markers]. */
export interface RelFact { head: string; human: boolean; plural: boolean; clause: string; main: string }
export const REL_FACTS: RelFact[] = [
  { head: 'The [scientist]', human: true, plural: false, clause: 'discovered the new [element]', main: 'received an [international] [award]' },
  { head: 'The [architect]', human: true, plural: false, clause: 'designed the [museum]', main: 'was born [in] [Spain]' },
  { head: 'The [students]', human: true, plural: true, clause: 'completed the [course]', main: 'received a [certificate] [from] the dean' },
  { head: 'The [author]', human: true, plural: false, clause: 'wrote this [novel]', main: 'lives [in] a small [village]' },
  { head: 'The [engineers]', human: true, plural: true, clause: 'built the [dam]', main: 'worked [on] it for five [years]' },
  { head: 'The [bridge]', human: false, plural: false, clause: 'connects the two [islands]', main: 'was [built] in [1932]' },
  { head: 'The [river]', human: false, plural: false, clause: 'flows through the [city]', main: '[often] floods [in] spring' },
  { head: 'The [machines]', human: false, plural: true, clause: 'produce the [parts]', main: 'were [made] in [Germany]' },
  { head: 'The [policy]', human: false, plural: false, clause: 'reduced air [pollution]', main: 'was [introduced] in [2012]' },
  { head: 'The [trains]', human: false, plural: true, clause: 'run between the two [cities]', main: 'are [often] [crowded]' },
];

export interface WhoseFact { head: string; owned: string; ownedPlural: boolean; rest: string; main: string }
export const WHOSE_FACTS: WhoseFact[] = [
  { head: 'The [author]', owned: 'novel', ownedPlural: false, rest: 'won the prize', main: 'gave a public [lecture]' },
  { head: 'The [company]', owned: 'products', ownedPlural: true, rest: 'are sold worldwide', main: 'employs over ten thousand [people]' },
  { head: 'The [student]', owned: 'essay', ownedPlural: false, rest: 'was selected', main: 'will read it at the [ceremony]' },
  { head: 'The [farmers]', owned: 'crops', ownedPlural: true, rest: 'were damaged', main: 'received help from the [government]' },
];

/** Noun-clause facts. */
export const NC_LEADS = ['[Scientists] still [debate]', '[Researchers] are still trying to [explain]', 'Experts [still] [disagree] about'];
export const NC_LEADS_PLAIN = ['Scientists still debate', 'Researchers are still trying to explain', 'It is still not entirely clear', 'Experts still disagree about'];
/** ok/bad are the clause core; tail completes the sentence and may carry [markers]. */
export interface EmbeddedQ { wh: string; ok: string; bad: [string, string, string]; tail: string }
export const EMBEDDED_QS: EmbeddedQ[] = [
  { wh: 'why', ok: 'the dinosaurs disappeared', bad: ['did the dinosaurs disappear', 'disappeared the dinosaurs', 'the dinosaurs to disappear'], tail: 'so [suddenly]' },
  { wh: 'how', ok: 'the pyramids were built', bad: ['were the pyramids built', 'the pyramids built were', 'the pyramids to be built'], tail: 'so [precisely]' },
  { wh: 'when', ok: 'the first cities appeared', bad: ['did the first cities appear', 'appeared the first cities', 'the first cities appearing'], tail: 'in [Mesopotamia]' },
  { wh: 'why', ok: 'some birds migrate', bad: ['do some birds migrate', 'migrate some birds', 'some birds migrating'], tail: 'at [night]' },
  { wh: 'where', ok: 'the earliest farmers lived', bad: ['did the earliest farmers live', 'lived the earliest farmers', 'the earliest farmers living'], tail: 'in that [region]' },
  { wh: 'how', ok: 'some birds navigate', bad: ['do some birds navigate', 'navigate some birds', 'some birds navigating'], tail: 'across entire [oceans]' },
];
export interface ClauseFact { clause: string; main: string }
export const THAT_FACTS: ClauseFact[] = [
  { clause: 'the [climate] is changing', main: 'is now [accepted] by most [scientists]' },
  { clause: 'the [earth] orbits the sun', main: 'was [once] a controversial [idea]' },
  { clause: 'regular [exercise] improves memory', main: 'has been [shown] in many [studies]' },
  { clause: 'the [company] lost money last year', main: '[surprised] many [investors]' },
];
export const WHAT_FACTS: ClauseFact[] = [
  { clause: 'the [researchers] found', main: '[surprised] the whole [team]' },
  { clause: 'the [students] wrote', main: '[impressed] their [teachers]' },
  { clause: 'the [speaker] said', main: 'was [reported] in the [newspapers]' },
  { clause: 'the [museum] owns', main: 'is [worth] millions of [dollars]' },
];
