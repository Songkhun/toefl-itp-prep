/*
 * Lexicon for patterns P18, P19, P21, P22. Notation: [text] marks an optional underline candidate;
 * "____" marks the tested slot in sentence frames. Facts stated as true must be true.
 */

/* ---------- P18 Articles ---------- */

/** Singular person subjects, used with "is". */
export const PEOPLE = ['My [neighbor]', 'Her [brother]', 'The new [tenant]', 'Our [guest]', 'His [cousin]', 'The [speaker]'];

/** Job noun phrases: art is the correct indefinite article, chosen by the SOUND of the first word. */
export interface Job { art: 'a' | 'an'; np: string; pl: string; sound?: string }
export const JOBS: Job[] = [
  { art: 'an', np: 'engineer', pl: 'engineers' },
  { art: 'a', np: 'university lecturer', pl: 'university lecturers', sound: 'a "y" sound' },
  { art: 'an', np: 'honest accountant', pl: 'honest accountants', sound: 'a vowel sound (the "h" is silent)' },
  { art: 'a', np: 'European diplomat', pl: 'European diplomats', sound: 'a "y" sound' },
  { art: 'an', np: 'architect', pl: 'architects' },
  { art: 'an', np: 'artist', pl: 'artists' },
  { art: 'a', np: 'uniformed police officer', pl: 'uniformed police officers', sound: 'a "y" sound' },
  { art: 'an', np: 'MBA student', pl: 'MBA students', sound: 'a vowel sound ("em")' },
  { art: 'a', np: 'one-time champion', pl: 'one-time champions', sound: 'a "w" sound' },
  { art: 'an', np: 'experienced nurse', pl: 'experienced nurses' },
  { art: 'a', np: 'union leader', pl: 'union leaders', sound: 'a "y" sound' },
  { art: 'an', np: 'electrician', pl: 'electricians' },
  { art: 'a', np: 'well-known author', pl: 'well-known authors' },
  { art: 'an', np: 'ambitious young lawyer', pl: 'ambitious young lawyers' },
  { art: 'a', np: 'hospital pharmacist', pl: 'hospital pharmacists' },
  { art: 'an', np: 'honorary member of the club', pl: 'honorary members of the club', sound: 'a vowel sound (the "h" is silent)' },
];
export const JOB_RESTS = ['who lives in the [city]', 'with many years of [experience]', 'from a small [town] in the north', 'who [travels] a lot for [work]'];

/** Superlatives (with the plain adjective, for the "the most + adjective" distractor). */
export interface Sup18 { sup: string; base: string }
export const SUPS18: Sup18[] = [
  { sup: 'youngest', base: 'young' }, { sup: 'oldest', base: 'old' }, { sup: 'tallest', base: 'tall' },
  { sup: 'fastest', base: 'fast' }, { sup: 'strongest', base: 'strong' }, { sup: 'newest', base: 'new' },
  { sup: 'best', base: 'good' }, { sup: 'busiest', base: 'busy' },
];
export const GROUPS18 = [
  { noun: 'player', tail: 'on the [team]' }, { noun: 'member', tail: 'of the [committee]' },
  { noun: 'student', tail: 'in the [class]' }, { noun: 'employee', tail: 'in the [company]' },
  { noun: 'runner', tail: 'in the [club]' },
];

