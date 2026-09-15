import { Head, Link } from '@inertiajs/react';

/**
 * صفحة تجريبية — تدرج من زاوية لزاوية فقط
 * #0a2463 ↔ #5e548e
 */
export default function GradientBg() {
    return (
        <div dir="rtl" className="lab-diag-page">
            <Head title="تجربة الخلفية" />

            <div className="lab-diag-bg" aria-hidden="true" />

            <main className="lab-diag-content">
                <p className="lab-diag-eyebrow">صفحة تجريبية</p>
                <h1>تدرج من زاوية لزاوية</h1>
                <p className="lab-diag-meta">
                    <code>#0a2463</code>
                    <span aria-hidden="true">→</span>
                    <code>#5e548e</code>
                </p>
                <Link href="/" className="lab-diag-back">
                    العودة للرئيسية
                </Link>
            </main>
        </div>
    );
}
