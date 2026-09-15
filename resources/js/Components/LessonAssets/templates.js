import { getLetterCatalog } from './letterCatalog';
import { getGradeCatalog, gradeBand, withIds as gradeWithIds } from './gradeCatalog';

const uid = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
const withIds = (items = []) => gradeWithIds(items);

export const GRADE_LEVELS = [
    { id: 1, label: 'الصف 1', band: 'foundation' },
    { id: 2, label: 'الصف 2', band: 'foundation' },
    { id: 3, label: 'الصف 3', band: 'foundation' },
    { id: 4, label: 'الصف 4', band: 'intermediate' },
    { id: 5, label: 'الصف 5', band: 'intermediate' },
    { id: 6, label: 'الصف 6', band: 'intermediate' },
    { id: 7, label: 'الصف 7', band: 'advanced' },
    { id: 8, label: 'الصف 8', band: 'advanced' },
    { id: 9, label: 'الصف 9', band: 'advanced' },
];

export const TEMPLATES = [
    {
        id: 'grade_track',
        label: 'مسار حسب الصف',
        description: 'يولّد درساً مناسباً تلقائياً من الصف 1 إلى 9',
        bands: ['foundation', 'intermediate', 'advanced'],
    },
    {
        id: 'letter_adventure',
        label: 'مغامرة حرف كاملة',
        description: 'قصة تفاعلية + كلمات + أسئلة + كتابة (تأسيس)',
        bands: ['foundation'],
    },
    {
        id: 'letter_story',
        label: 'قصة حرف',
        description: 'قصة + كلمات + تلوين + كتابة',
        bands: ['foundation'],
    },
    {
        id: 'story_tap',
        label: 'اضغط كلمات القصة',
        description: 'قصة يضغط فيها الطالب الكلمات الصحيحة',
        bands: ['foundation'],
    },
    {
        id: 'story_quiz',
        label: 'أسئلة على القصة',
        description: 'قصة ثم اختبار فهم',
        bands: ['foundation'],
    },
    {
        id: 'pick_only',
        label: 'لون الكلمات',
        description: 'شبكة صور يلوّن منها ما يبدأ بالحرف',
        bands: ['foundation'],
    },
    {
        id: 'find_letter',
        label: 'أين الحرف؟',
        description: 'اكتشف موضع الحرف داخل الكلمات',
        bands: ['foundation'],
    },
    {
        id: 'build_word',
        label: 'ركّب الكلمة',
        description: 'رتّب الحروف لتكوين الكلمة',
        bands: ['foundation'],
    },
    {
        id: 'match_pairs',
        label: 'مطابقة صورة وكلمة',
        description: 'اربط كل صورة بالكلمة المناسبة',
        bands: ['foundation'],
    },
    {
        id: 'trace_only',
        label: 'اكتب الحرف',
        description: 'خانات لكتابة الحرف',
        bands: ['foundation'],
    },
    {
        id: 'text_lab',
        label: 'مختبر النص',
        description: 'نص قرائي + أسئلة فهم وتحليل حسب الصف',
        bands: ['intermediate', 'advanced'],
    },
    {
        id: 'grammar_fix',
        label: 'محقق النحو',
        description: 'جمل وأسئلة نحو/إملاء متدرجة',
        bands: ['intermediate', 'advanced'],
    },
    {
        id: 'writing_workshop',
        label: 'ورشة الكتابة',
        description: 'كتابة موجّهة بمعيار حد أدنى للكلمات',
        bands: ['intermediate', 'advanced'],
    },
    {
        id: 'voice_reading',
        label: 'قراءة / إملاء مسموع',
        description: 'الطالب يقرأ بصوته ويسجّل ويرسل التسجيل',
        bands: ['foundation', 'intermediate', 'advanced'],
    },
];

export const THEMES = {
    clay_pink: {
        id: 'clay_pink',
        label: 'وردي مرح',
        banner: 'from-rose-500 to-pink-400',
        soft: 'bg-rose-50',
        accent: 'text-rose-700',
        chip: 'bg-rose-100 text-rose-700',
    },
    sky_play: {
        id: 'sky_play',
        label: 'سماء زرقاء',
        banner: 'from-sky-600 to-cyan-400',
        soft: 'bg-sky-50',
        accent: 'text-sky-700',
        chip: 'bg-sky-100 text-sky-700',
    },
    lemon_fun: {
        id: 'lemon_fun',
        label: 'ليموني مشرق',
        banner: 'from-amber-500 to-yellow-400',
        soft: 'bg-amber-50',
        accent: 'text-amber-800',
        chip: 'bg-amber-100 text-amber-800',
    },
    mint_fresh: {
        id: 'mint_fresh',
        label: 'نعناعي منعش',
        banner: 'from-emerald-600 to-teal-400',
        soft: 'bg-emerald-50',
        accent: 'text-emerald-800',
        chip: 'bg-emerald-100 text-emerald-800',
    },
};

