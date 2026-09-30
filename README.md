# Learn Languages Frontend

واجهة static منظمة حسب المسؤولية، مع الإبقاء على كل صفحة كـ entry point مستقل حتى تعمل على أي static host.

```text
assets/          التصميم والأساسيات المشتركة
  styles/        design tokens وواجهات form المشتركة
  scripts/       utilities للتخزين والحالة المحلية
data/            mock data قابلة للاستبدال لاحقًا بـ API
landing/         صفحة البداية
loading/         شاشة انتقال قصيرة قبل onboarding
language/        اختيار لغة الواجهة
register/        إنشاء الحساب
verification/   تأكيد البريد
login/           الدخول
goals/           تخصيص تجربة التعلم
dashboard/       قائمة جلسات المذاكرة والإحصاءات
study/           جلسة المراجعة المتباعدة
```

مفاتيح التخزين المحلية الوحيدة هي `user` و`language` و`learningPreferences` و`stats` وحالة الجلسة.
