import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Show({ conversation, messages = [], other }) {
    const { auth } = usePage().props;
    const form = useForm({ body: '' });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('messages.reply', conversation.id), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <AuthenticatedLayout header={other?.name || conversation.subject || 'محادثة'}>
            <Head title={other?.name || 'محادثة'} />

            <div className="mb-4">
                <Link href={route('messages.index')} className="text-sm text-primary hover:underline">
                    ← كل الرسائل
                </Link>
            </div>

            <div className="box flex h-[65vh] flex-col overflow-hidden">
                <div className="border-b border-slate-100 px-5 py-3">
                    <p className="font-medium text-slate-800">{other?.name || 'محادثة'}</p>
                    {conversation.subject && <p className="text-xs text-slate-500">{conversation.subject}</p>}
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/50 p-4">
                    {messages.map((m) => {
                        const mine = m.user_id === auth.user?.id;
                        return (
                            <div key={m.id} className={`flex ${mine ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-7 ${
                                    mine
                                        ? 'rounded-br-md bg-theme-1 text-white'
                                        : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'
                                }`}>
                                    {!mine && <p className="mb-1 text-[11px] font-medium opacity-70">{m.user?.name}</p>}
                                    <p className="whitespace-pre-wrap">{m.body}</p>
                                    <p className={`mt-1 text-[10px] ${mine ? 'text-white/60' : 'text-slate-400'}`}>
                                        {new Date(m.created_at).toLocaleString('ar')}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <form onSubmit={submit} className="flex gap-2 border-t border-slate-100 p-3">
                    <input
                        className="form-control flex-1"
                        placeholder="اكتب رسالتك..."
                        value={form.data.body}
                        onChange={(e) => form.setData('body', e.target.value)}
                        required
                    />
                    <PrimaryButton disabled={form.processing}>إرسال</PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
