import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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
    if (!form.email.trim()) next.email = 'أدخل البريد الإلكتروني'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'بريد إلكتروني غير صالح'
    if (!form.password) next.password = 'أدخل كلمة المرور'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      login(form)
      navigate('/account')
    } catch (err) {
      setAlert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>تسجيل الدخول</h1>
          <p>مرحباً بعودتك، سلطان!</p>
        </div>

        <div className="card">
          {alert && <div className="auth-alert error">{alert}</div>}

          <form onSubmit={handleSubmit} noValidate>
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

            <InputField
              label="كلمة المرور"
              name="password"
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="••••••••"
              icon="🔒"
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>

          <p className="auth-footer">
            ليس لديك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
