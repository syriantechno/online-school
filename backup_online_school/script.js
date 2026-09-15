// نموذج JavaScript لتحسين تجربة المستخدم في مدرسة اونلاين

document.addEventListener('DOMContentLoaded', function() {
    // تحريك شريط التنقل عند التمرير
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('header nav');
        if (window.scrollY > 50) {
            navbar.style.position = 'fixed';
            navbar.style.top = '0';
            navbar.style.backgroundColor = '#0a2463';
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.position = 'relative';
            navbar.style.top = 'auto';
            navbar.style.backgroundColor = 'transparent';
            navbar.style.boxShadow = 'none';
        }
    });

    // إظهار نموذج الاتصال عند النقر
    document.querySelector('.contact button').addEventListener('click', function() {
        document.querySelector('.contact form').style.display = 'block';
    });

    // إخفاء نموذج الاتصال بعد إرساله
    document.querySelector('.contact form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('تم إرسال طلبك بنجاح!');
        this.style.display = 'none';
    });

    // تفعيل تأثير التمرير للعناصر
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
});