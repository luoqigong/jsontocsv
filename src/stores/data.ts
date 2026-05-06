import { ref, computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import type { JsonValue, PathCandidate, NestingStrategy, FlatRow, ColumnMeta } from '@/types'
import { parseJson } from '@/core/parser'
import { findPathCandidates, getArrayAtPath } from '@/core/pathFinder'
import { flattenRows } from '@/core/flattener'
import { inferColumnTypes } from '@/core/typeInfer'

export const useDataStore = defineStore('data', () => {
  // State
  const rawInput = ref('')
  const parsedValue = shallowRef<JsonValue | null>(null)
  const parseError = ref<string | undefined>(undefined)
  const isJsonl = ref(false)
  const pathCandidates = ref<PathCandidate[]>([])
  const selectedPath = ref('')
  const nestingStrategy = ref<NestingStrategy>('flatten')
  const flatRows = ref<FlatRow[]>([])
  const columnMeta = ref<ColumnMeta[]>([])

  // Getters
  const hasError = computed(() => !!parseError.value)
  const arrayAtPath = computed(() => {
    if (!parsedValue.value || !selectedPath.value) return []
    return getArrayAtPath(parsedValue.value, selectedPath.value)
  })

  // Actions
  function setInput(input: string) {
    rawInput.value = input
    const result = parseJson(input)
    parsedValue.value = result.value
    parseError.value = result.error?.message
    isJsonl.value = result.isJsonl

    if (result.value) {
      pathCandidates.value = findPathCandidates(result.value)
      selectedPath.value = pathCandidates.value[0]?.path || ''
      recomputeRows()
    } else {
      pathCandidates.value = []
      selectedPath.value = ''
      flatRows.value = []
      columnMeta.value = []
    }
  }

  function setPath(path: string) {
    selectedPath.value = path
    recomputeRows()
  }

  function setStrategy(strategy: NestingStrategy) {
    nestingStrategy.value = strategy
    recomputeRows()
  }

  function recomputeRows() {
    if (!arrayAtPath.value.length) {
      flatRows.value = []
      columnMeta.value = []
      return
    }
    flatRows.value = flattenRows(arrayAtPath.value, nestingStrategy.value)
    columnMeta.value = inferColumnTypes(flatRows.value)
  }

  return {
    rawInput,
    parsedValue,
    parseError,
    isJsonl,
    pathCandidates,
    selectedPath,
    nestingStrategy,
    flatRows,
    columnMeta,
    hasError,
    arrayAtPath,
    setInput,
    setPath,
    setStrategy,
    recomputeRows,
  }
})
