import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import { useAuth } from '../context/AuthContext'
import { servers } from '../data/gameData'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    server: '',
    playerName: '',
  })
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((err) => ({ ...err, [field]: '' }))
    setAlert('')
  }

  const validate = () => {
    const next = {}
    if (!form.username.trim()) next.username = 'أدخل اسم المستخدم'
    else if (form.username.length < 3) next.username = '3 أحرف على الأقل'
    if (!form.email.trim()) next.email = 'أدخل البريد الإلكتروني'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'بريد غير صالح'
    if (!form.password) next.password = 'أدخل كلمة المرور'
    else if (form.password.length < 6) next.password = '6 أحرف على الأقل'
    if (form.password !== form.confirmPassword) next.confirmPassword = 'كلمتا المرور غير متطابقتين'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      register({
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        server: form.server,
        playerName: form.playerName.trim(),
      })
      navigate('/account')
    } catch (err) {
      setAlert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const serverOptions = [
    { value: '', label: 'اختر السيرفر (اختياري)' },
    ...servers.slice(0, 100).map((s) => ({ value: s, label: s })),
  ]

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: 480 }}>
        <div className="auth-header">
          <h1>إنشاء حساب</h1>
          <p>انضم لمجتمع لاعبي انتقام السلاطين</p>
        </div>

        <div className="card">
          {alert && <div className="auth-alert error">{alert}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-section-title">معلومات الحساب</div>

            <InputField
              label="اسم المستخدم"
              name="username"
              value={form.username}
              onChange={set('username')}
              placeholder="SultanKing"
              icon="👤"
              hint="يظهر في ملفك الشخصي"
              error={errors.username}
              required
              autoComplete="username"
            />

            <InputField
              label="البريد الإلكتروني"
              name="email"
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="example@email.com"
              icon="✉️"
              error={errors.email}
              required
              autoComplete="email"
            />

            <div className="form-row">
              <InputField
                label="كلمة المرور"
                name="password"
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="6 أحرف على الأقل"
                error={errors.password}
                required
                autoComplete="new-password"
              />
              <InputField
                label="تأكيد كلمة المرور"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="أعد الإدخال"
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-section-title">معلومات اللعبة</div>

            <InputField
              label="السيرفر"
              name="server"
              as="select"
              value={form.server}
              onChange={set('server')}
              options={serverOptions}
              hint="يمكنك تغييره لاحقاً من حسابك"
            />

            <InputField
              label="اسم اللاعب في اللعبة"
              name="playerName"
              value={form.playerName}
              onChange={set('playerName')}
              placeholder="اسمك داخل اللعبة"
              icon="⚔️"
              hint="اختياري — يظهر في ملفك"
            />

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </button>
          </form>

          <p className="auth-footer">
            لديك حساب؟ <Link to="/login">تسجيل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
