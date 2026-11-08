import { V, type Verb } from './build';

/** Coherent "institution does something" facts. Subjects carry one [marker] on the head noun. */
export interface ActiveFact { sg: string; pl: string; verb: Verb; rest: string }
export const ACTIVE_FACTS: ActiveFact[] = [
  { sg: 'The city [council]', pl: 'City [councils]', verb: V('approve', 'approves', 'approved', 'approved', 'approving'), rest: 'new [plans] for public parks' },
  { sg: 'The [library]', pl: '[Libraries]', verb: V('offer', 'offers', 'offered', 'offered', 'offering'), rest: 'free [courses] in computer skills' },
  { sg: 'The [museum]', pl: '[Museums]', verb: V('attract', 'attracts', 'attracted', 'attracted', 'attracting'), rest: 'large numbers of [visitors]' },
  { sg: 'The [company]', pl: '[Companies]', verb: V('export', 'exports', 'exported', 'exported', 'exporting'), rest: 'electronic [equipment] to Asia' },
  { sg: 'The [hospital]', pl: '[Hospitals]', verb: V('train', 'trains', 'trained', 'trained', 'training'), rest: 'nurses in [emergency] care' },
  { sg: 'The [university]', pl: '[Universities]', verb: V('fund', 'funds', 'funded', 'funded', 'funding'), rest: 'medical [research] projects' },
  { sg: 'The [farmer]', pl: '[Farmers]', verb: V('grow', 'grows', 'grew', 'grown', 'growing'), rest: 'rice in the river [valley]' },
  { sg: 'The [government]', pl: '[Governments]', verb: V('support', 'supports', 'supported', 'supported', 'supporting'), rest: 'scientific [research]' },
  { sg: 'The [school]', pl: '[Schools]', verb: V('teach', 'teaches', 'taught', 'taught', 'teaching'), rest: 'students [about] local history' },
  { sg: 'The [newspaper]', pl: '[Newspapers]', verb: V('publish', 'publishes', 'published', 'published', 'publishing'), rest: 'articles [about] the economy' },
];

/** Subject–verb agreement facts: head noun, distracting phrase with the opposite number, verb options. */
export interface AgreementFact { head: string; plural: boolean; dist: string; ok: string; bad: string; other: [string, string]; rest: string }
export const AGREEMENT_FACTS: AgreementFact[] = [
  { head: 'The [quality]', plural: false, dist: 'of the local [schools]', ok: 'has improved', bad: 'have improved', other: ['improving', 'to improve'], rest: 'greatly in recent [years]' },
  { head: 'The [members]', plural: true, dist: 'of the planning [committee]', ok: 'meet', bad: 'meets', other: ['meeting', 'to meet'], rest: 'every Thursday [morning]' },
  { head: 'The [number]', plural: false, dist: 'of international [students]', ok: 'has increased', bad: 'have increased', other: ['increasing', 'to increase'], rest: 'steadily [since] 2010' },
  { head: 'The [results]', plural: true, dist: 'of the recent [survey]', ok: 'show', bad: 'shows', other: ['showing', 'to show'], rest: 'a clear [change] in public opinion' },
  { head: 'The [price]', plural: false, dist: 'of fresh [vegetables]', ok: 'rises', bad: 'rise', other: ['rising', 'to rise'], rest: 'sharply in the [winter]' },
  { head: 'The [walls]', plural: true, dist: 'of the ancient [temple]', ok: 'are', bad: 'is', other: ['being', 'to be'], rest: 'covered with detailed [paintings]' },
  { head: 'A [list]', plural: false, dist: 'of the required [books]', ok: 'is', bad: 'are', other: ['being', 'to be'], rest: 'available at the [library]' },
  { head: 'The [causes]', plural: true, dist: 'of the [disease]', ok: 'remain', bad: 'remains', other: ['remaining', 'to remain'], rest: 'largely [unknown]' },
  { head: 'The [effect]', plural: false, dist: 'of these new [policies]', ok: 'is', bad: 'are', other: ['being', 'to be'], rest: 'difficult to [measure]' },
  { head: 'The [leaders]', plural: true, dist: 'of the [organization]', ok: 'have agreed', bad: 'has agreed', other: ['agreeing', 'to agree'], rest: 'to [meet] again next year' },
];

export const PAST_TIMES = ['in [1998]', 'two decades [ago]', 'last [year]', 'in [2015]'];
export const SINCE_TIMES = ['[since] 2005', '[since] 2010', '[since] 1998', '[since] the early 1990s'];
export const FRONT_TIMES = ['[Each] year,', 'In [most] years,', '[Today],'];

