<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDarkMode } from './composables/useDarkMode'
import AppSelect from './components/common/AppSelect.vue'

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
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
    <header class="border-b dark:border-gray-700 px-4 py-3 flex justify-between items-center">
      <RouterLink to="/" class="text-lg font-bold">JSON to Table</RouterLink>
      <div class="flex items-center gap-3">
        <AppSelect
          v-model="currentLocale"
          :options="localeOptions"
          @update:model-value="handleLocaleChange"
        />
        <button
          class="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          @click="toggle"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>
    <RouterView />
  </div>
</template>
