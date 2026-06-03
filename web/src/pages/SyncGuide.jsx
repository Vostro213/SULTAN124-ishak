import { Link } from 'react-router-dom'

const PHASES = [
  {
    phase: 'المرحلة 1 — الآن (بدون مزامنة)',
    items: [
      'وضع تفصيلي: عدّ الصناديق من الحقيبة',
      'وضع إجمالي جاهز: انسخ الرقم من شاشة اللعبة مباشرة',
      'حفظ محلي في حسابك (localStorage) — قريباً في Premium',
    ],
    status: 'current',
  },
  {
    phase: 'المرحلة 2 — نسخ ولصق ذكي',
    items: [
      'زر «نسخ من اللعبة»: تلصق نصاً من الحقيبة ويُحلَّل تلقائياً',
      'قالب Excel/Google Sheet للاعبين المتقدمين',
      'استيراد CSV من جدول تتبع شخصي',
    ],
    status: 'planned',
  },
  {
    phase: 'المرحلة 3 — OCR (صورة الشاشة)',
    items: [
      'التقط screenshot للحقيبة → AI يقرأ الأرقام',
      'يعمل على Android/iOS عبر PWA أو تطبيق companion',
      'أدق للموارد، أصعب للتسريعات المتعددة',
    ],
    status: 'planned',
  },
  {
    phase: 'المرحلة 4 — مزامنة شبه تلقائية',
    items: [
      'تطبيق مساعد يقرأ إشعارات اللعبة (إن أمكن)',
      'ربط Discord bot للتحالف — مشاركة موارد الفريق',
      'API رسمي — غير متوفر حالياً من ONEMT',
    ],
    status: 'future',
  },
]

const REALITY = [
  {
    title: '❌ لا يوجد API رسمي',
    text: 'انتقام السلاطين (ONEMT) لا تقدّم واجهة برمجية للاعبين. لا يمكن «ربط الحساب» مثل HoYoLab رسمياً بدون موافقة الشركة.',
  },
  {
    title: '⚠️ تجنّب أدوات الغش',
    text: 'أي أداة تطلب كلمة مرور اللعبة أو تعدّل ملفاتها = خطر حظر. الموقع يجب أن يبقى «قراءة فقط» للبيانات التي تدخلها أنت.',
  },
  {
    title: '✅ الحل العملي اليوم',
    text: 'إدخال يدوي + إجمالي جاهز + حفظ في حسابك. مع Premium: تحديث أسبوعي واحد يكفي لمعظم اللاعبين.',
  },
  {
    title: '📱 PWA + OCR لاحقاً',
    text: 'أفضل مسار تقني: موقع PWA يفتح على الجوال → تصوير الحقيبة → قراءة تلقائية. مثل تطبيقات مسح الفواتير.',
  },
]

export default function SyncGuide() {
  return (
    <>
      <div className="page-header">
        <h1>🔄 المزامنة مع اللعبة</h1>
        <p>خارطة طريق واقعية — ماذا يمكن وما لا يمكن</p>
      </div>

      <div className="card info-block">
        <h2>الوضع الحالي</h2>
        <p>
          اللعبة <strong>لا تدعم ربطاً رسمياً</strong> مع مواقع خارجية. الحلول المتاحة اليوم:
        </p>
        <ul className="info-list">
          <li><Link to="/resources">حاسبة الموارد</Link> — وضع «إجمالي جاهز» للرقم من شاشة اللعبة</li>
          <li><Link to="/speed">حاسبة التسريعات</Link> — وضع «إجمالي جاهز» بالساعات والدقائق</li>
          <li><Link to="/account">حسابك</Link> — حفظ البيانات يدوياً (Premium قريباً)</li>
        </ul>
      </div>

      <div className="card info-block">
        <h2>كيف تستخدم «الإجمالي الجاهز»؟</h2>
        <ol className="info-list numbered">
          <li>افتح اللعبة → الحقيبة → انظر الإجمالي (مثلاً 520.6M قمح)</li>
          <li>في الموقع: اختر «إجمالي جاهز» → أدخل 520.6 → وحدة M</li>
          <li>كرّر لكل مورد — أو استخدم «احسب كل الموارد»</li>
          <li>للتسريعات: من شاشة التسريعات في اللعبة، اجمع الساعات أو أدخل أيام+ساعات+دقائق</li>
        </ol>
      </div>

      <h2 className="section-heading">خارطة الطريق</h2>
      <div className="roadmap">
        {PHASES.map(({ phase, items, status }) => (
          <div key={phase} className={`roadmap-card ${status}`}>
            <h3>{phase}</h3>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <span className="roadmap-badge">
              {status === 'current' ? '✓ متاح' : status === 'planned' ? '📋 مخطط' : '🔮 مستقبلي'}
            </span>
          </div>
        ))}
      </div>

      <h2 className="section-heading">حقائق مهمة</h2>
      <div className="reality-grid">
        {REALITY.map(({ title, text }) => (
          <div key={title} className="card reality-card">
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>

      <div className="card info-block" style={{ marginTop: 32 }}>
        <h2>💡 اقتراحي لك كمطوّر</h2>
        <ol className="info-list numbered">
          <li><strong>الآن:</strong> أتقن الإدخال اليدوي + حفظ Premium — يكفي لـ 80% من المستخدمين</li>
          <li><strong>بعد 3 أشهر:</strong> OCR للحقيبة (Google Vision أو Tesseract) — ميزة مدفوعة</li>
          <li><strong>للتحالف:</strong> لوحة مشتركة — كل عضو يحدّث موارده يدوياً</li>
          <li><strong>لا تطلب:</strong> login اللعبة أو mod — خطر قانوني وحظر</li>
        </ol>
        <p style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          HoYoLab يعمل لأن miHoYo/HoYoverse وفّرت API. ONEMT لم تفعل ذلك — نحن نبني بديلاً عملياً.
        </p>
      </div>
    </>
  )
}
