import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { router } from './router'
import App from './App.vue'
import 'uno.css'

import zhCN from './i18n/zh-CN.json'
import en from './i18n/en.json'

const i18n = createI18n({
  locale: navigator.language.startsWith('zh') ? 'zh-CN' : 'en',
  fallbackLocale: 'en',
  messages: { 'zh-CN': zhCN, en },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
