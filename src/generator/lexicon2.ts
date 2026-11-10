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
  { pp: 'Painted', ing: 'Painting', base: 'Paint', rest: 'in the sixteenth [century]', subj: 'the [portrait]', main: 'hangs in a national [museum]' },
  { pp: 'Discovered', ing: 'Discovering', base: 'Discover', rest: 'by [accident]', subj: '[penicillin]', main: 'changed modern [medicine]' },
  { pp: 'Designed', ing: 'Designing', base: 'Design', rest: 'by a famous [architect]', subj: 'the [stadium]', main: 'can hold sixty thousand [people]' },
  { pp: 'Located', ing: 'Locating', base: 'Locate', rest: 'near the [coast]', subj: 'the [town]', main: 'attracts many [tourists] in summer' },
  { pp: 'Translated', ing: 'Translating', base: 'Translate', rest: 'into forty [languages]', subj: 'the [novel]', main: 'has sold millions of [copies]' },
  { pp: 'Made', ing: 'Making', base: 'Make', rest: 'from recycled [plastic]', subj: 'the [bags]', main: 'are strong and [cheap]' },
  { pp: 'Known', ing: 'Knowing', base: 'Know', rest: 'for its hot [springs]', subj: 'the [region]', main: 'attracts visitors all [year]' },
  { pp: 'Grown', ing: 'Growing', base: 'Grow', rest: 'in warm [climates]', subj: '[coffee] plants', main: 'need plenty of [rain]' },
  { pp: 'Protected', ing: 'Protecting', base: 'Protect', rest: 'by strict [laws]', subj: 'the [forest]', main: 'is home to many rare [birds]' },
  { pp: 'Damaged', ing: 'Damaging', base: 'Damage', rest: 'by the [earthquake]', subj: 'the old [bridge]', main: 'was closed for [repairs]' },
];
export interface OpeningIng { ing: string; past: string; rest: string; subj: string; main: string }
export const OPENING_ING: OpeningIng[] = [
  { ing: 'Using', past: 'Used', rest: 'satellite [data]', subj: 'the [researchers]', main: 'mapped the [coastline]' },
  { ing: 'Working', past: 'Worked', rest: 'late into the [night]', subj: 'the [engineers]', main: 'repaired the [system]' },
  { ing: 'Hoping', past: 'Hoped', rest: 'to find [gold]', subj: 'thousands of [settlers]', main: 'moved to [California]' },
  { ing: 'Comparing', past: 'Compared', rest: 'the two [samples]', subj: 'the [scientist]', main: 'noticed a small [difference]' },
  { ing: 'Studying', past: 'Studied', rest: 'the fossil [record]', subj: 'the [paleontologists]', main: 'identified a new [species]' },
  { ing: 'Realizing', past: 'Realized', rest: 'the [danger]', subj: 'the [pilot]', main: 'turned the plane [around]' },
  { ing: 'Measuring', past: 'Measured', rest: 'the [temperature] every hour', subj: 'the [team]', main: 'recorded a sudden [drop]' },
  { ing: 'Observing', past: 'Observed', rest: 'the night [sky]', subj: 'early [astronomers]', main: 'tracked the movement of the [planets]' },
  { ing: 'Combining', past: 'Combined', rest: 'two [chemicals]', subj: 'the [student]', main: 'produced a bright blue [liquid]' },
  { ing: 'Interviewing', past: 'Interviewed', rest: 'hundreds of [workers]', subj: 'the [researchers]', main: 'learned about working [conditions]' },
  { ing: 'Following', past: 'Followed', rest: 'the [river]', subj: 'the [explorers]', main: 'finally reached the [coast]' },
  { ing: 'Testing', past: 'Tested', rest: 'the new [vaccine]', subj: 'the [doctors]', main: 'found it safe and [effective]' },
  { ing: 'Wanting', past: 'Wanted', rest: 'to save [money]', subj: 'many [families]', main: 'grew their own [vegetables]' },
  { ing: 'Leaving', past: 'Left', rest: 'the [harbor] at dawn', subj: 'the [fishermen]', main: 'returned with a large [catch]' },
];
export interface Reduced { head: string; plural: boolean; pp: string; ing: string; by: string; main: string }
export const REDUCED: Reduced[] = [
  { head: 'The [data]', plural: true, pp: 'collected', ing: 'collecting', by: 'by the [satellite]', main: 'were sent to [laboratories] around the world' },
  { head: 'The [bridge]', plural: false, pp: 'designed', ing: 'designing', by: 'by a young [engineer]', main: 'won an international [prize]' },
  { head: 'The [samples]', plural: true, pp: 'taken', ing: 'taking', by: 'from the [lake]', main: 'contained high levels of [mercury]' },
  { head: 'The [houses]', plural: true, pp: 'damaged', ing: 'damaging', by: 'by the [storm]', main: 'were [rebuilt] within a year' },
  { head: 'The [paintings]', plural: true, pp: 'displayed', ing: 'displaying', by: 'in the main [hall]', main: 'are more than two hundred years [old]' },
  { head: 'The [letters]', plural: true, pp: 'written', ing: 'writing', by: 'by the [soldiers]', main: 'were published after the [war]' },
  { head: 'The [medicine]', plural: false, pp: 'prescribed', ing: 'prescribing', by: 'by the [doctor]', main: 'quickly reduced the [fever]' },
  { head: 'The [products]', plural: true, pp: 'made', ing: 'making', by: 'in this [factory]', main: 'are exported to many [countries]' },
  { head: 'The [money]', plural: false, pp: 'raised', ing: 'raising', by: 'at the [concert]', main: 'was donated to a local [hospital]' },
  { head: 'The [photographs]', plural: true, pp: 'taken', ing: 'taking', by: 'during the [expedition]', main: 'show the glacier in [1920]' },
  { head: 'The [rules]', plural: true, pp: 'established', ing: 'establishing', by: 'by the [committee]', main: 'apply to all [members]' },
  { head: 'The [tools]', plural: true, pp: 'found', ing: 'finding', by: 'in the [cave]', main: 'are about ten thousand years [old]' },
  { head: 'The [speech]', plural: false, pp: 'given', ing: 'giving', by: 'by the [president]', main: 'lasted almost an [hour]' },
  { head: 'The [water]', plural: false, pp: 'used', ing: 'using', by: 'in the [factory]', main: 'comes from a nearby [river]' },
  { head: 'The [results]', plural: true, pp: 'reported', ing: 'reporting', by: 'in the [study]', main: 'surprised many [experts]' },
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
  { lead: 'The tour [guide] spoke', kind: 'adverbs', items: [{ ok: 'clearly', bad: 'clear' }, { ok: 'slowly', bad: 'slow' }, { ok: 'politely', bad: 'polite' }], lastWrong: ['polite', 'politeness', 'with polite'] },
  { lead: 'The [apartment] is', kind: 'adjectives', items: [{ ok: 'spacious', bad: 'space' }, { ok: 'bright', bad: 'brightly' }, { ok: 'quiet', bad: 'quietly' }], lastWrong: ['quietly', 'quietness', 'in quiet'] },
  { lead: 'Regular [exercise] can', kind: 'base-form verb phrases after "can"', items: [{ ok: 'improve sleep', bad: 'improving sleep' }, { ok: 'reduce stress', bad: 'reducing stress' }, { ok: 'strengthen the heart', bad: 'strengthening the heart' }], lastWrong: ['strengthening the heart', 'strengthens the heart', 'to strengthen the heart'] },
  { lead: 'The [manager] asked the staff to', kind: 'base verbs after "to"', items: [{ ok: 'arrive early', bad: 'arriving early' }, { ok: 'dress formally', bad: 'dressing formally' }, { ok: 'greet every customer', bad: 'greeting every customer' }], lastWrong: ['greeting every customer', 'greeted every customer', 'to greeting every customer'] },
  { lead: 'The [scientists]', kind: 'past-tense verb phrases', items: [{ ok: 'collected samples', bad: 'collecting samples' }, { ok: 'analyzed the data', bad: 'analyzing the data' }, { ok: 'published the results', bad: 'publishing the results' }], lastWrong: ['publishing the results', 'to publish the results', 'the results were published'] },
  { lead: 'Many [tourists] enjoy', kind: 'gerunds', items: [{ ok: 'visiting museums', bad: 'to visit museums' }, { ok: 'tasting local food', bad: 'taste local food' }, { ok: 'shopping in markets', bad: 'to shop in markets' }], lastWrong: ['to shop in markets', 'shop in markets', 'they shop in markets'] },
  { lead: 'A successful [leader] is', kind: 'adjectives', items: [{ ok: 'confident', bad: 'confidence' }, { ok: 'decisive', bad: 'decisively' }, { ok: 'fair', bad: 'fairness' }], lastWrong: ['fairness', 'fairly', 'with fairness'] },
  { lead: 'The [report] was', kind: 'adjectives', items: [{ ok: 'accurate', bad: 'accurately' }, { ok: 'detailed', bad: 'detail' }, { ok: 'clear', bad: 'clarity' }], lastWrong: ['clarity', 'with clarity', 'in clarity'] },
  { lead: 'The [children] were taught to', kind: 'base verbs after "to"', items: [{ ok: 'share', bad: 'sharing' }, { ok: 'listen', bad: 'listening' }, { ok: 'cooperate', bad: 'cooperating' }], lastWrong: ['cooperating', 'cooperation', 'to cooperating'] },
  { lead: 'The [engineers] worked', kind: 'adverbs', items: [{ ok: 'quickly', bad: 'quick' }, { ok: 'efficiently', bad: 'efficient' }, { ok: 'safely', bad: 'safe' }], lastWrong: ['safe', 'safety', 'with safe'] },
  { lead: 'The [hotel] provides', kind: 'nouns', items: [{ ok: 'comfort', bad: 'comfortable' }, { ok: 'security', bad: 'secure' }, { ok: 'convenience', bad: 'convenient' }], lastWrong: ['convenient', 'conveniently', 'is convenient'] },
  { lead: 'The new [law] will', kind: 'base-form verb phrases after "will"', items: [{ ok: 'protect forests', bad: 'protecting forests' }, { ok: 'limit pollution', bad: 'limiting pollution' }, { ok: 'create parks', bad: 'creating parks' }], lastWrong: ['creating parks', 'creates parks', 'to creating parks'] },
  { lead: 'The [villagers]', kind: 'past-tense verb phrases', items: [{ ok: 'built a school', bad: 'building a school' }, { ok: 'dug a well', bad: 'digging a well' }, { ok: 'planted crops', bad: 'planting crops' }], lastWrong: ['planting crops', 'to plant crops', 'crops were planted'] },
  { lead: 'His [hobbies] include', kind: 'gerunds', items: [{ ok: 'reading', bad: 'to read' }, { ok: 'cooking', bad: 'cooks' }, { ok: 'gardening', bad: 'to garden' }], lastWrong: ['to garden', 'he gardens', 'garden'] },
  { lead: 'The [weather] was', kind: 'adjectives', items: [{ ok: 'cold', bad: 'coldly' }, { ok: 'windy', bad: 'wind' }, { ok: 'rainy', bad: 'rain' }], lastWrong: ['rain', 'rainily', 'with rain'] },
  { lead: 'Students in the [course] learn to', kind: 'base verbs after "to"', items: [{ ok: 'plan experiments', bad: 'planning experiments' }, { ok: 'record data', bad: 'recording data' }, { ok: 'write reports', bad: 'writing reports' }], lastWrong: ['writing reports', 'wrote reports', 'to writing reports'] },
  { lead: 'The [nurse] treated patients', kind: 'adverbs', items: [{ ok: 'gently', bad: 'gentle' }, { ok: 'calmly', bad: 'calm' }, { ok: 'professionally', bad: 'professional' }], lastWrong: ['professional', 'profession', 'with professional'] },
  { lead: 'The [city] is famous for its', kind: 'nouns', items: [{ ok: 'architecture', bad: 'architectural' }, { ok: 'history', bad: 'historical' }, { ok: 'culture', bad: 'cultural' }], lastWrong: ['cultural', 'culturally', 'is cultural'] },
];

