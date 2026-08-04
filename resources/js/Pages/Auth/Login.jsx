import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout title="تسجيل الدخول" heroSubtitle="مرحباً بعودتك — سجّل الدخول لإدارة الدروس والدورات.">
            <Head title="تسجيل الدخول" />

            {status && (
                <div className="mb-4 rounded-[0.6rem] border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
                    {status}
                </div>
            )}

            {(errors.email || errors.password) && (
                <div className="mb-4 rounded-[0.6rem] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                    {errors.email || errors.password}
                </div>
            )}

            <form onSubmit={submit} className="mt-2">
                <div>
                    <InputLabel htmlFor="email" value="البريد الإلكتروني*" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5"
                        placeholder="example@gmail.com"
                        autoComplete="username"
                        isFocused
                        onChange={(e) => setData('email', e.target.value)}
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
                        placeholder="************"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 sm:text-sm">
                    <label className="flex cursor-pointer items-center gap-2.5 select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        تذكرني
                    </label>
                    {canResetPassword && (
                        <Link href={route('password.request')} className="hover:text-primary">
                            نسيت كلمة المرور؟
                        </Link>
                    )}
                </div>

                <div className="mt-5 xl:mt-8">
                    <button type="submit" className="btn-primary-pill" disabled={processing}>
                        دخول
                    </button>
                </div>

                <div className="mt-5 text-center text-sm text-slate-500">
                    ليس لديك حساب؟{' '}
                    <Link href={route('register')} className="font-medium text-primary hover:underline">
                        إنشاء حساب
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