/** Place names. the = takes "the"; odd = a third wrong form. */
export interface Place { name: string; the: boolean; kind: string; odd: string }
export const PLACES: Place[] = [
  { name: 'Nile', the: true, kind: 'rivers', odd: 'Nile River' },
  { name: 'Amazon', the: true, kind: 'rivers', odd: 'Amazon River' },
  { name: 'Mississippi', the: true, kind: 'rivers', odd: 'Mississippi River' },
  { name: 'Sahara', the: true, kind: 'deserts', odd: 'Sahara Desert' },
  { name: 'Gobi Desert', the: true, kind: 'deserts', odd: 'Gobi' },
  { name: 'Alps', the: true, kind: 'mountain ranges', odd: 'Alps Mountains' },
  { name: 'Andes', the: true, kind: 'mountain ranges', odd: 'Andes Mountains' },
  { name: 'Himalayas', the: true, kind: 'mountain ranges', odd: 'Himalaya Mountains' },
  { name: 'Pacific Ocean', the: true, kind: 'oceans', odd: 'Pacific' },
  { name: 'Mediterranean', the: true, kind: 'seas', odd: 'Mediterranean Sea' },
  { name: 'Caribbean', the: true, kind: 'seas', odd: 'Caribbean Sea' },
  { name: 'Philippines', the: true, kind: 'countries with a plural name', odd: 'Philippine' },
  { name: 'Netherlands', the: true, kind: 'countries with a plural name', odd: 'Netherland' },
  { name: 'Brazil', the: false, kind: 'countries', odd: 'Brazilian' },
  { name: 'Canada', the: false, kind: 'countries', odd: 'Canadian' },
  { name: 'Japan', the: false, kind: 'countries', odd: 'Japanese' },
  { name: 'Egypt', the: false, kind: 'countries', odd: 'Egyptian' },
  { name: 'Peru', the: false, kind: 'countries', odd: 'Peruvian' },
  { name: 'Iceland', the: false, kind: 'countries', odd: 'Icelandic' },
  { name: 'Africa', the: false, kind: 'continents', odd: 'African' },
  { name: 'Asia', the: false, kind: 'continents', odd: 'Asian' },
  { name: 'Antarctica', the: false, kind: 'continents', odd: 'Antarctic' },
  { name: 'Lake Victoria', the: false, kind: 'single lakes', odd: 'the Victoria Lake' },
  { name: 'Lake Baikal', the: false, kind: 'single lakes', odd: 'the Baikal Lake' },
  { name: 'Mount Fuji', the: false, kind: 'single mountains', odd: 'the Fuji Mountain' },
  { name: 'Mount Kilimanjaro', the: false, kind: 'single mountains', odd: 'the Kilimanjaro Mountain' },
];
export const PLACE_FRAMES = [
  'Many [tourists] [visit] ____ every [year]',
  'The [documentary] was [filmed] in ____ last [spring]',
  '[Scientists] have [studied] ____ for many [decades]',
  'She wrote a [book] about ____ after a long [trip] [there]',
];

/* ---------- P19 Word form ---------- */

