import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ courses }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        course_id: '',
        scheduled_at: '',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('video-rooms.store'));
    };

    return (
        <AuthenticatedLayout header="إنشاء غرفة فيديو">
            <Head title="إنشاء غرفة فيديو" />

            <form onSubmit={submit} className="box mx-auto max-w-2xl space-y-4 p-6">
                <div>
                    <InputLabel htmlFor="title" value="عنوان الغرفة" />
                    <TextInput
                        id="title"
                        className="mt-1 block w-full"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        required
                    />
                    <InputError message={errors.title} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="description" value="الوصف" />
                    <textarea
                        id="description"
                        className="form-control mt-1"
                        rows={3}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                </div>

                <div>
                    <InputLabel htmlFor="course_id" value="ربط بدورة (اختياري)" />
                    <select
                        id="course_id"
                        className="form-control mt-1"
                        value={data.course_id}
                        onChange={(e) => setData('course_id', e.target.value)}
                    >
                        <option value="">بدون دورة</option>
                        {courses.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <InputLabel htmlFor="scheduled_at" value="موعد الجلسة (اختياري)" />
                    <TextInput
                        id="scheduled_at"
                        type="datetime-local"
                        className="mt-1 block w-full"
                        value={data.scheduled_at}
                        onChange={(e) => setData('scheduled_at', e.target.value)}
                    />
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                    />
                    غرفة نشطة
                </label>

                <div className="flex gap-3">
                    <PrimaryButton disabled={processing}>إنشاء ودخول</PrimaryButton>
                    <Link href={route('video-rooms.index')} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">
                        إلغاء
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
