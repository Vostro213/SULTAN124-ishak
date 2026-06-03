const API_BASE = import.meta.env.VITE_API_URL || 'https://sultan-api-dkcz.onrender.com'

export async function apiPost(path, body) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('تعذر الاتصال بالخادم — قد يكون في وضع السكون، انتظر 10 ثوان وحاول مجدداً')
  }
  try {
    return await res.json()
  } catch {
    throw new Error(`الخادم أعاد استجابة غير متوقعة (${res.status})`)
  }
}

export async function apiGet(path, token) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: token ? { 'x-admin-token': token } : {},
    })
  } catch {
    throw new Error('تعذر الاتصال بالخادم')
  }
  try {
    return await res.json()
  } catch {
    throw new Error(`الخادم أعاد استجابة غير متوقعة (${res.status})`)
  }
}

export function getApiBase() {
  return API_BASE
}
