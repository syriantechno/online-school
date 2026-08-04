import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ conversations, contacts = [] }) {
    const form = useForm({
        user_id: '',
        body: '',
        subject: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('messages.store'), {
            onSuccess: () => form.reset(),
        });
    };

    return (
        <AuthenticatedLayout header="الرسائل">
            <Head title="الرسائل" />

            <div className="grid gap-5 lg:grid-cols-5">
                <form onSubmit={submit} className="box space-y-3 p-5 lg:col-span-2">
                    <h3 className="font-medium text-slate-800">رسالة جديدة</h3>
                    <div>
                        <InputLabel value="إلى" />
                        <select
                            className="form-control mt-1"
                            value={form.data.user_id}
                            onChange={(e) => form.setData('user_id', e.target.value)}
                            required
                        >
                            <option value="">اختر مستخدماً</option>
                            {contacts.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} ({c.role === 'teacher' ? 'معلم' : c.role === 'admin' ? 'مدير' : c.role === 'parent' ? 'ولي أمر' : 'طالب'})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <InputLabel value="الموضوع (اختياري)" />
                        <input className="form-control mt-1" value={form.data.subject} onChange={(e) => form.setData('subject', e.target.value)} />
                    </div>
                    <div>
                        <InputLabel value="الرسالة" />
                        <textarea
                            className="form-control mt-1"
                            rows={4}
                            value={form.data.body}
                            onChange={(e) => form.setData('body', e.target.value)}
                            required
                        />
                    </div>
                    <PrimaryButton disabled={form.processing}>إرسال</PrimaryButton>
                </form>

                <div className="box overflow-hidden lg:col-span-3">
                    <div className="border-b border-slate-100 px-5 py-4">
                        <h3 className="font-medium text-slate-800">المحادثات</h3>
                    </div>
                    {conversations.data.length === 0 ? (
                        <p className="p-8 text-center text-sm text-slate-500">لا محادثات بعد.</p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {conversations.data.map((c) => {
                                const names = (c.participants || []).map((p) => p.name).join(' · ');
                                return (
                                    <Link
                                        key={c.id}
                                        href={route('messages.show', c.id)}
                                        className="block px-5 py-4 transition hover:bg-slate-50"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-medium text-slate-800">{names}</p>
                                            <span className="text-xs text-slate-400">
                                                {c.last_message_at ? new Date(c.last_message_at).toLocaleDateString('ar') : ''}
                                            </span>
                                        </div>
                                        <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                                            {c.latest_message?.body || c.subject || 'محادثة'}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
