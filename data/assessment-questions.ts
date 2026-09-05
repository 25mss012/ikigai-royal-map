import type { AssessmentQuestion } from "@/types";

function q(id: string, dimension: AssessmentQuestion["dimension"], en: string, ta: string, exampleEn: string, exampleTa: string): AssessmentQuestion {
  return { id, dimension, en, ta, exampleEn, exampleTa };
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // A. Love & energy (8)
  q("love1", "love", "Which activities leave you feeling more alive afterwards?", "எந்தச் செயல்களுக்குப் பிறகு நீங்கள் அதிக உயிர்ப்புடன் உணர்கிறீர்கள்?", "Example: gardening, cooking, teaching, walking.", "எடுத்துக்காட்டு: தோட்டம், சமையல், கற்பித்தல், நடை."),
  q("love2", "love", "What subjects do you explore even without external pressure?", "வெளி அழுத்தம் இல்லாமலே நீங்கள் ஆராயும் தலைப்புகள் எவை?", "Example: history videos, recipes, Fixing things.", "எடுத்துக்காட்டு: வரலாறு, சமையல் குறிப்பு, பழுது பார்த்தல்."),
  q("love3", "love", "What kind of problem makes you curious rather than tired?", "எந்த வகைப் பிரச்சினை உங்களுக்குச் சோர்வுக்குப் பதில் ஆர்வம் தருகிறது?", "Example: puzzles, people’s stories, how things work.", "எடுத்துக்காட்டு: புதிர், மனிதக் கதைகள், இயந்திரங்கள்."),
  q("love4", "love", "What would you still do in a small way even on a busy week?", "மிகவும் வேலை நிறைந்த வாரத்திலும் சிறிய அளவில் செய்யும் செயல் எது?", "Example: a short walk, sketching, calling a friend.", "எடுத்துக்காட்டு: குறு நடை, வரைதல், நண்பருடன் பேசுதல்."),
  q("love5", "love", "Which past moments felt joyful while doing them, not just after?", "செய்யும்போதே மகிழ்ச்சி தந்த கடந்த தருணங்கள் எவை?", "Example: playing music, volunteering, learning.", "எடுத்துக்காட்டு: இசை, தன்னார்வம், கற்றல்."),
  q("love6", "love", "What do you enjoy talking about with others?", "மற்றவர்களுடன் எதைப் பற்றிப் பேச விரும்புகிறீர்கள்?", "Example: films, sports, community news, ideas.", "எடுத்துக்காட்டு: திரைப்படம், விளையாட்டு, ஊர் செய்தி."),
  q("love7", "love", "What small pleasures restore your energy?", "எந்தச் சிறு மகிழ்ச்சிகள் உங்கள் ஆற்றலை மீட்கின்றன?", "Example: tea in quiet, morning light, tidying.", "எடுத்துக்காட்டு: அமைதியில் தேநீர், காலை ஒளி."),
  q("love8", "love", "What would you try if trying were easy and low-cost?", "முயற்சி எளிதாகவும் குறைந்த செலவிலும் இருந்தால் எதை முயல்வீர்கள்?", "Example: a new recipe, language, craft, route.", "எடுத்துக்காட்டு: புது சமையல், மொழி, கைவினை."),
  // B. Strengths & skills (8)
  q("str1", "strength", "What do people naturally ask you to help with?", "மக்கள் இயல்பாக உங்களிடம் எதற்கு உதவி கேட்கிறார்கள்?", "Example: phone settings, homework, listening.", "எடுத்துக்காட்டு: கைப்பேசி அமைப்பு, வீட்டுப்பாடம்."),
  q("str2", "strength", "Which skill have you improved through practice?", "பயிற்சியால் நீங்கள் மேம்படுத்திய திறன் எது?", "Example: cooking, driving, writing, sewing.", "எடுத்துக்காட்டு: சமையல், ஓட்டுதல், எழுதுதல்."),
  q("str3", "strength", "What kind of challenge can you patiently work through?", "எந்த வகைச் சவாலைப் பொறுமையாகச் சமாளிப்பீர்கள்?", "Example: long repairs, detailed work, practice.", "எடுத்துக்காட்டு: நீண்ட பழுது, நுணுக்க வேலை."),
  q("str4", "strength", "What do you learn faster than most people around you?", "சுற்றியுள்ளவர்களைவிட விரைவாகக் கற்கும் விஷயம் எது?", "Example: new apps, songs, routes, rules.", "எடுத்துக்காட்டு: புது செயலிகள், பாடல்கள்."),
  q("str5", "strength", "What careful work do others trust you with?", "எந்தக் கவனமான வேலையை மற்றவர்கள் உங்களிடம் நம்பி ஒப்படைக்கிறார்கள்?", "Example: accounts, childcare, organising.", "எடுத்துக்காட்டு: கணக்கு, குழந்தை பராமரிப்பு."),
  q("str6", "strength", "What have you built, fixed, grown, or organised?", "நீங்கள் உருவாக்கிய / சரிசெய்த / வளர்த்த / ஒழுங்கு செய்தது எது?", "Example: a shelf, garden, event, group.", "எடுத்துக்காட்டு: அலமாரி, தோட்டம், நிகழ்ச்சி."),
  q("str7", "strength", "What feedback have you received about doing something well?", "நன்றாகச் செய்ததாக என்ன பாராட்டு பெற்றுள்ளீர்கள்?", "Example: calm explaining, patience, neat work.", "எடுத்துக்காட்டு: அமைதியான விளக்கம், நேர்த்தி."),
  q("str8", "strength", "What can you keep doing even when it gets a little hard?", "சற்று கடினமானாலும் தொடரக்கூடிய செயல் எது?", "Example: practice, walking uphill, studying.", "எடுத்துக்காட்டு: பயிற்சி, மேடேற்ற நடை."),
  // C. Contribution & care (8)
  q("con1", "contribution", "Which people, communities, or problems do you genuinely care about?", "எந்த மனிதர்கள், சமூகங்கள், பிரச்சினைகள் பற்றி உண்மையில் அக்கறை கொள்கிறீர்கள்?", "Example: elders, children, street, animals.", "எடுத்துக்காட்டு: முதியோர், குழந்தைகள், தெரு."),
  q("con2", "contribution", "What improvement would you like to see around you?", "உங்களைச் சுற்றி என்ன முன்னேற்றம் காண விரும்புகிறீர்கள்?", "Example: cleaner park, kinder classroom.", "எடுத்துக்காட்டு: தூய பூங்கா, அன்பான வகுப்பு."),
  q("con3", "contribution", "When have you felt useful to someone else?", "எப்போது மற்றவருக்குப் பயனுள்ளதாக உணர்ந்தீர்கள்?", "Example: helped a neighbour, listened well.", "எடுத்துக்காட்டு: அண்டை வீட்டாருக்கு உதவி."),
  q("con4", "contribution", "What small need do you notice that others overlook?", "மற்றவர்கள் கவனிக்காத எந்தச் சிறு தேவையை நீங்கள் காண்கிறீர்கள்?", "Example: lonely person, broken step, litter.", "எடுத்துக்காட்டு: தனிமையில் ஒருவர், உடைந்த படி."),
  q("con5", "contribution", "What kind of help feels natural for you to give?", "எந்த வகை உதவி உங்களுக்கு இயல்பாக வருகிறது?", "Example: time, food, repair, company.", "எடுத்துக்காட்டு: நேரம், உணவு, பழுது."),
  q("con6", "contribution", "Who has helped you, and how might you pass it on?", "யார் உங்களுக்கு உதவினர்? அதை எப்படி முன்னெடுப்பீர்கள்?", "Example: a teacher; tutor one child.", "எடுத்துக்காட்டு: ஆசிரியர்; ஒரு குழந்தைக்கு உதவி."),
  q("con7", "contribution", "What place do you want to care for better?", "எந்த இடத்தைச் சிறப்பாகப் பராமரிக்க விரும்புகிறீர்கள்?", "Example: home, street, school, temple ground.", "எடுத்துக்காட்டு: வீடு, தெரு, பள்ளி."),
  q("con8", "contribution", "What could you share even if you have little money?", "பணம் குறைவாக இருந்தாலும் எதைப் பகிர முடியும்?", "Example: time, skill, seeds, stories.", "எடுத்துக்காட்டு: நேரம், திறன், விதைகள்."),
  // D. Values & meaning (8)
  q("val1", "values", "Which principles guide your difficult decisions?", "கடின முடிவுகளில் உங்களை வழிநடத்தும் கொள்கைகள் எவை?", "Example: honesty, kindness, fairness.", "எடுத்துக்காட்டு: நேர்மை, கருணை, நியாயம்."),
  q("val2", "values", "What kind of life would feel meaningful even if nobody applauded?", "யாரும் பாராட்டாவிட்டாலும் அர்த்தமுள்ள வாழ்க்கை எது?", "Example: quiet care, steady learning.", "எடுத்துக்காட்டு: அமைதியான பராமரிப்பு."),
  q("val3", "values", "What would you protect when choices become difficult?", "தேர்வுகள் கடினமாகும்போது எதைப் பாதுகாப்பீர்கள்?", "Example: family time, health, trust.", "எடுத்துக்காட்டு: குடும்ப நேரம், நம்பிக்கை."),
  q("val4", "values", "When did you feel proud of how you acted, not what you achieved?", "எதைச் சாதித்தீர்கள் என்பதால் அல்லாமல் எப்படி நடந்தீர்கள் என்பதால் பெருமை அடைந்தீர்கள்?", "Example: stayed kind under pressure.", "எடுத்துக்காட்டு: அழுத்தத்திலும் அன்பு."),
  q("val5", "values", "What tradition, faith, or philosophy steadies you?", "எந்த மரபு / நம்பிக்கை / தத்துவம் உங்களை நிலைப்படுத்துகிறது?", "Any background welcome; or none.", "எந்தப் பின்னணியும் சரி; இல்லாவிட்டாலும் சரி."),
  q("val6", "values", "What does enough look like for you?", "உங்களுக்குப் ‘போதும்’ என்பது எப்படி இருக்கும்?", "Example: simple meals, time, calm home.", "எடுத்துக்காட்டு: எளிய உணவு, அமைதி."),
  q("val7", "values", "What do you want to be remembered for in small ways?", "சிறு வழிகளில் எதற்காக நினைவுகூரப்பட விரும்புகிறீர்கள்?", "Example: listening, fairness, humour.", "எடுத்துக்காட்டு: கேட்டல், நியாயம்."),
  q("val8", "values", "What responsibility feels worth keeping?", "எந்தப் பொறுப்பு தொடரத் தகுந்ததாக உணர்கிறது?", "Example: caring for parent, garden, study.", "எடுத்துக்காட்டு: பெற்றோர் பராமரிப்பு."),
  // E. Flow & lifestyle fit (8)
  q("flo1", "flow", "Which activities make you lose track of time in a good way?", "எந்தச் செயல்களில் நல்ல வகையில் நேரம் மறக்கிறது?", "Example: drawing, coding, cooking, play.", "எடுத்துக்காட்டு: வரைதல், சமையல், விளையாட்டு."),
  q("flo2", "flow", "Do you prefer focused solitude, collaboration, or a mix?", "தனித்த கவனம், கூட்டு முயற்சி, கலவை — எது விருப்பம்?", "There is no wrong answer.", "தவறான பதில் இல்லை."),
  q("flo3", "flow", "What pace of life helps you do your best work?", "எந்த வாழ்க்கை வேகம் உங்கள் சிறப்புக்கு உதவுகிறது?", "Example: slow mornings, short sprints.", "எடுத்துக்காட்டு: மெதுவான காலை, குறு ஓட்டம்."),
  q("flo4", "flow", "What setting helps you concentrate?", "எந்தச் சூழல் கவனம் செலுத்த உதவுகிறது?", "Example: quiet room, nature, busy café.", "எடுத்துக்காட்டு: அமைதி அறை, இயற்கை."),
  q("flo5", "flow", "What challenge level keeps you engaged without worry?", "கவலை இல்லாமல் ஈடுபாடு தரும் சவால் அளவு எது?", "Not too easy, not too hard.", "மிக எளிதும் அல்ல, மிக கடினமும் அல்ல."),
  q("flo6", "flow", "What routine helps you start easily?", "எளிதில் தொடங்க உதவும் வழக்கம் எது?", "Example: clear table, timer, music.", "எடுத்துக்காட்டு: மேசை சுத்தம், நேர அளவி."),
  q("flo7", "flow", "What kind of rest restores you best?", "எந்த ஓய்வு உங்களைச் சிறப்பாக மீட்கிறது?", "Example: nap, walk, prayer, chat.", "எடுத்துக்காட்டு: குட்டித் தூக்கம், நடை."),
  q("flo8", "flow", "What would a kind, realistic week include for you?", "அன்பான, யதார்த்தமான வாரம் எதை உள்ளடக்கும்?", "Example: work, rest, people, play.", "எடுத்துக்காட்டு: வேலை, ஓய்வு, உறவு."),
];
