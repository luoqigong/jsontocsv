import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { FlatRow, FilterCondition } from '@/types'
import { useColumnsStore } from './columns'
import { applyFilters } from '@/core/filter'

export const useFiltersStore = defineStore('filters', () => {
  const columnsStore = useColumnsStore()

  const globalSearch = ref('')
  const conditions = ref<FilterCondition[]>([])

  const filteredRows = computed<FlatRow[]>(() => {
    let rows = columnsStore.displayRows

    // 1. 全局搜索
    if (globalSearch.value.trim()) {
      const term = globalSearch.value.trim().toLowerCase()
      rows = rows.filter((row) =>
        Object.values(row).some((val) => {
          if (val === null || val === undefined) return false
          return String(val).toLowerCase().includes(term)
        }),
      )
    }

    // 2. 条件过滤
    if (conditions.value.length > 0) {
      rows = applyFilters(rows, conditions.value)
    }

    return rows
  })

  const totalCount = computed(() => columnsStore.displayRows.length)
  const filteredCount = computed(() => filteredRows.value.length)

  function setGlobalSearch(term: string) {
    globalSearch.value = term
  }

  function addCondition(condition: FilterCondition) {
    conditions.value.push(condition)
  }

  function removeCondition(index: number) {
    conditions.value.splice(index, 1)
  }

  function updateCondition(index: number, patch: Partial<FilterCondition>) {
    if (index >= 0 && index < conditions.value.length) {
      conditions.value[index] = { ...conditions.value[index], ...patch }
    }
  }

  function clearFilters() {
    globalSearch.value = ''
    conditions.value = []
  }

  return {
    globalSearch,
    conditions,
    filteredRows,
    totalCount,
    filteredCount,
    setGlobalSearch,
    addCondition,
    removeCondition,
    updateCondition,
    clearFilters,
  }
})
