<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useFiltersStore } from '@/stores/filters'
import { useColumnsStore } from '@/stores/columns'
import { toCsv, toExcel } from '@/core/exporter'
import type { ExportOptions } from '@/types'
import AppButton from '@/components/common/AppButton.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import AppToggle from '@/components/common/AppToggle.vue'

const settingsStore = useSettingsStore()
const filtersStore = useFiltersStore()
const columnsStore = useColumnsStore()

const delimiterOptions = [
  { value: ',', label: ', (逗号)' },
  { value: ';', label: '; (分号)' },
  { value: '\t', label: '\t (制表符)' },
  { value: '|', label: '| (竖线)' },
]

const csvOptions = computed({
  get: () => settingsStore.csvOptions,
  set: (val: ExportOptions) => {
    settingsStore.csvOptions = val
  },
})

function getExportRows() {
  return csvOptions.value.filteredOnly
    ? filtersStore.filteredRows
    : columnsStore.displayRows
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function exportCsv() {
  const rows = getExportRows()
  const csv = toCsv(rows, csvOptions.value)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, 'export.csv')
}

async function exportExcel() {
  const rows = getExportRows()
  const blob = await toExcel(rows, settingsStore.excelOptions)
  downloadBlob(blob, 'export.xlsx')
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
      导出设置
    </h3>

    <div class="flex flex-col gap-3 rounded border border-gray-300 p-3 dark:border-gray-700">
      <h4 class="text-xs font-medium text-gray-600 dark:text-gray-400">
        CSV 选项
      </h4>

      <AppSelect
        :model-value="csvOptions.delimiter"
        label="分隔符"
        :options="delimiterOptions"
        @update:model-value="csvOptions = { ...csvOptions, delimiter: $event as ExportOptions['delimiter'] }"
      />

      <AppToggle
        :model-value="csvOptions.includeBom"
        label="包含 UTF-8 BOM"
        @update:model-value="csvOptions = { ...csvOptions, includeBom: $event }"
      />

      <AppToggle
        :model-value="csvOptions.includeHeader"
        label="包含表头"
        @update:model-value="csvOptions = { ...csvOptions, includeHeader: $event }"
      />

      <AppToggle
        :model-value="csvOptions.filteredOnly"
        label="仅导出过滤后的行"
        @update:model-value="csvOptions = { ...csvOptions, filteredOnly: $event }"
      />
    </div>

    <div class="flex gap-2">
      <AppButton variant="primary" @click="exportCsv">
        导出 CSV
      </AppButton>
      <AppButton variant="primary" @click="exportExcel">
        导出 Excel
      </AppButton>
    </div>
  </div>
</template>
