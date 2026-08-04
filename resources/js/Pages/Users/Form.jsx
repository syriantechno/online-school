import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Form({ user, roles }) {
    const isEdit = !!user;
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'student',
        phone: user?.phone || '',
        password: '',
        is_active: user?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) put(route('users.update', user.id));
        else post(route('users.store'));
    };

    return (
        <AuthenticatedLayout header={isEdit ? 'تعديل مستخدم' : 'مستخدم جديد'}>
            <Head title={isEdit ? 'تعديل مستخدم' : 'مستخدم جديد'} />

            <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
                <div>
                    <InputLabel value="الاسم" />
                    <TextInput className="mt-1 block w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div>
                    <InputLabel value="البريد" />
                    <TextInput type="email" className="mt-1 block w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div>
                    <InputLabel value="الدور" />
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                    >
                        {Object.entries(roles).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <InputLabel value="الهاتف" />
                    <TextInput className="mt-1 block w-full" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                </div>
                <div>
                    <InputLabel value={isEdit ? 'كلمة مرور جديدة (اختياري)' : 'كلمة المرور'} />
                    <TextInput type="password" className="mt-1 block w-full" value={data.password} onChange={(e) => setData('password', e.target.value)} required={!isEdit} />
                    <InputError message={errors.password} className="mt-2" />
                </div>
                <label className="flex items-center gap-2">
                    <Checkbox checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                    <span className="text-sm">حساب نشط</span>
                </label>
                <PrimaryButton disabled={processing}>{isEdit ? 'حفظ' : 'إنشاء'}</PrimaryButton>
            </form>
        </AuthenticatedLayout>
    );
}
