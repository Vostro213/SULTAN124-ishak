import { GITHUB_REPO, GITHUB_USER, REPO_NAME, SITE_URL } from '../config/site'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p>
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
            🌐 {SITE_URL.replace('https://', '')}
          </a>
        </p>
        <p>
          <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
            GitHub — {GITHUB_USER}/{REPO_NAME}
          </a>
        </p>
        <p className="footer-copy">انتقام السلاطين — أدوات اللاعبين</p>
      </div>
    </footer>
  )
}
