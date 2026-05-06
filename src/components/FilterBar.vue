<script setup lang="ts">
import { computed } from 'vue'
import { useFiltersStore } from '@/stores/filters'
import { useColumnsStore } from '@/stores/columns'
import type { FilterCondition } from '@/types'
import AppButton from '@/components/common/AppButton.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import AppBadge from '@/components/common/AppBadge.vue'

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
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <input
        :value="filtersStore.globalSearch"
        type="text"
        placeholder="全局搜索..."
        class="flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
        @input="filtersStore.setGlobalSearch(($event.target as HTMLInputElement).value)"
      >
      <AppButton variant="secondary" size="sm" @click="filtersStore.clearFilters">
        清除
      </AppButton>
      <AppBadge variant="default">
        {{ filtersStore.filteredCount }} / {{ filtersStore.totalCount }} rows
      </AppBadge>
    </div>

    <div class="flex flex-col gap-2">
      <div
        v-for="(condition, index) in filtersStore.conditions"
        :key="index"
        class="flex items-center gap-2"
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
          placeholder="值"
          class="flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          @input="updateConditionValue(index, ($event.target as HTMLInputElement).value)"
        >

        <AppButton variant="danger" size="sm" @click="filtersStore.removeCondition(index)">
          删除
        </AppButton>
      </div>
    </div>

    <div>
      <AppButton variant="secondary" size="sm" @click="addCondition">
        添加条件
      </AppButton>
    </div>
  </div>
</template>