export type Pos = 'n' | 'v' | 'adj' | 'adv';
export interface WordFamily { n: string; v: string; adj: string; adv: string; frames: { pos: Pos; s: string; why: string }[] }
export const FAMILIES: WordFamily[] = [
  { n: 'success', v: 'succeed', adj: 'successful', adv: 'successfully', frames: [
    { pos: 'adv', s: 'Early [sailors] navigated ____ by observing the [stars] at [night]', why: 'to describe the verb "navigated"' },
    { pos: 'n', s: 'The ____ of the [mission] [surprised] many [experts]', why: 'after "The" as the subject of the sentence' },
    { pos: 'adj', s: 'The [company] launched a ____ new [product] last [year]', why: 'to describe the noun "product"' },
    { pos: 'v', s: 'Few [students] ____ without regular [practice] and [effort]', why: 'as the main verb for the subject "Few students"' },
  ] },
  { n: 'danger', v: 'endanger', adj: 'dangerous', adv: 'dangerously', frames: [
    { pos: 'adj', s: 'Some [snakes] are extremely ____ to [humans] and [pets]', why: 'after "are extremely" to describe the subject' },
    { pos: 'adv', s: 'The [driver] was speeding ____ through the small [town] at [night]', why: 'to describe the verb "speeding"' },
    { pos: 'v', s: 'Pollution and [hunting] ____ many rare [species] of [birds]', why: 'as the main verb for the subject "Pollution and hunting"' },
    { pos: 'n', s: 'The [hikers] were not [aware] of the ____ [ahead]', why: 'after "the" as the object of "of"' },
  ] },
  { n: 'difference', v: 'differ', adj: 'different', adv: 'differently', frames: [
    { pos: 'n', s: 'There is a [clear] ____ between the two [samples] in the [study]', why: 'after "a clear" as the subject of "There is"' },
    { pos: 'v', s: 'The two [languages] ____ mainly in their [grammar] and [spelling]', why: 'as the main verb for the subject "The two languages"' },
    { pos: 'adj', s: 'Each [region] of the [country] has a ____ [climate]', why: 'to describe the noun "climate"' },
    { pos: 'adv', s: 'The [twins] [reacted] ____ to the [news]', why: 'to describe the verb "reacted"' },
  ] },
  { n: 'creation', v: 'create', adj: 'creative', adv: 'creatively', frames: [
    { pos: 'adj', s: 'The [artist] is known for her ____ use of [color] and [light]', why: 'to describe the noun "use"' },
    { pos: 'v', s: 'The [engineers] hope to ____ a cheaper [battery] for electric [cars]', why: 'after "to" as a base-form verb' },
    { pos: 'n', s: 'The ____ of the national [park] [protected] many [forests]', why: 'after "The" as the subject of the sentence' },
    { pos: 'adv', s: 'The [students] [solved] the [problem] ____', why: 'to describe the verb "solved"' },
  ] },
  { n: 'production', v: 'produce', adj: 'productive', adv: 'productively', frames: [
    { pos: 'n', s: 'Coffee ____ has increased [rapidly] in [Vietnam] since the [1990s]', why: 'as the subject of "has increased"' },
    { pos: 'adj', s: 'The [team] had a very ____ [meeting] this [morning]', why: 'to describe the noun "meeting"' },
    { pos: 'v', s: 'The new [factory] can ____ a thousand [cars] a [day]', why: 'after "can" as a base-form verb' },
    { pos: 'adv', s: 'The [volunteers] worked ____ all [afternoon] in the [garden]', why: 'to describe the verb "worked"' },
  ] },
  { n: 'protection', v: 'protect', adj: 'protective', adv: 'protectively', frames: [
    { pos: 'v', s: 'Strict [laws] ____ the rare [birds] on the [island]', why: 'as the main verb for the subject "Strict laws"' },
    { pos: 'n', s: 'A [helmet] provides ____ for the [head] in an [accident]', why: 'as the object of "provides"' },
    { pos: 'adj', s: 'The mother [bear] is very ____ of her [cubs] in [spring]', why: 'after "is very" to describe the subject' },
  ] },
  { n: 'decision', v: 'decide', adj: 'decisive', adv: 'decisively', frames: [
    { pos: 'n', s: 'The [committee] made a final ____ on [Monday] [morning]', why: 'after "a final" as the object of "made"' },
    { pos: 'v', s: 'The [voters] will ____ the [future] of the [city]', why: 'after "will" as a base-form verb' },
    { pos: 'adj', s: 'The [army] won a ____ [victory] in the [north]', why: 'to describe the noun "victory"' },
    { pos: 'adv', s: 'The [leader] acted ____ during the [crisis] last [year]', why: 'to describe the verb "acted"' },
  ] },
  { n: 'strength', v: 'strengthen', adj: 'strong', adv: 'strongly', frames: [
    { pos: 'n', s: 'The ____ of the [bridge] was tested by [engineers] in [1990]', why: 'after "The" as the subject of the sentence' },
    { pos: 'v', s: 'Regular [exercise] can ____ the [heart] and the [lungs]', why: 'after "can" as a base-form verb' },
    { pos: 'adj', s: 'A ____ [wind] damaged several [roofs] in the [village]', why: 'to describe the noun "wind"' },
    { pos: 'adv', s: 'The [residents] ____ opposed the new [airport] [project]', why: 'to describe the verb "opposed"' },
  ] },
  { n: 'attraction', v: 'attract', adj: 'attractive', adv: 'attractively', frames: [
    { pos: 'adj', s: 'The [city] has many ____ [parks] and [gardens]', why: 'to describe the noun "parks"' },
    { pos: 'v', s: 'Bright [flowers] ____ bees and [butterflies] in [summer]', why: 'as the main verb for the subject "Bright flowers"' },
    { pos: 'n', s: 'The old [castle] is the main ____ in the [town] for [tourists]', why: 'after "the main" as a noun' },
  ] },
  { n: 'competition', v: 'compete', adj: 'competitive', adv: 'competitively', frames: [
    { pos: 'n', s: 'The ____ between the two [companies] is [intense] this [year]', why: 'after "The" as the subject of the sentence' },
    { pos: 'v', s: 'Twenty [teams] will ____ in the national [tournament] in [May]', why: 'after "will" as a base-form verb' },
    { pos: 'adj', s: 'Prices in the [market] are very ____ this [season] for [buyers]', why: 'after "are very" to describe the subject' },
  ] },
  { n: 'variety', v: 'vary', adj: 'various', adv: 'variously', frames: [
    { pos: 'adj', s: 'The [market] sells ____ kinds of [fruit] and [vegetables]', why: 'to describe the noun "kinds"' },
    { pos: 'v', s: 'Temperatures in the [desert] ____ greatly between [day] and [night]', why: 'as the main verb for the subject "Temperatures"' },
    { pos: 'n', s: 'The [store] offers a wide ____ of [products] at low [prices]', why: 'after "a wide" as a noun' },
  ] },
  { n: 'beauty', v: 'beautify', adj: 'beautiful', adv: 'beautifully', frames: [
    { pos: 'adj', s: 'The [valley] is famous for its ____ [scenery] in [autumn]', why: 'to describe the noun "scenery"' },
    { pos: 'adv', s: 'The [choir] sang ____ at the [ceremony] last [night]', why: 'to describe the verb "sang"' },
    { pos: 'n', s: 'Visitors [admire] the ____ of the old [temple] at [sunset]', why: 'after "the" as the object of "admire"' },
  ] },
  { n: 'depth', v: 'deepen', adj: 'deep', adv: 'deeply', frames: [
    { pos: 'n', s: 'The ____ of the [lake] is about three hundred [meters] in some [places]', why: 'after "The" as the subject of the sentence' },
    { pos: 'adv', s: 'The [audience] was ____ moved by the [film] about the [war]', why: 'to describe the verb "moved"' },
    { pos: 'adj', s: 'The [river] is too ____ to [cross] on [foot]', why: 'after "too" to describe the subject' },
    { pos: 'v', s: '[Workers] had to ____ the old [canal] for larger [ships]', why: 'after "to" as a base-form verb' },
  ] },
  { n: 'simplicity', v: 'simplify', adj: 'simple', adv: 'simply', frames: [
    { pos: 'adv', s: 'The [teacher] [explained] the [idea] ____ and clearly', why: 'to describe the verb "explained"' },
    { pos: 'adj', s: 'The [instructions] on the [box] were [short] and ____', why: 'after "were short and" to describe the subject' },
    { pos: 'v', s: 'The new [software] will ____ the billing [process] for [customers]', why: 'after "will" as a base-form verb' },
    { pos: 'n', s: 'The [chair] is [admired] for the ____ of its [design]', why: 'after "the" as the object of "for"' },
  ] },
  { n: 'destruction', v: 'destroy', adj: 'destructive', adv: 'destructively', frames: [
    { pos: 'n', s: 'The [storm] caused widespread ____ along the [coast] last [year]', why: 'after "widespread" as the object of "caused"' },
    { pos: 'v', s: 'The [fire] could ____ the entire [forest] within [days]', why: 'after "could" as a base-form verb' },
    { pos: 'adj', s: 'Some [insects] are highly ____ to [crops] in [summer]', why: 'after "are highly" to describe the subject' },
  ] },
  { n: 'education', v: 'educate', adj: 'educational', adv: 'educationally', frames: [
    { pos: 'adj', s: 'The [museum] offers ____ programs for [children] on [weekends]', why: 'to describe the noun "programs"' },
    { pos: 'v', s: 'The [campaign] aims to ____ people about healthy [eating] and [exercise]', why: 'after "to" as a base-form verb' },
    { pos: 'n', s: 'Many [families] value a good ____ for their [children] above [everything]', why: 'after "a good" as the object of "value"' },
  ] },
  { n: 'prediction', v: 'predict', adj: 'predictable', adv: 'predictably', frames: [
    { pos: 'adj', s: 'The [weather] in the [region] is fairly ____ in [summer]', why: 'after "is fairly" to describe the subject' },
    { pos: 'v', s: '[Scientists] still cannot ____ [earthquakes] with great [accuracy]', why: 'after "cannot" as a base-form verb' },
    { pos: 'n', s: 'The [forecaster] made an [accurate] ____ about the [storm]', why: 'after "an accurate" as the object of "made"' },
  ] },
  { n: 'reliability', v: 'rely', adj: 'reliable', adv: 'reliably', frames: [
    { pos: 'adj', s: 'The new [trains] are [fast], [clean], and ____', why: 'after "are" in a list of adjectives describing the subject' },
    { pos: 'adv', s: 'The old [machine] has worked ____ for ten [years] without a [repair]', why: 'to describe the verb "worked"' },
    { pos: 'v', s: 'Many [farmers] ____ on [rain] to water their [crops]', why: 'as the main verb for the subject "Many farmers"' },
    { pos: 'n', s: 'Customers [value] the ____ of the [service] above [price]', why: 'after "the" as the object of "value"' },
  ] },
];

