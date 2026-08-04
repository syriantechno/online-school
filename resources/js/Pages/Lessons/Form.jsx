import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import InteractiveBuilder from '@/Components/InteractiveBuilder';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import VideoPlayer from '@/Components/VideoPlayer';
import { Head, useForm } from '@inertiajs/react';

export default function Form({ lesson, courses }) {
    const isEdit = !!lesson;
    const { data, setData, post, put, processing, errors } = useForm({
        course_id: lesson?.course_id || '',
        title: lesson?.title || '',
        content: lesson?.content || '',
        video_url: lesson?.video_url || '',
        duration_minutes: lesson?.duration_minutes || '',
        sort_order: lesson?.sort_order || 0,
        is_published: lesson?.is_published || false,
        is_interactive: lesson?.is_interactive || false,
        stars_reward: lesson?.stars_reward || 2,
        interactive_payload: lesson?.interactive_payload || { questions: [] },
    });

    const questions = data.interactive_payload?.questions || [];

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) put(route('lessons.update', lesson.id));
        else post(route('lessons.store'));
    };

    return (
        <AuthenticatedLayout header={isEdit ? 'تعديل درس' : 'درس جديد'}>
            <Head title={isEdit ? 'تعديل درس' : 'درس جديد'} />

            <form onSubmit={submit} className="mx-auto max-w-3xl space-y-5 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
                <div>
                    <InputLabel value="الدورة" />
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                        value={data.course_id}
                        onChange={(e) => setData('course_id', e.target.value)}
                        required
                    >
                        <option value="">اختر دورة</option>
                        {courses.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                    <InputError message={errors.course_id} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="عنوان الدرس" />
                    <TextInput className="mt-1 block w-full" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="المحتوى النصي" />
                    <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                        rows={5}
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        placeholder="اكتب شرح الدرس بالعربية..."
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <InputLabel value="رابط الفيديو" />
                        <TextInput
                            className="mt-1 block w-full"
                            value={data.video_url}
                            onChange={(e) => setData('video_url', e.target.value)}
                            placeholder="رابط يوتيوب أو فيميو أو ملف mp4"
                            dir="ltr"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            يدعم: يوتيوب، فيميو، وملفات mp4/webm مباشرة.
                        </p>
                        <InputError message={errors.video_url} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel value="المدة (دقائق)" />
                        <TextInput type="number" className="mt-1 block w-full" value={data.duration_minutes} onChange={(e) => setData('duration_minutes', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value="ترتيب العرض" />
                        <TextInput type="number" className="mt-1 block w-full" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value="نجوم عند الإكمال" />
                        <TextInput
                            type="number"
                            min="1"
                            max="20"
                            className="mt-1 block w-full"
                            value={data.stars_reward}
                            onChange={(e) => setData('stars_reward', e.target.value)}
                        />
                    </div>
                </div>

                {data.video_url && (
                    <VideoPlayer url={data.video_url} title="معاينة الفيديو" />
                )}

                <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2">
                        <Checkbox checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} />
                        <span className="text-sm">منشور</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <Checkbox
                            checked={data.is_interactive}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setData({
                                    ...data,
                                    is_interactive: checked,
                                    interactive_payload: checked
                                        ? data.interactive_payload || { questions: [] }
                                        : { questions: [] },
                                });
                            }}
                        />
                        <span className="text-sm">درس تفاعلي (أسئلة وتمارين)</span>
                    </label>
                </div>

                {data.is_interactive && (
                    <InteractiveBuilder
                        questions={questions}
                        onChange={(nextQuestions) =>
                            setData('interactive_payload', { questions: nextQuestions })
                        }
                    />
                )}
                <InputError message={errors.interactive_payload} className="mt-2" />

                <PrimaryButton disabled={processing}>{isEdit ? 'حفظ' : 'إنشاء'}</PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
