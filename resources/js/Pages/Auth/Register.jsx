import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { authRoute } from '@/utils/authRedirect';
import { useStudentTheme } from '@/contexts/StudentThemeContext';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function LightSwitch({ isOn, onToggle }) {
    return (
        <button type="button" onClick={onToggle} aria-pressed={isOn}
            aria-label={isOn ? 'إيقاف' : 'تشغيل الضوء وإظهار التسجيل'}
            className={`login-light-switch ${isOn ? 'is-on' : ''}`}>
            <span className="login-switch-screws" aria-hidden="true" />
            <span className="login-switch-rocker" aria-hidden="true"><span>{isOn ? 'I' : 'O'}</span></span>
        </button>
    );
}

export default function Register({ redirect = null, enrollCourse = null }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        gender: 'male',
        password: '',
        password_confirmation: '',
    });
    const { theme, setTheme } = useStudentTheme();
    const studentTheme = theme;
    const loginHref = authRoute('login', { redirect, enrollCourse });
    const enrollIntent = Boolean(enrollCourse);

    const [isLit, setIsLit] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    useEffect(() => {
        if (!isLit) return undefined;
        const timer = window.setTimeout(() => {
            const el = document.getElementById('register-name');
            el?.focus({ preventScroll: true });
        }, 650);
        return () => window.clearTimeout(timer);
    }, [isLit]);

    useEffect(() => {
        setTheme(data.gender === 'female' ? 'girl' : 'boy');
    }, [data.gender, setTheme]);

    return (
        <main className={`login-story login-theme-${studentTheme} ${isLit ? 'is-lit' : ''}`} dir="rtl">
            <Head title="إنشاء حساب" />
            <div className="login-night-sky" aria-hidden="true" />
            <div className="login-light-cone" aria-hidden="true" />
            <div className="login-floor-glow" aria-hidden="true" />

            <header className="login-story-header">
                <Link href="/" className="login-brand" aria-label="العودة إلى الصفحة الرئيسية">
                    <span className="login-logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 18 16.5 18c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></span>
                    <span><strong>تعلّم العربية</strong><small>منصة تعليم</small></span>
                </Link>
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

                    <div className={`login-card ${isLit ? 'is-lit' : ''}`} dir="rtl">
                        <div className="login-card-badge" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A3.75 3.75 0 0 0 12 1.5H7.5a3.75 3.75 0 0 0-3.75 3.75v13.5A3.75 3.75 0 0 0 7.5 22.5H12a3.75 3.75 0 0 0 3.75-3.75V15m3-3h-9m9 0-3-3m3 3-3 3" /></svg>
                        </div>
                        <h1>انضم إلينا</h1>
                        <p>{enrollIntent ? 'أنشئ حسابك للاشتراك في الدورة والبدء فوراً.' : 'أنشئ حسابك وابدأ رحلة التعلّم بالعربية.'}</p>
                        {(errors.email || errors.password || errors.name) && <div className="login-alert login-alert-error" role="alert">{errors.email || errors.password || errors.name}</div>}

                        <form onSubmit={submit} className="mt-6 text-right">
                            <div className="mb-5">
                                <InputLabel value="أنا*" />
                                <div className="grid grid-cols-2 gap-3">
                                    {[['male', 'طالب', '/assets/home/characters/boy-card.png'], ['female', 'طالبة', '/assets/home/characters/girl-card.png']].map(([value, label, image]) => (
                                        <button key={value} type="button" onClick={() => setData('gender', value)} aria-pressed={data.gender === value} className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 px-3 font-bold transition ${data.gender === value ? value === 'male' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-500'}`}>
                                            <span className="h-10 w-10 overflow-hidden rounded-full bg-white"><img src={image} alt="" className="h-full w-full object-cover object-top" /></span>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <InputError message={errors.gender} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="name" value="الاسم*" />
                                <TextInput id="name" name="name" value={data.name} className="login-input" autoComplete="name" isFocused tabIndex={isLit ? 0 : -1} onChange={(e) => setData('name', e.target.value)} required />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="email" value="البريد الإلكتروني*" />
                                <div className="login-input-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0-8.69 5.52a2 2 0 0 1-2.12 0L2.25 6.75" /></svg>
                                    <TextInput id="email" type="email" name="email" value={data.email} className="login-input" placeholder="example@gmail.com" autoComplete="username" tabIndex={isLit ? 0 : -1} onChange={(e) => setData('email', e.target.value)} />
                                </div>
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="كلمة المرور*" />
                                <div className="login-input-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 0h10.5a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25v-7.5a2.25 2.25 0 0 1 2.25-2.25Z" /></svg>
                                    <TextInput id="password" type="password" name="password" value={data.password} className="login-input" placeholder="••••••••" autoComplete="new-password" tabIndex={isLit ? 0 : -1} onChange={(e) => setData('password', e.target.value)} />
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password_confirmation" value="تأكيد كلمة المرور*" />
                                <div className="login-input-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 0h10.5a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25v-7.5a2.25 2.25 0 0 1 2.25-2.25Z" /></svg>
                                    <TextInput id="password_confirmation" type="password" name="password_confirmation" value={data.password_confirmation} className="login-input" placeholder="••••••••" autoComplete="new-password" tabIndex={isLit ? 0 : -1} onChange={(e) => setData('password_confirmation', e.target.value)} />
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>

                            <div className="mt-5 xl:mt-8">
                                <button type="submit" className="login-submit" disabled={processing}>
                                    {processing ? 'لحظة من فضلك...' : 'إنشاء الحساب'}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A3.75 3.75 0 0 0 12 1.5H7.5a3.75 3.75 0 0 0-3.75 3.75v13.5A3.75 3.75 0 0 0 7.5 22.5H12a3.75 3.75 0 0 0 3.75-3.75V15m3-3h-9m9 0-3-3m3 3-3 3" /></svg>
                                </button>
                            </div>

                            <div className="mt-5 text-center text-sm text-slate-500">
                                لديك حساب؟{' '}
                                <Link href={loginHref} tabIndex={isLit ? 0 : -1} className="login-accent-link font-bold hover:underline">تسجيل الدخول</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