/* ---------- P21 Prepositions and fixed phrases ---------- */

export interface Colloc { phrase: string; prep: string; wrong: [string, string, string]; frames: string[] }
export const COLLOCS: Colloc[] = [
  { phrase: 'depend on', prep: 'on', wrong: ['of', 'from', 'at'], frames: ['Many flowering [plants] depend ____ [insects] to carry [pollen]', 'The [success] of the [harvest] depends ____ the [weather]'] },
  { phrase: 'consist of', prep: 'of', wrong: ['from', 'on', 'by'], frames: ['Each [molecule] of water consists ____ two hydrogen [atoms] and one oxygen [atom]', 'The [committee] [consists] ____ twelve elected [members]'] },
  { phrase: 'responsible for', prep: 'for', wrong: ['of', 'to', 'with'], frames: ['The [manager] is responsible ____ hiring new [staff] each [year]', '[Smoking] is [responsible] ____ most cases of lung [cancer]'] },
  { phrase: 'capable of', prep: 'of', wrong: ['to', 'for', 'in'], frames: ['Bats are the only [mammals] [capable] ____ true [flight]', 'The new [robot] is capable ____ lifting heavy [boxes] [easily]'] },
  { phrase: 'interested in', prep: 'in', wrong: ['on', 'for', 'about'], frames: ['Many [students] are interested ____ studying [abroad] next [year]', 'The [museum] is [interested] ____ buying the old [painting]'] },
  { phrase: 'similar to', prep: 'to', wrong: ['with', 'from', 'as'], frames: ['The [coyote] is similar ____ the [wolf] but [smaller]', 'Her [design] is very similar ____ the original [plan] in [style]'] },
  { phrase: 'different from', prep: 'from', wrong: ['of', 'with', 'at'], frames: ['Moths are [different] ____ [butterflies] in several [ways]', 'The [rules] here are [different] ____ the rules in my [country]'] },
  { phrase: 'famous for', prep: 'for', wrong: ['of', 'by', 'with'], frames: ['The [region] is famous ____ its [wine] and [cheese]', 'Venice is [famous] ____ its [canals] and [bridges]'] },
  { phrase: 'result in', prep: 'in', wrong: ['to', 'on', 'with'], frames: ['The [storm] resulted ____ several power [outages] across the [region]', 'Poor [planning] often [results] ____ costly [delays]'] },
  { phrase: 'contribute to', prep: 'to', wrong: ['for', 'in', 'with'], frames: ['Many [factors] contributed ____ the [decline] of the [empire]', '[Volunteers] [contribute] ____ the success of the [festival]'] },
  { phrase: 'aware of', prep: 'of', wrong: ['for', 'to', 'with'], frames: ['Most [drivers] are [aware] ____ the new speed [limit]', 'The [doctor] was not aware ____ the patient\'s [allergy] [until] later'] },
  { phrase: 'belong to', prep: 'to', wrong: ['for', 'with', 'at'], frames: ['The ancient [coins] [belong] ____ the national [museum]', 'Whales [belong] ____ the same [group] of animals as [dolphins]'] },
  { phrase: 'prevent ... from', prep: 'from', wrong: ['to', 'of', 'for'], frames: ['The new [fence] prevents [deer] ____ entering the [garden]', 'Heavy [snow] prevented the [climbers] ____ reaching the [summit]'] },
  { phrase: 'succeed in', prep: 'in', wrong: ['to', 'on', 'for'], frames: ['The [scientists] [finally] succeeded ____ isolating the [virus]', 'Few [companies] succeed ____ entering this [market] [quickly]'] },
  { phrase: 'participate in', prep: 'in', wrong: ['on', 'at', 'to'], frames: ['More than fifty [countries] participated ____ the [conference] in [Geneva]', '[All] [students] must participate ____ the class [discussion]'] },
  { phrase: 'benefit from', prep: 'from', wrong: ['of', 'for', 'with'], frames: ['Small [farmers] will benefit ____ the new [irrigation] [system]', 'Patients [benefit] ____ regular [exercise] and good [sleep]'] },
  { phrase: 'insist on', prep: 'on', wrong: ['in', 'for', 'to'], frames: ['The [coach] insisted ____ daily [training] [sessions]', 'The [customer] [insisted] ____ speaking to the [manager]'] },
  { phrase: 'divide into', prep: 'into', wrong: ['on', 'to', 'with'], frames: ['The [book] is divided ____ three [parts] of equal [length]', 'The [teacher] divided the [class] ____ small [groups]'] },
  { phrase: 'composed of', prep: 'of', wrong: ['from', 'by', 'with'], frames: ['The [atmosphere] is [composed] mainly ____ nitrogen and [oxygen]', 'The [jury] [was] composed ____ twelve local [citizens]'] },
  { phrase: 'adapt to', prep: 'to', wrong: ['with', 'for', 'at'], frames: ['[Camels] are [well] adapted ____ life in the [desert]', 'New [employees] need [time] to adapt ____ the company [culture]'] },
  { phrase: 'focus on', prep: 'on', wrong: ['in', 'at', 'to'], frames: ['The [study] focuses ____ the eating [habits] of [teenagers]', 'The [government] [will] focus ____ improving public [transport]'] },
  { phrase: 'apply for', prep: 'for', wrong: ['on', 'at', 'with'], frames: ['More than two hundred [people] applied ____ the [job] [last] month', 'Students can [apply] ____ a [scholarship] in [March]'] },
  { phrase: 'approve of', prep: 'of', wrong: ['for', 'to', 'with'], frames: ['The [residents] did not [approve] ____ the new building [plans]', 'Her [parents] [approved] ____ her decision to study [medicine]'] },
  { phrase: 'react to', prep: 'to', wrong: ['at', 'for', 'on'], frames: ['The [public] reacted [angrily] ____ the tax [increase]', 'Many [plants] [react] ____ changes in [light]'] },
  { phrase: 'according to', prep: 'to', wrong: ['with', 'by', 'for'], frames: ['According ____ the [report], sales [rose] last [year]', 'According ____ the [museum], the [painting] is very [old]'] },
  { phrase: 'due to', prep: 'to', wrong: ['on', 'of', 'from'], frames: ['The [delay] was due ____ bad [weather] at the [airport]', 'The [cancellation] of the [game] was due ____ heavy [rain]'] },
  { phrase: 'associated with', prep: 'with', wrong: ['to', 'by', 'for'], frames: ['[High] blood [pressure] is often associated ____ heart [disease]', 'The [color] red is [associated] ____ danger in many [cultures]'] },
  { phrase: 'in charge of', prep: 'of', wrong: ['for', 'on', 'with'], frames: ['Ms. [Lopez] is [in] charge ____ the sales [department]', 'The [captain] was in charge ____ the whole [crew] during the [voyage]'] },
];

