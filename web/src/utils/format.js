export function formatNumber(num) {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toLocaleString('ar')
}

export function formatTime(seconds) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${days} يوم و ${hours} ساعة و ${minutes} دقيقة`
}

export function formatMinutesLabel(min) {
  if (min < 60) return `${min} د`
  if (min === 60) return '1 س'
  if (min === 120) return '2 س'
  if (min === 480) return '8 س'
  if (min === 720) return '12 س'
  if (min === 1440) return '24 س'
  return `${min} د`
}

/** تحويل ساعات + دقائق + أيام إلى إجمالي دقائق */
export function toTotalMinutes({ days = 0, hours = 0, minutes = 0 } = {}) {
  const d = parseInt(days, 10) || 0
  const h = parseInt(hours, 10) || 0
  const m = parseInt(minutes, 10) || 0
  return d * 1440 + h * 60 + m
}

/** عرض المدة من دقائق */
export function formatDuration(totalMinutes) {
  const days = Math.floor(totalMinutes / 1440)
  const rem = totalMinutes % 1440
  const hours = Math.floor(rem / 60)
  const mins = rem % 60
  const parts = []
  if (days) parts.push(`${days} يوم`)
  if (hours) parts.push(`${hours} ساعة`)
  if (mins || !parts.length) parts.push(`${mins} دقيقة`)
  return `${parts.join(' و ')} (${totalMinutes.toLocaleString('ar')} دقيقة)`
}

const UNIT_MULTIPLIERS = { raw: 1, K: 1_000, M: 1_000_000, B: 1_000_000_000 }

/**
 * ي parse رقم يدوي: 520.6 أو 520.6M أو مع وحدة من القائمة
 */
export function parseResourceInput(value, unit = 'raw') {
  if (value === '' || value == null) return 0
  const str = String(value).trim().replace(/,/g, '').replace(/\s/g, '')
  const inline = str.match(/^([\d.]+)\s*([kmb])?$/i)
  if (inline) {
    let num = parseFloat(inline[1])
    if (Number.isNaN(num)) return 0
    const suffix = (inline[2] || '').toUpperCase()
    if (suffix === 'K') num *= UNIT_MULTIPLIERS.K
    else if (suffix === 'M') num *= UNIT_MULTIPLIERS.M
    else if (suffix === 'B') num *= UNIT_MULTIPLIERS.B
    else if (unit !== 'raw') num *= UNIT_MULTIPLIERS[unit] || 1
    return Math.floor(num)
  }
  const num = parseFloat(str)
  if (Number.isNaN(num)) return 0
  return Math.floor(num * (UNIT_MULTIPLIERS[unit] || 1))
}
