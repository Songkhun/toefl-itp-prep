/*
 * Lexicon for patterns P07–P12. Notation: [text] marks an optional underline candidate.
 * Facts stated as true must be true; keep wording cautious.
 */

/** Concession and cause pairs: the same idea as a clause and as a noun phrase. */
export interface ClausePair { clause: string; noun: string; main: string; /** main clause with nouns instead of pronouns, for main-clause-first sentences */ mainFirst?: string }
export const CONCESSION: ClausePair[] = [
  { clause: 'the weather was extremely [cold]', noun: 'the extremely cold [weather]', main: 'the [hikers] reached the [summit]' },
  { clause: 'the experiment was very [expensive]', noun: 'the high [cost] of the experiment', main: 'the university [continued] to [fund] it', mainFirst: 'the university [continued] to [fund] the [project]' },
  { clause: 'the novel was very [long]', noun: 'the great [length] of the novel', main: 'it [sold] millions of [copies]', mainFirst: 'the book [sold] millions of [copies]' },
  { clause: 'the medicine had some side [effects]', noun: 'the side [effects] of the medicine', main: 'doctors [continued] to [prescribe] it', mainFirst: 'doctors [continued] to [prescribe] the [drug]' },
  { clause: 'the river was badly [polluted]', noun: 'the heavy [pollution] in the river', main: 'some [fish] still [lived] there', mainFirst: 'some [fish] still [lived] in the [water]' },
];
export const CAUSE: ClausePair[] = [
  { clause: 'the roads were [icy]', noun: 'the icy [roads]', main: 'the [schools] closed [early]' },
  { clause: 'the harvest was [poor]', noun: 'the poor [harvest]', main: 'food [prices] rose [sharply]' },
  { clause: 'the bridge was [damaged]', noun: 'the [damage] to the bridge', main: 'traffic was [delayed] for [hours]' },
  { clause: 'the museum was very [crowded]', noun: 'the large [crowds] in the museum', main: 'many [visitors] left [early]' },
  { clause: 'the soil is [rich]', noun: 'the rich [soil]', main: 'farmers [grow] many [crops] there' },
];
export interface SoThat { subj: string; be: string; adj: string; result: string }
export const SO_THAT: SoThat[] = [
  { subj: 'The [lecture]', be: 'was', adj: 'long', result: 'several students fell [asleep]' },
  { subj: 'The [storm]', be: 'was', adj: 'strong', result: 'many trees were [uprooted]' },
  { subj: 'The [instructions]', be: 'were', adj: 'confusing', result: 'nobody could [follow] them' },
  { subj: 'The [exam]', be: 'was', adj: 'difficult', result: 'few candidates [finished] it' },
];

