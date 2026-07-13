const DAYS = 30, MS_DAY = 86400000, HOURS = 24
const num = (v) => v != null && !Number.isNaN(v) && v > 0

export const normalizeStatus = (s) => String(s || '').toUpperCase()
export const isMonitorOnline = (s) => ['UP', 'STARTED'].includes(normalizeStatus(s))
export const isMonitorOffline = (s) => ['DOWN', 'LOOKS_DOWN'].includes(normalizeStatus(s))
export const isMonitorPaused = (s) => normalizeStatus(s) === 'PAUSED'
export const isMonitorWarning = (s) => ['PAUSED', 'STARTED'].includes(normalizeStatus(s))
export const isMonitorAbnormal = (s) => isMonitorOffline(s) || isMonitorPaused(s)

const rank = (s) => ({ UP: 0, STARTED: 1, PAUSED: 2, LOOKS_DOWN: 3, DOWN: 4 }[normalizeStatus(s)] ?? 5)

const cmp = (a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true })

const parseDomain = (value) => {
  const raw = String(value || '').trim().toLowerCase()
  if (!raw) return null

  try {
    const parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
    return {
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname.replace(/\/+$/, '')
    }
  } catch {
    return null
  }
}

const customDomainOrder = String(import.meta.env.VITE_CUSTOM_DOMAIN_ORDER || '')
  .split(',')
  .map(parseDomain)
  .filter(Boolean)

const defaultSortKey = ({
  friendly_name: 'friendlyName',
  create_datetime: 'createDateTime',
  status: 'status'
})[import.meta.env.VITE_UPTIMEROBOT_STATUS_SORT?.trim().toLowerCase()] || 'friendlyName'
const defaultSortOrder = defaultSortKey === 'createDateTime' ? 'desc' : 'asc'

const customOrderIndex = (monitorUrl) => {
  if (!customDomainOrder.length) return Infinity
  const monitor = parseDomain(monitorUrl)
  if (!monitor) return Infinity

  const index = customDomainOrder.findIndex((rule) => {
    if (rule.hostname !== monitor.hostname) return false
    if (rule.port && rule.port !== monitor.port) return false
    return !rule.pathname || rule.pathname === monitor.pathname
  })

  return index < 0 ? Infinity : index
}

export const sortMonitors = (list, {
  key = 'friendlyName',
  order = 'asc',
  customOrder = false
} = {}) => {
  const useCustomOrder = customOrder && customDomainOrder.length > 0
  const activeKey = useCustomOrder ? defaultSortKey : key
  const activeOrder = useCustomOrder ? defaultSortOrder : order
  const dir = activeOrder === 'desc' ? -1 : 1
  const get = {
    friendlyName: (m) => m.friendlyName || '',
    createDateTime: (m) => parseTimestamp(m.createDateTime) || 0,
    status: (m) => rank(m.status)
  }[activeKey] || ((m) => m.friendlyName || '')

  return [...list].sort((a, b) => {
    if (useCustomOrder) {
      const customA = customOrderIndex(a.url)
      const customB = customOrderIndex(b.url)
      if (customA !== customB) {
        if (customA === Infinity) return 1
        if (customB === Infinity) return -1
        return customA - customB
      }
    }

    const va = get(a), vb = get(b)
    const d = typeof va === 'string'
      ? va.localeCompare(vb, undefined, { numeric: true, sensitivity: 'base' })
      : va - vb
    return d * dir || cmp(a, b) * dir
  })
}

export const parseTimestamp = (v) => {
  if (v == null) return null
  if (typeof v === 'number') return v > 1e12 ? v : v * 1000
  const p = Date.parse(v)
  return Number.isNaN(p) ? null : p
}

function avgResponse(m) {
  const avg = m.responseTimeStats?.summary?.avg
  if (num(avg)) return Math.round(avg)
  const vals = (m.responseTimeStats?.time_series || []).map((p) => p.value).filter(num)
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null
}

function hourlyResponse(m) {
  const out = Array(HOURS).fill(null), groups = {}
  for (const p of m.responseTimeStats?.time_series || []) {
    if (!num(p.value)) continue
    const ts = parseTimestamp(p.timestamp)
    if (!ts) continue
    const h = Math.floor((Date.now() - ts) / 3600000)
    if (h >= 0 && h < HOURS) (groups[h] ||= []).push(p.value)
  }
  for (const [h, vals] of Object.entries(groups)) {
    out[h] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  }
  return out
}

function incidents30d(list = []) {
  const since = Math.floor((Date.now() - DAYS * MS_DAY) / 1000)
  const items = list.filter((i) => {
    const ts = parseTimestamp(i.startedAt)
    return ts && Math.floor(ts / 1000) >= since
  }).sort((a, b) => (parseTimestamp(b.startedAt) || 0) - (parseTimestamp(a.startedAt) || 0))
  return { incidents: items, totalDowntime: items.reduce((n, i) => n + (i.duration || 0), 0) }
}

function buildDailyUptimes(m) {
  const days = Array(DAYS).fill(null)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (const { timestamp, uptime } of m.lastDayUptimes?.histogram || []) {
    if (uptime == null) continue
    const ts = parseTimestamp(timestamp)
    if (!ts) continue
    const start = new Date(ts)
    start.setHours(0, 0, 0, 0)
    const age = Math.floor((today - start) / MS_DAY)
    if (age >= 0 && age < DAYS) days[DAYS - 1 - age] = Number(uptime)
  }
  if (!days.some(Boolean) && isMonitorOnline(m.status)) days.fill(100)
  const valid = days.filter(num)
  const uptime = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length
    : (isMonitorOnline(m.status) ? 100 : 0)
  return { dailyUptimes: days, uptime }
}

export const processMonitorData = (m) => {
  const { incidents, totalDowntime } = incidents30d(m.incidents)
  const { dailyUptimes, uptime } = buildDailyUptimes(m)
  return {
    ...m,
    stats: { avgResponseTime: avgResponse(m), dailyResponseTimes: hourlyResponse(m), uptime, dailyUptimes, incidents, totalDowntime }
  }
}

export const patchResponseTimeStats = (m, stats) => {
  const { stats: _, ...rest } = m
  return processMonitorData({ ...rest, responseTimeStats: stats })
}
