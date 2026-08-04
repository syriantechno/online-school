import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Show({ course, thread, canReply, canModerate }) {
    const form = useForm({ body: '', is_answer: false });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('discussions.replies.store', [course.id, thread.id]), {
            preserveScroll: true,
            onSuccess: () => form.reset('body'),
        });
    };

    return (
        <AuthenticatedLayout header={thread.title}>
            <Head title={thread.title} />

            <div className="mb-4">
                <Link href={route('discussions.index', course.id)} className="text-sm text-primary hover:underline">
                    ← العودة للنقاشات
                </Link>
            </div>

            <article className="box mb-5 p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-medium text-slate-800">{thread.title}</h1>
                        <p className="mt-1 text-xs text-slate-500">
                            {thread.user?.name}
                            {thread.user?.role === 'teacher' ? ' · معلم' : ''}
                            {' · '}
                            {new Date(thread.created_at).toLocaleString('ar')}
                        </p>
                    </div>
                    {canModerate && (
                        <button
                            type="button"
                            className="text-sm text-danger hover:underline"
                            onClick={() => confirm('حذف النقاش؟') && router.delete(route('discussions.destroy', [course.id, thread.id]))}
                        >
                            حذف
                        </button>
                    )}
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{thread.body}</p>
            </article>

            <div className="mb-5 space-y-3">
                <h2 className="text-sm font-medium text-slate-500">الردود ({thread.replies?.length || 0})</h2>
                {(thread.replies || []).map((r) => (
                    <div key={r.id} className={`box p-4 ${r.is_answer ? 'border-success/30 bg-success/5' : ''}`}>
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-slate-800">
                                {r.user?.name}
                                {r.user?.role === 'teacher' ? ' · معلم' : ''}
                            </p>
                            {r.is_answer && <span className="rounded-md bg-success/10 px-2 py-0.5 text-[11px] text-success">إجابة معتمدة</span>}
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{r.body}</p>
                        <p className="mt-2 text-xs text-slate-400">{new Date(r.created_at).toLocaleString('ar')}</p>
                    </div>
                ))}
            </div>

            {canReply && (
                <form onSubmit={submit} className="box space-y-3 p-5">
                    <h3 className="font-medium text-slate-800">أضف رداً</h3>
                    <textarea
                        className="form-control"
                        rows={3}
                        value={form.data.body}
                        onChange={(e) => form.setData('body', e.target.value)}
                        required
                    />
                    {canModerate && (
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input
                                type="checkbox"
                                checked={form.data.is_answer}
                                onChange={(e) => form.setData('is_answer', e.target.checked)}
                            />
                            تعليم كإجابة صحيحة
                        </label>
                    )}
                    <PrimaryButton disabled={form.processing}>إرسال الرد</PrimaryButton>
                </form>
            )}
        </AuthenticatedLayout>
    );
}