/** Comparatives and superlatives (true facts). */
export interface Comp { a: string; /** verb to use; else guessed from a */ be?: string; /** a is a proper noun (never lowercased) */ proper?: boolean; comp: string; wrong: [string, string, string]; b: string; badWE: string }
export const COMP: Comp[] = [
  { a: '[Lead]', comp: 'heavier', wrong: ['more heavy', 'heaviest', 'more heavier'], b: '[aluminum]', badWE: 'more heavier' },
  { a: 'The Pacific [Ocean]', comp: 'larger', wrong: ['more large', 'largest', 'more larger'], b: 'the [Atlantic]', badWE: 'more larger' },
  { a: '[Diamonds]', comp: 'harder', wrong: ['more hard', 'hardest', 'more harder'], b: '[glass]', badWE: 'more harder' },
  { a: '[Platinum]', comp: 'rarer', wrong: ['the rarer', 'rarest', 'more rarer'], b: '[silver]', badWE: 'more rarer' },
  { a: 'A [cheetah]', comp: 'faster', wrong: ['more fast', 'fastest', 'more faster'], b: 'a [lion]', badWE: 'more faster' },
  { a: '[Copper]', comp: 'more conductive', wrong: ['most conductive', 'conductive more', 'the more conductive'], b: '[iron]', badWE: 'most conductive' },
  { a: '[Gold]', be: 'is', comp: 'denser', wrong: ['more dense', 'densest', 'more denser'], b: '[lead]', badWE: 'more denser' },
  { a: 'The [Sun]', be: 'is', comp: 'hotter', wrong: ['more hot', 'hottest', 'more hotter'], b: 'any [planet]', badWE: 'more hotter' },
  { a: '[Air]', be: 'is', comp: 'lighter', wrong: ['more light', 'lightest', 'more lighter'], b: '[water]', badWE: 'more lighter' },
  { a: 'Mount [Everest]', be: 'is', proper: true, comp: 'higher', wrong: ['more high', 'highest', 'more higher'], b: 'Mont [Blanc]', badWE: 'more higher' },
  { a: 'The [Amazon]', be: 'is', comp: 'longer', wrong: ['more long', 'longest', 'more longer'], b: 'the [Mississippi]', badWE: 'more longer' },
  { a: '[Elephants]', be: 'are', comp: 'heavier', wrong: ['more heavy', 'heaviest', 'more heavier'], b: '[horses]', badWE: 'more heavier' },
  { a: '[Steel]', be: 'is', comp: 'stronger', wrong: ['more strong', 'strongest', 'more stronger'], b: '[wood]', badWE: 'more stronger' },
  { a: '[Light]', be: 'is', comp: 'faster', wrong: ['more fast', 'fastest', 'more faster'], b: '[sound]', badWE: 'more faster' },
  { a: 'A [tortoise]', be: 'is', comp: 'slower', wrong: ['more slow', 'slowest', 'more slower'], b: 'a [rabbit]', badWE: 'more slower' },
  { a: '[Antarctica]', be: 'is', proper: true, comp: 'colder', wrong: ['more cold', 'coldest', 'more colder'], b: 'the [Arctic]', badWE: 'more colder' },
  { a: '[Asia]', be: 'is', proper: true, comp: 'bigger', wrong: ['more big', 'biggest', 'more bigger'], b: '[Europe]', badWE: 'more bigger' },
  { a: 'A [marathon]', be: 'is', comp: 'longer', wrong: ['more long', 'longest', 'more longer'], b: 'a [half] marathon', badWE: 'more longer' },
  { a: '[Rubber]', be: 'is', comp: 'more flexible', wrong: ['most flexible', 'flexible more', 'the more flexible'], b: '[glass]', badWE: 'most flexible' },
  { a: '[Silver]', be: 'is', comp: 'more valuable', wrong: ['most valuable', 'valuable more', 'the more valuable'], b: '[copper]', badWE: 'most valuable' },
  { a: '[Diamonds]', be: 'are', comp: 'more expensive', wrong: ['most expensive', 'expensive more', 'the more expensive'], b: '[glass]', badWE: 'most expensive' },
];
export interface Sup { a: string; ok: string; wrong: [string, string, string]; noun: string; rest: string; badWE: string }
export const SUP: Sup[] = [
  { a: '[Jupiter]', ok: 'the largest', wrong: ['largest', 'the larger', 'the most large'], noun: 'planet', rest: 'in the solar [system]', badWE: 'the larger' },
  { a: '[Mercury]', ok: 'the smallest', wrong: ['smallest', 'the smaller', 'the most small'], noun: 'planet', rest: 'in the solar [system]', badWE: 'the smaller' },
  { a: 'The blue [whale]', ok: 'the largest', wrong: ['largest', 'the larger', 'the most large'], noun: 'animal', rest: 'alive [today]', badWE: 'the most large' },
  { a: '[Russia]', ok: 'the largest', wrong: ['largest', 'the larger', 'the most large'], noun: 'country', rest: 'in the world by [area]', badWE: 'the larger' },
  { a: 'The [Nile]', ok: 'the longest', wrong: ['longest', 'the longer', 'the most long'], noun: 'river', rest: 'in [Africa]', badWE: 'the longer' },
  { a: 'Mount [Everest]', ok: 'the highest', wrong: ['highest', 'the higher', 'the most high'], noun: 'mountain', rest: 'on [Earth]', badWE: 'the most high' },
  { a: 'The [cheetah]', ok: 'the fastest', wrong: ['fastest', 'the faster', 'the most fast'], noun: 'land animal', rest: 'in the [world]', badWE: 'the faster' },
  { a: 'The [Pacific]', ok: 'the largest', wrong: ['largest', 'the larger', 'the most large'], noun: 'ocean', rest: 'on [Earth]', badWE: 'the larger' },
  { a: '[Antarctica]', ok: 'the coldest', wrong: ['coldest', 'the colder', 'the most cold'], noun: 'continent', rest: 'on [Earth]', badWE: 'the colder' },
  { a: '[Hydrogen]', ok: 'the lightest', wrong: ['lightest', 'the lighter', 'the most light'], noun: 'element', rest: 'in the periodic [table]', badWE: 'the lighter' },
  { a: '[Diamond]', ok: 'the hardest', wrong: ['hardest', 'the harder', 'the most hard'], noun: 'natural material', rest: 'known to [science]', badWE: 'the harder' },
  { a: '[Venus]', ok: 'the hottest', wrong: ['hottest', 'the hotter', 'the most hot'], noun: 'planet', rest: 'in the solar [system]', badWE: 'the hotter' },
  { a: 'The [Amazon]', ok: 'the largest', wrong: ['largest', 'the larger', 'the most large'], noun: 'rainforest', rest: 'in the [world]', badWE: 'the most large' },
  { a: '[Oxygen]', ok: 'the most abundant', wrong: ['most abundant', 'the more abundant', 'the abundantest'], noun: 'element', rest: "in Earth's [crust]", badWE: 'the more abundant' },
  { a: 'The [giraffe]', ok: 'the tallest', wrong: ['tallest', 'the taller', 'the most tall'], noun: 'animal', rest: 'in the [world]', badWE: 'the taller' },
  { a: '[Mercury]', ok: 'the closest', wrong: ['closest', 'the closer', 'the most close'], noun: 'planet', rest: 'to the [Sun]', badWE: 'the closer' },
  { a: 'Lake [Baikal]', ok: 'the deepest', wrong: ['deepest', 'the deeper', 'the most deep'], noun: 'lake', rest: 'in the [world]', badWE: 'the deeper' },
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
