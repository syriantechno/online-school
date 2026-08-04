import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ users, filters, roles }) {
    return (
        <AuthenticatedLayout header="المستخدمون">
            <Head title="المستخدمون" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    <TextInput
                        className="!w-52 !py-2"
                        defaultValue={filters.search || ''}
                        placeholder="بحث..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.get(route('users.index'), { search: e.target.value, role: filters.role }, { preserveState: true });
                            }
                        }}
                    />
                    <select
                        className="form-control !w-auto !py-2"
                        value={filters.role || ''}
                        onChange={(e) => router.get(route('users.index'), { role: e.target.value || undefined, search: filters.search }, { preserveState: true })}
                    >
                        <option value="">كل الأدوار</option>
                        {Object.entries(roles).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
                <Link href={route('users.create')}>
                    <PrimaryButton>مستخدم جديد</PrimaryButton>
                </Link>
            </div>

            <div className="box overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>الاسم</th>
                                <th>البريد</th>
                                <th>الدور</th>
                                <th>الحالة</th>
                                <th>إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr key={user.id}>
                                    <td className="font-medium text-slate-800">{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{roles[user.role] || user.role}</td>
                                    <td>
                                        <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${user.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                            {user.is_active ? 'نشط' : 'موقوف'}
                                        </span>
                                    </td>
                                    <td>
                                        <Link href={route('users.edit', user.id)} className="text-primary hover:underline">تعديل</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
