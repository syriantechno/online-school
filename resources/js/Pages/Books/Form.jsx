import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Form({ book, courses }) {
    const isEdit = !!book;
    const { data, setData, post, processing, errors } = useForm({
        title: book?.title || '',
        description: book?.description || '',
        course_id: book?.course_id || '',
        is_published: book?.is_published || false,
        file: null,
        _method: isEdit ? 'put' : 'post',
    });

    const submit = (e) => {
        e.preventDefault();
        post(isEdit ? route('books.update', book.id) : route('books.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header={isEdit ? 'تعديل كتاب' : 'رفع كتاب'}>
            <Head title={isEdit ? 'تعديل كتاب' : 'رفع كتاب'} />

            <form onSubmit={submit} className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
                <div>
                    <InputLabel value="عنوان الكتاب" />
                    <TextInput className="mt-1 block w-full" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="الوصف" />
                    <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                        rows={3}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                </div>

                <div>
                    <InputLabel value="الدورة (اختياري)" />
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
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
                    <InputLabel value={isEdit ? 'استبدال الملف (اختياري)' : 'ملف PDF / ePub'} />
                    <input
                        type="file"
                        accept=".pdf,.epub"
                        className="mt-1 block w-full text-sm"
                        onChange={(e) => setData('file', e.target.files[0])}
                        required={!isEdit}
                    />
                    <InputError message={errors.file} className="mt-2" />
                </div>

                <label className="flex items-center gap-2">
                    <Checkbox checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} />
                    <span className="text-sm">منشور</span>
                </label>

                <PrimaryButton disabled={processing}>{isEdit ? 'حفظ' : 'رفع'}</PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
