/*
 * Lexicon for patterns P13–P17. Notation: [text] marks an optional underline candidate.
 * Facts stated as true must be true; keep wording cautious.
 */
import { V, type Verb } from './build';

/* ---------- P13 conditionals and wishes ---------- */
/** One idea that reads naturally as both an unreal present and an unreal past condition. */
export interface Cond { ifSubj: string; plural: boolean; ifVerb: Verb; ifObj: string; mainSubj: string; mainVerb: Verb; mainRest: string }
export const COND: Cond[] = [
  { ifSubj: 'the [farmers]', plural: true, ifVerb: V('plant', 'plants', 'planted', 'planted', 'planting'), ifObj: 'drought-resistant [seeds]', mainSubj: 'their [crops]', mainVerb: V('survive', 'survives', 'survived', 'survived', 'surviving'), mainRest: 'the dry [summer]' },
  { ifSubj: 'the [city]', plural: false, ifVerb: V('build', 'builds', 'built', 'built', 'building'), ifObj: 'more bicycle [lanes]', mainSubj: 'fewer [people]', mainVerb: V('drive', 'drives', 'drove', 'driven', 'driving'), mainRest: 'to [work]' },
  { ifSubj: 'the [researchers]', plural: true, ifVerb: V('use', 'uses', 'used', 'used', 'using'), ifObj: 'a larger [sample]', mainSubj: 'the [results]', mainVerb: V('be', 'is', 'was', 'been', 'being'), mainRest: 'more [reliable]' },
  { ifSubj: 'the [store]', plural: false, ifVerb: V('lower', 'lowers', 'lowered', 'lowered', 'lowering'), ifObj: 'its [prices]', mainSubj: 'more [customers]', mainVerb: V('buy', 'buys', 'bought', 'bought', 'buying'), mainRest: 'its [products]' },
  { ifSubj: 'the [students]', plural: true, ifVerb: V('read', 'reads', 'read', 'read', 'reading'), ifObj: 'the [instructions] carefully', mainSubj: 'they', mainVerb: V('make', 'makes', 'made', 'made', 'making'), mainRest: 'fewer [mistakes]' },
  { ifSubj: 'the [gallery]', plural: false, ifVerb: V('open', 'opens', 'opened', 'opened', 'opening'), ifObj: 'on [weekends]', mainSubj: 'more [families]', mainVerb: V('visit', 'visits', 'visited', 'visited', 'visiting'), mainRest: 'its [exhibits]' },
  { ifSubj: 'the [region]', plural: false, ifVerb: V('receive', 'receives', 'received', 'received', 'receiving'), ifObj: 'more [rain]', mainSubj: 'the [lake]', mainVerb: V('rise', 'rises', 'rose', 'risen', 'rising'), mainRest: 'to its normal [level]' },
  { ifSubj: 'the [hospital]', plural: false, ifVerb: V('hire', 'hires', 'hired', 'hired', 'hiring'), ifObj: 'more [nurses]', mainSubj: 'patients', mainVerb: V('spend', 'spends', 'spent', 'spent', 'spending'), mainRest: 'less [time] waiting for [care]' },
];

/** Wishes about the present: plural subjects only, never the verb "be". */
export interface Wish { who: string; verb: Verb; rest: string }
export const WISH: Wish[] = [
  { who: 'Many [travelers]', verb: V('have', 'has', 'had', 'had', 'having'), rest: 'more [time] to explore each [city]' },
  { who: 'Many [commuters]', verb: V('live', 'lives', 'lived', 'lived', 'living'), rest: 'closer to their [offices]' },
  { who: 'Some new [employees]', verb: V('know', 'knows', 'knew', 'known', 'knowing'), rest: 'more about the [history] of the firm' },
  { who: 'Many language [learners]', verb: V('speak', 'speaks', 'spoke', 'spoken', 'speaking'), rest: 'more [fluently] [at] work' },
  { who: 'Most [farmers]', verb: V('own', 'owns', 'owned', 'owned', 'owning'), rest: 'more modern [machinery] [for] their [fields]' },
];

