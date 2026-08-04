@php
    $seo = \App\Models\SeoSetting::getCurrent();
    $ga = trim((string) ($seo->google_analytics_id ?? ''));
    $aw = trim((string) ($seo->google_ads_aw_id ?? ''));
    $loaderId = $ga !== '' ? $ga : $aw;
@endphp
@if($loaderId !== '')
    <script>
        (function () {
            var gaId = @json($ga);
            var awId = @json($aw);
            var conversionLabel = @json(trim((string) ($seo->google_ads_conversion_label ?? '')));
            var loaderId = @json($loaderId);
            var consentKey = 'online_school_google_consent_v1';
            var consentChoice = null;

            try {
                consentChoice = window.localStorage.getItem(consentKey);
            } catch (e) {}

            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
            window.gtag('consent', 'default', {
                analytics_storage: consentChoice === 'granted' ? 'granted' : 'denied',
                ad_storage: consentChoice === 'granted' ? 'granted' : 'denied',
                ad_user_data: consentChoice === 'granted' ? 'granted' : 'denied',
                ad_personalization: consentChoice === 'granted' ? 'granted' : 'denied',
                wait_for_update: 500
            });
            window.gtag('js', new Date());
            if (gaId) {
                window.gtag('config', gaId);
            }
            if (awId) {
                window.gtag('config', awId, { allow_enhanced_conversions: true });
            }

            var script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(loaderId);
            document.head.appendChild(script);

            function updateConsent(choice) {
                consentChoice = choice;
                try {
                    window.localStorage.setItem(consentKey, choice);
                } catch (e) {}
                var value = choice === 'granted' ? 'granted' : 'denied';
                window.gtag('consent', 'update', {
                    analytics_storage: value,
                    ad_storage: value,
                    ad_user_data: value,
                    ad_personalization: value
                });
                document.getElementById('online-school-google-consent')?.remove();
            }

            function showConsent() {
                if (consentChoice === 'granted' || consentChoice === 'denied' || document.getElementById('online-school-google-consent')) {
                    return;
                }
                var bar = document.createElement('div');
                bar.id = 'online-school-google-consent';
                bar.style.cssText = 'position:fixed;bottom:16px;inset-inline:16px;z-index:9999;background:#0c0a09;color:#fff;padding:14px 16px;border-radius:16px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;box-shadow:0 18px 40px rgba(0,0,0,.35);font-family:"Noto Sans Arabic",sans-serif;';
                bar.innerHTML = '<span style="font-size:14px;line-height:1.6;">نستخدم ملفات تعريف الارتباط لتحسين التجربة والتحليلات. هل توافق؟</span>';
                var actions = document.createElement('div');
                actions.style.cssText = 'display:flex;gap:8px;';
                var accept = document.createElement('button');
                accept.textContent = 'موافقة';
                accept.style.cssText = 'background:#b45309;color:#fff;border:0;border-radius:999px;padding:8px 16px;cursor:pointer;font-family:"Noto Sans Arabic",sans-serif;';
                accept.onclick = function () { updateConsent('granted'); };
                var deny = document.createElement('button');
                deny.textContent = 'رفض';
                deny.style.cssText = 'background:transparent;color:#fff;border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:8px 16px;cursor:pointer;font-family:"Noto Sans Arabic",sans-serif;';
                deny.onclick = function () { updateConsent('denied'); };
                actions.appendChild(accept);
                actions.appendChild(deny);
                bar.appendChild(actions);
                document.body.appendChild(bar);
            }

            window.OnlineSchoolGoogle = {
                track: function (eventName, params) {
                    if (typeof window.gtag === 'function') {
                        window.gtag('event', eventName, params || {});
                    }
                },
                trackConversion: function () {
                    if (awId && conversionLabel && typeof window.gtag === 'function') {
                        window.gtag('event', 'conversion', { send_to: awId + '/' + conversionLabel });
                    }
                },
                grantConsent: function () { updateConsent('granted'); },
                denyConsent: function () { updateConsent('denied'); }
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', showConsent);
            } else {
                showConsent();
            }
        })();
    </script>
@endif
