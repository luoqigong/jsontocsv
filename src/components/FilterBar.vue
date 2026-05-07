<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFiltersStore } from '@/stores/filters'
import { useColumnsStore } from '@/stores/columns'
import type { FilterCondition } from '@/types'
import AppButton from '@/components/common/AppButton.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import AppBadge from '@/components/common/AppBadge.vue'

const { t } = useI18n()
const filtersStore = useFiltersStore()
const columnsStore = useColumnsStore()

const columnOptions = computed(() => {
  return columnsStore.visibleColumns.map((col) => ({
    value: col.name,
    label: col.name,
  }))
})

const operatorOptions = [
  { value: 'contains', label: 'contains' },
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: 'starts with', label: 'starts with' },
  { value: 'regex', label: 'regex' },
]

function addCondition() {
  const firstCol = columnsStore.visibleColumns[0]
  const condition: FilterCondition = {
    column: firstCol?.name || '',
    operator: 'contains',
    value: '',
  }
  filtersStore.addCondition(condition)
}

function updateConditionColumn(index: number, columnName: string) {
  filtersStore.updateCondition(index, { column: columnName })
}

function updateConditionOperator(index: number, operator: string) {
  const validOperators: FilterCondition['operator'][] = ['>', '<', '=', '!=', '>=', '<=', 'contains', 'starts with', 'regex']
  if (validOperators.includes(operator as FilterCondition['operator'])) {
    filtersStore.updateCondition(index, { operator: operator as FilterCondition['operator'] })
  }
}

function updateConditionValue(index: number, value: string) {
  filtersStore.updateCondition(index, { value })
}
</script>

<template>
  <div class="min-w-0 flex flex-col gap-4">
    <div class="min-w-0 flex flex-col gap-3 lg:flex-row lg:items-center">
      <input
        :value="filtersStore.globalSearch"
        type="text"
        :placeholder="t('filter.search')"
        class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-950/70 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-primary-500 dark:focus:ring-primary-900/30"
        @input="filtersStore.setGlobalSearch(($event.target as HTMLInputElement).value)"
      >
      <div class="min-w-0 flex flex-wrap items-center gap-2">
        <AppButton variant="secondary" size="sm" @click="filtersStore.clearFilters">
          {{ t('filter.clear') }}
        </AppButton>
        <AppBadge variant="default">
          {{ filtersStore.filteredCount }} / {{ filtersStore.totalCount }} {{ t('table.rows') }}
        </AppBadge>
      </div>
    </div>

    <div v-if="filtersStore.conditions.length > 0" class="min-w-0 flex flex-col gap-3">
      <div
        v-for="(condition, index) in filtersStore.conditions"
        :key="index"
        class="min-w-0 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/85 p-3 dark:border-gray-800 dark:bg-gray-950/70 xl:flex-nowrap"
      >
        <AppSelect
          :model-value="condition.column"
          :options="columnOptions"
          @update:model-value="updateConditionColumn(index, $event)"
        />

        <AppSelect
          :model-value="condition.operator"
          :options="operatorOptions"
          @update:model-value="updateConditionOperator(index, $event)"
        />

        <input
          :value="condition.value"
          type="text"
          :placeholder="t('filter.value')"
          class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-primary-500 dark:focus:ring-primary-900/30"
          @input="updateConditionValue(index, ($event.target as HTMLInputElement).value)"
        >

        <AppButton variant="danger" size="sm" @click="filtersStore.removeCondition(index)">
          {{ t('filter.delete') }}
        </AppButton>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-xs text-slate-500 dark:text-gray-400">
        {{ t('filter.hint') }}
      </p>
      <AppButton variant="secondary" size="sm" @click="addCondition">
        {{ t('filter.addCondition') }}
      </AppButton>
    </div>
  </div>
</template>
