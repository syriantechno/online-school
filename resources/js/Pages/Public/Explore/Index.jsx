import PublicSiteLayout from '@/Components/PublicSiteLayout';
import PublicCourseCard from '@/Components/PublicCourseCard';
import { Head, Link, router } from '@inertiajs/react';

export default function ExploreIndex({ courses, filters }) {
    const submitSearch = (event) => {
        event.preventDefault();
        router.get(route('explore.index'), { search: event.target.search.value, level: filters.level || '' }, { preserveState: true });
    };

    return (
        <PublicSiteLayout title="استكشف الدورات">
            <Head title="استكشف الدورات" />

            <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-7 lg:px-10">
                <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                    <div>
                        <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700">تعلّم من الموقع</span>
                        <p className="mt-3 max-w-2xl text-base font-medium leading-8 text-slate-600">
                            اختر دورة، شاهد عدد الدروس والمدة، ثم ادخل مباشرة للتعلم — بدون الحاجة للوحة التحكم.
                        </p>
                    </div>
                    <form onSubmit={submitSearch} className="flex w-full max-w-md gap-2">
                        <input
                            name="search"
                            defaultValue={filters.search || ''}
                            placeholder="ابحث عن دورة..."
                            className="form-control !py-3"
                        />
                        <button type="submit" className="min-h-12 shrink-0 rounded-xl bg-blue-700 px-5 font-black text-white">
                            بحث
                        </button>
                    </form>
                </div>

                {courses.data.length === 0 ? (
                    <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                        <p className="text-lg font-black text-slate-700">لا توجد دورات منشورة بعد</p>
                        <p className="mt-2 text-sm text-slate-500">سيتم عرض الدورات هنا فور نشرها من المعلمين.</p>
                    </div>
                ) : (
                    <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {courses.data.map((course, index) => (
                            <PublicCourseCard key={course.id} course={course} index={index} showDescription />
                        ))}
                    </div>
                )}

                {courses.links?.length > 3 && (
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        {courses.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`min-h-10 rounded-lg px-4 py-2 text-sm font-bold ${link.active ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </PublicSiteLayout>
    );
}
