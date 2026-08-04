import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, router, useForm } from '@inertiajs/react';

export default function Manage({ parents = [], students = [] }) {
    const form = useForm({
        parent_id: '',
        student_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('parent-links.store'), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <AuthenticatedLayout header="ربط أولياء الأمور">
            <Head title="ربط أولياء الأمور" />

            <form onSubmit={submit} className="box mb-5 grid gap-3 p-5 md:grid-cols-3">
                <select
                    className="form-control"
                    value={form.data.parent_id}
                    onChange={(e) => form.setData('parent_id', e.target.value)}
                    required
                >
                    <option value="">اختر ولي الأمر</option>
                    {parents.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <select
                    className="form-control"
                    value={form.data.student_id}
                    onChange={(e) => form.setData('student_id', e.target.value)}
                    required
                >
                    <option value="">اختر الطالب</option>
                    {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
                <PrimaryButton disabled={form.processing}>ربط</PrimaryButton>
            </form>

            <div className="space-y-4">
                {parents.map((parent) => (
                    <div key={parent.id} className="box p-5">
                        <h3 className="font-medium text-slate-800">{parent.name}</h3>
                        <p className="text-xs text-slate-500">{parent.email}</p>
                        <div className="mt-3 space-y-2">
                            {(parent.children || []).length === 0 && (
                                <p className="text-sm text-slate-500">لا طلاب مرتبطين.</p>
                            )}
                            {(parent.children || []).map((child) => (
                                <div key={child.id} className="flex items-center justify-between rounded-box border border-slate-100 px-3 py-2 text-sm">
                                    <span>{child.name} · {child.stars}★</span>
                                    <button
                                        type="button"
                                        className="text-danger hover:underline"
                                        onClick={() => {
                                            router.delete(route('parent-links.destroy'), {
                                                data: { parent_id: parent.id, student_id: child.id },
                                                preserveScroll: true,
                                            });
                                        }}
                                    >
                                        فك الربط
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
