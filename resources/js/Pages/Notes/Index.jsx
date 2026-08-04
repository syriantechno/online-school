import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ notes, filters = {} }) {
    return (
        <AuthenticatedLayout header="ملاحظاتي">
            <Head title="ملاحظاتي" />

            <div className="mb-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => router.get(route('notes.index'), {}, { preserveState: true })}
                    className={`rounded-md px-3 py-1.5 text-sm ${!filters.bookmarked ? 'bg-primary text-white' : 'border border-slate-200 text-slate-600'}`}
                >
                    الكل
                </button>
                <button
                    type="button"
                    onClick={() => router.get(route('notes.index'), { bookmarked: 1 }, { preserveState: true })}
                    className={`rounded-md px-3 py-1.5 text-sm ${filters.bookmarked ? 'bg-primary text-white' : 'border border-slate-200 text-slate-600'}`}
                >
                    المفضّلة فقط
                </button>
            </div>

            <div className="space-y-3">
                {notes.data?.map((note) => (
                    <article key={note.id} className="box p-5">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                                <Link href={route('lessons.show', note.lesson_id)} className="font-medium text-primary hover:underline">
                                    {note.lesson?.title}
                                </Link>
                                <p className="mt-0.5 text-xs text-slate-400">{note.lesson?.course?.title}</p>
                            </div>
                            {note.is_bookmarked && (
                                <span className="rounded-md bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-600">مفضّل</span>
                            )}
                        </div>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {note.body || 'بدون نص — درس مفضّل فقط.'}
                        </p>
                        <p className="mt-2 text-[11px] text-slate-400">
                            آخر تحديث: {note.updated_at ? new Date(note.updated_at).toLocaleString('ar') : '—'}
                        </p>
                    </article>
                ))}
                {(notes.data?.length ?? 0) === 0 && (
                    <div className="box p-10 text-center text-sm text-slate-500">
                        لا ملاحظات بعد. افتح درساً واكتب ملاحظة أو أضفه للمفضلة.
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