/* ---------- P14 gerunds and infinitives ---------- */
/** verb: the finite verb as it appears in the sentence; comp: the verb that follows it. */
export interface VerbComp { subj: string; verb: string; /** dictionary form of the verb, for explanations */ lemma?: string; comp: Verb; rest: string }
/** Verbs followed only by a gerund. */
export const GERUND_AFTER: VerbComp[] = [
  { subj: 'Many [birds]', verb: 'avoid', lemma: 'avoid', comp: V('nest', 'nests', 'nested', 'nested', 'nesting'), rest: '[near] busy [roads]' },
  { subj: 'The [workers]', verb: 'finished', lemma: 'finish', comp: V('paint', 'paints', 'painted', 'painted', 'painting'), rest: 'the [bridge] [before] winter' },
  { subj: '[City] [planners]', verb: 'considered', lemma: 'consider', comp: V('build', 'builds', 'built', 'built', 'building'), rest: 'a [second] [airport]' },
  { subj: 'Most [patients]', verb: 'enjoy', lemma: 'enjoy', comp: V('walk', 'walks', 'walked', 'walked', 'walking'), rest: '[in] the hospital [garden]' },
  { subj: 'The [witness]', verb: 'denied', lemma: 'deny', comp: V('see', 'sees', 'saw', 'seen', 'seeing'), rest: 'the [stolen] [car]' },
  { subj: 'The [engineers]', verb: 'postponed', lemma: 'postpone', comp: V('launch', 'launches', 'launched', 'launched', 'launching'), rest: 'the [satellite] [until] spring' },
];
/** Verbs followed only by an infinitive. */
export const INFINITIVE_AFTER: VerbComp[] = [
  { subj: 'The [members]', verb: 'decided', lemma: 'decide', comp: V('postpone', 'postpones', 'postponed', 'postponed', 'postponing'), rest: 'the [vote] [until] Friday' },
  { subj: 'The local [bakery]', verb: 'hopes', lemma: 'hope', comp: V('open', 'opens', 'opened', 'opened', 'opening'), rest: 'three new [stores] [next] year' },
  { subj: '[Both] [countries]', verb: 'agreed', lemma: 'agree', comp: V('reduce', 'reduces', 'reduced', 'reduced', 'reducing'), rest: 'their carbon [emissions] [by] half' },
  { subj: 'The [landlord]', verb: 'refused', lemma: 'refuse', comp: V('lower', 'lowers', 'lowered', 'lowered', 'lowering'), rest: 'the [rent] [this] year' },
  { subj: 'The [climbers]', verb: 'managed', lemma: 'manage', comp: V('reach', 'reaches', 'reached', 'reached', 'reaching'), rest: 'the [summit] [before] dark' },
  { subj: 'The [railway]', verb: 'plans', lemma: 'plan', comp: V('expand', 'expands', 'expanded', 'expanded', 'expanding'), rest: 'its [network] [across] the country' },
  { subj: '[Many] young [couples]', verb: 'cannot afford', lemma: 'afford', comp: V('buy', 'buys', 'bought', 'bought', 'buying'), rest: 'a [house] [in] the city' },
];
/** Prepositions (inside fixed phrases) are followed by a gerund. */
export const AFTER_PREP: VerbComp[] = [
  { subj: 'The [engineers]', verb: 'were interested in', comp: V('design', 'designs', 'designed', 'designed', 'designing'), rest: 'a [quieter] [engine]' },
  { subj: 'The [curator]', verb: 'is responsible for', comp: V('protect', 'protects', 'protected', 'protected', 'protecting'), rest: 'many [rare] [paintings]' },
  { subj: '[Some] desert [plants]', verb: 'are capable of', comp: V('survive', 'survives', 'survived', 'survived', 'surviving'), rest: 'long [periods] [without] water' },
  { subj: 'The [doctors]', verb: 'succeeded in', comp: V('identify', 'identifies', 'identified', 'identified', 'identifying'), rest: 'the [cause] [of] the illness' },
  { subj: 'The [author]', verb: 'is famous for', comp: V('write', 'writes', 'wrote', 'written', 'writing'), rest: 'detective [novels] [set] in London' },
];

/* ---------- P15 modals ---------- */
export interface ModalFact { subj: string; modal: string; verb: Verb; rest: string }
export const MODAL: ModalFact[] = [
  { subj: 'Visitors to the [laboratory]', modal: 'must', verb: V('wear', 'wears', 'wore', 'worn', 'wearing'), rest: '[protective] [glasses]' },
  { subj: '[Students]', modal: 'should', verb: V('submit', 'submits', 'submitted', 'submitted', 'submitting'), rest: 'their [essays] [by] Friday' },
  { subj: '[Some] [insects]', modal: 'can', verb: V('survive', 'survives', 'survived', 'survived', 'surviving'), rest: '[freezing] [temperatures]' },
  { subj: 'A small change in [temperature]', modal: 'can', verb: V('affect', 'affects', 'affected', 'affected', 'affecting'), rest: 'the [growth] of [crops]' },
  { subj: 'Regular [exercise]', modal: 'may', verb: V('lower', 'lowers', 'lowered', 'lowered', 'lowering'), rest: 'the [risk] of heart [disease]' },
  { subj: '[All] [drivers]', modal: 'must', verb: V('stop', 'stops', 'stopped', 'stopped', 'stopping'), rest: '[at] a red [light]' },
  { subj: 'Careful [scientists]', modal: 'should', verb: V('repeat', 'repeats', 'repeated', 'repeated', 'repeating'), rest: '[important] [experiments]' },
];
/** Modal + have + past participle, about the past. */
export const PAST_MODAL: ModalFact[] = [
  { subj: 'The first [people] in the Americas', modal: 'may', verb: V('cross', 'crosses', 'crossed', 'crossed', 'crossing'), rest: 'a land [bridge] [from] Asia' },
  { subj: 'The [ancient] [city]', modal: 'must', verb: V('be', 'is', 'was', 'been', 'being'), rest: '[abandoned] [suddenly]' },
  { subj: 'The [builders]', modal: 'should', verb: V('test', 'tests', 'tested', 'tested', 'testing'), rest: 'the [bridge] more [carefully]' },
  { subj: 'The [fire]', modal: 'could', verb: V('start', 'starts', 'started', 'started', 'starting'), rest: '[in] the [kitchen]' },
  { subj: 'The missing [letter]', modal: 'might', verb: V('be', 'is', 'was', 'been', 'being'), rest: '[lost] in the [mail]' },
];

