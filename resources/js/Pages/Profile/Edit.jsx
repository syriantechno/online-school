import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout header="الملف الشخصي">
            <Head title="الملف الشخصي" />

            <div className="mx-auto max-w-3xl space-y-6">
                <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
