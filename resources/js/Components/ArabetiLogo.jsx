/**
 * شعار عربيتي — نسخة 3D الملونة.
 * المسار: /assets/brand/arabeti-logo-3d.png (1516×1013)
 */
export default function ArabetiLogo({ className = '', size = 'hero', animate: _animate = true }) {
    const isNav = size === 'nav';

    return (
        <span className={`arabiti-logo arabiti-logo-img arabiti-logo-${size} ${className}`.trim()}>
            <img
                src="/assets/brand/arabeti-logo-3d.png"
                alt="عربيتي — Learn Arabic Step by Step"
                width={isNav ? 168 : 1516}
                height={isNav ? 112 : 1013}
                decoding="async"
                fetchpriority={size === 'hero' ? 'high' : 'auto'}
            />
        </span>
    );
}