export function templatesForGrade(gradeLevel = 1) {
    const band = gradeBand(gradeLevel);
    return TEMPLATES.filter((template) => template.bands.includes(band) || template.id === 'grade_track' || template.id === 'voice_reading');
}

function storyParagraphs(text = '') {
    return String(text)
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean);
}

function tokenizeStory(text, targets, letter) {
    const labels = new Set((targets || []).map((item) => item.label));
    return String(text)
        .split(/(\s+)/)
        .filter((part) => part.length)
        .map((part, index) => {
            const clean = part.replace(/[^\u0600-\u06FF]/g, '');
            const correct = Boolean(clean) && (labels.has(clean) || clean.startsWith(letter));
            return {
                id: `tok_${index}`,
                text: part,
                clean: clean || null,
                correct: Boolean(clean) && correct,
            };
        });
}

function scramble(word = '') {
    const chars = [...String(word)];
    for (let i = chars.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    const result = chars.join('');
    return result === word ? chars.reverse().join('') : result;
}

function findLetterItems(targets, letter) {
    return withIds(
        (targets || []).map((item) => {
            const positions = [...String(item.label || '')]
                .map((ch, index) => (ch === letter ? index : -1))
                .filter((index) => index >= 0);
            return {
                ...item,
                letter,
                correct_index: positions[0] ?? 0,
                positions,
            };
        }),
    );
}

function buildFoundationBlocks(template, letter, catalog) {
    const targets = withIds(catalog.targets);
    const distractors = withIds(catalog.distractors);
    const storyText = catalog.story;
    const paragraphs = storyParagraphs(storyText);
    const highlight = [letter, ...targets.map((item) => item.label)];
    const questions = withIds(
        (catalog.questions || []).map((q) => ({
            question: q.question,
            options: q.options,
            correct_index: q.correct_index,
        })),
    );
    const blocks = [];

    const addStory = (interactive = false) => {
        blocks.push({
            id: uid('story'),
            kind: 'story',
            title: `قصة حرف ${letter}`,
            text: storyText,
            paragraphs,
            highlight,
        });
        if (interactive) {
            blocks.push({
                id: uid('tap'),
                kind: 'story_tap',
                prompt: `اضغط على الكلمات التي تبدأ بحرف (${letter}) داخل القصة`,
                letter,
                tokens: tokenizeStory(storyText, targets, letter),
            });
        }
    };

    if (template === 'letter_adventure' || template === 'grade_track') {
        addStory(true);
        blocks.push({ id: uid('vocab'), kind: 'vocab_grid', title: `كلمات تبدأ بحرف (${letter})`, items: targets });
        blocks.push({
            id: uid('pick'),
            kind: 'pick_grid',
            prompt: `لون الكلمات التي تبدأ بحرف (${letter})`,
            items: withIds([...targets, ...distractors].sort(() => Math.random() - 0.5)),
        });
        if (questions.length) {
            blocks.push({ id: uid('quiz'), kind: 'story_quiz', prompt: 'أجب عن أسئلة القصة', items: questions });
        }
        blocks.push({
            id: uid('find'),
            kind: 'find_letter',
            prompt: `أين يقع حرف (${letter}) داخل الكلمة؟`,
            letter,
            items: findLetterItems(targets.slice(0, 3), letter),
        });
        blocks.push({
            id: uid('voice'),
            kind: 'voice_reading',
            mode: 'reading',
            prompt: `اقرأ بصوتك كلمات حرف (${letter}) ثم أرسل التسجيل`,
            passage: targets
                .slice(0, 4)
                .map((item) => item.label)
                .join('، '),
            max_seconds: 45,
        });
        blocks.push({ id: uid('trace'), kind: 'trace_letter', prompt: `اكتب حرف ${catalog.name}`, letter, count: 6 });
        return blocks;
    }

    if (template === 'letter_story') {
        addStory(false);
        blocks.push({ id: uid('vocab'), kind: 'vocab_grid', title: `كلمات تبدأ بحرف (${letter})`, items: targets });
        blocks.push({
            id: uid('pick'),
            kind: 'pick_grid',
            prompt: `لون الكلمات التي تبدأ بحرف (${letter})`,
            items: withIds([...targets, ...distractors].sort(() => Math.random() - 0.5)),
        });
        blocks.push({ id: uid('trace'), kind: 'trace_letter', prompt: `اكتب حرف ${catalog.name}`, letter, count: 6 });
    }
    if (template === 'story_tap') {
        addStory(true);
        blocks.push({ id: uid('vocab'), kind: 'vocab_grid', title: `كلمات حرف (${letter})`, items: targets });
    }
    if (template === 'story_quiz') {
        addStory(false);
        blocks.push({
            id: uid('quiz'),
            kind: 'story_quiz',
            prompt: 'اختبر فهمك للقصة',
            items: questions.length
                ? questions
                : withIds([
                    {
                        question: `أي كلمة تبدأ بحرف ${letter}؟`,
                        options: [targets[0]?.label || letter, distractors[0]?.label || 'باب', distractors[1]?.label || 'شمس'],
                        correct_index: 0,
                    },
                ]),
        });
    }
    if (template === 'pick_only') {
        blocks.push({
            id: uid('pick'),
            kind: 'pick_grid',
            prompt: `لون الكلمات التي تبدأ بحرف (${letter})`,
            items: withIds([...targets, ...distractors].sort(() => Math.random() - 0.5)),
        });
    }
    if (template === 'find_letter') {
        blocks.push({
            id: uid('find'),
            kind: 'find_letter',
            prompt: `اضغط على حرف (${letter}) داخل كل كلمة`,
            letter,
            items: findLetterItems(targets, letter),
        });
    }
    if (template === 'build_word') {
        blocks.push({
            id: uid('build'),
            kind: 'build_word',
            prompt: 'رتّب الحروف لتكوّن الكلمة الصحيحة',
            items: withIds(targets.slice(0, 4).map((item) => ({ ...item, scrambled: scramble(item.label), answer: item.label }))),
        });
    }
    if (template === 'match_pairs') {
        blocks.push({ id: uid('match'), kind: 'match_pairs', prompt: 'صل كل صورة بالكلمة المناسبة', items: targets });
    }
    if (template === 'trace_only') {
        blocks.push({ id: uid('trace'), kind: 'trace_letter', prompt: `اكتب حرف ${catalog.name}`, letter, count: 8 });
    }
    if (template === 'voice_reading') {
        blocks.push({
            id: uid('voice'),
            kind: 'voice_reading',
            mode: 'reading',
            prompt: 'اقرأ النص بصوتك بوضوح ثم أرسل التسجيل للمعلم',
            passage: targets
                .slice(0, 5)
                .map((item) => item.label)
                .join(' · '),
            max_seconds: 60,
        });
    }

    return blocks;
}

function buildUpperBlocks(template, gradeLevel) {
    const catalog = getGradeCatalog(gradeLevel);
    const blocks = [];
    const textLab = () => {
        blocks.push({
            id: uid('text'),
            kind: 'text_lab',
            title: catalog.title,
            prompt: 'اقرأ النص ثم أجب عن أسئلة الفهم',
            text: catalog.passage,
            paragraphs: storyParagraphs(catalog.passage),
            items: withIds(catalog.questions),
        });
    };
    const grammar = () => {
        blocks.push({
            id: uid('grammar'),
            kind: 'grammar_fix',
            prompt: 'حلّل الجمل واختر الإجابة الصحيحة',
            items: withIds(catalog.grammar),
        });
    };
    const writing = () => {
        blocks.push({
            id: uid('write'),
            kind: 'writing_workshop',
            prompt: catalog.writing_prompt,
            min_words: catalog.min_words,
            rubric: 'وضوح الفكرة · ترابط الجمل · سلامة اللغة',
        });
    };
    const voice = (mode = 'reading') => {
        blocks.push({
            id: uid('voice'),
            kind: 'voice_reading',
            mode,
            prompt: mode === 'dictation' ? 'استمع في ذهنك للنص ثم اقرأه بصوتك كإملاء مسموع وأرسل التسجيل' : 'اقرأ النص بصوتك بوضوح ثم أرسل التسجيل للمعلم',
            passage: catalog.voice_passage,
            max_seconds: gradeLevel >= 7 ? 90 : 60,
        });
    };

    if (template === 'grade_track') {
        textLab();
        grammar();
        voice('reading');
        if (gradeLevel >= 6) writing();
        return { blocks, catalog };
    }
    if (template === 'text_lab') textLab();
    if (template === 'grammar_fix') grammar();
    if (template === 'writing_workshop') writing();
    if (template === 'voice_reading') voice('reading');

    return { blocks, catalog };
}

export function buildGeneratedWorksheet({
    template = 'letter_adventure',
    letter = 'ب',
    theme = 'clay_pink',
    grade_level = 1,
    customStory,
} = {}) {
    const gradeLevel = Math.min(9, Math.max(1, Number(grade_level) || 1));
    const band = gradeBand(gradeLevel);
    let resolvedTemplate = template;

    if (template === 'grade_track') {
        resolvedTemplate = 'grade_track';
    } else if (band === 'foundation' && ['text_lab', 'grammar_fix', 'writing_workshop'].includes(template)) {
        resolvedTemplate = 'letter_adventure';
    } else if (band !== 'foundation' && ['letter_adventure', 'letter_story', 'story_tap', 'story_quiz', 'pick_only', 'find_letter', 'build_word', 'match_pairs', 'trace_only'].includes(template)) {
        resolvedTemplate = 'grade_track';
    }

    if (band === 'foundation' || (resolvedTemplate !== 'grade_track' && ['letter_adventure', 'letter_story', 'story_tap', 'story_quiz', 'pick_only', 'find_letter', 'build_word', 'match_pairs', 'trace_only', 'voice_reading'].includes(resolvedTemplate) && band === 'foundation')) {
        const catalog = { ...getLetterCatalog(letter) };
        if (customStory) catalog.story = customStory;
        const useTemplate = resolvedTemplate === 'grade_track' ? 'letter_adventure' : resolvedTemplate;
        const blocks = buildFoundationBlocks(useTemplate, letter, catalog);
        return {
            type: 'generated_worksheet',
            template: useTemplate === 'letter_adventure' && template === 'grade_track' ? 'grade_track' : useTemplate,
            letter,
            grade_level: gradeLevel,
            theme,
            skill: 'الحروف والأصوات',
            objective: `أن يميّز الطالب حرف ${letter} والكلمات التي تبدأ به من خلال قصة وأنشطة تفاعلية`,
            instruction: 'اتبع الخطوات بالترتيب. في خطوة الصوت سجّل قراءتك وأرسلها.',
            title: `مغامرة حرف ${letter} · الصف ${gradeLevel}`,
            blocks,
        };
    }

    // صفوف 4–9
    const upperTemplate = ['text_lab', 'grammar_fix', 'writing_workshop', 'voice_reading', 'grade_track'].includes(resolvedTemplate)
        ? resolvedTemplate
        : 'grade_track';
    const { blocks, catalog } = buildUpperBlocks(upperTemplate, gradeLevel);

    return {
        type: 'generated_worksheet',
        template: upperTemplate,
        letter: letter || '',
        grade_level: gradeLevel,
        theme,
        skill: catalog.skill,
        objective: `أن يطوّر طالب الصف ${gradeLevel} مهارات ${catalog.skill} عبر أنشطة تفاعلية`,
        instruction: 'اقرأ بعناية، أجب، واكتب أو سجّل صوتك عند الطلب. التسجيل يُرسل للمعلم للمراجعة.',
        title: `${catalog.title} · الصف ${gradeLevel}`,
        blocks,
    };
}

export function emptyGeneratedPayload() {
    return buildGeneratedWorksheet({ letter: 'ب', template: 'grade_track', grade_level: 1 });
}

export function countGeneratedAnswers(payload) {
    let total = 0;
    for (const block of payload?.blocks || []) {
        if (block.kind === 'pick_grid') {
            total += (block.items || []).length;
        } else if (block.kind === 'match_pairs' || block.kind === 'find_letter' || block.kind === 'build_word') {
            total += (block.items || []).length;
        } else if (block.kind === 'story_quiz' || block.kind === 'text_lab' || block.kind === 'grammar_fix') {
            total += (block.items || []).length;
        } else if (block.kind === 'story_tap') {
            total += (block.tokens || []).filter((token) => token.correct).length;
        } else if (block.kind === 'trace_letter') {
            total += Math.max(1, Number(block.count) || 1);
        } else if (block.kind === 'writing_workshop' || block.kind === 'voice_reading') {
            total += 1;
        }
    }
    return total;
}

export { gradeBand };
export default buildGeneratedWorksheet;
