import { Head } from '@inertiajs/react';
import PublicSiteLayout from '@/Components/PublicSiteLayout';
import { useStudentTheme } from '@/contexts/StudentThemeContext';
import { useEffect, useRef, useState } from 'react';

export default function Welcome({ content = {}, courses = [], stats: liveStats = [] }) {
    const { isPublicHome } = useStudentTheme();
    const start = isPublicHome ? route('explore.index') : route('learning.my');
    const heroRef = useRef(null);
    const charactersRef = useRef([]);
    const scrollRef = useRef(0);
    const [scrollY, setScrollY] = useState(0);
    const [activeSection, setActiveSection] = useState('hero');

    // Track which section is currently visible for parallax
    useEffect(() => {
        const sections = document.querySelectorAll('.cinematic-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.dataset.section || 'hero');
                }
            });
        }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

        sections.forEach((sec) => observer.observe(sec));
        return () => observer.disconnect();
    }, []);

    // Parallax scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cinematic text reveal animation
    useEffect(() => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const cinematicElements = document.querySelectorAll('.cinematic-reveal');
        cinematicElements.forEach((el, index) => {
            setTimeout(() => {
                revealObserver.observe(el);
            }, index * 150);
        });

        return () => {
            revealObserver.disconnect();
        };
    }, []);

    // Dynamic parallax with physics-based movement
    useEffect(() => {
        let lastMouseX = 0;
        let lastMouseY = 0;
        let mouseMoving = false;
        let velocityX = 0;
        let velocityY = 0;

        const handleMouseMove = (e) => {
            mouseMoving = true;
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX - innerWidth / 2) / innerWidth;
            const y = (e.clientY - innerHeight / 2) / innerHeight;

            velocityX = x - lastMouseX;
            velocityY = y - lastMouseY;
            lastMouseX = x;
            lastMouseY = y;

            charactersRef.current.forEach((char, index) => {
                if (char) {
                    const depth = Math.pow(index + 1, 0.7);
                    const moveX = (x + velocityX * 0.5) * depth * 30;
                    const moveY = (y + velocityY * 0.5) * depth * 25;
                    const rotation = (index % 2 === 0) ? moveX * 0.15 : -moveX * 0.15;
                    char.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.03) rotate(${rotation}deg)`;
                    char.style.filter = `drop-shadow(0 10px 30px rgba(79, 70, 229, ${0.3 + Math.abs(moveX) * 0.01}))`;
                }
            });
        };

        const mouseMoveThrottler = () => {
            if (mouseMoving) {
                handleMouseMove({ clientX: lastMouseX * window.innerWidth, clientY: lastMouseY * window.innerHeight });
                setTimeout(mouseMoveThrottler, 16);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousemove', mouseMoveThrottler);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousemove', mouseMoveThrottler);
        };
    }, []);

    // Advanced dynamic glow effects with particle system
    const createGlow = () => {
        const hero = heroRef.current;
        if (!hero) return;

        const glowContainer = document.createElement('div');
        glowContainer.className = 'hero-glow-container';

        const glow = document.createElement('div');
        glow.className = 'hero-advanced-glow';

        const particleCount = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-glow-particle';
            const size = Math.random() * 200 + 150;
            const offsetX = (Math.random() - 0.5) * 80;
            const offsetY = (Math.random() - 0.5) * 80;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.setProperty('--offset-x', `${offsetX}px`);
            particle.style.setProperty('--offset-y', `${offsetY}px`);
            particle.style.opacity = Math.random() * 0.4 + 0.1;
            glow.appendChild(particle);
        }

        const blur = document.createElement('div');
        blur.className = 'hero-glow-blur';
        blur.style.width = `${Math.random() * 400 + 300}px`;
        blur.style.height = `${Math.random() * 400 + 300}px`;
        blur.style.left = `${Math.random() * 100}%`;
        blur.style.top = `${Math.random() * 100}%`;
        blur.style.opacity = Math.random() * 0.15 + 0.05;

        glowContainer.appendChild(glow);
        glowContainer.appendChild(blur);
        hero.appendChild(glowContainer);

        const particles = glow.querySelectorAll('.hero-glow-particle');
        particles.forEach((particle, i) => {
            const angle = (particleCount === 1) ? 0 : (360 / particleCount) * i;
            const radius = Math.random() * 100 + 50;
            const targetX = Math.cos(angle) * radius;
            const targetY = Math.sin(angle) * radius;
            particle.animate([
                { transform: `translate3d(0, 0, 0) scale(0.8)`, opacity: 0 },
                { transform: `translate3d(${targetX}px, ${targetY}px, 0) scale(1.2)`, opacity: 0.2 },
                { transform: `translate3d(${targetX * 1.5}px, ${targetY * 1.5}px, 0) scale(0.9)`, opacity: 0 }
            ], {
                duration: 3000,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            });
        });

        glow.animate([
            { opacity: 0, transform: 'scale(0.9)', filter: 'blur(0px)' },
            { opacity: 1, transform: 'scale(1)', filter: 'blur(4px)' },
            { opacity: 0, transform: 'scale(1.1)', filter: 'blur(8px)' }
        ], {
            duration: 2000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        }).onfinish = () => {
            glowContainer.remove();
        };
    };

    const glowInterval = setInterval(createGlow, 1500);

    return (
        <PublicSiteLayout fullBleed overlayHero>
            <Head title="عربيتي" />
            <meta name="description" content={content.hero_description || 'عربيتي — منصة تعليم للأطفال والأهل.'} />

            {/* === GLOBAL LAYERS === */}
            <style>{`
                .hero-fallback-bg {
                    background: linear-gradient(135deg, #0f0a2e 0%, #1a0a3e 30%, #0a1628 60%, #0d1f3c 100%);
                    background-attachment: fixed;
                }

                .arabeti-hero {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    background: linear-gradient(135deg, #0f0a2e 0%, #1a0a3e 30%, #0a1628 60%, #0d1f3c 100%);
                    background-attachment: fixed;
                }

                /* === GRID LAYERS === */
                .arabeti-hero-grid {
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 60%),
                        radial-gradient(ellipse 60% 50% at 70% 60%, rgba(79, 70, 229, 0.06) 0%, transparent 50%),
                        radial-gradient(ellipse 50% 40% at 30% 70%, rgba(139, 92, 246, 0.04) 0%, transparent 40%);
                    z-index: 0;
                }

                /* === GRADIENT ORBS === */
                .arabeti-hero-pattern {
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(79, 70, 229, 0.1) 0%, transparent 45%),
                        radial-gradient(circle at 50% 80%, rgba(56, 189, 248, 0.08) 0%, transparent 30%);
                    z-index: 1;
                    pointer-events: none;
                }

                /* === CONTENT WRAP === */
                .home-pro-wrap {
                    position: relative;
                    z-index: 10;
                }

                /* === CINEMATIC HEADLINE === */
                .cinematic-headline {
                    font-size: clamp(3rem, 8vw, 6rem);
                    font-weight: 800;
                    line-height: 1.05;
                    letter-spacing: -0.03em;
                    text-shadow: 0 0 80px rgba(139, 92, 246, 0.3), 0 0 120px rgba(139, 92, 246, 0.15);
                    background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 40%, #a78bfa 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .cinematic-desc {
                    font-size: clamp(0.95rem, 2vw, 1.15rem);
                    line-height: 1.7;
                    max-width: 600px;
                    color: rgba(255, 255, 255, 0.6);
                    margin-top: 1.2rem;
                }

                .cinematic-kicker {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.35rem 0.9rem;
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(56, 189, 248, 0.2));
                    border: 1px solid rgba(139, 92, 246, 0.4);
                    border-radius: 2rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: #e0e7ff;
                    margin-bottom: 1.5rem;
                }

                /* === BUTTONS === */
                .cinematic-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.85rem 2rem;
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(79, 70, 229, 0.9));
                    border: none;
                    border-radius: 0.6rem;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #ffffff;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255,255,255,0.08) inset;
                    position: relative;
                    overflow: hidden;
                    text-decoration: none;
                }

                .cinematic-btn-primary::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(56, 189, 248, 0.2));
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .cinematic-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 35px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset;
                    background: linear-gradient(135deg, rgba(139, 92, 246, 1), rgba(79, 70, 229, 1));
                }

                .cinematic-btn-primary:hover::before {
                    opacity: 1;
                }

                .cinematic-btn-primary:active {
                    transform: translateY(0) scale(0.97);
                }

                .cinematic-btn-ghost {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.55rem 1.3rem;
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 0.5rem;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.75);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    text-decoration: none;
                    position: relative;
                }

                .cinematic-btn-ghost:hover {
                    border-color: rgba(255, 255, 255, 0.5);
                    color: #ffffff;
                    background: rgba(255, 255, 255, 0.08);
                    transform: translateY(-1px);
                }

                .cinematic-btn-ghost:active {
                    transform: translateY(0) scale(0.97);
                }

                /* === HERO STAGE === */
                .arabeti-hero-stage {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3rem;
                    margin-top: 2rem;
                    opacity: 0.8;
                }

                .arabeti-stage-glow {
                    position: absolute;
                    width: 220px;
                    height: 220px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 60%);
                    filter: blur(60px);
                    z-index: 0;
                }

                .hero-char-tilt {
                    will-change: transform, opacity, filter;
                    cursor: pointer;
                    transition: transform 0.15s ease, filter 0.3s ease;
                }

                .hero-char-tilt:hover {
                    transform: scale(1.06);
                    z-index: 5;
                }

                .hero-char-tilt:hover .arabeti-hero-char {
                    filter: drop-shadow(0 25px 40px rgba(79, 70, 229, 0.35));
                }

                .arabeti-hero-char {
                    width: 180px;
                    height: 220px;
                    object-fit: cover;
                    border-radius: 1rem;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                /* === SCROLL HINT === */
                .cinematic-scroll-hint {
                    position: absolute;
                    bottom: 3rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    z-index: 10;
                    opacity: 0.7;
                }

                .cinematic-scroll-text {
                    font-size: 0.8rem;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.45);
                }

                .cinematic-scroll-wheel {
                    width: 1px;
                    height: 24px;
                    background: rgba(255, 255, 255, 0.25);
                    border-radius: 1px;
                    position: relative;
                    overflow: hidden;
                }

                .cinematic-scroll-dot {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: scroll-dot-bounce 2s ease-in-out infinite;
                }

                @keyframes scroll-dot-bounce {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
                    50% { transform: translate(-50%, -50%) scale(1.8); opacity: 1; }
                }

                /* === STATS BAND === */
                .arabeti-stats-band {
                    background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 100%);
                    padding: 3rem 0;
                    position: relative;
                    overflow: hidden;
                }

                .arabeti-stats-row {
                    display: flex;
                    gap: 2rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .arabeti-stat {
                    text-align: center;
                    padding: 1rem 1.2rem;
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(56, 189, 248, 0.05));
                    border: 1px solid rgba(139, 92, 246, 0.15);
                    border-radius: 0.75rem;
                    min-width: 100px;
                    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .arabeti-stat::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15), transparent 60%);
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .arabeti-stat:hover {
                    transform: translateY(-3px);
                    border-color: rgba(139, 92, 246, 0.3);
                    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
                }

                .arabeti-stat:hover::before {
                    opacity: 1;
                }

                .arabeti-stat strong {
                    display: block;
                    font-size: 1.8rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #e0e7ff, #a78bfa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    position: relative;
                    z-index: 1;
                }

                .arabeti-stat span {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: rgba(255, 255, 255, 0.5);
                    position: relative;
                    z-index: 1;
                }

                /* === LEVELS SECTION === */
                .home-pro-section {
                    padding: 5rem 0;
                    background: linear-gradient(180deg, #0f0a2e 0%, #1a0a3e 50%, #0a1628 100%);
                    position: relative;
                    overflow: hidden;
                }

                .home-pro-section::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 40%),
                        radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.06) 0%, transparent 30%);
                    pointer-events: none;
                }

                .home-pro-wrap {
                    position: relative;
                    z-index: 1;
                }

                .home-pro-section-head {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .home-pro-kicker {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.3rem 0.8rem;
                    background: linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(139, 92, 246, 0.2));
                    border: 1px solid rgba(56, 189, 248, 0.3);
                    border-radius: 1.5rem;
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: #e0e7ff;
                    margin-bottom: 1rem;
                }

                .home-pro-section-head h2 {
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 700;
                    color: #ffffff;
                    line-height: 1.1;
                }

                .home-pro-section-head h2 em {
                    font-style: normal;
                    background: linear-gradient(135deg, #e0e7ff, #a78bfa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .home-pro-section-head p {
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.5);
                    margin-top: 0.5rem;
                }

                .home-pro-level-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.25rem;
                    position: relative;
                    z-index: 1;
                }

                .home-pro-level-card {
                    position: relative;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    overflow: hidden;
                    cursor: pointer;
                    text-decoration: none;
                    display: block;
                }

                .home-pro-level-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, #8b5cf6, #38bdf8);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.4s ease;
                }

                .home-pro-level-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(139, 92, 246, 0.3);
                    background: rgba(255, 255, 255, 0.07);
                    box-shadow: 0 15px 40px rgba(139, 92, 246, 0.12);
                }

                .home-pro-level-card:hover::before {
                    transform: scaleX(1);
                }

                .home-pro-level-icon {
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(56, 189, 248, 0.15));
                    border-radius: 0.75rem;
                    margin-bottom: 1rem;
                    transition: all 0.3s;
                }

                .home-pro-level-card:hover .home-pro-level-icon {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(56, 189, 248, 0.25));
                    transform: scale(1.1);
                }

                .home-pro-level-card strong {
                    display: block;
                    font-size: 1.05rem;
                    color: #ffffff;
                    margin-bottom: 0.25rem;
                }

                .home-pro-level-card small {
                    display: block;
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.4);
                    margin-bottom: 0.5rem;
                }

                .home-pro-level-card p {
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.35);
                    line-height: 1.5;
                    margin-bottom: 0.75rem;
                }

                .home-pro-level-go {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #38bdf8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 0.3rem 0.8rem;
                    background: rgba(56, 189, 248, 0.15);
                    border: 1px solid rgba(56, 189, 248, 0.3);
                    border-radius: 1rem;
                    transition: all 0.3s;
                }

                .home-pro-level-card:hover .home-pro-level-go {
                    background: rgba(56, 189, 248, 0.25);
                    border-color: rgba(56, 189, 248, 0.5);
                }

                /* === HOW IT WORKS === */
                .home-pro-section-soft {
                    padding: 5rem 0;
                    background: linear-gradient(180deg, #0f0a2e 0%, #1a0a3e 50%, #0a1628 100%);
                    position: relative;
                    overflow: hidden;
                }

                .home-pro-section-soft::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.06) 0%, transparent 50%),
                        radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.04) 0%, transparent 40%);
                    pointer-events: none;
                }

                .home-pro-journey {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    position: relative;
                    z-index: 1;
                }

                .home-pro-journey-step {
                    text-align: center;
                    padding: 1.5rem 1rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 1rem;
                    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .home-pro-journey-step::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, transparent 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%);
                    opacity: 0;
                    transition: opacity 0.4s;
                }

                .home-pro-journey-step:hover {
                    transform: translateY(-3px);
                    border-color: rgba(139, 92, 246, 0.25);
                    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.08);
                }

                .home-pro-journey-step:hover::after {
                    opacity: 1;
                }

                .home-pro-journey-step strong {
                    display: block;
                    font-size: 1.2rem;
                    color: #e0e7ff;
                    margin-bottom: 0.5rem;
                }

                .home-pro-journey-step p {
                    font-size: 0.78rem;
                    color: rgba(255, 255, 255, 0.35);
                    line-height: 1.5;
                }

                /* === PARENTS SECTION === */
                .home-pro-section {
                    padding: 5rem 0;
                    background: linear-gradient(180deg, #0f0a2e 0%, #1a0a3e 50%, #0a1628 100%);
                    position: relative;
                    overflow: hidden;
                }

                .home-pro-section::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(circle at 70% 30%, rgba(56, 189, 248, 0.06) 0%, transparent 40%),
                        radial-gradient(circle at 20% 70%, rgba(139, 92, 246, 0.04) 0%, transparent 40%);
                    pointer-events: none;
                }

                .home-pro-parents-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.25rem;
                    position: relative;
                    z-index: 1;
                }

                .home-pro-section-head {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .home-pro-section-head-start {
                    padding-top: 1.5rem;
                }

                .home-pro-section-head h2 {
                    font-size: clamp(2rem, 4vw, 2.5rem);
                    font-weight: 700;
                    color: #ffffff;
                    line-height: 1.1;
                }

                .home-pro-section-head h2 em {
                    font-style: normal;
                    background: linear-gradient(135deg, #e0e7ff, #a78bfa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .home-pro-section-head p {
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.5);
                    margin-top: 0.5rem;
                }

                .home-pro-parent-cards {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    position: relative;
                    z-index: 1;
                }

                .home-pro-parent-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1.25rem 1.5rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 0.75rem;
                    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .home-pro-parent-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .home-pro-parent-card:hover {
                    transform: translateX(4px);
                    border-color: rgba(139, 92, 246, 0.25);
                    background: rgba(255, 255, 255, 0.05);
                }

                .home-pro-parent-card:hover::before {
                    opacity: 1;
                }

                .home-pro-parent-card h3 {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #e0e7ff;
                    margin-bottom: 0.25rem;
                }

                .home-pro-parent-card p {
                    font-size: 0.78rem;
                    color: rgba(255, 255, 255, 0.4);
                    line-height: 1.5;
                }

                /* === CTA SECTION === */
                .home-pro-cta-band {
                    padding: 5rem 0;
                    background: linear-gradient(180deg, #0f0a2e 0%, #1a0a3e 50%, #0a1628 100%);
                    position: relative;
                    overflow: hidden;
                }

                .home-pro-cta-band::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 30% 80%, rgba(56, 189, 248, 0.06) 0%, transparent 40%);
                    pointer-events: none;
                }

                .home-pro-cta-inner {
                    text-align: center;
                    position: relative;
                    z-index: 1;
                }

                .home-pro-cta-inner h2 {
                    font-size: clamp(1.6rem, 3.5vw, 2.2rem);
                    font-weight: 700;
                    color: #ffffff;
                    line-height: 1.2;
                    margin-bottom: 0.75rem;
                }

                .home-pro-cta-inner p {
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.5);
                    margin-bottom: 1.5rem;
                }

                .home-pro-cta-row {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                    position: relative;
                    z-index: 1;
                }

                /* === FLOATING ORBS === */
                .hero-dynamic-glow {
                    position: absolute;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%);
                    filter: blur(2px);
                    animation: floating-orb 4s ease-in-out infinite;
                    pointer-events: none;
                    z-index: -1;
                    transition: transform 0.1s ease;
                }

                .hero-dynamic-glow:nth-child(2) {
                    animation-delay: 1s;
                    width: 160px;
                    height: 160px;
                    background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 60%);
                }

                .hero-dynamic-glow:nth-child(3) {
                    animation-delay: 2s;
                    width: 120px;
                    height: 120px;
                    background: radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 60%);
                }

                @keyframes floating-orb {
                    0%, 100% {
                        transform: translate3d(0, 0, 0) rotate(0deg);
                        opacity: 0.2;
                    }
                    25% {
                        transform: translate3d(10px, -15px, 0) rotate(180deg);
                        opacity: 0.4;
                    }
                    50% {
                        transform: translate3d(20px, -25px, 0) rotate(360deg);
                        opacity: 0.5;
                    }
                    75% {
                        transform: translate3d(-10px, -10px, 0) rotate(540deg);
                        opacity: 0.3;
                    }
                }

                /* === SHIMMER TEXT === */
                .shimmer-text {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 3s infinite;
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .shimmer-text {
                    font-size: 0.75rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    font-weight: 500;
                    margin-top: 0.5rem;
                }

                /* === GLASS EFFECT === */
                .glass-effect {
                    backdrop-filter: blur(12px);
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    border-radius: 0.75rem;
                }

                /* === SCROLL REVEAL === */
                .revealed {
                    opacity: 1 !important;
                    transform: translate3d(0, 0, 0) scale(1);
                    transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .cinematic-reveal {
                    opacity: 0;
                    transform: translate3d(0, 30px, 0) scale(0.95);
                    filter: blur(4px);
                    animation-fill-mode: forwards;
                    animation-duration: 1.2s;
                    animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                /* === SCROLL ANIMATIONS === */
                .cinematic-section {
                    position: relative;
                    will-change: transform, opacity;
                }

                .cinematic-section.revealed {
                    opacity: 1 !important;
                    transform: translate3d(0, 0, 0) scale(1);
                }

                .cinematic-section-depth-1 {
                    transform: translate3d(0, 20px, 0);
                    transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .cinematic-section-depth-2 {
                    transform: translate3d(0, 40px, 0);
                    transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .cinematic-section-depth-3 {
                    transform: translate3d(0, 60px, 0);
                    transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .cinematic-section-depth-4 {
                    transform: translate3d(0, 80px, 0);
                    transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                /* === CHARACTER FLOATING ANIMATION === */
                .arabeti-char-float {
                    animation: char-float 4s ease-in-out infinite;
                    will-change: transform, opacity, filter;
                }

                @keyframes char-float {
                    0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
                    25% { transform: translate3d(0, -8px, 0) rotate(1deg); }
                    50% { transform: translate3d(0, -4px, 0) rotate(-1deg); }
                    75% { transform: translate3d(0, -12px, 0) rotate(0.5deg); }
                }

                /* === CHARACTER WAVE ANIMATION === */
                .arabeti-char-wave {
                    animation: char-wave 3s ease-in-out infinite;
                    will-change: transform;
                }

                @keyframes char-wave {
                    0%, 100% { transform: translate3d(0, 0, 0) scaleY(1); }
                    50% { transform: translate3d(0, -6px, 0) scaleY(1.05); }
                }

                /* === CHARACTER GLOW PULSE === */
                .arabeti-char-glow {
                    animation: char-glow-pulse 2s ease-in-out infinite;
                }

                @keyframes char-glow-pulse {
                    0%, 100% { filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.3)); }
                    50% { filter: drop-shadow(0 0 40px rgba(139, 92, 246, 0.6)); }
                }

                /* === SCROLL INDICATOR === */
                .scroll-indicator {
                    animation: scroll-indicator-bounce 2s ease-in-out infinite;
                }

                @keyframes scroll-indicator-bounce {
                    0%, 100% { transform: translateY(0); opacity: 0.7; }
                    50% { transform: translateY(8px); opacity: 1; }
                }

                /* === PARALLAX LAYER === */
                .parallax-layer {
                    will-change: transform, opacity;
                    transition: transform 0.1s ease-out;
                }

                /* === ENTRANCE ANIMATION === */
                @keyframes cinematic-text-reveal {
                    from { opacity: 0; transform: translate3d(0, 30px, 0) scale(0.95); filter: blur(4px); }
                    to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
                }

                /* === MOBILE RESPONSIVE === */
                @media (max-width: 768px) {
                    .arabeti-hero-stage {
                        gap: 1.5rem;
                    }

                    .arabeti-stage-glow {
                        width: 120px;
                        height: 120px;
                    }

                    .hero-char-tilt {
                        transform: scale(0.9);
                    }

                    .hero-char-tilt:hover {
                        transform: scale(1.06);
                    }

                    .arabeti-hero-char {
                        width: 140px;
                        height: 170px;
                    }

                    .cinematic-headline {
                        font-size: clamp(2rem, 10vw, 4rem);
                    }

                    .arabeti-hero-stage {
                        flex-direction: column-reverse;
                        gap: 1.5rem;
                    }

                    .arabeti-stage-glow {
                        width: 160px;
                        height: 160px;
                    }
                }

                @media (max-width: 480px) {
                    .arabeti-hero-stage {
                        gap: 1rem;
                    }

                    .arabeti-stage-glow {
                        width: 100px;
                        height: 100px;
                    }

                    .hero-char-tilt {
                        transform: scale(0.85);
                    }

                    .hero-char-tilt:hover {
                        transform: scale(1.06);
                    }

                    .arabeti-hero-char {
                        width: 120px;
                        height: 150px;
                    }

                    .cinematic-headline {
                        font-size: clamp(1.8rem, 12vw, 3rem);
                    }
                }

                /* === REDUCED MOTION === */
                @media (prefers-reduced-motion: reduce) {
                    .arabeti-hero-stage,
                    .arabeti-stage-glow,
                    .hero-char-tilt,
                    .arabeti-hero-char,
                    .cinematic-scroll-hint,
                    .cinematic-scroll-dot,
                    .hero-glow-container,
                    .hero-advanced-glow,
                    .hero-glow-particle,
                    .hero-glow-blur,
                    .arabeti-hero-side,
                    .arabeti-char-float,
                    .arabeti-char-wave,
                    .arabeti-char-glow,
                    .cinematic-godray,
                    .cinematic-godray-boy,
                    .cinematic-godray-girl,
                    .hero-rimlight,
                    .hero-rimlight-boy,
                    .hero-rimlight-girl,
                    .hero-dynamic-glow,
                    .shimmer-text,
                    .scroll-indicator {
                        animation: none !important;
                    }

                    .cinematic-reveal {
                        animation: none !important;
                        opacity: 1 !important;
                        transform: none !important;
                    }

                    .arabeti-hero-copy > * {
                        animation: none !important;
                    }

                    .parallax-layer {
                        transition: none !important;
                    }
                }

                /* === SCROLL-DRIVEN TRANSITIONS === */
                .cinematic-section.is-active-depth-1 {
                    transform: translate3d(0, 20px, 0);
                    opacity: 1;
                }

                .cinematic-section.is-active-depth-2 {
                    transform: translate3d(0, 40px, 0);
                    opacity: 1;
                }

                .cinematic-section.is-active-depth-3 {
                    transform: translate3d(0, 60px, 0);
                    opacity: 1;
                }

                .cinematic-section.is-active-depth-4 {
                    transform: translate3d(0, 80px, 0);
                    opacity: 1;
                }
            `}</style>

            {/* === HERO SECTION === */}
            <section
                ref={heroRef}
                className="arabeti-hero cinematic-section cinematic-section-depth-1"
                data-section="hero"
                style={{ backgroundAttachment: 'fixed' }}
            >
                {/* Grid layers */}
                <div className="arabeti-hero-grid">
                    <div className="grid-bg-pattern"></div>
                </div>

                {/* Gradient orbs */}
                <div className="arabeti-hero-pattern"></div>

                {/* Godray lighting effects - using separate classes to avoid conflicts with existing CSS */}
                <div className="cinematic-godray" style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, 0.35) 30%, rgba(139, 92, 246, 0.15) 60%, transparent 100%)', filter: 'blur(60px)' }}></div>
                <div className="cinematic-godray-boy" style={{ position: 'absolute', bottom: '25%', right: '10%', width: '360px', height: '560px', background: 'radial-gradient(circle at 78% 28%, rgba(255,255,255,.52) 0%, transparent 65%)' }}></div>
                <div className="cinematic-godray-girl" style={{ position: 'absolute', top: '15%', left: '6%', width: '340px', height: '540px', background: 'radial-gradient(circle at 22% 28%, rgba(255,255,255,.46) 0%, transparent 65%)' }}></div>

                {/* Glow orbs */}
                <div className="hero-rimlight" style={{ position: 'absolute', top: '30%', left: '10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 60%)', animation: 'rimlight-breathe 6s ease-in-out infinite' }}></div>
                <div className="hero-rimlight-boy" style={{ position: 'absolute', bottom: '20%', right: '15%', width: '35%', height: '35%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 55%)', animation: 'rimlight-breathe 8s ease-in-out infinite 1s' }}></div>
                <div className="hero-rimlight-girl" style={{ position: 'absolute', top: '10%', right: '30%', width: '30%', height: '30%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 50%)', animation: 'rimlight-breathe 7s ease-in-out infinite 2s' }}></div>

                {/* Dynamic glow particles */}
                <div className="hero-glow-container" ref={heroRef}></div>

                {/* Hero content */}
                <div className="home-pro-wrap">
                    <div className="arabeti-hero-copy text-center px-4 sm:px-6 max-w-2xl mx-auto">
                        {/* Kicker */}
                        <span className="cinematic-kicker inline-flex">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            منصة عربية للأطفال
                        </span>

                        {/* Headline */}
                        <h1 className="cinematic-headline">
                            عربيتي
                        </h1>

                        {/* Description */}
                        <p className="cinematic-desc">
                            عالم تعليمي سحري للأطفال، حيث تتجول الشخصيات المميزة في دروس تفاعلية تعلّم من خلالها أطفالك كأنهم يغامرون في قصة.
                        </p>

                        {/* CTA */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <a href={route('explore.index')} className="cinematic-btn-primary">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7l5 5-5 5"/></svg>
                                ابدأ التعلم
                            </a>
                            <a href={route('explore.index')} className="cinematic-btn-ghost">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                                استكشف الدورات
                            </a>
                        </div>
                    </div>
                </div>

                {/* Scroll hint */}
                <div className="cinematic-scroll-hint">
                    <span className="cinematic-scroll-text">اسحب للتمرير</span>
                    <div className="cinematic-scroll-wheel">
                        <div className="cinematic-scroll-dot"></div>
                    </div>
                </div>
            </section>

            {/* === ENTER THE WORLD === */}
            <section
                ref={heroRef}
                className="arabeti-hero cinematic-section cinematic-section-depth-2"
                data-section="world"
                style={{ backgroundAttachment: 'fixed' }}
            >
                {/* Grid layers */}
                <div className="arabeti-hero-grid">
                    <div className="grid-bg-pattern"></div>
                </div>

                {/* Gradient orbs */}
                <div className="arabeti-hero-pattern"></div>

                {/* Godray lighting effects */}
                <div className="cinematic-godray" style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, 0.35) 30%, rgba(139, 92, 246, 0.15) 60%, transparent 100%)', filter: 'blur(60px)' }}></div>
                <div className="cinematic-godray-boy" style={{ position: 'absolute', bottom: '25%', right: '10%', width: '360px', height: '560px', background: 'radial-gradient(circle at 78% 28%, rgba(255,255,255,.52) 0%, transparent 65%)' }}></div>
                <div className="cinematic-godray-girl" style={{ position: 'absolute', top: '15%', left: '6%', width: '340px', height: '540px', background: 'radial-gradient(circle at 22% 28%, rgba(255,255,255,.46) 0%, transparent 65%)' }}></div>

                {/* Glow orbs */}
                <div className="hero-rimlight" style={{ position: 'absolute', top: '30%', left: '10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 60%)', animation: 'rimlight-breathe 6s ease-in-out infinite' }}></div>
                <div className="hero-rimlight-boy" style={{ position: 'absolute', bottom: '20%', right: '15%', width: '35%', height: '35%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 55%)', animation: 'rimlight-breathe 8s ease-in-out infinite 1s' }}></div>
                <div className="hero-rimlight-girl" style={{ position: 'absolute', top: '10%', right: '30%', width: '30%', height: '30%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 50%)', animation: 'rimlight-breathe 7s ease-in-out infinite 2s' }}></div>

                {/* Dynamic glow particles */}
                <div className="hero-glow-container" ref={heroRef}></div>

                {/* Hero content */}
                <div className="home-pro-wrap text-center px-4 sm:px-6 max-w-2xl mx-auto">
                    <span className="cinematic-kicker inline-flex">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                        دخول العالم
                    </span>
                    <h2 className="cinematic-headline mt-3">
                        دخل إلى عالم التعلم
                    </h2>
                    <p className="cinematic-desc mt-3">
                        انضم إلى شخصياتك المفضلة في رحلة تعليمية تفاعلية. استكشف مواضيع متنوعة مع شخصيات مذهلة توجهك خلال دروسًا سحرية.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                        <a href={route('explore.index')} className="cinematic-btn-primary">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7l5 5-5 5"/></svg>
                            ابدأ التعلم
                        </a>
                        <a href={route('explore.index')} className="cinematic-btn-ghost">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                            استكشف الدورات
                        </a>
                    </div>
                </div>
            </section>

            {/* === MEET THE GUIDES === */}
            <section className="home-pro-section cinematic-section cinematic-section-depth-3" data-section="guides">
                <div className="home-pro-wrap text-center px-4 sm:px-6 max-w-2xl mx-auto">
                    <span className="cinematic-kicker inline-flex">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6m-3-4h-3"/></svg>
                        شخصياتنا المميزة
                    </span>
                    <h2 className="cinematic-headline mt-3">
                        اجمع معنا
                    </h2>
                    <p className="cinematic-desc mt-1">
                        شخصيتان مذهلتان توجهان طفلك خلال رحلة تعليمية غامرة.
                    </p>
                </div>

                {/* Two characters in cinematic scene */}
                <div className="home-pro-journey">
                    {/* Boy character */}
                    <div className="home-pro-journey-step">
                        <div className="arabeti-char-float arabeti-char-glow mb-3">
                            <div className="arabeti-hero-side mx-auto" style={{ background: 'linear-gradient(135deg, #0f0a2e 0%, #1a0a3e 30%, #0a1628 60%, #0d1f3c 100%)', width: '160px', height: '200px', objectFit: 'cover', borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
                                <img src="https://picsum.photos/seed/boy-char-1/160/200.jpg" alt="شخصية الطفل" loading="lazy" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">الطفل</h3>
                        <p className="text-sm text-slate-400">مفكر وفضولي يوجه الطفل خلال دروسه</p>
                    </div>

                    {/* Girl character */}
                    <div className="home-pro-journey-step">
                        <div className="arabeti-char-float arabeti-char-glow mb-3" style={{ animationDelay: '1s' }}>
                            <div className="arabeti-hero-side mx-auto" style={{ background: 'linear-gradient(135deg, #0f0a2e 0%, #1a0a3e 30%, #0a1628 60%, #0d1f3c 100%)', width: '160px', height: '200px', objectFit: 'cover', borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
                                <img src="https://picsum.photos/seed/girl-char-1/160/200.jpg" alt="شخصية الطفلة" loading="lazy" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">الطفلة</h3>
                        <p className="text-sm text-slate-400">مستعيرة ومرشدة توجه الطفل خلال دروسه</p>
                    </div>
                </div>
            </section>

            {/* === LEARN WITH THEM === */}
            <section className="home-pro-section cinematic-section cinematic-section-depth-4" data-section="learn">
                <div className="home-pro-wrap text-center px-4 sm:px-6 max-w-2xl mx-auto">
                    <span className="cinematic-kicker inline-flex">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                        دروس تفاعلية
                    </span>
                    <h2 className="cinematic-headline mt-3">
                        تعلم معاً
                    </h2>
                    <p className="cinematic-desc mt-1">
                        شاهد كيف تعلّم أطفالك من خلال دروس تفاعلية مع شخصياتنا.
                    </p>
                </div>

                {/* Interactive lesson demo */}
                <div className="home-pro-journey">
                    <div className="home-pro-journey-step" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                🌟
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">الطفلة تشرح</h3>
                                <p className="text-xs text-slate-400">لماذا ألوان السماء؟</p>
                            </div>
                        </div>
                        <div className="glass-effect p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">🧑</div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold">👧</div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                السماء زرقاء بسبب انعكاس ضوء الشمس على جزيئات الهواء. شاهد الفيديو التعليمي الكامل!
                            </p>
                        </div>
                    </div>

                    <div className="home-pro-journey-step" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                                🧑
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">الطفل يسأل</h3>
                                <p className="text-xs text-slate-400">لماذا السماء زرقاء؟</p>
                            </div>
                        </div>
                        <div className="glass-effect p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">🧑</div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold">👧</div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                السماء زرقاء بسبب انعكاس ضوء الشمس على جزيئات الهواء. شاهد الفيديو الكامل!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* === CHOOSE YOUR WORLD === */}
            <section className="home-pro-section cinematic-section cinematic-section-depth-5" data-section="worlds">
                <div className="home-pro-wrap text-center px-4 sm:px-6 max-w-2xl mx-auto">
                    <span className="cinematic-kicker inline-flex">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                        اختر عالمك المفضل
                    </span>
                    <h2 className="cinematic-headline mt-3">
                        اختر عالمك المفضل
                    </h2>
                    <p className="cinematic-desc mt-1">
                        استكشف مواضيع تعليمية غامرة مع شخصياتنا المميزة.
                    </p>
                </div>

                {/* World cards */}
                <div className="home-pro-level-grid">
                    <a href={route('explore.index')} className="home-pro-level-card group">
                        <div className="home-pro-level-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 000 20M12 2a14.5 14.5 0 010 20M2 12h20"/></svg>
                        </div>
                        <h3 className="font-bold text-white mb-1">الرياضيات</h3>
                        <p className="text-xs text-slate-400 mb-2">أغانم تعليمية تفاعلية مع شخصياتها المميزة</p>
                        <span className="home-pro-level-go">
                            استكشف
                        </span>
                    </a>

                    <a href={route('explore.index')} className="home-pro-level-card group">
                        <div className="home-pro-level-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                        </div>
                        <h3 className="font-bold text-white mb-1">العلوم</h3>
                        <p className="text-xs text-slate-400 mb-2">أغانم تعليمية تفاعلية مع شخصياتها المميزة</p>
                        <span className="home-pro-level-go">
                            استكشف
                        </span>
                    </a>

                    <a href={route('explore.index')} className="home-pro-level-card group">
                        <div className="home-pro-level-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                        </div>
                        <h3 className="font-bold text-white mb-1">اللغة</h3>
                        <p className="text-xs text-slate-400 mb-2">أغانم تعليمية تفاعلية مع شخصياتها المميزة</p>
                        <span className="home-pro-level-go">
                            استكشف
                        </span>
                    </a>

                    <a href={route('explore.index')} className="home-pro-level-card group">
                        <div className="home-pro-level-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        </div>
                        <h3 className="font-bold text-white mb-1">الإبداع</h3>
                        <p className="text-xs text-slate-400 mb-2">أغانم تعليمية تفاعلية مع شخصياتها المميزة</p>
                        <span className="home-pro-level-go">
                            استكشف
                        </span>
                    </a>
                </div>
            </section>

            {/* === LEARNING JOURNEY === */}
            <section className="home-pro-section cinematic-section cinematic-section-depth-6" data-section="journey">
                <div className="home-pro-wrap text-center px-4 sm:px-6 max-w-2xl mx-auto">
                    <span className="cinematic-kicker inline-flex">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        مسار التعلم
                    </span>
                    <h2 className="cinematic-headline mt-3">
                        رحلة التعلّم
                    </h2>
                    <p className="cinematic-desc mt-1">
                        اجرب دروسًا تفاعلية واكتشف تقدمك في عالم التعلم.
                    </p>
                </div>

                {/* Journey steps */}
                <div className="home-pro-journey">
                    <div className="home-pro-journey-step">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mb-3">
                            1
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1">دورة</h4>
                        <p className="text-xs text-slate-400">استكشف مواضيع تعليمية متنوعة مع شخصياتها المميزة</p>
                    </div>

                    <div className="home-pro-journey-step">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg mb-3">
                            2
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1">تمرين</h4>
                        <p className="text-xs text-slate-400">أكمل تمارين تفاعلية مع شخصياتها المميزة</p>
                    </div>

                    <div className="home-pro-journey-step">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg mb-3">
                            3
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1">تحدي</h4>
                        <p className="text-xs text-slate-400">اجرب تحديات تفاعلية مع شخصياتها المميزة</p>
                    </div>

                    <div className="home-pro-journey-step">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg mb-3">
                            4
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1">إنجاز</h4>
                        <p className="text-xs text-slate-400">احصل على إنجازات تُظهر تقدمك في التعلّم</p>
                    </div>
                </div>
            </section>

            {/* === FOR PARENTS === */}
            <section className="home-pro-section cinematic-section cinematic-section-depth-7" data-section="parents">
                <div className="home-pro-wrap text-center px-4 sm:px-6 max-w-2xl mx-auto">
                    <span className="cinematic-kicker inline-flex">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6m-3-4h-3"/></svg>
                        لعائلتك
                    </span>
                    <h2 className="cinematic-headline mt-3">
                        عَلّم أطفالك
                    </h2>
                    <p className="cinematic-desc mt-1">
                        تابع التقدم، وأهداف التعلم، وإنجازات أطفالك بشكل مرن.
                    </p>
                </div>

                {/* Parent cards */}
                <div className="home-pro-parents-grid">
                    <div className="home-pro-parent-card">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm mb-2">📊</div>
                        <h3 className="font-bold text-white text-sm">تتبع التقدم</h3>
                        <p className="text-xs text-slate-400">راقب تقدّم طفلك في كل مرحلة تعليمية</p>
                    </div>

                    <div className="home-pro-parent-card">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm mb-2">🎯</div>
                        <h3 className="font-bold text-white text-sm">أهداف التعلم</h3>
                        <p className="text-xs text-slate-400">حدد أهدافًا محددة لتعليم أطفالك</p>
                    </div>

                    <div className="home-pro-parent-card">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm mb-2">🏆</div>
                        <h3 className="font-bold text-white text-sm">إنجازات وبرامج</h3>
                        <p className="text-xs text-slate-400">احصل على إنجازات تُظهر تقدم أطفالك</p>
                    </div>
                </div>
            </section>

            {/* === FINAL CINEMATIC CTA === */}
            <section className="home-pro-cta-band cinematic-section cinematic-section-depth-8" data-section="final">
                <div className="home-pro-cta-inner">
                    <span className="cinematic-kicker inline-flex">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7l5 5-5 5"/></svg>
                        ابدأ الآن
                    </span>
                    <h2 className="cinematic-headline mt-3">
                        رحلتك تبدأ الآن
                    </h2>
                    <p className="cinematic-desc mt-1">
                        انضم إلى الشخصيات المميزة وابدأ رحلة تعليمية سحرية.
                    </p>
                    <div className="home-pro-cta-row">
                        <a href={route('explore.index')} className="cinematic-btn-primary">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7l5 5-5 5"/></svg>
                            ابدأ التعلم
                        </a>
                        <a href={route('explore.index')} className="cinematic-btn-ghost">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                            استكشف الدورات
                        </a>
                    </div>
                </div>
            </section>
        </PublicSiteLayout>
    );
}