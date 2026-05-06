import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ColumnMeta, FlatRow } from '@/types'
import { useDataStore } from './data'
import { applyColumnTransform } from '@/core/transform'

export const useColumnsStore = defineStore('columns', () => {
  const dataStore = useDataStore()

  // overrides: key -> Partial<ColumnMeta>
  const overrides = ref<Map<string, Partial<ColumnMeta>>>(new Map())

  // Computed: merged columns (dataStore.columnMeta + overrides)
  const columns = computed<ColumnMeta[]>(() => {
    const merged = dataStore.columnMeta.map((col) => {
      const override = overrides.value.get(col.key)
      if (override) {
        return { ...col, ...override }
      }
      return col
    })
    // Apply explicit ordering if any column has an order override
    const hasOrder = merged.some((c) => c.order !== undefined)
    if (hasOrder) {
      return [...merged].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }
    return merged
  })

  const visibleColumns = computed(() => columns.value.filter((c) => !c.hidden))

  // displayRows: 经过列变换后的行(用于表格展示和导出)
  const displayRows = computed<FlatRow[]>(() => {
    return applyColumnTransform(dataStore.flatRows, visibleColumns.value)
  })

  // Actions
  function renameColumn(key: string, name: string) {
    const current = overrides.value.get(key) || {}
    overrides.value.set(key, { ...current, name })
  }

  function toggleHidden(key: string) {
    const current = overrides.value.get(key) || {}
    const original = dataStore.columnMeta.find((c) => c.key === key)
    const isHidden = current.hidden !== undefined ? current.hidden : original?.hidden ?? false
    overrides.value.set(key, { ...current, hidden: !isHidden })
  }

  function setType(key: string, type: ColumnMeta['type']) {
    const current = overrides.value.get(key) || {}
    overrides.value.set(key, { ...current, type })
  }

  function setFormat(key: string, format: string) {
    const current = overrides.value.get(key) || {}
    overrides.value.set(key, { ...current, format })
  }

  function moveColumn(key: string, direction: 'up' | 'down') {
    const idx = dataStore.columnMeta.findIndex((c) => c.key === key)
    if (idx === -1) return

    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= dataStore.columnMeta.length) return

    // Since we cannot mutate dataStore.columnMeta directly,
    // we store an explicit order index in overrides for each column.
    const currentOverrides = new Map(overrides.value)

    // Initialize order for all columns if not already set
    for (let i = 0; i < dataStore.columnMeta.length; i++) {
      const colKey = dataStore.columnMeta[i].key
      const ov = currentOverrides.get(colKey) || {}
      if (ov.order === undefined) {
        currentOverrides.set(colKey, { ...ov, order: i })
      }
    }

    const colA = dataStore.columnMeta[idx].key
    const colB = dataStore.columnMeta[newIdx].key
    const orderA = currentOverrides.get(colA)!.order!
    const orderB = currentOverrides.get(colB)!.order!

    currentOverrides.set(colA, { ...currentOverrides.get(colA), order: orderB })
    currentOverrides.set(colB, { ...currentOverrides.get(colB), order: orderA })

    overrides.value = currentOverrides
  }

  function resetOverrides() {
    overrides.value.clear()
  }

  return {
    overrides,
    columns,
    visibleColumns,
    displayRows,
    renameColumn,
    toggleHidden,
    setType,
    setFormat,
    moveColumn,
    resetOverrides,
  }
})
