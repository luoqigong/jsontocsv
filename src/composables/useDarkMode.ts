import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'j2t-dark-mode'

export function useDarkMode() {
  const isDark = ref(false)

  const apply = (dark: boolean) => {
    isDark.value = dark
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem(STORAGE_KEY, dark ? '1' : '0')
  }

  const toggle = () => apply(!isDark.value)

  onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    apply(saved ? saved === '1' : prefersDark)
  })

  watch(isDark, apply)

  return { isDark, toggle }
}