/** Participle phrases. pp = the passive form, ing = the active form. */
export interface OpeningPP { pp: string; base: string; ing: string; rest: string; subj: string; main: string }
export const OPENING_PP: OpeningPP[] = [
  { pp: 'Built', ing: 'Building', base: 'Build', rest: 'of local [stone]', subj: 'the old [church]', main: 'has [survived] for centuries' },
  { pp: 'Written', ing: 'Writing', base: 'Write', rest: 'in simple [language]', subj: 'the [report]', main: 'was easy to [understand]' },
  { pp: 'Established', ing: 'Establishing', base: 'Establish', rest: 'in the nineteenth [century]', subj: 'the [library]', main: 'now holds over a million [books]' },
  { pp: 'Surrounded', ing: 'Surrounding', base: 'Surround', rest: 'by [mountains]', subj: 'the [village]', main: 'is difficult to [reach] in winter' },
];
export interface OpeningIng { ing: string; past: string; rest: string; subj: string; main: string }
export const OPENING_ING: OpeningIng[] = [
  { ing: 'Using', past: 'Used', rest: 'satellite [data]', subj: 'the [researchers]', main: 'mapped the [coastline]' },
  { ing: 'Working', past: 'Worked', rest: 'late into the [night]', subj: 'the [engineers]', main: 'repaired the [system]' },
  { ing: 'Hoping', past: 'Hoped', rest: 'to find [gold]', subj: 'thousands of [settlers]', main: 'moved to [California]' },
  { ing: 'Comparing', past: 'Compared', rest: 'the two [samples]', subj: 'the [scientist]', main: 'noticed a small [difference]' },
];
export interface Reduced { head: string; plural: boolean; pp: string; ing: string; by: string; main: string }
export const REDUCED: Reduced[] = [
  { head: 'The [data]', plural: true, pp: 'collected', ing: 'collecting', by: 'by the [satellite]', main: 'were sent to [laboratories] around the world' },
  { head: 'The [bridge]', plural: false, pp: 'designed', ing: 'designing', by: 'by a young [engineer]', main: 'won an international [prize]' },
  { head: 'The [samples]', plural: true, pp: 'taken', ing: 'taking', by: 'from the [lake]', main: 'contained high levels of [mercury]' },
  { head: 'The [houses]', plural: true, pp: 'damaged', ing: 'damaging', by: 'by the [storm]', main: 'were [rebuilt] within a year' },
  { head: 'The [paintings]', plural: true, pp: 'displayed', ing: 'displaying', by: 'in the main [hall]', main: 'are more than two hundred years [old]' },
];

/** Appositives about true, well-known facts. */
export interface Appos { head: string; app: string; be: string; main: string; rel: 'who' | 'which' }
export const APPOS: Appos[] = [
  { head: 'Marie [Curie]', app: 'a physicist and [chemist]', be: 'was', main: '[won] two Nobel [Prizes]', rel: 'who' },
  { head: '[Jupiter]', app: 'the largest planet in the solar [system]', be: 'is', main: '[has] dozens of [moons]', rel: 'which' },
  { head: 'Charles [Darwin]', app: 'an English [naturalist]', be: 'was', main: '[published] his theory of evolution in [1859]', rel: 'who' },
  { head: 'The [Nile]', app: 'one of the longest rivers in the [world]', be: 'is', main: 'flows [north] into the Mediterranean [Sea]', rel: 'which' },
  { head: 'The [cheetah]', app: 'the fastest land [animal]', be: 'is', main: 'can [reach] about 100 kilometers per [hour]', rel: 'which' },
  { head: 'Isaac [Newton]', app: 'an English [mathematician]', be: 'was', main: 'described the laws of [motion] and [gravity]', rel: 'who' },
  { head: '[Saturn]', app: 'the sixth planet from the [Sun]', be: 'is', main: 'is [famous] for its [rings]', rel: 'which' },
  { head: 'Leonardo da [Vinci]', app: 'an Italian [painter] and inventor', be: 'was', main: '[painted] the Mona [Lisa]', rel: 'who' },
  
  { head: 'The [Sahara]', app: 'the largest hot desert in the [world]', be: 'is', main: '[covers] much of North [Africa]', rel: 'which' },
  { head: 'Mount [Everest]', app: 'the highest mountain above sea [level]', be: 'is', main: '[lies] on the border between Nepal and [China]', rel: 'which' },
];

