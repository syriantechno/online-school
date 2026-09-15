import { useCallback, useEffect, useRef, useState } from 'react';

const MIN = 1.2;
const HANDLES = [
    ['nw', 'left-0 top-0 -translate-x-1/2 -translate-y-1/2', 'nwse-resize'],
    ['ne', 'right-0 top-0 translate-x-1/2 -translate-y-1/2', 'nesw-resize'],
    ['sw', 'left-0 bottom-0 -translate-x-1/2 translate-y-1/2', 'nesw-resize'],
    ['se', 'right-0 bottom-0 translate-x-1/2 translate-y-1/2', 'nwse-resize'],
];

const typeStyle = {
    click: 'border-emerald-500 bg-emerald-400/20',
    fill: 'border-sky-500 bg-sky-400/25',
    select: 'border-violet-500 bg-violet-400/20',
};

function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
}

function toPct(clientX, clientY, el) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) {
        return { x: 0, y: 0 };
    }

    return {
        x: clamp(((clientX - r.left) / r.width) * 100, 0, 100),
        y: clamp(((clientY - r.top) / r.height) * 100, 0, 100),
    };
}

function fromCorners(a, b) {
    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);

    return {
        x,
        y,
        w: Math.max(MIN, Math.abs(b.x - a.x)),
        h: Math.max(MIN, Math.abs(b.y - a.y)),
    };
}

function clampZone(zone) {
    const w = clamp(Number(zone.w) || MIN, MIN, 100);
    const h = clamp(Number(zone.h) || MIN, MIN, 100);

    return {
        ...zone,
        w,
        h,
        x: clamp(Number(zone.x) || 0, 0, 100 - w),
        y: clamp(Number(zone.y) || 0, 0, 100 - h),
    };
}

function resizeZone(origin, handle, point) {
    const right = origin.x + origin.w;
    const bottom = origin.y + origin.h;
    let { x, y, w, h } = origin;

    if (handle.includes('w')) {
        x = Math.min(point.x, right - MIN);
        w = right - x;
    }
    if (handle.includes('e')) {
        w = Math.max(MIN, point.x - origin.x);
    }
    if (handle.includes('n')) {
        y = Math.min(point.y, bottom - MIN);
        h = bottom - y;
    }
    if (handle.includes('s')) {
        h = Math.max(MIN, point.y - origin.y);
    }

    return clampZone({ ...origin, x, y, w, h });
}

