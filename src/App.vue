<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDarkMode } from './composables/useDarkMode'
import AppSelect from './components/common/AppSelect.vue'
import CookieBanner from './components/CookieBanner.vue'

const { isDark, toggle } = useDarkMode()
const { locale } = useI18n()

const LOCALE_KEY = 'j2t-locale'

const localeOptions = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en', label: 'English' },
]

const currentLocale = ref(locale.value)

function handleLocaleChange(val: string) {
  currentLocale.value = val
  locale.value = val
  localStorage.setItem(LOCALE_KEY, val)
}

onMounted(() => {
  const saved = localStorage.getItem(LOCALE_KEY)
  if (saved && (saved === 'zh-CN' || saved === 'en')) {
    currentLocale.value = saved
    locale.value = saved
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
    <div class="relative flex min-h-screen flex-col overflow-hidden">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.16),_transparent_58%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_60%)]" />
      <div class="pointer-events-none absolute inset-x-0 top-0 h-full bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.76),_rgba(255,255,255,0.94))] dark:bg-[linear-gradient(to_bottom,_rgba(3,7,18,0.72),_rgba(3,7,18,0.95))]" />

      <header class="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/75">
        <div class="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <RouterLink to="/" class="group min-w-0">
            <div class="flex items-center gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-sm font-bold text-white shadow-lg shadow-primary-600/25 ring-1 ring-primary-400/30">
                JT
              </div>
              <div class="min-w-0">
                <p class="truncate text-base font-semibold text-gray-950 dark:text-white">
                  JSON to Table
                </p>
                <p class="truncate text-xs text-gray-500 transition-colors group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400">
                  Browser-first JSON workspace for clean table exports
                </p>
              </div>
            </div>
          </RouterLink>

          <div class="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2 rounded-2xl border border-gray-200 bg-white/85 p-1.5 shadow-sm shadow-gray-200/60 dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none">
            <AppSelect
              v-model="currentLocale"
              :options="localeOptions"
              @update:model-value="handleLocaleChange"
            />
            <button
              class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-base text-gray-700 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-primary-700/60 dark:hover:bg-primary-950/60 dark:hover:text-primary-300"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
              @click="toggle"
            >
              {{ isDark ? '☀️' : '🌙' }}
            </button>
          </div>
        </div>
      </header>

      <main class="relative z-10 flex-1">
        <RouterView />
      </main>

      <footer class="relative z-10 border-t border-white/60 bg-white/70 pb-16 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/70">
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              JSON to Table
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Free JSON to Excel &amp; CSV converter with private, client-side processing.
            </p>
          </div>

          <nav class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <RouterLink to="/about" class="transition-colors hover:text-primary-600 dark:hover:text-primary-400">
              About
            </RouterLink>
            <RouterLink to="/contact" class="transition-colors hover:text-primary-600 dark:hover:text-primary-400">
              Contact
            </RouterLink>
            <RouterLink to="/privacy" class="transition-colors hover:text-primary-600 dark:hover:text-primary-400">
              Privacy
            </RouterLink>
            <RouterLink to="/cookies" class="transition-colors hover:text-primary-600 dark:hover:text-primary-400">
              Cookies
            </RouterLink>
            <RouterLink to="/terms" class="transition-colors hover:text-primary-600 dark:hover:text-primary-400">
              Terms
            </RouterLink>
          </nav>
        </div>
      </footer>

      <CookieBanner />
    </div>
  </div>
</template>
