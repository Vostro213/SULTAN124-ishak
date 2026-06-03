import { useEffect, useState } from 'react'
import { apiPost, apiGet } from '../config/api'

export default function Admin() {
  const [step, setStep] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchPage, setSearchPage] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('sultan_admin_token')
    if (saved) { setToken(saved); setStep('loading'); fetchData(saved) }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await apiPost('/api/admin/login', { username, password })
      if (res.error) { setError(res.error); return }
      localStorage.setItem('sultan_admin_token', res.token)
      setToken(res.token)
      fetchData(res.token)
    } catch (err) {
      setError(err.message || 'حدث خطأ في الاتصال')
    }
  }

  const fetchData = async (t) => {
    setStep('loading')
    try {
      const res = await apiGet('/api/admin/visits', t)
      if (res.error) { setStep('login'); localStorage.removeItem('sultan_admin_token'); setError('انتهت الجلسة'); return }
      setData(res)
      setStep('panel')
    } catch (err) {
      setStep('login')
      setError(err.message || 'حدث خطأ')
    }
  }

  const logout = () => {
    localStorage.removeItem('sultan_admin_token')
    setToken('')
    setData(null)
    setStep('login')
  }

  const filteredVisits = data?.visits?.filter(v => {
    if (filter === 'today') return v.timestamp?.startsWith(new Date().toISOString().slice(0, 10))
    if (filter === 'unique') return true
    if (searchPage) return v.page?.includes(searchPage)
    return true
  }) || []

  const uniqueIps = new Set()
  const uniqueFiltered = filter === 'unique' ? data?.visits?.filter(v => {
    if (uniqueIps.has(v.ip)) return false
    uniqueIps.add(v.ip)
    return true
  }) : filteredVisits

  const visits = filter === 'unique' ? uniqueFiltered : filteredVisits

  if (step === 'login') {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1>🔐 لوحة التحكم</h1>
            <p>دخول المشرف</p>
          </div>
          <div className="card">
            {error && <div className="auth-alert error">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="field">
                <label className="field-label">اسم المستخدم</label>
                <div className="field-input-wrap">
                  <input className="field-input" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
                </div>
              </div>
              <div className="field">
                <label className="field-label">كلمة السر</label>
                <div className="field-input-wrap">
                  <input className="field-input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block">دخول</button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'loading') return <div className="loading-screen">جاري التحميل...</div>

  const s = data?.summary || {}
  const pages = Object.entries(s.pages || {}).sort((a, b) => b[1] - a[1])

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>📊 لوحة التحكم</h1>
          <p>مراقبة الزوار والمستخدمين</p>
        </div>
        <button className="btn btn-ghost" onClick={logout}>تسجيل الخروج</button>
      </div>

      <div className="stat-cards">
        <div className="stat-card"><div className="value">{s.total || 0}</div><div className="label">إجمالي الزيارات</div></div>
        <div className="stat-card"><div className="value">{s.today || 0}</div><div className="label">زيارات اليوم</div></div>
        <div className="stat-card"><div className="value">{s.uniqueIps || 0}</div><div className="label">زوار فريدين</div></div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ color: 'var(--gold)', margin: '0 0 12px' }}>📄 الصفحات الأكثر زيارة</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {pages.slice(0, 10).map(([page, count]) => (
            <span key={page} style={{ background: 'var(--bg-input)', borderRadius: 999, padding: '4px 12px', fontSize: '.85rem' }}>
              {page || '/'} <strong style={{ color: 'var(--gold)' }}>{count}</strong>
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['all', 'today', 'unique'].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'الكل' : f === 'today' ? 'اليوم' : 'مميزين'}
              </button>
            ))}
          </div>
          <input className="field-input" style={{ width: 200, padding: '8px 12px' }} placeholder="🔍 بحث بصفحة..." value={searchPage} onChange={e => setSearchPage(e.target.value)} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--gold)' }}>
                <th style={{ padding: 10, textAlign: 'right' }}>الوقت</th>
                <th style={{ padding: 10, textAlign: 'right' }}>IP</th>
                <th style={{ padding: 10, textAlign: 'right' }}>الموقع</th>
                <th style={{ padding: 10, textAlign: 'right' }}>الجهاز</th>
                <th style={{ padding: 10, textAlign: 'right' }}>المتصفح</th>
                <th style={{ padding: 10, textAlign: 'right' }}>نظام التشغيل</th>
                <th style={{ padding: 10, textAlign: 'right' }}>المزود</th>
                <th style={{ padding: 10, textAlign: 'right' }}>الصفحة</th>
              </tr>
            </thead>
            <tbody>
              {visits.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>لا توجد زيارات بعد</td></tr>
              ) : visits.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 8, direction: 'ltr', textAlign: 'right' }}>{new Date(v.timestamp).toLocaleString('ar')}</td>
                  <td style={{ padding: 8, direction: 'ltr' }}>{v.ip}</td>
                  <td style={{ padding: 8 }}>{v.city} {v.country}</td>
                  <td style={{ padding: 8 }}>{v.device}</td>
                  <td style={{ padding: 8 }}>{v.browser}</td>
                  <td style={{ padding: 8 }}>{v.os}</td>
                  <td style={{ padding: 8, fontSize: '.75rem' }}>{v.isp}</td>
                  <td style={{ padding: 8, direction: 'ltr', fontSize: '.75rem' }}>{v.page}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: 'left', marginTop: 12, color: 'var(--text-muted)', fontSize: '.8rem' }}>
          إجمالي: {visits.length}
        </div>
      </div>
    </>
  )
}
