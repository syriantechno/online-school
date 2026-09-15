/**
 * قاموس أحرف عربية → كلمات صحيحة تبدأ بالحرف + قصص طويلة.
 */
export const ARABIC_LETTERS = [
    'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
    'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي',
];

function startsWithLetter(word, letter) {
    const first = String(word || '').trim()[0];
    if (!first) {
        return false;
    }
    if (letter === 'أ') {
        return ['أ', 'ا', 'إ', 'آ'].includes(first);
    }
    return first === letter;
}

const catalogs = {
    أ: {
        name: 'الألف',
        story: `في صباحٍ مشرق خرج أحمد من البيت وهو يحمل تفاحة حمراء لصديقه.
في الحديقة رأى أسداً صغيراً لطيفاً يلعب قرب الزهور، فتوقف أحمد بدهشة وفرح.
قال أحمد: مرحباً أيها الأسد! هل تحب أن تأكل معي؟
ابتسم الأسد وقال: أحب حرف الألف لأنه يجمع كلمات جميلة مثل أحمد والأسد والأزهار.
جلس الصديقان تحت الشجرة، وأكلا، وضحكا، ثم رسم أحمد حرف الألف الكبير على الرمل.
وفي المساء عاد أحمد إلى البيت وهو يقول: شكراً حرف الألف… لقد صنعت لنا يوماً لا يُنسى!`,
        targets: [
            { icon: 'boy', label: 'أحمد' },
            { icon: 'cat', label: 'أسد' },
            { icon: 'flower', label: 'أزهار' },
        ],
        distractors: [
            { icon: 'balloon', label: 'بالون' },
            { icon: 'fish', label: 'سمكة' },
            { icon: 'door', label: 'باب' },
        ],
        questions: [
            { question: 'من الذي خرج إلى الحديقة؟', options: ['أحمد', 'باسم', 'سارة'], correct_index: 0 },
            { question: 'ماذا رأى أحمد في الحديقة؟', options: ['سمكة', 'أسداً', 'قمر'], correct_index: 1 },
        ],
    },
    ب: {
        name: 'الباء',
        story: `في صباح جميل أحضر باسم بالوناً أزرق كبيراً إلى الحديقة.
كان البالون يرقص مع الريح، وباسم يضحك فرحاً وهو يمسك الخيط بقوة.
قرب البركة رأى بطة صغيرة صفراء تنظر إليه بفضول.
لوّح باسم بالبالون وقال: تعالي نلعب يا بطة!
لعبا معاً بين الأشجار، ثم جلسا أمام باب البيت الخشبي الوردي.
قالت البطة: شكراً حرف الباء… بسببك صارت عندنا كلمات جميلة: بالون وبطة وباب.
وعند الغروب قال باسم: أحب حرف الباء أكثر من قبل، لأنه صنع لنا قصة مليئة بالضحك والألوان.`,
        targets: [
            { icon: 'balloon', label: 'بالون' },
            { icon: 'duck', label: 'بطة' },
            { icon: 'door', label: 'باب' },
            { icon: 'boy', label: 'باسم' },
        ],
        distractors: [
            { icon: 'apple', label: 'تفاحة' },
            { icon: 'fish', label: 'سمكة' },
            { icon: 'flower', label: 'زهرة' },
        ],
        questions: [
            { question: 'ماذا أحضر باسم إلى الحديقة؟', options: ['كتاب', 'بالون', 'مفتاح'], correct_index: 1 },
            { question: 'من لعبت مع باسم؟', options: ['القطة', 'البطة', 'الجمل'], correct_index: 1 },
            { question: 'أين جلسا في نهاية القصة؟', options: ['أمام الباب', 'فوق القمر', 'داخل السمكة'], correct_index: 0 },
        ],
    },
    ت: {
        name: 'التاء',
        story: `رسمت تالا على دفترها تفاحة حمراء كبيرة، ثم لوّنتها بعناية.
بعد الرسم صنعت تاجاً لامعاً من الورق الذهبي ووضعته على رأسها.
جاءت القطة الصغيرة توتة وقفزت بجانبها تموء بفرح.
قالت تالا: هيا يا توتة… اليوم يوم حرف التاء!
لعبتا بين التلال الصغيرة في الحديقة، ثم قرأتا قصة قصيرة معاً.
وفي المساء كتبت تالا حرف التاء مرات كثيرة وهي تقول: حرف التاء يفتح لي باب التسلية والتعلم.`,
        targets: [
            { icon: 'apple', label: 'تفاحة' },
            { icon: 'star', label: 'تاج' },
            { icon: 'cat', label: 'توتة' },
            { icon: 'girl', label: 'تالا' },
        ],
        distractors: [
            { icon: 'balloon', label: 'بالون' },
            { icon: 'moon', label: 'قمر' },
            { icon: 'door', label: 'باب' },
        ],
        questions: [
            { question: 'ماذا رسمت تالا؟', options: ['تفاحة', 'سمكة', 'جمل'], correct_index: 0 },
            { question: 'ما اسم القطة؟', options: ['نادر', 'توتة', 'وليد'], correct_index: 1 },
        ],
    },
    ج: {
        name: 'الجيم',
        story: `جلس جاد تحت شجرة جميلة في يوم ربيعي هادئ.
فجأة ظهر جمل ودود يحمل على ظهره سلة من الجبنة الطازجة.
ضحك جاد وقال: مرحباً أيها الجمل! هل جئت لتشاركنا اللعب؟
هزّ الجمل رأسه فرحاً، ثم ذهبا معاً لزيارة الجدة الطيبة في البيت المجاور.
صنعت الجدة كعكة، وجلست العائلة تضحك وتتكلم عن حرف الجيم.
قال جاد قبل النوم: حرف الجيم علّمني كلمات جميلة مثل جمل وجبنة وجدة.`,
        targets: [
            { icon: 'camel', label: 'جمل' },
            { icon: 'milk', label: 'جبنة' },
            { icon: 'girl', label: 'جدة' },
            { icon: 'boy', label: 'جاد' },
        ],
        distractors: [
            { icon: 'fish', label: 'سمكة' },
            { icon: 'book', label: 'كتاب' },
            { icon: 'sun', label: 'شمس' },
        ],
        questions: [
            { question: 'ماذا ظهر أمام جاد؟', options: ['جمل', 'بالون', 'قمر'], correct_index: 0 },
            { question: 'من زارا في القصة؟', options: ['الجدة', 'السمكة', 'الشمس'], correct_index: 0 },
        ],
    },
    د: {
        name: 'الدال',
        story: `فتح دان دفتره الأزرق وكتب حرف الدال بخط جميل.
ثم رسم دباً بنّياً ودجاجة صغيرة تمرح في الحقل.
قال دان للدب: تعال نقرأ قصة عن حرف الدال!
جلست الدجاجة قرب النافذة، وبدأ دان يروي قصة مضحكة عن دمية ودراجة.
ضحك الجميع، ورسم دان حرف الدال على الباب وعلى الدفتر عشر مرات.
وفي آخر اليوم قال: حرف الدال صديقي… يدلني دائماً على كلمات جديدة.`,
        targets: [
            { icon: 'cat', label: 'دب' },
            { icon: 'duck', label: 'دجاجة' },
            { icon: 'book', label: 'دفتر' },
            { icon: 'boy', label: 'دان' },
        ],
        distractors: [
            { icon: 'balloon', label: 'بالون' },
            { icon: 'moon', label: 'قمر' },
            { icon: 'flower', label: 'زهرة' },
        ],
        questions: [
            { question: 'ماذا فتح دان؟', options: ['دفتره', 'بالوناً', 'مفتاحاً'], correct_index: 0 },
            { question: 'أي حيوان رسمه دان مع الدجاجة؟', options: ['دب', 'جمل', 'سمكة'], correct_index: 0 },
        ],
    },
    ر: {
        name: 'الراء',
        story: `ركض رامي فوق الرمل الناعم قرب الشاطئ وهو يحمل دلوه الأحمر.
جمع أصدافاً صغيرة، ثم رأى رمانة حمراء لامعة تركها أحدهم على الطاولة.
رسم رامي على الرمل حرف الراء كبيراً، وكتب بجانبه: رمل، رامي، رمان.
مرّت رياح خفيفة فحرّكت الرمل قليلاً، فضحك رامي وقال: حتى الريح تحب حرف الراء!
عاد إلى البيت وغسل يديه، ثم رسم رمانة جديدة في دفتره.
وقبل النوم همس: حرف الراء يرنّ في أذني مثل أغنية سعيدة.`,
        targets: [
            { icon: 'boy', label: 'رامي' },
            { icon: 'apple', label: 'رمان' },
            { icon: 'sun', label: 'رمل' },
        ],
        distractors: [
            { icon: 'door', label: 'باب' },
            { icon: 'fish', label: 'سمكة' },
            { icon: 'flower', label: 'وردة' },
        ],
        questions: [
            { question: 'أين ركض رامي؟', options: ['فوق الرمل', 'فوق القمر', 'داخل الكتاب'], correct_index: 0 },
            { question: 'أي فاكهة وجد رامي؟', options: ['رمان', 'تفاحة', 'بطيخ'], correct_index: 0 },
        ],
    },
    س: {
        name: 'السين',
        story: `سبحت سارة في المسبح الصغير وهي تراقب سمكة ملونة في الحوض المجاور.
بعد السباحة جلست تحت سحابة بيضاء ناعمة تشبه القطن.
أخرجت ساعة يدها الصغيرة ونظرت إلى الوقت وقالت: حان وقت القصة!
قرأت قصة عن سفر سعيد إلى مدينة بعيدة، ثم رسمت حرف السين على الورق.
ضحكت أمها وقالت: كلماتك اليوم كلها بحرف السين… سمكة وسحابة وساعة.
نامت سارة وهي تحلم بسمكة ذهبية تسبح بين السحب.`,
        targets: [
            { icon: 'fish', label: 'سمكة' },
            { icon: 'cloud', label: 'سحابة' },
            { icon: 'sun', label: 'ساعة' },
            { icon: 'girl', label: 'سارة' },
        ],
        distractors: [
            { icon: 'balloon', label: 'بالون' },
            { icon: 'door', label: 'باب' },
            { icon: 'apple', label: 'تفاحة' },
        ],
        questions: [
            { question: 'ماذا راقبت سارة؟', options: ['سمكة', 'جمل', 'باب'], correct_index: 0 },
            { question: 'أين جلست بعد السباحة؟', options: ['تحت سحابة', 'فوق نجمة', 'داخل قمر'], correct_index: 0 },
        ],
    },
    ش: {
        name: 'الشين',
        story: `أشرقت الشمس الذهبية فوق الشجرة العالية في ساحة المدرسة.
جلست شهد تحت الشجرة وفتحت كتابها المصوّر عن حرف الشين.
رأت شارة لامعة على غلاف الكتاب، فضحكت وقالت: هذه شارة المتفوقين!
شربت رشفة شاي دافئ مع جدتها، ثم رسمت شمساً وشجرة على اللوح.
قالت الجدة: حرف الشين يضيء مثل الشمس ويعلو مثل الشجرة.
وعند الغروب همست شهد: شكراً حرف الشين على يوم مليء بالدفء والقصص.`,
        targets: [
            { icon: 'sun', label: 'شمس' },
            { icon: 'tree', label: 'شجرة' },
            { icon: 'star', label: 'شارة' },
            { icon: 'girl', label: 'شهد' },
        ],
        distractors: [
            { icon: 'duck', label: 'بطة' },
            { icon: 'key', label: 'مفتاح' },
            { icon: 'watermelon', label: 'بطيخ' },
        ],
        questions: [
            { question: 'ماذا أشرق في بداية القصة؟', options: ['الشمس', 'القمر', 'المفتاح'], correct_index: 0 },
            { question: 'أين جلست شهد؟', options: ['تحت الشجرة', 'فوق السحابة', 'داخل البالون'], correct_index: 0 },
        ],
    },
    ق: {
        name: 'القاف',
        story: `قرأ قاسم قصة طويلة عن قمر فضي يضيء القرية ليلاً.
كانت القطة الصغيرة تجلس على ركبتيه وتستمع كأنها تفهم كل كلمة.
صنع قاسم قلباً من الورق الأحمر وأهداه لأخته في غرفة القراءة.
قالت الأخت: حرف القاف في قمر وقطة وقلب… ما أجمله!
خرج قاسم مع أبيه ليشاهد القمر الحقيقي من الشرفة.
وفي السرير كتب حرف القاف مرات كثيرة قبل أن ينام سعيداً.`,
        targets: [
            { icon: 'moon', label: 'قمر' },
            { icon: 'cat', label: 'قطة' },
            { icon: 'flower', label: 'قلب' },
            { icon: 'boy', label: 'قاسم' },
        ],
        distractors: [
            { icon: 'balloon', label: 'بالون' },
            { icon: 'fish', label: 'سمكة' },
            { icon: 'door', label: 'باب' },
        ],
        questions: [
            { question: 'عن ماذا قرأ قاسم؟', options: ['عن القمر', 'عن البطة', 'عن الباب'], correct_index: 0 },
            { question: 'ماذا صنع من الورق؟', options: ['قلباً', 'مفتاحاً', 'جمل'], correct_index: 0 },
        ],
    },
    ك: {
        name: 'الكاف',
        story: `كتب كريم كلمة كتاب بخط كبير على السبورة.
ثم أمسك كرة زرقاء ولعب بها في الساحة قرب الكوخ الصغير.
دخل الكوخ الخشبي ووجد كتاباً قديماً عن الحروف العربية.
قرأ كريم قصة قصيرة، ثم رسم كوخاً وكرة وكتاباً في دفتره.
قال المعلّم: ممتاز يا كريم… كلماتك اليوم كلها بحرف الكاف.
رجع كريم إلى البيت وهو يردد: كتاب، كرة، كوخ… حرف الكاف صديقي.`,
        targets: [
            { icon: 'book', label: 'كتاب' },
            { icon: 'balloon', label: 'كرة' },
            { icon: 'house', label: 'كوخ' },
            { icon: 'boy', label: 'كريم' },
        ],
        distractors: [
            { icon: 'apple', label: 'تفاحة' },
            { icon: 'moon', label: 'قمر' },
            { icon: 'duck', label: 'بطة' },
        ],
        questions: [
            { question: 'ماذا كتب كريم على السبورة؟', options: ['كتاب', 'شمس', 'بطة'], correct_index: 0 },
            { question: 'أين وجد الكتاب القديم؟', options: ['في الكوخ', 'في القمر', 'في السمكة'], correct_index: 0 },
        ],
    },
    م: {
        name: 'الميم',
        story: `في الصباح فتحت مريم مفتاح الباب الذهبي وخرجت إلى الحديقة.
سمعت صوت مطر خفيف يطرق الأوراق، ففتحت مظلتها الصفراء الجميلة.
وجدت على الطاولة موزة ناضجة، فجلست ومسحت المطر عن وجهها بابتسامة.
قالت مريم: اليوم يوم حرف الميم… مفتاح ومطر وموز ومريم!
رسمت على دفترها موجة زرقاء صغيرة بجانب الموزة، ثم كتبت حرف الميم عشر مرات.
جاء أخوها وقال: هل نلعب لعبة الميم؟ من يجد أكثر كلمات تبدأ بميم؟
ضحكت مريم وبدأت تعدّ: مدرسة، مفتاح، مطر، موز، موجة…
وعند المساء أغلقت الباب بالمفتاح وهمست: حرف الميم ممتع مثل المطر الخفيف.`,
        targets: [
            { icon: 'key', label: 'مفتاح' },
            { icon: 'cloud', label: 'مطر' },
            { icon: 'sun', label: 'موز' },
            { icon: 'girl', label: 'مريم' },
        ],
        distractors: [
            { icon: 'door', label: 'باب' },
            { icon: 'fish', label: 'سمكة' },
            { icon: 'flower', label: 'وردة' },
        ],
        questions: [
            { question: 'بماذا فتحت مريم الباب؟', options: ['بالمفتاح', 'بالبالون', 'بالشمس'], correct_index: 0 },
            { question: 'أي فاكهة وجدت مريم؟', options: ['موز', 'رمان', 'تفاحة'], correct_index: 0 },
            { question: 'ماذا سمعت مريم في الحديقة؟', options: ['صوت المطر', 'صوت الجمل', 'صوت القمر'], correct_index: 0 },
        ],
    },
    ن: {
        name: 'النون',
        story: `نظر نادر إلى نجمة لامعة في السماء الصافية.
قطف نرجسة صفراء من الحديقة وأهداها إلى جدته مع بطاقة صغيرة.
كتبت الجدة: شكراً يا نادر… حرف النون في نجمة ونرجسة ونادر.
جلس نادر يرسم نهرًا أزرق ونخلة عالية بجانب النرجسة.
قرأ قصة عن نسر يطير فوق النهر، ثم نام وهو يحلم بالنجوم.
وفي الصباح كتب حرف النون وقال: أحب الكلمات التي تبدأ بنون.`,
        targets: [
            { icon: 'star', label: 'نجمة' },
            { icon: 'flower', label: 'نرجسة' },
            { icon: 'boy', label: 'نادر' },
        ],
        distractors: [
            { icon: 'balloon', label: 'بالون' },
            { icon: 'apple', label: 'تفاحة' },
            { icon: 'door', label: 'باب' },
        ],
        questions: [
            { question: 'إلى ماذا نظر نادر؟', options: ['نجمة', 'باب', 'جمل'], correct_index: 0 },
            { question: 'ماذا أهدى لجدته؟', options: ['نرجسة', 'مفتاح', 'بطة'], correct_index: 0 },
        ],
    },
    و: {
        name: 'الواو',
        story: `وقف وليد أمام وردة حمراء كبيرة في حديقة البيت.
كانت الوردة تتمايل مع الريح، فجلس وليد ورسم وجهه مبتسماً بجانب الوردة.
فتح ورقة بيضاء كبيرة وكتب عليها حرف الواو مرات كثيرة: و و و.
قالت أخته: انظر… وردة وولد وورقة كلها تبدأ بحرف الواو!
ضحك وليد وقال: أحب حرف الواو لأنه يصل الكلمات ببعضها مثل حبل لطيف.
حمل وردة صغيرة وورقة رسم عليها وجهاً سعيداً، ودخل البيت فرحاً.
وقبل النوم وضع الوردة في مزهرية وهمس: شكراً حرف الواو على يوم مليء بالألوان.`,
        targets: [
            { icon: 'flower', label: 'وردة' },
            { icon: 'boy', label: 'وليد' },
            { icon: 'book', label: 'ورقة' },
        ],
        distractors: [
            { icon: 'key', label: 'مفتاح' },
            { icon: 'duck', label: 'بطة' },
            { icon: 'sun', label: 'شمس' },
        ],
        questions: [
            { question: 'أمام ماذا وقف وليد؟', options: ['وردة', 'مفتاح', 'سمكة'], correct_index: 0 },
            { question: 'ماذا كتب على الورقة؟', options: ['حرف الواو', 'حرف الميم', 'حرف الباء'], correct_index: 0 },
            { question: 'أي كلمة في القصة تبدأ بحرف الواو؟', options: ['وردة', 'مفتاح', 'شمس'], correct_index: 0 },
        ],
    },
    ي: {
        name: 'الياء',
        story: `مدّ ياسر يده الصغيرة وأمسك يويو أصفر لامعاً.
لعب باليويو في الساحة ثم رسم يداً كبيرة على دفتره.
قالت المعلمة: حرف الياء في يد وياسر ويويو.
ضحك ياسر وكتب حرف الياء في نهاية الكلمات وهو يغني.
في المساء غسل يديه، ووضع اليويو بجانب السرير.
وحلم أنه يطير مثل طائر صغير فوق حديقة مليئة بالياسمين.`,
        targets: [
            { icon: 'pencil', label: 'يد' },
            { icon: 'boy', label: 'ياسر' },
            { icon: 'star', label: 'يويو' },
        ],
        distractors: [
            { icon: 'door', label: 'باب' },
            { icon: 'fish', label: 'سمكة' },
            { icon: 'moon', label: 'قمر' },
        ],
        questions: [
            { question: 'ماذا أمسك ياسر؟', options: ['يويو', 'باب', 'جمل'], correct_index: 0 },
            { question: 'ماذا رسم على دفتره؟', options: ['يداً', 'قمر', 'مفتاح'], correct_index: 0 },
        ],
    },
};

