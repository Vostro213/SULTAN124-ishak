import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { servers } from '../data/gameData'
import { FaUser, FaUserPlus, FaSignInAlt } from 'react-icons/fa'

export default function Home() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const handleSearch = (e) => {
    const value = e.target.value
    setSearch(value)
    if (!value.trim()) {
      setSuggestions([])
      return
    }
    const filtered = servers
      .filter((s) => s.includes(value))
      .slice(0, 30)
    setSuggestions(filtered)
  }

  const selectServer = (server) => {
    setSearch(server)
    setSuggestions([])
  }

  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
        <h1>انتقام السلاطين</h1>
        <p>حاسبات الموارد والتسريعات والتدريب — أدوات احترافية للاعبين الجادّين</p>
        <div className="hero-actions">
          {user ? (
            <Link to="/account" className="btn btn-primary">
              <FaUser /> حسابي
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                <FaUserPlus /> إنشاء حساب مجاني
              </Link>
              <Link to="/login" className="btn btn-outline">
                <FaSignInAlt /> تسجيل الدخول
              </Link>
            </>
          )}
        </div>

        <div className="server-search-wrapper">
          <div className="server-search">
            <span className="server-search-icon">🔍</span>
            <input
              type="text"
              className="server-search-input"
              placeholder="ابحث عن سيرفرك..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          {suggestions.length > 0 && (
            <ul className="server-suggestions">
              {suggestions.map((s) => (
                <li key={s} onClick={() => selectServer(s)}>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        </div>
      </section>

      <div className="tools-grid">
        <Link to="/speed" className="tool-card">
          <div className="icon">⚡</div>
          <h3>حاسبة التسريعات</h3>
          <p>اجمع تسريعاتك الحرة والجنود والبناء والعلوم</p>
        </Link>
        <Link to="/resources" className="tool-card">
          <div className="icon">📦</div>
          <h3>موارد الحقيبة</h3>
          <p>قمح، خشب، حديد، فضة، بلور، نيزك، كهرمان</p>
        </Link>
        <Link to="/training" className="tool-card">
          <div className="icon">💪</div>
          <h3>حاسبة التدريب</h3>
          <p>كم جندي يمكنك تدريبه حسب مواردك</p>
        </Link>
      </div>
    </>
  )
}
