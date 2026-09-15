const paths = {
    play: 'M8 5v14l11-7L8 5z',
    book: 'M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z',
    arrow: 'M19 12H5m7-7l-7 7 7 7',
    rocket: 'M14.7 6.3c3.3-3.3 6.4-2.7 6.4-2.7s.6 3.1-2.7 6.4l-3.7 3.7-4.4-4.4 4.4-3zM9.3 10.7L5 11l-3 3 6 1m5.3-1.7L13 17.5l-3 3-1-6m7-8h.01',
    star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z',
    user: 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m7.5-10a4 4 0 100-8 4 4 0 000 8z',
    login: 'M10 17l5-5-5-5m5 5H3m12-9h4a2 2 0 012 2v14a2 2 0 01-2 2h-4',
    logout: 'M17 7l5 5m0 0-5 5m5-5H9m4-5H5a2 2 0 00-2 2v10a2 2 0 002 2h8',
    chart: 'M4 19V9m6 10V5m6 14v-7m5 7H2',
    check: 'M20 6L9 17l-5-5',
};

export default function SiteIcon({ name, className = 'site-btn-icon' }) {
    const path = paths[name];
    if (!path) return null;

    return (
        <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
    );
}
