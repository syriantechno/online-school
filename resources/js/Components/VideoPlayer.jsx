/**
 * تحويل روابط يوتيوب / فيميو / ملف مباشر إلى مصدر قابل للعرض.
 */
export function resolveVideoSource(url) {
    if (!url || typeof url !== 'string') {
        return null;
    }

    const trimmed = url.trim();
    if (!trimmed) {
        return null;
    }

    // YouTube: watch, youtu.be, embed, shorts
    const yt =
        trimmed.match(
            /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
        ) || trimmed.match(/[?&]v=([A-Za-z0-9_-]{6,})/);

    if (yt?.[1]) {
        return {
            type: 'iframe',
            src: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1&hl=ar`,
            provider: 'youtube',
        };
    }

    // Vimeo
    const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeo?.[1]) {
        return {
            type: 'iframe',
            src: `https://player.vimeo.com/video/${vimeo[1]}?title=0&byline=0`,
            provider: 'vimeo',
        };
    }

    // Direct media
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(trimmed)) {
        return { type: 'video', src: trimmed, provider: 'file' };
    }

    // Fallback: try as iframe (some LMS / Google Drive preview links)
    return { type: 'iframe', src: trimmed, provider: 'other' };
}

export default function VideoPlayer({ url, title = 'فيديو الدرس' }) {
    const source = resolveVideoSource(url);

    if (!source) {
        return null;
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-brand-100 bg-brand-950 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <h3 className="text-sm font-medium text-white">{title}</h3>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-brand-100">
                    {source.provider === 'youtube'
                        ? 'يوتيوب'
                        : source.provider === 'vimeo'
                          ? 'فيميو'
                          : source.provider === 'file'
                            ? 'ملف فيديو'
                            : 'فيديو'}
                </span>
            </div>

            <div className="relative aspect-video w-full bg-black">
                {source.type === 'video' ? (
                    <video
                        className="h-full w-full"
                        controls
                        controlsList="nodownload"
                        playsInline
                        src={source.src}
                    >
                        متصفحك لا يدعم تشغيل الفيديو.
                    </video>
                ) : (
                    <iframe
                        title={title}
                        src={source.src}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                    />
                )}
            </div>
        </section>
    );
}
