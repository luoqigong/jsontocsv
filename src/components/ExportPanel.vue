<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import { useFiltersStore } from '@/stores/filters'
import { useColumnsStore } from '@/stores/columns'
import { toCsv, toExcel } from '@/core/exporter'
import type { ExportOptions } from '@/types'
import AppButton from '@/components/common/AppButton.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import AppToggle from '@/components/common/AppToggle.vue'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const filtersStore = useFiltersStore()
const columnsStore = useColumnsStore()

const delimiterOptions = [
  { value: ',', label: t('export.delimiterComma') },
  { value: ';', label: t('export.delimiterSemicolon') },
  { value: '\t', label: t('export.delimiterTab') },
  { value: '|', label: t('export.delimiterPipe') },
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
  <div class="min-w-0 flex flex-col gap-4">
    <div class="min-w-0 rounded-[1.5rem] border border-slate-200 bg-slate-50/85 p-4 dark:border-gray-800 dark:bg-gray-950/70">
      <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-gray-500">
        {{ t('export.csvOptions') }}
      </p>
      <div class="mt-4 grid gap-4">
        <AppSelect
          :model-value="csvOptions.delimiter"
          :label="t('export.delimiter')"
          :options="delimiterOptions"
          @update:model-value="csvOptions = { ...csvOptions, delimiter: $event as ExportOptions['delimiter'] }"
        />

        <div class="grid gap-3">
          <AppToggle
            :model-value="csvOptions.includeBom"
            :label="t('export.includeBom')"
            @update:model-value="csvOptions = { ...csvOptions, includeBom: $event }"
          />

          <AppToggle
            :model-value="csvOptions.includeHeader"
            :label="t('export.includeHeader')"
            @update:model-value="csvOptions = { ...csvOptions, includeHeader: $event }"
          />

          <AppToggle
            :model-value="csvOptions.filteredOnly"
            :label="t('export.filteredOnly')"
            @update:model-value="csvOptions = { ...csvOptions, filteredOnly: $event }"
          />
        </div>
      </div>
    </div>

    <div class="grid gap-2 sm:grid-cols-2">
      <AppButton variant="primary" @click="exportCsv">
        {{ t('export.csv') }}
      </AppButton>
      <AppButton variant="primary" @click="exportExcel">
        {{ t('export.excel') }}
      </AppButton>
    </div>
  </div>
</template>