export default function ImageHotspotEditor({
    imageUrl,
    zones = [],
    selectedId,
    onSelect,
    onChange,
    onCreate,
}) {
    const boxRef = useRef(null);
    const dragRef = useRef(null);
    const [draft, setDraft] = useState(null);
    const [sizeWarning, setSizeWarning] = useState(false);

    const selected = zones.find((zone) => zone.id === selectedId);

    const updateZone = useCallback(
        (id, patch) => {
            onChange(zones.map((zone) => (zone.id === id ? clampZone({ ...zone, ...patch }) : zone)));
        },
        [onChange, zones],
    );

    const onPointerDown = (event) => {
        if (event.button !== 0 || !boxRef.current) {
            return;
        }
        if (event.target.closest('[data-zone]') || event.target.closest('[data-handle]')) {
            return;
        }

        const start = toPct(event.clientX, event.clientY, boxRef.current);
        dragRef.current = { mode: 'create', start };
        setDraft({ ...start, w: 0, h: 0 });
        onSelect(null);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event) => {
        const drag = dragRef.current;
        if (!drag || !boxRef.current) {
            return;
        }

        const point = toPct(event.clientX, event.clientY, boxRef.current);
        if (drag.mode === 'create') {
            setDraft(fromCorners(drag.start, point));
            return;
        }
        if (drag.mode === 'move') {
            updateZone(drag.id, {
                x: drag.origin.x + (point.x - drag.start.x),
                y: drag.origin.y + (point.y - drag.start.y),
            });
            return;
        }
        if (drag.mode === 'resize') {
            updateZone(drag.id, resizeZone(drag.origin, drag.handle, point));
        }
    };

    const finishCreate = () => {
        const drag = dragRef.current;
        if (drag?.mode === 'create' && draft && draft.w >= MIN && draft.h >= MIN) {
            onCreate(clampZone(draft));
        }
        dragRef.current = null;
        setDraft(null);
    };

    const onZonePointerDown = (event, zone) => {
        if (event.button !== 0 || !boxRef.current) {
            return;
        }
        event.stopPropagation();
        onSelect(zone.id);
        const start = toPct(event.clientX, event.clientY, boxRef.current);
        dragRef.current = { mode: 'move', id: zone.id, start, origin: { ...zone } };
        boxRef.current.setPointerCapture(event.pointerId);
    };

    const onHandlePointerDown = (event, zone, handle) => {
        if (event.button !== 0 || !boxRef.current) {
            return;
        }
        event.stopPropagation();
        onSelect(zone.id);
        dragRef.current = {
            mode: 'resize',
            id: zone.id,
            handle,
            origin: { ...zone },
        };
        boxRef.current.setPointerCapture(event.pointerId);
    };

    useEffect(() => {
        const onKey = (event) => {
            const tag = event.target.tagName;
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
                return;
            }
            if (!selected) {
                return;
            }
            if (event.key === 'Delete' || event.key === 'Backspace') {
                event.preventDefault();
                onChange(zones.filter((zone) => zone.id !== selected.id));
                onSelect(null);
                return;
            }
            const step = event.shiftKey ? 2 : 0.5;
            const moves = {
                ArrowLeft: { x: selected.x - step },
                ArrowRight: { x: selected.x + step },
                ArrowUp: { y: selected.y - step },
                ArrowDown: { y: selected.y + step },
            };
            if (moves[event.key]) {
                event.preventDefault();
                updateZone(selected.id, moves[event.key]);
            }
        };

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selected, zones, onChange, onSelect, updateZone]);

    useEffect(() => {
        const box = boxRef.current;
        if (!box || !selected) {
            setSizeWarning(false);
            return;
        }
        const tooSmall = (selected.w / 100) * box.clientWidth < 40 || (selected.h / 100) * box.clientHeight < 40;
        setSizeWarning(tooSmall);
    }, [selected]);

    if (!imageUrl) {
        return (
            <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                ارفع صورة النشاط أولاً ثم ارسم مناطق الإجابة عليها.
            </div>
        );
    }

    return (
        <div>
            <div
                ref={boxRef}
                dir="ltr"
                className="relative touch-none overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={finishCreate}
                onPointerCancel={finishCreate}
            >
                <img src={imageUrl} alt="ورقة النشاط" className="pointer-events-none block w-full select-none" draggable={false} />

                {zones.map((zone, index) => (
                    <div
                        key={zone.id}
                        data-zone={zone.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`منطقة الإجابة ${index + 1}`}
                        onPointerDown={(event) => onZonePointerDown(event, zone)}
                        className={`absolute cursor-move rounded-md border-2 ${typeStyle[zone.type] || typeStyle.click} ${
                            selectedId === zone.id ? 'z-20 ring-2 ring-white ring-offset-2 ring-offset-primary' : 'z-10'
                        }`}
                        style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%` }}
                    >
                        <span className="absolute -top-2 right-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-900 px-1 text-[11px] font-black text-white">
                            {index + 1}
                        </span>
                        {selectedId === zone.id &&
                            HANDLES.map(([handle, pos, cursor]) => (
                                <button
                                    key={handle}
                                    type="button"
                                    data-handle={handle}
                                    aria-label={`تغيير حجم المنطقة من ${handle}`}
                                    className={`absolute z-30 h-4 w-4 rounded-full border-2 border-white bg-primary ${pos}`}
                                    style={{ cursor }}
                                    onPointerDown={(event) => onHandlePointerDown(event, zone, handle)}
                                />
                            ))}
                    </div>
                ))}

                {draft && draft.w > 0.4 && draft.h > 0.4 && (
                    <div
                        className="pointer-events-none absolute z-30 rounded-md border-2 border-dashed border-primary bg-primary/15"
                        style={{ left: `${draft.x}%`, top: `${draft.y}%`, width: `${draft.w}%`, height: `${draft.h}%` }}
                    />
                )}
            </div>

            <p className="mt-3 text-xs leading-6 text-slate-500">
                اسحب على الصورة لرسم مربع الإجابة، ثم حرّكه أو غيّر حجمه. الأسهم تحرّك المنطقة المحددة، وDelete يحذفها.
            </p>
            {sizeWarning && (
                <p className="mt-1 text-xs font-bold text-amber-700">المنطقة صغيرة وقد يصعب على الطفل الضغط عليها — كبّرها قليلاً.</p>
            )}
        </div>
    );
}