/** Parallel lists of three. items[i].bad is a non-parallel form of items[i].ok. */
export interface ParItem { ok: string; bad: string }
export interface Parallel { lead: string; items: [ParItem, ParItem, ParItem]; lastWrong: [string, string, string]; kind: string }
export const PARALLEL: Parallel[] = [
  { lead: 'The new [laptop] is', kind: 'adjectives', items: [{ ok: 'light', bad: 'lightly' }, { ok: 'fast', bad: 'speed' }, { ok: 'reliable', bad: 'reliably' }], lastWrong: ['reliably', 'reliability', 'it is reliable'] },
  { lead: 'The course teaches [children] to', kind: 'base verbs after "to"', items: [{ ok: 'read', bad: 'reading' }, { ok: 'write', bad: 'writing' }, { ok: 'count', bad: 'counting' }], lastWrong: ['counting', 'counted', 'to counting'] },
  { lead: "The museum's [collection] includes", kind: 'nouns', items: [{ ok: 'paintings', bad: 'painted' }, { ok: 'sculptures', bad: 'sculpting' }, { ok: 'photographs', bad: 'photographing' }], lastWrong: ['photographing', 'photographed', 'to photograph'] },
  { lead: 'Her favorite [activities] are', kind: 'gerunds', items: [{ ok: 'hiking', bad: 'to hike' }, { ok: 'swimming', bad: 'swims' }, { ok: 'painting', bad: 'to paint' }], lastWrong: ['to paint', 'paints', 'she paints'] },
  { lead: 'A good [researcher] must be', kind: 'adjectives', items: [{ ok: 'curious', bad: 'curiosity' }, { ok: 'patient', bad: 'patiently' }, { ok: 'careful', bad: 'carefully' }], lastWrong: ['carefully', 'care', 'with care'] },
  { lead: 'The [job] requires', kind: 'nouns', items: [{ ok: 'patience', bad: 'patient' }, { ok: 'creativity', bad: 'creative' }, { ok: 'honesty', bad: 'honest' }], lastWrong: ['honest', 'honestly', 'is honest'] },
  { lead: 'The [athletes] trained', kind: 'adverbs', items: [{ ok: 'regularly', bad: 'regular' }, { ok: 'carefully', bad: 'careful' }, { ok: 'patiently', bad: 'patient' }], lastWrong: ['patient', 'patience', 'with patient'] },
  { lead: 'The new [policy] will', kind: 'base-form verb phrases after "will"', items: [{ ok: 'reduce costs', bad: 'reducing costs' }, { ok: 'save energy', bad: 'saving energy' }, { ok: 'protect jobs', bad: 'protecting jobs' }], lastWrong: ['protecting jobs', 'protects jobs', 'to protecting jobs'] },
  { lead: 'The [students] were asked to', kind: 'base verbs after "to"', items: [{ ok: 'read the article', bad: 'reading the article' }, { ok: 'summarize it', bad: 'summarizing it' }, { ok: 'discuss it', bad: 'discussing it' }], lastWrong: ['discussing it', 'discussed it', 'to discussing it'] },
  { lead: 'The [volunteers]', kind: 'past-tense verb phrases', items: [{ ok: 'cleaned the beach', bad: 'cleaning the beach' }, { ok: 'planted trees', bad: 'planting trees' }, { ok: 'repaired the fence', bad: 'repairing the fence' }], lastWrong: ['repairing the fence', 'to repair the fence', 'the fence was repaired'] },
];

/** Comparatives and superlatives (true facts). */
export interface Comp { a: string; comp: string; wrong: [string, string, string]; b: string; badWE: string }
export const COMP: Comp[] = [
  { a: '[Lead]', comp: 'heavier', wrong: ['more heavy', 'heaviest', 'more heavier'], b: '[aluminum]', badWE: 'more heavier' },
  { a: 'The Pacific [Ocean]', comp: 'larger', wrong: ['more large', 'largest', 'more larger'], b: 'the [Atlantic]', badWE: 'more larger' },
  { a: '[Diamonds]', comp: 'harder', wrong: ['more hard', 'hardest', 'more harder'], b: '[glass]', badWE: 'more harder' },
  { a: '[Platinum]', comp: 'rarer', wrong: ['the rarer', 'rarest', 'more rarer'], b: '[silver]', badWE: 'more rarer' },
  { a: 'A [cheetah]', comp: 'faster', wrong: ['more fast', 'fastest', 'more faster'], b: 'a [lion]', badWE: 'more faster' },
  { a: '[Copper]', comp: 'more conductive', wrong: ['most conductive', 'conductive more', 'the more conductive'], b: '[iron]', badWE: 'most conductive' },
];
export interface Sup { a: string; ok: string; wrong: [string, string, string]; noun: string; rest: string; badWE: string }
export const SUP: Sup[] = [
  { a: '[Jupiter]', ok: 'the largest', wrong: ['largest', 'the larger', 'the most large'], noun: 'planet', rest: 'in the solar [system]', badWE: 'the larger' },
  { a: '[Mercury]', ok: 'the smallest', wrong: ['smallest', 'the smaller', 'the most small'], noun: 'planet', rest: 'in the solar [system]', badWE: 'the smaller' },
  { a: 'The blue [whale]', ok: 'the largest', wrong: ['largest', 'the larger', 'the most large'], noun: 'animal', rest: 'alive [today]', badWE: 'the most large' },
  { a: '[Russia]', ok: 'the largest', wrong: ['largest', 'the larger', 'the most large'], noun: 'country', rest: 'in the world by [area]', badWE: 'the larger' },
];

