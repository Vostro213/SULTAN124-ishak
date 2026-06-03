import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">🕌</div>
        <h1>404</h1>
        <p>هذه الصفحة غير موجودة — كأنها قلعة بدون سور!</p>
        <Link to="/" className="btn btn-primary">
          🏠 العودة إلى الرئيسية
        </Link>
      </div>
    </div>
  )
}
