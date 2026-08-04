import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="تأكيد البريد" />

            <div className="mb-4 text-sm text-gray-600">
                شكراً لتسجيلك! يرجى تأكيد بريدك عبر الرابط الذي أرسلناه. إن لم يصلك، يمكننا إرسال رابط جديد.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    تم إرسال رابط تفعيل جديد إلى بريدك.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        إعادة إرسال رابط التفعيل
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900"
                    >
                        تسجيل الخروج
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
