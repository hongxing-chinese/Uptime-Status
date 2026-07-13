<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100
    dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="flex-1 p-3 sm:p-8">
      <main class="max-w-7xl mx-auto space-y-8">
        <Header :title="title" :is-refreshing="isRefreshing" :is-dark="isDark" v-model:sort="sort"
          @refresh="load" @toggle-theme="toggleTheme" @toggle-language="toggleLanguage" />
        <Stats :monitors="monitors" />
        <Card :monitors="monitors" :sort="sort" :error="error" :refreshing="isRefreshing" @update-monitor="onPatch" />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchMonitorData, writeCache, readCache, isRateLimit, waitRetry } from './utils/api'
import Header from './components/Header.vue'
import Stats from './components/Stats.vue'
import Card from './components/Card.vue'
import Footer from './components/Footer.vue'

const { t, locale } = useI18n()
const title = ref(import.meta.env.VITE_APP_TITLE || t('common.title'))
const monitors = ref([])
const isRefreshing = ref(false)
const isDark = ref(false)
const error = ref('')

const SORT_KEY_MAP = {
  friendly_name: 'friendlyName',
  create_datetime: 'createDateTime',
  status: 'status'
}
const SORT_KEYS = new Set(Object.values(SORT_KEY_MAP))
const envSortKey = SORT_KEY_MAP[import.meta.env.VITE_UPTIMEROBOT_STATUS_SORT?.trim().toLowerCase()]
  || 'friendlyName'
const defaultSort = () => ({
  key: envSortKey,
  order: envSortKey === 'createDateTime' ? 'desc' : 'asc',
  customOrder: true
})

const loadSort = () => {
  const raw = localStorage.getItem('monitorSort')
  if (!raw) return defaultSort()
  if (raw.includes(':')) {
    const [key, order, mode] = raw.split(':')
    return {
      key: SORT_KEYS.has(key) ? key : envSortKey,
      order: order === 'desc' ? 'desc' : 'asc',
      customOrder: mode ? mode === 'custom' : true
    }
  }
  const key = SORT_KEYS.has(raw) ? raw : envSortKey
  return { key, order: key === 'createDateTime' ? 'desc' : 'asc', customOrder: true }
}

const sort = ref(loadSort())

watch(sort, (v) => {
  const mode = v.customOrder ? 'custom' : 'plain'
  localStorage.setItem('monitorSort', `${v.key}:${v.order}:${mode}`)
}, { deep: true })
watch(locale, () => { title.value = import.meta.env.VITE_APP_TITLE || t('common.title') })

const toggleLanguage = () => {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  localStorage.setItem('locale', locale.value)
}

const initTheme = () => {
  isDark.value = localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark.value)
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', isDark.value)
}

let loadId = 0

const load = async (force = false) => {
  if (isRefreshing.value) return
  const id = ++loadId
  isRefreshing.value = true
  if (force) error.value = ''
  let useForce = force

  while (id === loadId) {
    try {
      monitors.value = await fetchMonitorData({ force: useForce })
      error.value = ''
      break
    } catch (e) {
      if (id !== loadId) break
      const stale = readCache(true)
      if (stale?.length) monitors.value = stale
      if (!isRateLimit(e)) { error.value = t('error.fetchFailed'); break }
      isRefreshing.value = false
      await waitRetry(e.retryAfter || 60, (s) => {
        if (id === loadId) {
          error.value = monitors.value.length
            ? t('error.rateLimitRetry', { seconds: s })
            : t('error.rateLimit', { seconds: s })
        }
      })
      if (id !== loadId) break
      isRefreshing.value = true
      useForce = true
    }
  }
  if (id === loadId) isRefreshing.value = false
}

const onPatch = (m) => {
  const i = monitors.value.findIndex((x) => x.id === m.id)
  if (i >= 0) { monitors.value[i] = m; writeCache(monitors.value) }
}

onMounted(() => { initTheme(); load() })
onUnmounted(() => { loadId++ })
</script>
