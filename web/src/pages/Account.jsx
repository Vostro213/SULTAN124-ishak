import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import { useAuth } from '../context/AuthContext'
import { servers } from '../data/gameData'

export default function Account() {
  const { user, loading, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [form, setForm] = useState({ username: '', email: '', server: '', playerName: '' })
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading, navigate])

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        email: user.email,
        server: user.server || '',
        playerName: user.playerName || '',
      })
    }
  }, [user])

  if (loading || !user) return <div className="loading-screen">جاري التحميل...</div>

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((err) => ({ ...err, [field]: '' }))
    setSaved(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.username.trim()) next.username = 'مطلوب'
    if (form.username.length < 3) next.username = '3 أحرف على الأقل'
    setErrors(next)
    if (Object.keys(next).length) return

    updateProfile({
      username: form.username.trim(),
      server: form.server,
      playerName: form.playerName.trim(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('ar', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const serverOptions = [
    { value: '', label: '— لم يُحدَّد —' },
    ...servers.slice(0, 100).map((s) => ({ value: s, label: s })),
  ]

  return (
    <>
      <div className="page-header">
        <h1>حسابي</h1>
        <p>إدارة ملفك الشخصي وإعدادات اللعبة</p>
      </div>

      <div className="account-grid">
        <aside className="account-sidebar">
          <div className="card profile-card">
            <div className="profile-avatar">{user.username.charAt(0).toUpperCase()}</div>
            <h2 className="profile-name">{user.username}</h2>
            <p className="profile-email">{user.email}</p>
            <span className={`plan-tag${user.plan === 'premium' ? ' premium' : ''}`}>
              {user.plan === 'premium' ? '⭐ Premium' : 'مجاني'}
            </span>

            <div className="account-tabs">
              <button type="button" className={`tab-btn${tab === 'profile' ? ' active' : ''}`} onClick={() => setTab('profile')}>
                👤 الملف الشخصي
              </button>
              <button type="button" className={`tab-btn${tab === 'game' ? ' active' : ''}`} onClick={() => setTab('game')}>
                ⚔️ معلومات اللعبة
              </button>
              <button type="button" className={`tab-btn${tab === 'saved' ? ' active' : ''}`} onClick={() => setTab('saved')}>
                💾 البيانات المحفوظة
              </button>
            </div>
          </div>
        </aside>

        <div className="card">
          {tab === 'profile' && (
            <>
              <h2 className="card-title">الملف الشخصي</h2>
              <p className="card-subtitle">عدّل معلومات حسابك الأساسية</p>

              <div className="stat-cards">
                <div className="stat-card">
                  <div className="value">{user.plan === 'premium' ? '⭐' : '🆓'}</div>
                  <div className="label">الباقة</div>
                </div>
                <div className="stat-card">
                  <div className="value">{joinDate.split(' ')[2] || '—'}</div>
                  <div className="label">تاريخ الانضمام</div>
                </div>
                <div className="stat-card">
                  <div className="value">0</div>
                  <div className="label">ملفات محفوظة</div>
                </div>
              </div>

              {saved && <div className="auth-alert success">✓ تم حفظ التغييرات</div>}

              <form onSubmit={handleSave}>
                <InputField
                  label="اسم المستخدم"
                  name="username"
                  value={form.username}
                  onChange={set('username')}
                  icon="👤"
                  error={errors.username}
                  required
                />
                <InputField
                  label="البريد الإلكتروني"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={() => {}}
                  hint="لا يمكن تغيير البريد حالياً"
                  icon="✉️"
                />
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button type="submit" className="btn btn-primary">حفظ التغييرات</button>
                  {user.plan !== 'premium' && (
                    <Link to="/premium" className="btn btn-outline">ترقية Premium</Link>
                  )}
                </div>
              </form>
            </>
          )}

          {tab === 'game' && (
            <>
              <h2 className="card-title">معلومات اللعبة</h2>
              <p className="card-subtitle">اربط حسابك بسيرفرك واسمك في اللعبة</p>

              {saved && <div className="auth-alert success">✓ تم حفظ التغييرات</div>}

              <form onSubmit={handleSave}>
                <InputField
                  label="السيرفر"
                  name="server"
                  as="select"
                  value={form.server}
                  onChange={set('server')}
                  options={serverOptions}
                  hint="السيرفر الذي تلعب فيه"
                />
                <InputField
                  label="اسم اللاعب"
                  name="playerName"
                  value={form.playerName}
                  onChange={set('playerName')}
                  placeholder="اسمك داخل انتقام السلاطين"
                  icon="⚔️"
                />
                <button type="submit" className="btn btn-primary">حفظ</button>
              </form>
            </>
          )}

          {tab === 'saved' && (
            <>
              <h2 className="card-title">البيانات المحفوظة</h2>
              <p className="card-subtitle">
                {user.plan === 'premium'
                  ? 'احفظ حقيبة الموارد والتسريعات (قريباً)'
                  : 'متاح مع اشتراك Premium — 10$/شهر'}
              </p>

              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📂</div>
                <p>لا توجد بيانات محفوظة بعد</p>
                {user.plan !== 'premium' ? (
                  <Link to="/premium" className="btn btn-primary" style={{ marginTop: 20 }}>
                    اشترك Premium لحفظ بياناتك
                  </Link>
                ) : (
                  <p style={{ marginTop: 16, fontSize: '0.85rem' }}>استخدم الحاسبات ثم احفظ — قريباً</p>
                )}
              </div>
            </>
          )}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <button type="button" className="btn btn-ghost" onClick={() => { logout(); navigate('/') }}>
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