/** Passive facts: a thing that receives the action. */
export interface PassiveFact { subj: string; plural: boolean; verb: Verb; rest: string }
export const PASSIVE_FACTS: PassiveFact[] = [
  { subj: 'The new [vaccine]', plural: false, verb: V('test', 'tests', 'tested', 'tested', 'testing'), rest: 'in several [hospitals]' },
  { subj: 'The ancient [manuscripts]', plural: true, verb: V('discover', 'discovers', 'discovered', 'discovered', 'discovering'), rest: 'in a [cave] near the coast' },
  { subj: 'The [bridge]', plural: false, verb: V('build', 'builds', 'built', 'built', 'building'), rest: 'across the [river]' },
  { subj: 'The test [results]', plural: true, verb: V('publish', 'publishes', 'published', 'published', 'publishing'), rest: 'in a scientific [journal]' },
  { subj: 'The music [festival]', plural: false, verb: V('hold', 'holds', 'held', 'held', 'holding'), rest: 'in the main [square]' },
  { subj: 'The [paintings]', plural: true, verb: V('sell', 'sells', 'sold', 'sold', 'selling'), rest: 'at an [auction] in London' },
  { subj: 'The new [law]', plural: false, verb: V('approve', 'approves', 'approved', 'approved', 'approving'), rest: 'by the national [parliament]' },
  { subj: 'Several new [species]', plural: true, verb: V('identify', 'identifies', 'identified', 'identified', 'identifying'), rest: 'in the [rainforest]' },
];

/** Adjective-clause facts. clause and main each carry one [marker]. */
export interface RelFact { head: string; human: boolean; plural: boolean; clause: string; main: string }
export const REL_FACTS: RelFact[] = [
  { head: 'The [scientist]', human: true, plural: false, clause: '[discovered] the new element', main: 'received an international [award]' },
  { head: 'The [architect]', human: true, plural: false, clause: '[designed] the museum', main: 'was born in [Spain]' },
  { head: 'The [students]', human: true, plural: true, clause: '[completed] the course', main: 'received a [certificate]' },
  { head: 'The [author]', human: true, plural: false, clause: '[wrote] this novel', main: 'lives in a small [village]' },
  { head: 'The [engineers]', human: true, plural: true, clause: '[built] the dam', main: 'worked on it for five [years]' },
  { head: 'The [bridge]', human: false, plural: false, clause: '[connects] the two islands', main: 'was built in [1932]' },
  { head: 'The [river]', human: false, plural: false, clause: '[flows] through the city', main: 'often floods in [spring]' },
  { head: 'The [machines]', human: false, plural: true, clause: '[produce] the parts', main: 'were made in [Germany]' },
  { head: 'The [policy]', human: false, plural: false, clause: '[reduced] air pollution', main: 'was introduced in [2012]' },
  { head: 'The [trains]', human: false, plural: true, clause: '[run] between the two cities', main: 'are often [crowded]' },
];

export interface WhoseFact { head: string; poss: string; main: string }
export const WHOSE_FACTS: WhoseFact[] = [
  { head: 'The [author]', poss: 'novel won the prize', main: 'gave a public [lecture]' },
  { head: 'The [company]', poss: 'products are sold worldwide', main: 'employs over ten thousand [people]' },
  { head: 'The [student]', poss: 'essay was selected', main: 'will read it at the [ceremony]' },
  { head: 'The [farmers]', poss: 'crops were damaged', main: 'received help from the [government]' },
];

/** Noun-clause facts. */
export const NC_LEADS = ['[Scientists] still do not [know]', '[Researchers] are trying to [explain]', 'It is not [clear]', '[Historians] have long [wondered]'];
export interface EmbeddedQ { wh: string; ok: string; bad: [string, string, string] }
export const EMBEDDED_QS: EmbeddedQ[] = [
  { wh: 'why', ok: 'the dinosaurs disappeared so suddenly', bad: ['did the dinosaurs disappear so suddenly', 'disappeared the dinosaurs so suddenly', 'the dinosaurs to disappear so suddenly'] },
  { wh: 'how', ok: 'the pyramids were built', bad: ['were the pyramids built', 'the pyramids built were', 'the pyramids to be built'] },
  { wh: 'when', ok: 'the first cities appeared', bad: ['did the first cities appear', 'appeared the first cities', 'the first cities appearing'] },
  { wh: 'why', ok: 'some birds migrate at night', bad: ['do some birds migrate at night', 'migrate some birds at night', 'some birds migrating at night'] },
  { wh: 'where', ok: 'the river begins', bad: ['does the river begin', 'the river beginning', 'is the river begin'] },
  { wh: 'how', ok: 'bees communicate with each other', bad: ['do bees communicate with each other', 'communicate bees with each other', 'bees communicating with each other'] },
];
export interface ThatFact { clause: string; main: string }
export const THAT_FACTS: ThatFact[] = [
  { clause: 'the [climate] is changing', main: 'is now accepted by most [scientists]' },
  { clause: 'the [earth] orbits the sun', main: 'was once a controversial [idea]' },
  { clause: 'regular [exercise] improves memory', main: 'has been shown in many [studies]' },
  { clause: 'the [company] lost money last year', main: 'surprised many [investors]' },
];
export interface WhatFact { clause: string; main: string }
export const WHAT_FACTS: WhatFact[] = [
  { clause: 'the [researchers] found', main: 'surprised the whole [team]' },
  { clause: 'the [students] wrote', main: 'impressed their [teachers]' },
  { clause: 'the [speaker] said', main: 'was reported in the [newspapers]' },
  { clause: 'the [museum] owns', main: 'is worth millions of [dollars]' },
];