// أحرف إضافية بقصص وافية حتى لا يظهر محتوى ضعيف
const shortExtras = {
    ث: ['ثعلب', 'ثلج', 'ثوب'],
    ح: ['حصان', 'حليب', 'حديقة'],
    خ: ['خروف', 'خيمة', 'خبز'],
    ذ: ['ذئب', 'ذرة', 'ذهب'],
    ز: ['زهرة', 'زرافة', 'زيتون'],
    ص: ['صقر', 'صورة', 'صندوق'],
    ض: ['ضفدع', 'ضوء', 'ضرس'],
    ط: ['طائر', 'طابة', 'طبق'],
    ظ: ['ظرف', 'ظل', 'ظبي'],
    ع: ['عصفور', 'عنب', 'علم'],
    غ: ['غيمة', 'غزال', 'غصن'],
    ف: ['فراشة', 'فيل', 'فستان'],
    ل: ['ليمون', 'لبن', 'لعب'],
    ه: ['هلال', 'هدية', 'هدهد'],
};

const iconFor = {
    ثعلب: 'cat', ثلج: 'cloud', ثوب: 'star',
    حصان: 'camel', حليب: 'milk', حديقة: 'tree',
    خروف: 'cat', خيمة: 'house', خبز: 'sun',
    ذئب: 'cat', ذرة: 'sun', ذهب: 'star',
    زهرة: 'flower', زرافة: 'camel', زيتون: 'tree',
    صقر: 'duck', صورة: 'book', صندوق: 'house',
    ضفدع: 'duck', ضوء: 'sun', ضرس: 'star',
    طائر: 'duck', طابة: 'balloon', طبق: 'sun',
    ظرف: 'book', ظل: 'cloud', ظبي: 'cat',
    عصفور: 'duck', عنب: 'watermelon', علم: 'star',
    غيمة: 'cloud', غزال: 'cat', غصن: 'tree',
    فراشة: 'flower', فيل: 'camel', فستان: 'girl',
    ليمون: 'sun', لبن: 'milk', لعب: 'balloon',
    هلال: 'moon', هدية: 'star', هدهد: 'duck',
};

