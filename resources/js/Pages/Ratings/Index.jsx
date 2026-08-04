import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';

function Stars({ value }) {
    return (
        <span className="text-amber-500" aria-label={`${value} نجوم`}>
            {'★'.repeat(value)}{'☆'.repeat(5 - value)}
        </span>
    );
}

export default function Index({ ratings, students, courses, canRate, myStars, myAverage }) {
    const form = useForm({
        student_id: '',
        course_id: '',
        stars: 5,
        comment: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('ratings.store'), {
            preserveScroll: true,
            onSuccess: () => form.reset('comment'),
        });
    };

    return (
        <AuthenticatedLayout header="تقييم الطلاب">
            <Head title="تقييم الطلاب" />

            <div className="mb-5 grid gap-4 sm:grid-cols-2">
                <div className="box p-5">
                    <p className="text-xs text-slate-500">نجومي</p>
                    <p className="mt-1 text-2xl font-semibold text-amber-500">{myStars ?? 0} ★</p>
                </div>
                {myAverage !== null && myAverage !== undefined && (
                    <div className="box p-5">
                        <p className="text-xs text-slate-500">متوسط تقييمي</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-800">
                            {myAverage || '—'} {myAverage ? <Stars value={Math.round(myAverage)} /> : null}
                        </p>
                    </div>
                )}
            </div>

            {canRate && (
                <form onSubmit={submit} className="box mb-5 grid gap-4 p-5 md:grid-cols-2">
                    <h3 className="md:col-span-2 font-semibold text-slate-800">تقييم جديد</h3>

                    <div>
                        <InputLabel value="الطالب" />
                        <select
                            className="form-control mt-1"
                            value={form.data.student_id}
                            onChange={(e) => form.setData('student_id', e.target.value)}
                            required
                        >
                            <option value="">اختر طالباً</option>
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.stars}★)
                                </option>
                            ))}
                        </select>
                        <InputError message={form.errors.student_id} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel value="الدورة (اختياري)" />
                        <select
                            className="form-control mt-1"
                            value={form.data.course_id}
                            onChange={(e) => form.setData('course_id', e.target.value)}
                        >
                            <option value="">بدون دورة</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <InputLabel value="التقييم (1–5)" />
                        <select
                            className="form-control mt-1"
                            value={form.data.stars}
                            onChange={(e) => form.setData('stars', Number(e.target.value))}
                        >
                            {[5, 4, 3, 2, 1].map((n) => (
                                <option key={n} value={n}>{n} نجوم</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <InputLabel value="ملاحظة" />
                        <textarea
                            className="form-control mt-1"
                            rows={2}
                            value={form.data.comment}
                            onChange={(e) => form.setData('comment', e.target.value)}
                            placeholder="تعليق للمعلم..."
                        />
                    </div>

                    <div className="md:col-span-2">
                        <PrimaryButton disabled={form.processing}>حفظ التقييم</PrimaryButton>
                    </div>
                </form>
            )}

            <div className="box overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>الطالب</th>
                                <th>المقيّم</th>
                                <th>الدورة</th>
                                <th>النجوم</th>
                                <th>ملاحظة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratings.data.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.student?.name}</td>
                                    <td>{r.rater?.name}</td>
                                    <td>{r.course?.title || '—'}</td>
                                    <td><Stars value={r.stars} /></td>
                                    <td className="max-w-xs truncate">{r.comment || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {ratings.data.length === 0 && (
                    <p className="p-8 text-center text-sm text-slate-500">لا تقييمات بعد.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
