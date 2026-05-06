<script setup lang="ts">
import { computed } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
} from '@tanstack/vue-table'
import { useFiltersStore } from '@/stores/filters'
import { useColumnsStore } from '@/stores/columns'
import AppBadge from '@/components/common/AppBadge.vue'

const filtersStore = useFiltersStore()
const columnsStore = useColumnsStore()

const data = computed(() => filtersStore.filteredRows)

const columns = computed<ColumnDef<Record<string, unknown>, unknown>[]>(() => {
  return columnsStore.visibleColumns.map((col) => ({
    accessorKey: col.name,
    header: col.name,
    enableSorting: true,
    size: 150,
    minSize: 80,
  }))
})

const table = useVueTable({
  get data() {
    return data.value as Record<string, unknown>[]
  },
  get columns() {
    return columns.value
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})

function getSortIndicator(header: ReturnType<typeof table.getFlatHeaders>[number]) {
  if (!header.column.getIsSorted()) return '↕'
  if (header.column.getIsSorted() === 'asc') return '↑'
  return '↓'
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between px-1">
      <AppBadge variant="default">
        {{ filtersStore.filteredCount }} / {{ filtersStore.totalCount }} rows
      </AppBadge>
    </div>

    <div class="overflow-auto rounded border border-gray-300 dark:border-gray-700">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="bg-gray-50 dark:bg-gray-800"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="cursor-pointer select-none border-b border-r border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 transition-colors last:border-r-0 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
              :style="{ width: header.getSize() + 'px', minWidth: header.getSize() + 'px' }"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <div class="flex items-center gap-1">
                <span>{{ header.column.columnDef.header }}</span>
                <span class="text-xs text-gray-400 dark:text-gray-500">
                  {{ getSortIndicator(header) }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="border-r border-gray-200 px-3 py-2 text-gray-800 last:border-r-0 dark:border-gray-700 dark:text-gray-200"
              :style="{ width: cell.column.getSize() + 'px', minWidth: cell.column.getSize() + 'px' }"
            >
              {{ cell.getValue() === null || cell.getValue() === undefined ? '' : String(cell.getValue()) }}
            </td>
          </tr>
          <tr v-if="table.getRowModel().rows.length === 0">
            <td
              :colspan="columns.length || 1"
              class="px-3 py-8 text-center text-gray-400 dark:text-gray-500"
            >
              无数据
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