/* ---------- P16 pronouns ---------- */
/** Sentence: subj verb ____ noun rest. The blank is a possessive pronoun. */
export interface Possessive { subj: string; verb: string; noun: string; rest: string }
export const POSS_PLURAL: Possessive[] = [
  { subj: 'Many [birds]', verb: 'build', noun: 'nests', rest: 'in tall [trees]' },
  { subj: '[Honeybees]', verb: 'use', noun: 'dances', rest: 'to share the [location] of food' },
  { subj: 'Female [mammals]', verb: 'feed', noun: 'young', rest: 'with [milk]' },
  { subj: 'The [students]', verb: 'presented', noun: 'findings', rest: 'at the [conference]' },
  { subj: 'Early [farmers]', verb: 'stored', noun: 'grain', rest: 'in clay [pots]' },
];
export const POSS_SINGULAR: Possessive[] = [
  { subj: 'The [river]', verb: 'gradually changed', noun: 'course', rest: 'over many [centuries]' },
  { subj: 'A deciduous [tree]', verb: 'loses', noun: 'leaves', rest: 'every [autumn]' },
  { subj: 'The planet [Mercury]', verb: 'completes', noun: 'orbit', rest: 'in about 88 [days]' },
  { subj: 'An [octopus]', verb: 'can change', noun: 'color', rest: 'very [quickly]' },
  { subj: 'The [glacier]', verb: 'has lost much of', noun: 'ice', rest: 'over the past [century]' },
];
/** pre ... [them] post — the object refers back to a plural noun. */
export interface ObjectRef { pre: string; post: string }
export const OBJECT_REF: ObjectRef[] = [
  { pre: 'The [scientists] collected the [samples] and [tested]', post: 'in the [laboratory]' },
  { pre: 'The [farmers] harvested the [apples] and [sold]', post: 'at the local [market]' },
  { pre: 'The [teacher] marked the [essays] and [returned]', post: 'to the [class]' },
  { pre: 'The [library] received two old [maps] and [displayed]', post: 'in the main [hall]' },
];

/* ---------- P17 singular/plural and countable nouns ---------- */
export interface OneOf { subj: string; verb: string; /** a superlative ending in -est */ adj: string; sg: string; pl: string; post: string }
export const ONE_OF: OneOf[] = [
  { subj: '[The Nile]', verb: 'is', adj: 'longest', sg: 'river', pl: 'rivers', post: '[in] the world' },
  { subj: '[K2]', verb: 'is', adj: 'highest', sg: 'mountain', pl: 'mountains', post: '[on] Earth' },
  { subj: '[Tokyo]', verb: 'is', adj: 'largest', sg: 'city', pl: 'cities', post: '[in] the world' },
  { subj: '[Jupiter]', verb: 'is', adj: 'brightest', sg: 'object', pl: 'objects', post: '[in] the night sky' },
  { subj: '[The Sahara]', verb: 'is', adj: 'driest', sg: 'region', pl: 'regions', post: '[on] Earth' },
  { subj: '[The cheetah]', verb: 'is', adj: 'fastest', sg: 'animal', pl: 'animals', post: '[on] land' },
];
/** lead (optional) comes before the quantifier, so the quantifier is not always the first word. */
export interface Quant { lead?: string; q: string; sg: string; pl: string; rest: string }
export const QUANT: Quant[] = [
  { lead: '[During] the [storm],', q: 'several', sg: 'building', pl: 'buildings', rest: '[were] badly [damaged]' },
  { q: 'A number of', sg: 'student', pl: 'students', rest: '[have] applied [for] the [scholarship]' },
  { lead: 'In such [dry] [soil],', q: 'few', sg: 'plant', pl: 'plants', rest: '[can] [survive] for long' },
  { q: 'Both', sg: 'sample', pl: 'samples', rest: '[were] tested [twice] in the [laboratory]' },
  { lead: 'At the [gate],', q: 'all', sg: 'passenger', pl: 'passengers', rest: '[must] show a [ticket]' },
];
/** Uncountable nouns: never plural, never with "a/an" or "many". det = the correct determiner before the noun. */
export interface Uncount { pre: string; det: string; noun: string; post: string }
export const UNCOUNT: Uncount[] = [
  { pre: 'The [researchers] [gathered]', det: 'a great deal of', noun: 'information', post: '[about] the [disease]' },
  { pre: 'The [laboratory] [bought]', det: 'some new', noun: 'equipment', post: '[for] its [experiments]' },
  { pre: 'The [professor] [gave] the students', det: 'some useful', noun: 'advice', post: '[about] their [essays]' },
  { pre: 'The [hotel] [replaced]', det: 'most of the old', noun: 'furniture', post: '[in] its [rooms]' },
  { pre: 'Each [passenger] [may] bring', det: 'a small amount of', noun: 'luggage', post: '[on] the [bus]' },
];
