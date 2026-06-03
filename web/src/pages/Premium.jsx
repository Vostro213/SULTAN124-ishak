import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Premium() {
  const { user, upgradeToPremium } = useAuth()

  const handleDemoUpgrade = () => {
    if (!user) return
    upgradeToPremium()
    alert('تم تفعيل Premium تجريبياً! (بدون دفع حقيقي)')
  }

  return (
    <>
      <div className="page-header">
        <h1>⭐ Premium</h1>
        <p>كل الأدوات + ميزات حصرية</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 420, margin: '0 auto 32px', padding: 40 }}>
          <div style={{ fontSize: '3.5rem', fontWeight: 700, background: 'var(--premium)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            10$
          </div>
          <div style={{ color: 'var(--text-muted)' }}>شهرياً</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'right' }}>
          {[
            'حفظ حقيبة الموارد وتسريعاتك',
            'حتى 3 ملفات محفوظة',
            'خطط تدريب جاهزة',
            'أدلة واستراتيجيات حصرية',
            'بدون إعلانات',
            'دعم أولوية',
          ].map((item) => (
            <li key={item} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--success)' }}>✓ </span>{item}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          {user ? (
            user.plan === 'premium' ? (
              <p style={{ color: 'var(--success)' }}>✓ أنت مشترك Premium</p>
            ) : (
              <button type="button" className="btn btn-primary" onClick={handleDemoUpgrade}>
                تفعيل Premium (تجريبي)
              </button>
            )
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                سجّل ثم اشترك
              </Link>
              <p style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                الدفع عبر Stripe — قريباً
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
