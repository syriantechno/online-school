import { Link, usePage } from '@inertiajs/react';
import ArabetiLogo from '@/Components/ArabetiLogo';
import BrandLetters from '@/Components/BrandLetters';
import { useStudentTheme } from '@/contexts/StudentThemeContext';

export default function HomeHero3D({ content = {} }) {
    const page = usePage();
    const { isPublicHome } = useStudentTheme();
    const user = page.props.auth?.user;

    const heroDesc = content.hero_description || 'منصة عربية أصيلة للأطفال: حروف بهوية، دروس ممتعة، ومتابعة واضحة للأهل.';
    const heroLine = content.hero_highlight || content.hero_title || 'عربيتي… حيثُ تنبض اللغة العربية بالحياة';

    const startHref = isPublicHome ? route('explore.index') : route('learning.my');

    return (
        <section className="n-hero is-cinematic" aria-label="مقدمة عربيتي" style={{ '--mx': '0', '--my': '0' }}>
            {/* طبقات الخلفية */}
            <div className="n-hero-bg" aria-hidden="true" />
            <div className="n-hero-grid" aria-hidden="true" />
            <div className="n-hero-orbs" aria-hidden="true">
                <span className="n-orb n-orb-a" aria-hidden="true" />
                <span className="n-orb n-orb-b" aria-hidden="true" />
                <span className="n-orb n-orb-c" aria-hidden="true" />
            </div>

            <BrandLetters variant="hero" />

            <div className="n-hero-inner">
                <div className="n-hero-identity">
                    <ArabetiLogo size="hero" />
                    <h1 className="n-hero-title">{isPublicHome ? 'عربيتي' : `مرحباً ${user?.name ?? 'الطالب'}!`}</h1>
                    <p className="n-hero-tagline">{heroDesc}</p>
                </div>

                <div className="n-hero-glass-pill cinematic-reveal">
                    {heroLine}
                </div>

                <div className="n-hero-actions cinematic-reveal">
                    <Link href={startHref} className="n-btn n-btn-primary">
                        {isPublicHome ? 'استكشف المنصة' : 'ابدأ التعلم'}
                    </Link>
                    <Link href="/#levels" className="n-btn n-btn-ghost">
                        حدّد مستواك
                    </Link>
                </div>
            </div>

            {/* مؤشر التمرير */}
            <div className="n-scroll-hint" aria-label="تمرير للأسفل">
                <span className="n-scroll-text">اكتشف المزيد</span>
                <span className="n-scroll-wheel"><span className="n-scroll-dot" /></span>
            </div>
        </section>
    );
}