Object.entries(shortExtras).forEach(([letter, words]) => {
    catalogs[letter] = {
        name: `حرف ${letter}`,
        story: `في يوم ممتع خرج طفل يحب حرف ${letter} ليكتشف كلمات جديدة.
وجد ${words[0]} و${words[1]} و${words[2]} في طريقه، فضحك وقال: كلها تبدأ بحرف ${letter}!
رسم الحرف مرات كثيرة، وقرأ قصة قصيرة، ثم صنع بطاقة ملونة لكل كلمة.
شارك أصدقاءه اللعبة: من يجد كلمة جديدة بحرف ${letter}؟
وفي المساء كتب الحرف في دفتره وقال: أحب حرف ${letter} لأنه يفتح لي باب المغامرات.`,
        targets: words.map((label) => ({ icon: iconFor[label] || 'star', label })),
        distractors: [
            { icon: 'door', label: 'باب' },
            { icon: 'apple', label: 'تفاحة' },
            { icon: 'fish', label: 'سمكة' },
        ].filter((item) => !startsWithLetter(item.label, letter)),
        questions: [
            { question: `أي كلمة تبدأ بحرف ${letter}؟`, options: [words[0], 'باب', 'شمس'].filter((w, i, arr) => arr.indexOf(w) === i), correct_index: 0 },
            { question: `اختر كلمة بحرف ${letter}`, options: ['قمر', words[1], 'سمكة'], correct_index: 1 },
        ],
    };
});

