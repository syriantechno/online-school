import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout title="إنشاء حساب" heroSubtitle="انضم للمنصة وابدأ رحلة التعلّم بالعربية.">
            <Head title="إنشاء حساب" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="الاسم*" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1.5"
                        autoComplete="name"
                        isFocused
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-1" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="البريد الإلكتروني*" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="كلمة المرور*" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="تأكيد كلمة المرور*" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1.5"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                <div className="mt-5 xl:mt-8">
                    <button type="submit" className="btn-primary-pill" disabled={processing}>
                        تسجيل
                    </button>
                </div>

                <div className="mt-5 text-center text-sm text-slate-500">
                    لديك حساب؟{' '}
                    <Link href={route('login')} className="font-medium text-primary hover:underline">
                        تسجيل الدخول
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
