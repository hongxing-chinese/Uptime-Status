import {
  getCachedMonitorStatus,
  fetchMonitorResponseTime,
  parseRequestApiKey,
  corsHeaders,
  CACHE_TTL_MS
} from '../../api/status.js'

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    ...corsHeaders,
    'Content-Type': 'application/json',
    'Cache-Control': status >= 400 ? 'no-store' : `public, max-age=${CACHE_TTL_MS / 1000 | 0}`
  }
})

export async function onRequest({ request, env = {} }) {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (request.method !== 'GET' && request.method !== 'POST') return json({ error: '只支持 GET / POST' }, 405)

  try {
    const url = new URL(request.url)
    const apiKey = await parseRequestApiKey(request, env)
    const monitorId = url.searchParams.get('monitorId')

    if (monitorId) {
      return json({ responseTimeStats: await fetchMonitorResponseTime({ apiKey, monitorId }) })
    }

    const force = ['1', 'true'].includes(url.searchParams.get('refresh'))
    return json(await getCachedMonitorStatus(apiKey, { force }))
  } catch (e) {
    if (e.name === 'RateLimitError') {
      return json({ error: e.message, retryAfter: e.retryAfter }, 429)
    }
    return json({ error: e.message || '请求失败' }, 500)
  }
}