const defaultDistractors = [
    { icon: 'apple', label: 'تفاحة' },
    { icon: 'fish', label: 'سمكة' },
    { icon: 'flower', label: 'زهرة' },
    { icon: 'moon', label: 'قمر' },
    { icon: 'sun', label: 'شمس' },
    { icon: 'book', label: 'كتاب' },
    { icon: 'door', label: 'باب' },
    { icon: 'key', label: 'مفتاح' },
];

function resolveIcon(item) {
    return item.fallbackIcon || item.icon;
}

function safeDistractors(letter, list) {
    return (list || defaultDistractors)
        .filter((item) => !startsWithLetter(item.label, letter))
        .slice(0, 3)
        .map((item) => ({ icon: resolveIcon(item), label: item.label, starts_with: false }));
}

export function getLetterCatalog(letter) {
    const entry = catalogs[letter];
    if (!entry) {
        return {
            letter,
            name: `حرف ${letter}`,
            story: `تعرّف معنا على حرف ${letter} من خلال قصة طويلة وكلمات وأنشطة ممتعة.\nابحث عن الكلمات التي تبدأ بهذا الحرف، ولوّنها، ثم اكتبه بيدك.`,
            targets: [
                { icon: 'star', label: `${letter}طل`, starts_with: true },
                { icon: 'pencil', label: `${letter}يت`, starts_with: true },
                { icon: 'book', label: `${letter}اب`, starts_with: true },
            ].map((x) => ({ ...x, icon: resolveIcon(x), starts_with: true })),
            distractors: safeDistractors(letter, defaultDistractors),
            questions: [
                { question: `أي كلمة تبدأ بحرف ${letter}؟`, options: [`${letter}طل`, 'باب', 'شمس'], correct_index: 0 },
            ],
        };
    }

    const targets = entry.targets
        .filter((item) => startsWithLetter(item.label, letter))
        .map((item) => ({
            icon: resolveIcon(item),
            label: item.label,
            starts_with: true,
        }));

    return {
        letter,
        name: entry.name,
        story: entry.story,
        targets: targets.length ? targets : entry.targets.map((item) => ({
            icon: resolveIcon(item),
            label: item.label,
            starts_with: true,
        })),
        distractors: safeDistractors(letter, entry.distractors),
        questions: entry.questions || [],
    };
}

export function availableLetters() {
    return ARABIC_LETTERS;
}

export { startsWithLetter };
export default catalogs;
