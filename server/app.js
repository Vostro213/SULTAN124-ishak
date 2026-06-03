import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const VISITS_FILE = join(DATA_DIR, 'visits.json')

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123'
const PORT = process.env.PORT || 3001

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
if (!existsSync(VISITS_FILE)) writeFileSync(VISITS_FILE, '[]', 'utf-8')

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

// --- تخزين الجلسات ---
const sessions = new Map()
let sessionIdSeq = 1

function readVisits() {
  try {
    return JSON.parse(readFileSync(VISITS_FILE, 'utf-8'))
  } catch { return [] }
}

function writeVisits(data) {
  writeFileSync(VISITS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// --- جلب الموقع من الـ IP ---
async function fetchGeo(ip) {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,query`)
    const data = await res.json()
    if (data.status === 'success') {
      return { country: data.country, city: data.city, isp: data.isp }
    }
  } catch { /* silent */ }
  return { country: '❓', city: '❓', isp: '❓' }
}

function parseDevice(ua) {
  if (!ua) return { browser: '❓', os: '❓', device: 'كمبيوتر' }
  const u = ua.toLowerCase()
  let browser = '❓', os = '❓', device = 'كمبيوتر'
  if (u.includes('firefox')) browser = 'Firefox'
  else if (u.includes('edge')) browser = 'Edge'
  else if (u.includes('chrome')) browser = 'Chrome'
  else if (u.includes('safari')) browser = 'Safari'
  else if (u.includes('opera')) browser = 'Opera'
  if (u.includes('windows')) os = 'Windows'
  else if (u.includes('mac os') || u.includes('macintosh')) os = 'macOS'
  else if (u.includes('linux')) os = 'Linux'
  else if (u.includes('android')) os = 'Android'
  else if (u.includes('ios') || u.includes('iphone') || u.includes('ipad')) os = 'iOS'
  if (u.includes('mobile') || u.includes('android')) device = 'جوال'
  else if (u.includes('tablet') || u.includes('ipad')) device = 'جهاز لوحي'
  return { browser, os, device }
}

// --- تسجيل زيارة ---
app.post('/api/track', async (req, res) => {
  const { page, referrer } = req.body
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1'
  const ua = req.headers['user-agent'] || ''
  const geo = await fetchGeo(ip)
  const device = parseDevice(ua)
  const visit = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    ip,
    page: page || '/',
    referrer: referrer || '',
    ...geo,
    ...device,
    timestamp: new Date().toISOString(),
  }
  const visits = readVisits()
  visits.unshift(visit)
  if (visits.length > 2000) visits.length = 2000
  writeVisits(visits)
  res.json({ ok: true })
})

// --- دخول المشرف ---
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body
  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ error: 'اسم المستخدم أو كلمة السر خطأ' })
  }
  const token = (sessionIdSeq++).toString(36) + '-' + Date.now().toString(36)
  sessions.set(token, { createdAt: Date.now() })
  res.json({ token })
})

// --- جلب بيانات الزوار (للمشرف فقط) ---
app.get('/api/admin/visits', (req, res) => {
  const token = req.headers['x-admin-token']
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: 'غير مصرح' })
  }
  const visits = readVisits()
  const summary = {
    total: visits.length,
    today: visits.filter(v => v.timestamp?.startsWith(new Date().toISOString().slice(0, 10))).length,
    uniqueIps: new Set(visits.map(v => v.ip)).size,
    pages: {},
  }
  visits.forEach(v => {
    const p = v.page || '/'
    summary.pages[p] = (summary.pages[p] || 0) + 1
  })
  res.json({ visits, summary })
})

app.listen(PORT, () => {
  console.log(`✓ خادم التتبع يعمل على http://localhost:${PORT}`)
  console.log(`  لوحة التحكم: http://localhost:${PORT}/admin`)
  console.log(`  ADMIN_USERNAME: ${ADMIN_USER}`)
})
