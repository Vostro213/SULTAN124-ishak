import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaCrown, FaUser, FaSignOutAlt, FaUserPlus, FaSignInAlt } from 'react-icons/fa'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span><FaCrown /></span>
          انتقام السلاطين
        </Link>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
            الرئيسية
          </NavLink>
          <NavLink to="/speed" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            ⚡ التسريعات
          </NavLink>
          <NavLink to="/resources" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            📦 الموارد
          </NavLink>
          <NavLink to="/training" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            💪 التدريب
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            ℹ️ حول
          </NavLink>
        </div>

        <div className="nav-user">
          {user ? (
            <>
              <Link to="/account" className="user-badge">
                <span className="avatar"><FaUser /></span>
                <span>{user.username}</span>
                <span className={`plan-tag${user.plan === 'premium' ? ' premium' : ''}`}>
                  {user.plan === 'premium' ? 'Premium' : 'مجاني'}
                </span>
              </Link>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <FaSignOutAlt /> خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                <FaSignInAlt /> دخول
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <FaUserPlus /> إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
