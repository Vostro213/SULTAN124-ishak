import { Link } from 'react-router-dom'

export default function About() {
  return (
    <>
      <div className="page-header">
        <h1>ℹ️ حول الموقع</h1>
        <p>أدوات مساعدة للاعبين انتقام السلاطين</p>
      </div>

      <div className="card about-content">
        <p>
          موقع <strong>انتقام السلاطين</strong> يقدّم حاسبات مجانية تساعدك على إدارة مواردك
          وتسريعاتك وخطط التدريب — مثل ما يفعل HoYoLab لـ Genshin Impact، لكن مخصص
          للعبة انتقام السلاطين.
        </p>

        <h2>الحاسبات المتوفرة</h2>
        <ul className="about-list">
          <li>
            <Link to="/speed">⚡ حاسبة التسريعات</Link> — جمع تسريعاتك (حرة، جنود، بناء، علوم)
          </li>
          <li>
            <Link to="/resources">📦 حاسبة موارد الحقيبة</Link> — قمح، خشب، حديد، فضة، بلور، حجر نيزك، كهرمان
          </li>
          <li>
            <Link to="/training">👮 حاسبة التدريب</Link> — كم جندي يمكنك تدريبه حسب مواردك
          </li>
        </ul>

        <h2>لماذا نحفظ الموارد في الحقيبة؟</h2>
        <p>
          الموارد داخل الحقيبة (الصناديق) لا يمكن سرقتها من لاعبين آخرين.
          استخدم الحاسبة لمعرفة إجمالي ما لديك قبل فتح الصناديق.
        </p>

        <h2>الاشتراك Premium</h2>
        <p>
          قريباً: حفظ بياناتك، خطط تدريب، أدلة حصرية، وبدون إعلانات —
          <Link to="/premium" style={{ marginRight: 8 }}>تعرّف على الباقة بـ 10$</Link>
        </p>
      </div>
    </>
  )
}
