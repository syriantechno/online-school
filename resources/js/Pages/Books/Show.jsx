import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { confirmAction } from '@/Components/ConfirmDialog';
import InteractiveBuilder from '@/Components/InteractiveBuilder';
import InteractiveQuiz from '@/Components/InteractiveQuiz';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ book, fileUrl, canManage, userStars }) {
    const chapters = book.chapters || [];
    const [activeId, setActiveId] = useState(chapters[0]?.id || null);
    const active = chapters.find((c) => c.id === activeId) || null;

    const form = useForm({
        title: '',
        page_from: 1,
        page_to: '',
        stars_reward: 3,
        is_interactive: true,
        interactive_payload: { questions: [] },
    });

    const submitChapter = (e) => {
        e.preventDefault();
        form.post(route('books.chapters.store', book.id), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                form.setData('interactive_payload', { questions: [] });
            },
        });
    };

    const completeChapter = ({ score, total }) => {
        if (!active) return;
        router.post(
            route('books.chapters.complete', [book.id, active.id]),
            { score, total },
            { preserveScroll: true },
        );
    };

    return (
        <AuthenticatedLayout header={book.title}>
            <Head title={book.title} />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm text-slate-500">
                        {book.course?.title || 'كتاب عام'} · {book.uploader?.name}
                    </p>
                    {typeof userStars === 'number' && (
                        <p className="mt-1 text-sm text-amber-600">نجومك الحالية: {userStars} ★</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <a href={fileUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        تحميل الملف
                    </a>
                    <Link href={route('books.index')} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        العودة
                    </Link>
                </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-12">
                <div className="space-y-4 xl:col-span-8">
                    {book.file_type === 'pdf' ? (
                        <div className="box overflow-hidden p-0">
                            <iframe title={book.title} src={fileUrl} className="h-[72vh] w-full" />
                        </div>
                    ) : (
                        <div className="box p-6 text-sm text-slate-500">افتح الملف من زر التحميل أعلاه.</div>
                    )}

                    {active?.is_interactive && (
                        <div className="box p-5">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                <div>
                                    <h2 className="font-semibold text-slate-800">{active.title}</h2>
                                    <p className="text-xs text-slate-500">
                                        صفحات {active.page_from}
                                        {active.page_to ? `–${active.page_to}` : ''} · مكافأة {active.stars_reward} نجوم
                                    </p>
                                </div>
                            </div>
                            <InteractiveQuiz
                                key={active.id}
                                payload={active.interactive_payload}
                                onComplete={completeChapter}
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-4 xl:col-span-4">
                    <div className="box p-4">
                        <h3 className="mb-3 font-semibold text-slate-800">فصول الكتاب</h3>
                        {chapters.length === 0 && (
                            <p className="text-sm text-slate-500">لا فصول تفاعلية بعد.</p>
                        )}
                        <div className="space-y-2">
                            {chapters.map((ch) => (
                                <button
                                    key={ch.id}
                                    type="button"
                                    onClick={() => setActiveId(ch.id)}
                                    className={`flex w-full items-start justify-between rounded-xl border px-3 py-2.5 text-right text-sm transition ${
                                        activeId === ch.id
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-slate-100 bg-white text-slate-700 hover:border-slate-200'
                                    }`}
                                >
                                    <span>
                                        <span className="block font-medium">{ch.title}</span>
                                        <span className="text-xs opacity-70">
                                            ص {ch.page_from}{ch.page_to ? `–${ch.page_to}` : ''}
                                        </span>
                                    </span>
                                    <span className="text-amber-500">{ch.stars_reward}★</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {canManage && (
                        <form onSubmit={submitChapter} className="box space-y-3 p-4">
                            <h3 className="font-semibold text-slate-800">إضافة فصل تفاعلي</h3>
                            <label className="block text-xs text-slate-600">
                                عنوان الفصل
                                <input
                                    className="form-control mt-1"
                                    value={form.data.title}
                                    onChange={(e) => form.setData('title', e.target.value)}
                                    required
                                />
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <label className="block text-xs text-slate-600">
                                    من صفحة
                                    <input
                                        type="number"
                                        min="1"
                                        className="form-control mt-1"
                                        value={form.data.page_from}
                                        onChange={(e) => form.setData('page_from', Number(e.target.value))}
                                    />
                                </label>
                                <label className="block text-xs text-slate-600">
                                    إلى صفحة
                                    <input
                                        type="number"
                                        min="1"
                                        className="form-control mt-1"
                                        value={form.data.page_to}
                                        onChange={(e) => form.setData('page_to', e.target.value ? Number(e.target.value) : '')}
                                    />
                                </label>
                                <label className="block text-xs text-slate-600">
                                    نجوم
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        className="form-control mt-1"
                                        value={form.data.stars_reward}
                                        onChange={(e) => form.setData('stars_reward', Number(e.target.value))}
                                    />
                                </label>
                            </div>

                            <InteractiveBuilder
                                questions={form.data.interactive_payload.questions || []}
                                onChange={(questions) =>
                                    form.setData('interactive_payload', { questions })
                                }
                            />

                            <PrimaryButton disabled={form.processing}>حفظ الفصل</PrimaryButton>
                        </form>
                    )}

                    {canManage && active && (
                        <button
                            type="button"
                            className="w-full rounded-xl border border-danger/30 bg-danger/5 px-4 py-2 text-sm text-danger"
                            onClick={async () => {
                                if (await confirmAction({ message: 'سيتم حذف الفصل المحدد وكل نشاطاته.', variant: 'danger' })) {
                                    router.delete(route('books.chapters.destroy', [book.id, active.id]), {
                                        preserveScroll: true,
                                    });
                                }
                            }}
                        >
                            حذف الفصل المحدد
                        </button>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