/* ---------- P22 Redundancy and wrong word ---------- */

export const SUBJ22 = ['The [researchers]', 'The young [engineer]', 'Our [team]', 'The [students]', 'The city [council]'];
/** make/do collocations in the past tense. obj must contain an underline candidate. */
export interface MakeDo { verb: 'made' | 'did'; obj: string; tail: string; wrong: [string, string, string] }
export const MAKE_DO: MakeDo[] = [
  { verb: 'made', obj: 'an important [discovery]', tail: 'in the [laboratory]', wrong: ['did', 'took', 'had'] },
  { verb: 'made', obj: 'a serious [mistake]', tail: 'in the final [report]', wrong: ['did', 'took', 'had'] },
  { verb: 'made', obj: 'a difficult [decision]', tail: 'after a long [meeting]', wrong: ['did', 'got', 'put'] },
  { verb: 'made', obj: 'good [progress]', tail: 'during the first [month]', wrong: ['did', 'took', 'got'] },
  { verb: 'made', obj: 'a lot of [noise]', tail: 'late at [night]', wrong: ['did', 'took', 'had'] },
  { verb: 'made', obj: 'several [changes]', tail: 'to the [plan]', wrong: ['did', 'took', 'had'] },
  { verb: 'made', obj: 'a special [effort]', tail: 'to finish [early]', wrong: ['did', 'took', 'got'] },
  { verb: 'made', obj: 'a detailed [plan]', tail: 'for the new [park]', wrong: ['did', 'took', 'got'] },
  { verb: 'did', obj: 'extensive [research]', tail: 'on the [topic]', wrong: ['made', 'took', 'had'] },
  { verb: 'did', obj: 'a lot of [damage]', tail: 'to the old [garden]', wrong: ['made', 'took', 'had'] },
  { verb: 'did', obj: '[business]', tail: 'with several foreign [companies]', wrong: ['made', 'took', 'had'] },
  { verb: 'did', obj: 'a [favor]', tail: 'for the [neighbors]', wrong: ['made', 'took', 'had'] },
  { verb: 'did', obj: 'a great deal of [work]', tail: 'to restore the old [lighthouse]', wrong: ['made', 'took', 'gave'] },
  { verb: 'did', obj: 'serious [harm]', tail: 'to the local [economy]', wrong: ['made', 'took', 'had'] },
];

