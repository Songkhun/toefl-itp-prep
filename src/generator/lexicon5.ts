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
    { pos: 'adv', s: 'The [dishes] were ____ [arranged] on the long [table]', why: 'to describe the verb "arranged"' },
  ] },
  { n: 'competition', v: 'compete', adj: 'competitive', adv: 'competitively', frames: [
    { pos: 'n', s: 'The ____ between the two [companies] is [intense] this [year]', why: 'after "The" as the subject of the sentence' },
    { pos: 'v', s: 'Twenty [teams] will ____ in the national [tournament] in [May]', why: 'after "will" as a base-form verb' },
    { pos: 'adj', s: 'Prices in the [market] are very ____ this [season] for [buyers]', why: 'after "are very" to describe the subject' },
    { pos: 'adv', s: 'The [company] [priced] its new [phones] ____', why: 'to describe the verb "priced"' },
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
    { pos: 'v', s: '[Volunteers] planted [flowers] to ____ the old [square]', why: 'after "to" as a base-form verb' },
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
    { pos: 'adj', s: 'The [trip] to the [zoo] was both [fun] and ____', why: 'after "both fun and" to describe the subject' },
    { pos: 'v', s: 'The [campaign] aims to ____ people about healthy [eating] and [exercise]', why: 'after "to" as a base-form verb' },
    { pos: 'n', s: 'Many [families] value a good ____ for their [children] above [everything]', why: 'after "a good" as the object of "value"' },
  ] },
  { n: 'prediction', v: 'predict', adj: 'predictable', adv: 'predictably', frames: [
    { pos: 'adj', s: 'The [weather] in the [region] is fairly ____ in [summer]', why: 'after "is fairly" to describe the subject' },
    { pos: 'v', s: '[Scientists] still cannot ____ [earthquakes] with great [accuracy]', why: 'after "cannot" as a base-form verb' },
    { pos: 'n', s: 'The [forecaster] made an [accurate] ____ about the [storm]', why: 'after "an accurate" as the object of "made"' },
    { pos: 'adv', s: 'The [film] ended ____ with a happy [wedding] [scene]', why: 'to describe the verb "ended"' },
  ] },
  { n: 'reliability', v: 'rely', adj: 'reliable', adv: 'reliably', frames: [
    { pos: 'adj', s: 'The new [trains] are [fast], [clean], and ____', why: 'after "are" in a list of adjectives describing the subject' },
    { pos: 'adv', s: 'The old [machine] has worked ____ for ten [years] without a [repair]', why: 'to describe the verb "worked"' },
    { pos: 'v', s: 'Many [farmers] ____ on [rain] to water their [crops]', why: 'as the main verb for the subject "Many farmers"' },
    { pos: 'n', s: 'Customers [value] the ____ of the [service] above [price]', why: 'after "the" as the object of "value"' },
  ] },
  { n: 'analysis', v: 'analyze', adj: 'analytical', adv: 'analytically', frames: [
    { pos: 'n', s: 'A careful ____ of the [data] [revealed] a surprising [pattern]', why: 'after "A careful" as the subject of the sentence' },
    { pos: 'v', s: 'The [researchers] will ____ the [samples] in the [laboratory]', why: 'after "will" as a base-form verb' },
    { pos: 'adj', s: 'Her [approach] to the [problem] was highly ____ and [precise]', why: 'after "was highly" to describe the subject' },
    { pos: 'adv', s: 'The [detective] [examined] the [evidence] ____', why: 'to describe the verb "examined"' },
  ] },
  { n: 'information', v: 'inform', adj: 'informative', adv: 'informatively', frames: [
    { pos: 'n', s: 'The [website] provides useful ____ about local [events] and [services]', why: 'after "useful" as the object of "provides"' },
    { pos: 'v', s: 'The [airline] will ____ [passengers] of any [delays]', why: 'after "will" as a base-form verb' },
    { pos: 'adj', s: 'The [lecture] on [climate] was very ____ and [interesting]', why: 'after "was very" to describe the subject' },
    { pos: 'adv', s: 'The [guide] spoke ____ about the [history] of the [castle]', why: 'to describe the verb "spoke"' },
  ] },
  { n: 'imagination', v: 'imagine', adj: 'imaginative', adv: 'imaginatively', frames: [
    { pos: 'n', s: 'Good [writers] use their ____ to [create] new [worlds]', why: 'after "their" as the object of "use"' },
    { pos: 'v', s: 'It is hard to ____ [life] without [electricity] or running [water]', why: 'after "to" as a base-form verb' },
    { pos: 'adj', s: 'The [architect] is known for her ____ [designs] and bold [colors]', why: 'to describe the noun "designs"' },
    { pos: 'adv', s: 'The old [warehouse] was ____ [converted] into a [theater]', why: 'to describe the verb "converted"' },
  ] },
  { n: 'continuation', v: 'continue', adj: 'continuous', adv: 'continuously', frames: [
    { pos: 'n', s: 'The [council] approved the ____ of the [program] for another [year]', why: 'after "the" as the object of "approved"' },
    { pos: 'v', s: 'Prices are [expected] to ____ [rising] next [year]', why: 'after "to" as a base-form verb' },
    { pos: 'adj', s: 'The [machine] makes a ____ [noise] all [night]', why: 'to describe the noun "noise"' },
    { pos: 'adv', s: 'The [factory] has operated ____ since [1950] without [closing]', why: 'to describe the verb "operated"' },
  ] },
  { n: 'agreement', v: 'agree', adj: 'agreeable', adv: 'agreeably', frames: [
    { pos: 'n', s: 'The two [countries] [finally] signed a trade ____ in [June]', why: 'after "a trade" as the object of "signed"' },
    { pos: 'v', s: 'Most [doctors] ____ that [sleep] is important for [health]', why: 'as the main verb for the subject "Most doctors"' },
    { pos: 'n', s: 'The [workers] reached an ____ with the [company] after long [talks]', why: 'after "an" as the object of "reached"' },
  ] },
  { n: 'width', v: 'widen', adj: 'wide', adv: 'widely', frames: [
    { pos: 'n', s: 'The ____ of the [road] is about ten [meters] near the [bridge]', why: 'after "The" as the subject of the sentence' },
    { pos: 'v', s: 'The [city] plans to ____ the main [street] next [year]', why: 'after "to" as a base-form verb' },
    { pos: 'adj', s: 'The [river] is too ____ to [cross] without a [boat]', why: 'after "too" to describe the subject' },
    { pos: 'adv', s: 'English is ____ spoken in [business] and [science] around the [world]', why: 'to describe the verb "spoken"' },
  ] },
  { n: 'activity', v: 'activate', adj: 'active', adv: 'actively', frames: [
    { pos: 'n', s: 'Volcanic ____ has [increased] on the [island] since [March]', why: 'after "Volcanic" as the subject of the sentence' },
    { pos: 'v', s: 'Pressing the red [button] will ____ the [alarm] [immediately]', why: 'after "will" as a base-form verb' },
    { pos: 'adj', s: 'My [grandfather] is still very ____ at the [age] of [eighty]', why: 'after "is still very" to describe the subject' },
    { pos: 'adv', s: 'The [students] participated ____ in the [class] [discussion]', why: 'to describe the verb "participated"' },
  ] },
  { n: 'origin', v: 'originate', adj: 'original', adv: 'originally', frames: [
    { pos: 'n', s: 'The ____ of the [word] is [unknown] to most [scholars]', why: 'after "The" as the subject of the sentence' },
    { pos: 'v', s: 'Many popular [dances] ____ in small [villages] in [Brazil]', why: 'as the main verb for the subject "Many popular dances"' },
    { pos: 'adj', s: 'The [museum] displays the ____ [copy] of the [document]', why: 'to describe the noun "copy"' },
    { pos: 'adv', s: 'The [building] was ____ [designed] as a [school]', why: 'to describe the verb "designed"' },
  ] },
  { n: 'emphasis', v: 'emphasize', adj: 'emphatic', adv: 'emphatically', frames: [
    { pos: 'n', s: 'The [school] places great ____ on [reading] and [writing]', why: 'after "great" as the object of "places"' },
    { pos: 'v', s: 'The [speaker] tried to ____ the [importance] of [sleep]', why: 'after "to" as a base-form verb' },
    { pos: 'adv', s: 'The [minister] ____ [denied] the [rumors]', why: 'to describe the verb "denied"' },
  ] },
  { n: 'sympathy', v: 'sympathize', adj: 'sympathetic', adv: 'sympathetically', frames: [
    { pos: 'n', s: 'The [community] expressed deep ____ for the [victims] of the [flood]', why: 'after "deep" as the object of "expressed"' },
    { pos: 'v', s: 'Many [readers] ____ with the main [character] in the [novel]', why: 'as the main verb for the subject "Many readers"' },
    { pos: 'adj', s: 'The [nurse] was ____ to the [patient] and his [family]', why: 'after "was" to describe the subject' },
    { pos: 'adv', s: 'The [teacher] [listened] ____ to the [student]', why: 'to describe the verb "listened"' },
  ] },
  { n: 'economy', v: 'economize', adj: 'economic', adv: 'economically', frames: [
    { pos: 'n', s: 'The national ____ [grew] by three [percent] last [year]', why: 'after "The national" as the subject of the sentence' },
    { pos: 'v', s: '[Families] must ____ on [heating] during the [winter]', why: 'after "must" as a base-form verb' },
    { pos: 'adv', s: 'The new [engine] uses [fuel] more ____ than the old [one]', why: 'after "more" to describe the verb "uses"' },
  ] },
  { n: 'weakness', v: 'weaken', adj: 'weak', adv: 'weakly', frames: [
    { pos: 'n', s: 'The [report] [identified] one major ____ in the [plan]', why: 'after "one major" as the object of "identified"' },
    { pos: 'v', s: 'The [illness] can ____ the [body] for several [weeks]', why: 'after "can" as a base-form verb' },
    { pos: 'adj', s: 'The [signal] is [often] too ____ in the [mountains]', why: 'after "too" to describe the subject' },
    { pos: 'adv', s: 'The injured [bird] [moved] ____ across the [grass]', why: 'to describe the verb "moved"' },
  ] },
  { n: 'persuasion', v: 'persuade', adj: 'persuasive', adv: 'persuasively', frames: [
    { pos: 'n', s: 'After much ____, the [manager] [agreed] to the [plan]', why: 'after "much" as a noun' },
    { pos: 'v', s: 'She tried to ____ her [parents] to [buy] a [dog]', why: 'after "to" as a base-form verb' },
    { pos: 'adj', s: 'The [lawyer] made a very ____ [argument] in [court]', why: 'to describe the noun "argument"' },
    { pos: 'adv', s: 'The [candidate] spoke ____ about [jobs] and [taxes]', why: 'to describe the verb "spoke"' },
  ] },
  { n: 'intensity', v: 'intensify', adj: 'intense', adv: 'intensely', frames: [
    { pos: 'n', s: 'The ____ of the [storm] [surprised] the [forecasters]', why: 'after "The" as the subject of the sentence' },
    { pos: 'v', s: 'The [fighting] is likely to ____ in the [coming] [weeks]', why: 'after "to" as a base-form verb' },
    { pos: 'adj', s: 'The [heat] in the [desert] was ____ at [noon]', why: 'after "was" to describe the subject' },
    { pos: 'adv', s: 'The [students] studied ____ before the [final] [exam]', why: 'to describe the verb "studied"' },
  ] },
  { n: 'clarity', v: 'clarify', adj: 'clear', adv: 'clearly', frames: [
    { pos: 'n', s: 'The [report] is [praised] for its ____ and [accuracy]', why: 'after "its" as the object of "for"' },
    { pos: 'v', s: 'The [teacher] asked the [student] to ____ his [answer]', why: 'after "to" as a base-form verb' },
    { pos: 'adj', s: 'The [water] in the [lake] is ____ and [cold]', why: 'after "is" to describe the subject' },
    { pos: 'adv', s: 'The [instructions] were ____ [written] in three [languages]', why: 'to describe the verb "written"' },
  ] },
];

