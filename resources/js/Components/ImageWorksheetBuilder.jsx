import axios from 'axios';
import { useMemo, useState } from 'react';
import ImageHotspotEditor from '@/Components/ImageHotspotEditor';

const uid = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

const zoneTypes = [
    ['click', 'نقر / تلوين'],
    ['fill', 'كتابة'],
    ['select', 'اختيار'],
];

const emptyPayload = {
    type: 'image_worksheet',
    skill: 'الحروف والأصوات',
    objective: '',
    instruction: '',
    show_outlines: true,
    pages: [],
};

export { emptyPayload };

export default function ImageWorksheetBuilder({ payload, onChange }) {
    const data = { ...emptyPayload, ...payload, type: 'image_worksheet', pages: payload?.pages || [] };
    const pages = data.pages;
    const [active, setActive] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const page = pages[active] || null;
    const zones = page?.zones || [];
    const selected = useMemo(() => zones.find((zone) => zone.id === selectedId) || null, [zones, selectedId]);

    const patch = (fields) => onChange({ ...data, ...fields });
    const patchPage = (index, fields) => {
        patch({ pages: pages.map((item, i) => (i === index ? { ...item, ...fields } : item)) });
    };
    const patchZones = (nextZones) => {
        if (!page) {
            return;
        }
        patchPage(active, { zones: nextZones });
        if (selectedId && !nextZones.some((zone) => zone.id === selectedId)) {
            setSelectedId(null);
        }
    };
    const patchZone = (fields) => {
        if (!selected) {
            return;
        }
        patchZones(zones.map((zone) => (zone.id === selected.id ? { ...zone, ...fields } : zone)));
    };

    const uploadFiles = async (fileList) => {
        const files = [...fileList].filter((file) => file.type.startsWith('image/'));
        if (!files.length) {
            return;
        }
        setUploading(true);
        setError('');
        try {
            const uploaded = [];
            for (const file of files) {
                const form = new FormData();
                form.append('image', file);
                const { data: response } = await axios.post(route('worksheets.images.store'), form);
                uploaded.push({
                    id: uid('page'),
                    image: response.path,
                    image_url: response.url,
                    title: file.name.replace(/\.[^.]+$/, ''),
                    zones: [],
                });
            }
            const next = [...pages, ...uploaded];
            patch({ pages: next });
            setActive(next.length - 1);
            setSelectedId(null);
        } catch (err) {
            setError(err.response?.data?.message || 'تعذر رفع الصورة. تأكد أنها JPG أو PNG وأقل من 10 ميغابايت.');
        } finally {
            setUploading(false);
        }
    };

    const removePage = async (index) => {
        const target = pages[index];
        if (target?.image) {
            try {
                await axios.delete(route('worksheets.images.destroy'), { data: { path: target.image } });
            } catch {
                // Keep going even if the file is already gone.
            }
        }
        const next = pages.filter((_, i) => i !== index);
        patch({ pages: next });
        setActive(Math.max(0, Math.min(active, next.length - 1)));
        setSelectedId(null);
    };

    const createZone = (rect) => {
        const zone = {
            id: uid('zone'),
            type: 'click',
            x: rect.x,
            y: rect.y,
            w: rect.w,
            h: rect.h,
            correct: true,
            answer: '',
            label: '',
            hint: '',
            options: ['', ''],
            correct_index: 0,
        };
        patchZones([...zones, zone]);
        setSelectedId(zone.id);
    };

    return (
        <div className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-2">
                <label className="block">
                    <span className="font-bold">تعليمات النشاط للطالب</span>
                    <textarea
                        rows={2}
                        className="form-control mt-2"
                        value={data.instruction || ''}
                        onChange={(e) => patch({ instruction: e.target.value })}
                        placeholder="مثال: لون الكلمات التي تبدأ بحرف ب، ثم اكتب الحرف في الأسفل"
                    />
                </label>
                <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
                    <input
                        type="checkbox"
                        checked={data.show_outlines !== false}
                        onChange={(e) => patch({ show_outlines: e.target.checked })}
                    />
                    <span>
                        <strong className="block">إظهار حدود المربعات للطالب</strong>
                        <span className="text-xs text-slate-500">عطّلها إذا كانت الورقة نفسها توضّح أماكن الإجابة.</span>
                    </span>
                </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 font-black text-white">
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        multiple
                        className="sr-only"
                        onChange={(e) => {
                            uploadFiles(e.target.files);
                            e.target.value = '';
                        }}
                    />
                    {uploading ? 'جاري الرفع...' : 'رفع صورة النشاط'}
                </label>
                <p className="text-xs text-slate-500">يمكنك رفع عدة صفحات. ارسم مربعاً فوق كل مكان تريد أن يجيب فيه الطالب.</p>
            </div>
            {error && <p className="text-sm font-bold text-danger">{error}</p>}

            {pages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {pages.map((item, index) => (
                        <button
                            type="button"
                            key={item.id || index}
                            onClick={() => {
                                setActive(index);
                                setSelectedId(null);
                            }}
                            className={`min-h-11 rounded-xl border px-3 text-sm font-bold ${
                                active === index ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white'
                            }`}
                        >
                            صفحة {index + 1}
                            {item.zones?.length ? ` · ${item.zones.length}` : ''}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                <ImageHotspotEditor
                    imageUrl={page?.image_url}
                    zones={zones}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onChange={patchZones}
                    onCreate={createZone}
                />

                <aside className="space-y-4">
                    {page && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="font-black">هذه الصفحة</h3>
                                <button type="button" onClick={() => removePage(active)} className="text-sm font-bold text-danger">
                                    حذف الصورة
                                </button>
                            </div>
                            <label className="mt-3 block text-sm">
                                عنوان الصفحة (اختياري)
                                <input
                                    className="form-control mt-1"
                                    value={page.title || ''}
                                    onChange={(e) => patchPage(active, { title: e.target.value })}
                                />
                            </label>
                            <p className="mt-2 text-xs text-slate-500">{zones.length} منطقة إجابة</p>
                        </div>
                    )}

                    {selected ? (
                        <div className="rounded-2xl border border-primary/20 bg-white p-4">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="font-black">مكان الإجابة</h3>
                                <button
                                    type="button"
                                    onClick={() => patchZones(zones.filter((zone) => zone.id !== selected.id))}
                                    className="text-sm font-bold text-danger"
                                >
                                    حذف المنطقة
                                </button>
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2">
                                {zoneTypes.map(([type, label]) => (
                                    <button
                                        type="button"
                                        key={type}
                                        onClick={() => patchZone({ type })}
                                        className={`min-h-11 rounded-xl border px-2 text-xs font-black ${
                                            selected.type === type ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {[
                            ['x', 'من اليسار %'],
                            ['y', 'من الأعلى %'],
                                    ['w', 'عرض %'],
                                    ['h', 'ارتفاع %'],
                                ].map(([key, label]) => (
                                    <label key={key} className="text-xs font-bold text-slate-600">
                                        {label}
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            className="form-control mt-1 !py-2"
                                            value={Number(selected[key]).toFixed(1)}
                                            onChange={(e) => patchZone({ [key]: Number(e.target.value) })}
                                        />
                                    </label>
                                ))}
                            </div>
                            <p className="mt-2 text-[11px] text-slate-500">الإحداثيات نسبة مئوية من الصورة، لذلك تبقى ثابتة على كل الشاشات.</p>

                            <label className="mt-4 block text-sm">
                                تسمية داخلية
                                <input
                                    className="form-control mt-1"
                                    value={selected.label || ''}
                                    onChange={(e) => patchZone({ label: e.target.value })}
                                    placeholder="مثال: بالون / بطة / باب"
                                />
                            </label>
                            <label className="mt-3 block text-sm">
                                تلميح للطالب (اختياري)
                                <input
                                    className="form-control mt-1"
                                    value={selected.hint || ''}
                                    onChange={(e) => patchZone({ hint: e.target.value })}
                                    placeholder="يظهر عند تمرير المؤشر"
                                />
                            </label>

                            {selected.type === 'click' && (
                                <label className="mt-4 flex min-h-12 items-center gap-2 rounded-xl bg-emerald-50 px-3 text-sm font-bold text-emerald-800">
                                    <input
                                        type="checkbox"
                                        checked={selected.correct !== false}
                                        onChange={(e) => patchZone({ correct: e.target.checked })}
                                    />
                                    هذه إجابة صحيحة (الطالب يجب أن ينقرها)
                                </label>
                            )}

                            {selected.type === 'fill' && (
                                <label className="mt-4 block text-sm">
                                    الإجابة الصحيحة
                                    <input
                                        className="form-control mt-1"
                                        value={selected.answer || ''}
                                        onChange={(e) => patchZone({ answer: e.target.value })}
                                        placeholder="مثال: ب"
                                    />
                                </label>
                            )}

                            {selected.type === 'select' && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-bold">الخيارات — حدّد الصحيحة</p>
                                    {(selected.options || ['', '']).map((option, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={`correct_${selected.id}`}
                                                checked={Number(selected.correct_index) === index}
                                                onChange={() => patchZone({ correct_index: index })}
                                                aria-label={`الخيار ${index + 1} هو الصحيح`}
                                            />
                                            <input
                                                className="form-control !py-2"
                                                value={option}
                                                onChange={(e) => {
                                                    const options = [...(selected.options || [])];
                                                    options[index] = e.target.value;
                                                    patchZone({ options });
                                                }}
                                                placeholder={`خيار ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="text-sm font-bold text-primary"
                                        onClick={() => patchZone({ options: [...(selected.options || []), ''] })}
                                    >
                                        إضافة خيار
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                            ارسم مربعاً فوق مكان الإجابة على الصورة. بعد رسمه يمكنك تحريكه أو ضبط موقعه بالأرقام بدقة.
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
