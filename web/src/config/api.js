// غيّر هذا الرابط إلى رابط خادمك بعد نشره (مثل Render/Railway)
// للتجربة محلياً: http://localhost:3001
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function apiGet(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: token ? { 'x-admin-token': token } : {},
  })
  return res.json()
}

export function getApiBase() {
  return API_BASE
}