/* ---------- P21 Prepositions and fixed phrases ---------- */

export interface Colloc { phrase: string; prep: string; wrong: [string, string, string]; frames: string[] }
export const COLLOCS: Colloc[] = [
  { phrase: 'depend on', prep: 'on', wrong: ['of', 'from', 'at'], frames: ['Many flowering [plants] depend ____ [insects] to carry [pollen]', 'The [success] of the [harvest] depends ____ the [weather]', 'The [price] of [tickets] depends ____ the [season]'] },
  { phrase: 'consist of', prep: 'of', wrong: ['from', 'on', 'by'], frames: ['Each [molecule] of water consists ____ two hydrogen [atoms] and one oxygen [atom]', 'The [committee] [consists] ____ twelve elected [members]', 'The [meal] consists ____ rice, [fish], and [soup]'] },
  { phrase: 'responsible for', prep: 'for', wrong: ['of', 'to', 'with'], frames: ['The [manager] is responsible ____ hiring new [staff] each [year]', '[Smoking] is [responsible] ____ most cases of lung [cancer]', 'The [council] is responsible ____ repairing local [roads] and [parks]'] },
  { phrase: 'capable of', prep: 'of', wrong: ['to', 'for', 'in'], frames: ['Bats are the only [mammals] [capable] ____ true [flight]', 'The new [robot] is capable ____ lifting heavy [boxes] [easily]', 'Young [children] are [capable] ____ learning two [languages]'] },
  { phrase: 'interested in', prep: 'in', wrong: ['on', 'for', 'about'], frames: ['Many [students] are interested ____ studying [abroad] next [year]', 'The [museum] is [interested] ____ buying the old [painting]', 'The [scientist] became interested ____ [insects] as a [child]'] },
  { phrase: 'similar to', prep: 'to', wrong: ['with', 'from', 'as'], frames: ['The [coyote] is similar ____ the [wolf] but [smaller]', 'Her [design] is very similar ____ the original [plan] in [style]', 'The [climate] of the [island] is similar ____ that of [Hawaii]'] },
  { phrase: 'different from', prep: 'from', wrong: ['of', 'with', 'at'], frames: ['Moths are [different] ____ [butterflies] in several [ways]', 'The [rules] here are [different] ____ the rules in my [country]', 'City [life] is [very] different ____ life in the [countryside]'] },
  { phrase: 'famous for', prep: 'for', wrong: ['of', 'by', 'with'], frames: ['The [region] is famous ____ its [wine] and [cheese]', 'Venice is [famous] ____ its [canals] and [bridges]', 'The [restaurant] is famous ____ its fresh [seafood] and [desserts]'] },
  { phrase: 'result in', prep: 'in', wrong: ['to', 'on', 'with'], frames: ['The [storm] resulted ____ several power [outages] across the [region]', 'Poor [planning] often [results] ____ costly [delays]', 'Heavy [rain] can result ____ [floods] and [landslides]'] },
  { phrase: 'contribute to', prep: 'to', wrong: ['for', 'in', 'with'], frames: ['Many [factors] contributed ____ the [decline] of the [empire]', '[Volunteers] [contribute] ____ the success of the [festival]', 'Exercise [contributes] ____ good [health] and better [sleep]'] },
  { phrase: 'aware of', prep: 'of', wrong: ['for', 'to', 'with'], frames: ['Most [drivers] are [aware] ____ the new speed [limit]', 'The [doctor] was not aware ____ the patient\'s [allergy] [until] later', 'Few [visitors] are aware ____ the [history] of the [building]'] },
  { phrase: 'belong to', prep: 'to', wrong: ['for', 'with', 'at'], frames: ['The ancient [coins] [belong] ____ the national [museum]', 'Whales [belong] ____ the same [group] of animals as [dolphins]', 'This old [house] [once] belonged ____ a famous [writer]'] },
  { phrase: 'prevent ... from', prep: 'from', wrong: ['to', 'of', 'for'], frames: ['The new [fence] prevents [deer] ____ entering the [garden]', 'Heavy [snow] prevented the [climbers] ____ reaching the [summit]', 'Strict [rules] prevent [visitors] ____ touching the [paintings]'] },
  { phrase: 'succeed in', prep: 'in', wrong: ['to', 'on', 'for'], frames: ['The [scientists] [finally] succeeded ____ isolating the [virus]', 'Few [companies] succeed ____ entering this [market] [quickly]', 'She [finally] succeeded ____ passing her [driving] [test]'] },
  { phrase: 'participate in', prep: 'in', wrong: ['on', 'at', 'to'], frames: ['More than fifty [countries] participated ____ the [conference] in [Geneva]', '[All] [students] must participate ____ the class [discussion]', 'Local [schools] [will] participate ____ the science [fair]'] },
  { phrase: 'benefit from', prep: 'from', wrong: ['of', 'for', 'with'], frames: ['Small [farmers] will benefit ____ the new [irrigation] [system]', 'Patients [benefit] ____ regular [exercise] and good [sleep]', 'The whole [town] [will] benefit ____ the new [hospital]'] },
  { phrase: 'insist on', prep: 'on', wrong: ['in', 'for', 'to'], frames: ['The [coach] insisted ____ daily [training] [sessions]', 'The [customer] [insisted] ____ speaking to the [manager]', 'Her [parents] insisted ____ [paying] for the [dinner]'] },
  { phrase: 'divide into', prep: 'into', wrong: ['on', 'to', 'with'], frames: ['The [book] is divided ____ three [parts] of equal [length]', 'The [teacher] divided the [class] ____ small [groups]', 'The [river] divides the [city] ____ two [parts]'] },
  { phrase: 'composed of', prep: 'of', wrong: ['from', 'by', 'with'], frames: ['The [atmosphere] is [composed] mainly ____ nitrogen and [oxygen]', 'The [jury] [was] composed ____ twelve local [citizens]', 'The [orchestra] is [composed] ____ sixty [musicians]'] },
  { phrase: 'adapt to', prep: 'to', wrong: ['with', 'for', 'at'], frames: ['[Camels] are [well] adapted ____ life in the [desert]', 'New [employees] need [time] to adapt ____ the company [culture]', 'Some [birds] have [adapted] ____ life in big [cities]'] },
  { phrase: 'focus on', prep: 'on', wrong: ['in', 'at', 'to'], frames: ['The [study] focuses ____ the eating [habits] of [teenagers]', 'The [government] [will] focus ____ improving public [transport]', 'The [lesson] will [mainly] focus ____ the past perfect [tense]'] },
  { phrase: 'apply for', prep: 'for', wrong: ['on', 'at', 'with'], frames: ['More than two hundred [people] applied ____ the [job] [last] month', 'Students can [apply] ____ a [scholarship] in [March]', 'She [plans] to apply ____ a [visa] next [month]'] },
  { phrase: 'approve of', prep: 'of', wrong: ['for', 'to', 'with'], frames: ['The [residents] did not [approve] ____ the new building [plans]', 'Her [parents] [approved] ____ her decision to study [medicine]', 'Most [voters] approve ____ the new [park] [plan]'] },
  { phrase: 'react to', prep: 'to', wrong: ['at', 'for', 'on'], frames: ['The [public] reacted [angrily] ____ the tax [increase]', 'Many [plants] [react] ____ changes in [light]', 'The [stock] [market] reacted quickly ____ the [news]'] },
  { phrase: 'according to', prep: 'to', wrong: ['with', 'by', 'for'], frames: ['According ____ the [report], sales [rose] last [year]', 'According ____ the [museum], the [painting] is very [old]', 'According ____ the [survey], most [people] [prefer] tea'] },
  { phrase: 'due to', prep: 'to', wrong: ['on', 'of', 'from'], frames: ['The [delay] was due ____ bad [weather] at the [airport]', 'The [cancellation] of the [game] was due ____ heavy [rain]', 'The [flight] was cancelled due ____ a [technical] [problem]'] },
  { phrase: 'associated with', prep: 'with', wrong: ['to', 'by', 'for'], frames: ['[High] blood [pressure] is often associated ____ heart [disease]', 'The [color] red is [associated] ____ danger in many [cultures]', 'Long [hours] at a [desk] are associated ____ back [pain]'] },
  { phrase: 'in charge of', prep: 'of', wrong: ['for', 'on', 'with'], frames: ['Ms. [Lopez] is [in] charge ____ the sales [department]', 'The [captain] was in charge ____ the whole [crew] during the [voyage]', 'Mr. [Chen] will be in charge ____ the new [project] [team]'] },
  { phrase: 'rely on', prep: 'on', wrong: ['of', 'to', 'with'], frames: ['Many [villages] still rely ____ [wells] for drinking [water]', 'The [team] [relies] heavily ____ its young [players]', 'Small [businesses] often rely ____ [loans] from local [banks]'] },
  { phrase: 'protect ... from', prep: 'from', wrong: ['of', 'at', 'to'], frames: ['[Sunscreen] protects the [skin] ____ harmful [rays]', 'The [wall] was built to protect the [town] ____ [floods]', 'Thick [fur] protects the [animals] ____ the [cold]'] },
  { phrase: 'involved in', prep: 'in', wrong: ['on', 'at', 'to'], frames: ['[Hundreds] of [volunteers] were involved ____ the [cleanup]', 'The [mayor] was not [involved] ____ the [decision]', 'Several [companies] are involved ____ [building] the new [stadium]'] },
  { phrase: 'familiar with', prep: 'with', wrong: ['of', 'at', 'in'], frames: ['Most [drivers] are familiar ____ the [local] [roads]', 'The new [nurse] is not yet [familiar] ____ the hospital [routine]', '[Engineers] must be familiar ____ the [safety] [rules]'] },
  { phrase: 'proud of', prep: 'of', wrong: ['for', 'with', 'at'], frames: ['The [parents] were [proud] ____ their son\'s [achievement]', 'The [town] is proud ____ its long [history] of [music]', 'The [workers] felt proud ____ the [new] [bridge]'] },
  { phrase: 'take part in', prep: 'in', wrong: ['on', 'at', 'to'], frames: ['Thousands of [runners] took part ____ the [marathon] last [Sunday]', 'All [members] are [invited] to take part ____ the [meeting]', '[Children] can take part ____ many [activities] at the [camp]'] },
  { phrase: 'suffer from', prep: 'from', wrong: ['of', 'with', 'by'], frames: ['Millions of [people] suffer ____ [allergies] every [spring]', 'The [region] [suffered] ____ a long [drought]', 'Many [older] [adults] suffer ____ back [pain]'] },
  { phrase: 'object to', prep: 'to', wrong: ['against', 'at', 'for'], frames: ['Many [residents] objected ____ the [new] [highway]', 'The [workers] [objected] ____ the longer [hours]', 'Some [parents] object ____ the new [uniform] [policy]'] },
  { phrase: 'concentrate on', prep: 'on', wrong: ['in', 'at', 'to'], frames: ['It is [hard] to concentrate ____ [work] in a noisy [office]', 'The [company] will [now] concentrate ____ its online [sales]', 'Students should concentrate ____ the [questions] they [find] [difficult]'] },
  { phrase: 'equivalent to', prep: 'to', wrong: ['with', 'of', 'as'], frames: ['One [mile] is [roughly] equivalent ____ 1.6 [kilometers]', 'The [prize] is equivalent ____ a year\'s [salary] for most [workers]', 'A foreign [diploma] is [often] equivalent ____ a local [degree]'] },
  { phrase: 'deal with', prep: 'with', wrong: ['on', 'about', 'for'], frames: ['The [city] must deal ____ heavy [traffic] every [morning]', 'The [manager] [dealt] ____ the [complaint] quickly', 'Nurses learn to deal ____ [stress] in [difficult] [situations]'] },
  { phrase: 'consistent with', prep: 'with', wrong: ['to', 'of', 'for'], frames: ['The new [results] are [consistent] ____ earlier [studies]', 'His [story] was not consistent ____ the [evidence] [found] later', 'The [data] were consistent ____ the [theory] [proposed] in [1990]'] },
  { phrase: 'lack of', prep: 'of', wrong: ['in', 'for', 'on'], frames: ['The [project] failed because of a lack ____ [funding] and [staff]', 'A [lack] ____ sleep can [affect] your [memory]', 'There is a [serious] lack ____ clean [water] in the [region]'] },
  { phrase: 'effect on', prep: 'on', wrong: ['to', 'at', 'for'], frames: ['The [drug] has little effect ____ [older] [patients]', '[Music] can have a [strong] effect ____ our [mood]', 'The [storm] had a [serious] effect ____ local [farms]'] },
  { phrase: 'reason for', prep: 'for', wrong: ['of', 'to', 'about'], frames: ['The main [reason] ____ the [delay] was the [weather]', 'Scientists are [studying] the reason ____ the [decline] in bee [numbers]', 'There is no [clear] reason ____ his [sudden] [departure]'] },
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
