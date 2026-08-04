import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Form({ course, teachers = [] }) {
    const isEdit = !!course;
    const { data, setData, post, processing, errors } = useForm({
        title: course?.title || '',
        description: course?.description || '',
        level: course?.level || '',
        subject: course?.subject || '',
        teacher_id: course?.teacher_id || '',
        is_published: course?.is_published || false,
        cover_image: null,
        _method: isEdit ? 'put' : 'post',
    });

    const submit = (e) => {
        e.preventDefault();
        post(isEdit ? route('courses.update', course.id) : route('courses.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header={isEdit ? 'تعديل دورة' : 'دورة جديدة'}>
            <Head title={isEdit ? 'تعديل دورة' : 'دورة جديدة'} />

            <form onSubmit={submit} className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
                <div>
                    <InputLabel htmlFor="title" value="عنوان الدورة" />
                    <TextInput id="title" className="mt-1 block w-full" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="description" value="الوصف" />
                    <textarea
                        id="description"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                        rows={4}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="غلاف الدورة" />
                    {course?.cover_url && !data.cover_image && (
                        <img src={course.cover_url} alt="" className="mt-2 h-32 w-full rounded-lg object-cover" />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="mt-2 block w-full text-sm text-slate-600 file:me-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
                        onChange={(e) => setData('cover_image', e.target.files[0] || null)}
                    />
                    <InputError message={errors.cover_image} className="mt-2" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="subject" value="المادة" />
                        <TextInput id="subject" className="mt-1 block w-full" value={data.subject} onChange={(e) => setData('subject', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel htmlFor="level" value="المستوى" />
                        <TextInput id="level" className="mt-1 block w-full" value={data.level} onChange={(e) => setData('level', e.target.value)} placeholder="ابتدائي / متوسط / ثانوي" />
                    </div>
                </div>

                {teachers.length > 0 && (
                    <div>
                        <InputLabel htmlFor="teacher_id" value="المعلم" />
                        <select
                            id="teacher_id"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                            value={data.teacher_id}
                            onChange={(e) => setData('teacher_id', e.target.value)}
                        >
                            <option value="">اختر معلماً</option>
                            {teachers.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <label className="flex items-center gap-2">
                    <Checkbox checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} />
                    <span className="text-sm text-slate-700">نشر الدورة</span>
                </label>

                <PrimaryButton disabled={processing}>{isEdit ? 'حفظ التعديلات' : 'إنشاء الدورة'}</PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
