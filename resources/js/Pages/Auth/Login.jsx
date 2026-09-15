import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { LogoMark } from '@/Layouts/GuestLayout';
import { authRoute } from '@/utils/authRedirect';
import { useStudentTheme } from '@/contexts/StudentThemeContext';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function LightSwitch({ isOn, onToggle }) {
    return (
        <button type="button" onClick={onToggle} aria-pressed={isOn}
            aria-label={isOn ? 'إطفاء الضوء' : 'تشغيل الضوء وإظهار تسجيل الدخول'}
            className={`login-light-switch ${isOn ? 'is-on' : ''}`}>
            <span className="login-switch-screws" aria-hidden="true" />
            <span className="login-switch-rocker" aria-hidden="true"><span>{isOn ? 'I' : 'O'}</span></span>
        </button>
    );
}

function LoginForm({ status, canResetPassword, isLit, emailInput, redirect, enrollCourse }) {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false });
    const registerHref = authRoute('register', { redirect, enrollCourse });
    const enrollIntent = Boolean(enrollCourse);
    const submit = (event) => {
        event.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <div className="login-card" aria-hidden={!isLit}>
            <div className="login-card-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A3.75 3.75 0 0 0 12 1.5H7.5a3.75 3.75 0 0 0-3.75 3.75v13.5A3.75 3.75 0 0 0 7.5 22.5H12a3.75 3.75 0 0 0 3.75-3.75V15m3-3h-9m9 0-3-3m3 3-3 3" /></svg>
            </div>
            <h1>أهلاً بعودتك!</h1>
            <p>{enrollIntent ? 'سجّل دخولك للاشتراك في الدورة ومتابعة التعلّم.' : 'سجّل دخولك وتابع مغامرتك التعليمية.'}</p>
            {status && <div className="login-alert login-alert-success">{status}</div>}
            {(errors.email || errors.password) && <div className="login-alert login-alert-error" role="alert">{errors.email || errors.password}</div>}

            <form onSubmit={submit} className="mt-6 text-right">
                <div>
                    <InputLabel htmlFor="email" value="البريد الإلكتروني" />
                    <div className="login-input-wrap">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0-8.69 5.52a2 2 0 0 1-2.12 0L2.25 6.75" /></svg>
                        <TextInput ref={emailInput} id="email" type="email" name="email" value={data.email} className="login-input" placeholder="example@gmail.com" autoComplete="username" tabIndex={isLit ? 0 : -1} onChange={(e) => setData('email', e.target.value)} />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="كلمة المرور" />
                    <div className="login-input-wrap">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 0h10.5a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25v-7.5a2.25 2.25 0 0 1 2.25-2.25Z" /></svg>
                        <TextInput id="password" type="password" name="password" value={data.password} className="login-input" placeholder="••••••••" autoComplete="current-password" tabIndex={isLit ? 0 : -1} onChange={(e) => setData('password', e.target.value)} />
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500 sm:text-sm">
                    <label className="flex cursor-pointer items-center gap-2.5 select-none"><Checkbox name="remember" checked={data.remember} tabIndex={isLit ? 0 : -1} onChange={(e) => setData('remember', e.target.checked)} />تذكرني</label>
                    {canResetPassword && <Link href={route('password.request')} tabIndex={isLit ? 0 : -1} className="login-accent-link font-semibold hover:underline">نسيت كلمة المرور؟</Link>}
                </div>
                <button type="submit" tabIndex={isLit ? 0 : -1} className="login-submit" disabled={processing}>
                    {processing ? 'لحظة من فضلك...' : 'دخول إلى مدرستي'}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A3.75 3.75 0 0 0 12 1.5H7.5a3.75 3.75 0 0 0-3.75 3.75v13.5A3.75 3.75 0 0 0 7.5 22.5H12a3.75 3.75 0 0 0 3.75-3.75V15m3-3h-9m9 0-3-3m3 3-3 3" /></svg>
                </button>
                <div className="mt-5 text-center text-sm text-slate-500">طالب جديد؟ <Link href={registerHref} tabIndex={isLit ? 0 : -1} className="login-accent-link font-bold hover:underline">أنشئ حسابك الآن</Link></div>
            </form>
        </div>
    );
}

export default function Login({ status, canResetPassword, redirect = null, enrollCourse = null }) {
    const { appName } = usePage().props;
    const { theme } = useStudentTheme();
    const studentTheme = theme;
    const [isLit, setIsLit] = useState(false);
    const emailInput = useRef(null);
    useEffect(() => {
        if (!isLit) return undefined;
        const timer = window.setTimeout(() => emailInput.current?.focus({ preventScroll: true }), 650);
        return () => window.clearTimeout(timer);
    }, [isLit]);

    return (
        <main className={`login-story login-theme-${studentTheme} ${isLit ? 'is-lit' : ''}`} dir="rtl">
            <Head title="تسجيل الدخول" />
            <div className="login-night-sky" aria-hidden="true" />
            <div className="login-light-cone" aria-hidden="true" />
            <div className="login-floor-glow" aria-hidden="true" />
            <header className="login-story-header">
                <Link href="/" className="login-brand" aria-label="العودة إلى الصفحة الرئيسية"><LogoMark className="bg-white/80 shadow-lg" /><span><strong>تعلّم العربية</strong><small>{appName || 'المدرسة الإلكترونية'}</small></span></Link>
                <Link href="/" className="login-home-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m3 11.25 9-8.25 9 8.25M5.25 9.19v11.06h13.5V9.19M9 20.25v-6h6v6" /></svg>الرئيسية</Link>
            </header>

            <section className="login-story-content">
                <div className="login-character-zone" aria-hidden="true">
                    <span className="login-character-blob" />
                    <span className="login-spark login-spark-one">✦</span><span className="login-spark login-spark-two">✦</span>
                    <img src={studentTheme === 'girl' ? '/assets/home/characters/girl-hero.png' : '/assets/home/characters/boy-hero.png'} alt="" className="login-character" />
                    <div className="login-character-message"><strong>العِلم نور والجهل ظلام</strong><span>{isLit ? 'أحسنت! أضاء العلم طريقنا، لنبدأ التعلّم' : 'شغّل نور العلم لتظهر بوابة مدرستك'}</span></div>
                </div>

                <div className="login-action-zone">
                    <div className="login-lamp" aria-hidden="true"><span className="login-lamp-wire" /><span className="login-lamp-shade" /><span className="login-lamp-bulb" /></div>
                    <div className="login-switch-prompt">
                        <span className="login-prompt-arrow" aria-hidden="true"><svg viewBox="0 0 70 50" fill="none"><path d="M66 4C48 5 43 19 42 31c0 7-7 11-16 10H7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 6" /><path d="m14 34-8 7 8 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        <strong className="login-wisdom">العِلم نور<br /><span>والجهل ظلام</span></strong>
                        <span className="login-switch-help">{isLit ? 'أصبح كل شيء جاهزاً' : 'اضغط على المفتاح وأضئ طريقك'}</span>
                        <LightSwitch isOn={isLit} onToggle={() => setIsLit((value) => !value)} />
                        {!isLit && <button type="button" onClick={() => setIsLit(true)} className="login-skip">الدخول مباشرة</button>}
                    </div>
                    <LoginForm status={status} canResetPassword={canResetPassword} isLit={isLit} emailInput={emailInput} redirect={redirect} enrollCourse={enrollCourse} />
                </div>
            </section>
        </main>
    );
}