/** Hand-checked frames for confusable words and redundancy. bad is the Written Expression error (default wrong[0]). */
export interface WordChoice { s: string; ok: string; wrong: [string, string, string]; why: string }
export const CONFUSABLE: WordChoice[] = [
  { s: 'The [price] of gasoline tends to ____ when [demand] for oil [increases]', ok: 'rise', wrong: ['raise', 'arise', 'raising'], why: '"Rise" means "go up" and takes no object. "Raise" needs an object (raise prices).' },
  { s: 'The [government] plans to ____ taxes next [year] to pay for new [schools]', ok: 'raise', wrong: ['rise', 'arise', 'rising'], why: '"Raise" takes an object ("taxes"). "Rise" cannot take an object.' },
  { s: 'The [sun] ____ in the east every [morning] and sets in the [west]', ok: 'rises', wrong: ['raises', 'arises', 'rise'], why: '"Rises" (go up, no object) is needed, with -s for the singular subject "The sun". "Raises" needs an object.' },
  { s: 'Most [birds] ____ their eggs in [nests] built from [twigs]', ok: 'lay', wrong: ['lie', 'lain', 'lying'], why: '"Lay" (put down) takes an object ("their eggs"). "Lie" (rest) takes no object.' },
  { s: 'The old [cat] likes to ____ in the [sun] after [lunch]', ok: 'lie', wrong: ['lay', 'laid', 'laying'], why: '"Lie" (rest) takes no object. "Lay" means "put something down" and needs an object.' },
  { s: 'The two [cities] look so much ____ that [visitors] often confuse [them]', ok: 'alike', wrong: ['like', 'likely', 'liking'], why: '"Alike" (similar) is used after a verb with no object following. "Like" needs an object ("look like each other").' },
  { s: 'The new [policy] will ____ thousands of [workers] in the [region]', ok: 'affect', wrong: ['effect', 'effective', 'affection'], why: '"Affect" is the verb (to influence). "Effect" is usually a noun (a result).' },
  { s: 'The [medicine] had a strong ____ on the [patient] [within] hours', ok: 'effect', wrong: ['affect', 'effective', 'affecting'], why: 'After "a strong", a noun is needed: "effect" (a result). "Affect" is a verb.' },
  { s: 'The [bank] agreed to ____ the [company] two million [dollars]', ok: 'lend', wrong: ['borrow', 'borrowing', 'lending'], why: 'The bank gives the money, so the verb is "lend". You "borrow" money from someone.' },
  { s: 'The [students] had to ____ books from the city [library] for the [project]', ok: 'borrow', wrong: ['lend', 'lent', 'lending'], why: 'The students take books and return them later, so the verb is "borrow ... from". The library "lends" books.' },
  { s: 'The [guide] ____ the [tourists] about the history of the [castle]', ok: 'told', wrong: ['said', 'spoke', 'talked'], why: '"Tell" is followed directly by the person spoken to ("told the tourists"). "Say", "speak" and "talk" are not.' },
  { s: 'The [mayor] ____ that the new [bridge] would open in [June]', ok: 'said', wrong: ['told', 'spoke', 'talked'], why: '"Say" is followed directly by a "that" clause. "Tell" needs a person first ("told reporters that...").' },
  { s: 'The [teacher] asked the [children] to ____ quietly during the [test]', ok: 'sit', wrong: ['set', 'seat', 'sat'], why: '"Sit" takes no object. "Set" and "seat" need an object, and "sat" is not a base form.' },
  { s: 'The [workers] had to ____ the heavy [boxes] on the [table]', ok: 'set', wrong: ['sit', 'sat', 'seat'], why: '"Set" (put) takes an object ("the heavy boxes"). "Sit" takes no object.' },
];
export const REDUNDANT: WordChoice[] = [
  { s: 'Monarch [butterflies] ____ to the [north] in [spring]', ok: 'return', wrong: ['return back', 'returning back', 'back return'], why: '"Return" already means "go back", so adding "back" is redundant.' },
  { s: 'The [teacher] asked the [student] to ____ the answer more [slowly]', ok: 'repeat', wrong: ['repeat again', 'repeating again', 'again repeat'], why: '"Repeat" already means "say again", so adding "again" is redundant.' },
  { s: 'The Blue Nile and the White [Nile] ____ near the [city] of [Khartoum]', ok: 'join', wrong: ['join together', 'joining together', 'together join'], why: '"Join" already means "come together", so adding "together" is redundant.' },
  { s: 'The [army] continued to ____ toward the [capital] for three [days]', ok: 'advance', wrong: ['advance forward', 'advancing forward', 'forward advance'], why: '"Advance" already means "move forward", so adding "forward" is redundant.' },
  { s: 'The two [companies] decided to ____ into one large [firm] last [year]', ok: 'merge', wrong: ['merge together', 'merging together', 'together merge'], why: '"Merge" already means "combine together", so adding "together" is redundant.' },
  { s: 'The old [bridge] ____ the two [villages] on either side of the [river]', ok: 'connects', wrong: ['connects together', 'connecting together', 'together connects'], why: '"Connect" already means "join together", so adding "together" is redundant.' },
  { s: 'The [reason] for the [delay] was ____ a storm had closed the [airport]', ok: 'that', wrong: ['because', 'due to', 'because of'], why: 'After "The reason ... was", use "that". "The reason ... was because" repeats the idea of cause and is redundant.' },
];
