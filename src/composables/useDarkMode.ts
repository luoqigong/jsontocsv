import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'j2t-dark-mode'

export function useDarkMode() {
  const isDark = ref(false)

  const applyClass = (dark: boolean) => {
    if (typeof document === 'undefined') return
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  const savePreference = (dark: boolean) => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, dark ? '1' : '0')
  }

  const apply = (dark: boolean) => {
    isDark.value = dark
    applyClass(dark)
    savePreference(dark)
  }

  const toggle = () => apply(!isDark.value)

  onMounted(() => {
    if (typeof localStorage === 'undefined' || typeof window === 'undefined') return
    const saved = localStorage.getItem(STORAGE_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    apply(saved ? saved === '1' : prefersDark)
  })

  watch(isDark, (dark) => {
    applyClass(dark)
    savePreference(dark)
  })

  return { isDark, toggle }
}
