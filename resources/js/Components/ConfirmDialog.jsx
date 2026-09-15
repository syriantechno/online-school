import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const EVENT_NAME = 'school:confirm';

export function confirmAction(options) {
    const detail = typeof options === 'string' ? { message: options } : options;
    return new Promise((resolve) => window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { ...detail, resolve } })));
}

export default function ConfirmDialog() {
    const { auth } = usePage().props;
    const [dialog, setDialog] = useState(null);
    const confirmRef = useRef(null);
    const isGirl = auth.user?.role === 'student' && auth.user?.gender === 'female';

    useEffect(() => {
        const open = (event) => setDialog(event.detail);
        window.addEventListener(EVENT_NAME, open);
        return () => window.removeEventListener(EVENT_NAME, open);
    }, []);

    useEffect(() => {
        if (!dialog) return undefined;
        const timer = setTimeout(() => confirmRef.current?.focus(), 30);
        const onKey = (event) => event.key === 'Escape' && close(false);
        document.addEventListener('keydown', onKey);
        return () => { clearTimeout(timer); document.removeEventListener('keydown', onKey); };
    }, [dialog]);

    const close = (result) => {
        dialog?.resolve(result);
        setDialog(null);
    };

    if (!dialog) return null;
    const isDanger = dialog.variant === 'danger';
    const picture = isGirl ? '/assets/home/characters/girl3.png' : '/assets/home/characters/boy-card.png';

    return <div className="school-confirm-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close(false)}>
        <section className={`school-confirm ${isDanger ? 'school-confirm-danger' : ''}`} role="alertdialog" aria-modal="true" aria-labelledby="school-confirm-title" aria-describedby="school-confirm-message">
            <span className="school-confirm-orb" aria-hidden="true" />
            <button type="button" className="school-confirm-close" onClick={() => close(false)} aria-label="إغلاق">×</button>
            <img src={picture} alt="" className="school-confirm-character" aria-hidden="true" />
            <div className="school-confirm-copy">
                <span>{isDanger ? 'لحظة من فضلك' : 'خطوة أخيرة'}</span>
                <h2 id="school-confirm-title">{dialog.title || (isDanger ? 'هل أنت متأكد؟' : 'جاهز للمتابعة؟')}</h2>
                <p id="school-confirm-message">{dialog.message}</p>
                <div className="school-confirm-actions">
                    <button type="button" className="school-confirm-cancel" onClick={() => close(false)}>{dialog.cancelLabel || 'لا، تراجع'}</button>
                    <button ref={confirmRef} type="button" className="school-confirm-submit" onClick={() => close(true)}>{dialog.confirmLabel || (isDanger ? 'نعم، احذف' : 'نعم، تابع')}</button>
                </div>
            </div>
        </section>
    </div>;
}