/** Inversion after negative / limiting expressions. bad[0] is normal (uninverted) order. */
export interface Inv { lead: string; ok: string; bad: [string, string, string]; rest: string; cue: string }
export const INV: Inv[] = [
  { lead: '[Rarely]', cue: 'Rarely', ok: 'does it snow', bad: ['it snows', 'it does snow', 'snows it'], rest: '[in] the [Sahara] [Desert]' },
  { lead: '[Seldom]', cue: 'Seldom', ok: 'do wild bears attack', bad: ['wild bears attack', 'wild bears do attack', 'attack wild bears'], rest: '[people] [unless] the bears feel [threatened]' },
  { lead: 'Never [before]', cue: 'Never before', ok: 'had the city seen', bad: ['the city had seen', 'the city saw', 'saw the city'], rest: '[such] a [large] [crowd]' },
  { lead: 'Only in recent [decades]', cue: 'Only in recent decades', ok: 'have scientists begun', bad: ['scientists have begun', 'scientists began', 'begun scientists have'], rest: 'to [fully] [understand] how sleep affects [memory]' },
  { lead: 'Not [only]', cue: 'Not only', ok: 'does the plant provide', bad: ['the plant provides', 'the plant does provide', 'provides the plant'], rest: '[food], [but] it also prevents soil [erosion]' },
  { lead: 'Hardly [ever]', cue: 'Hardly ever', ok: 'do large comets pass', bad: ['large comets pass', 'large comets do pass', 'pass large comets'], rest: '[this] [close] to [Earth]' },
  { lead: 'Under no [circumstances]', cue: 'Under no circumstances', ok: 'should visitors feed', bad: ['visitors should feed', 'visitors feed', 'feed visitors should'], rest: 'the [wild] [animals] in the [park]' },
  { lead: 'Not until the [1960s]', cue: 'Not until', ok: 'did humans travel', bad: ['humans traveled', 'humans did travel', 'traveled humans'], rest: '[into] [outer] [space]' },
  { lead: 'Only after the [storm]', cue: 'Only after', ok: 'did the rescue teams reach', bad: ['the rescue teams reached', 'the rescue teams did reach', 'reached the rescue teams'], rest: 'the [isolated] [mountain] [village]' },
  { lead: '[Little]', cue: 'Little', ok: 'did the early settlers know', bad: ['the early settlers knew', 'the early settlers did know', 'knew the early settlers'], rest: '[about] the [harsh] [winters]' },
  { lead: 'So [rare]', cue: 'So rare', ok: 'is this orchid', bad: ['this orchid is', 'is it this orchid', 'this orchid'], rest: 'that few [botanists] have [seen] it in the [wild]' },
  { lead: '[Rarely]', cue: 'Rarely', ok: 'is the summit visible', bad: ['the summit is visible', 'the summit visible is', 'visible the summit is'], rest: '[through] the [thick] [clouds]' },
];
