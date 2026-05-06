import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ExportOptions, ExcelStyleOptions } from '@/types'

export const useSettingsStore = defineStore('settings', () => {
  const locale = ref<'zh-CN' | 'en'>('zh-CN')

  const csvOptions = ref<ExportOptions>({
    delimiter: ',',
    includeBom: true,
    lineEnding: '\r\n',
    includeHeader: true,
    filteredOnly: false,
  })

  const excelOptions = ref<ExcelStyleOptions>({
    boldHeader: true,
    freezeHeader: true,
    autoColumnWidth: true,
  })

  function setLocale(l: 'zh-CN' | 'en') {
    locale.value = l
  }

  return { locale, csvOptions, excelOptions, setLocale }
})
