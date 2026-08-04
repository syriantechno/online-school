<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\User;

class CertificateService
{
    public function __construct(
        private NotificationService $notifications,
        private StarService $stars,
    ) {}

    public function issueIfEligible(Enrollment $enrollment): ?Certificate
    {
        if ($enrollment->status !== 'completed' && $enrollment->progress_percent < 100) {
            return null;
        }

        $existing = Certificate::query()
            ->where('user_id', $enrollment->user_id)
            ->where('course_id', $enrollment->course_id)
            ->first();

        if ($existing) {
            return $existing;
        }

        $certificate = Certificate::query()->create([
            'code' => Certificate::generateCode(),
            'user_id' => $enrollment->user_id,
            'course_id' => $enrollment->course_id,
            'final_percent' => $enrollment->progress_percent,
            'issued_at' => now(),
        ]);

        $user = User::query()->find($enrollment->user_id);
        $courseTitle = $enrollment->course?->title ?? 'الدورة';

        if ($user) {
            if (! $this->stars->alreadyAwarded($user, $certificate, 'certificate')) {
                $this->stars->award($user, 10, 'certificate', $certificate, 'شهادة إتمام: '.$courseTitle);
            }

            $this->notifications->send(
                $user,
                'certificate',
                'مبروك! حصلت على شهادة',
                'تم إصدار شهادة إتمام لدورة '.$courseTitle,
                route('certificates.show', $certificate->id)
            );
        }

        return $certificate;
    }
}
