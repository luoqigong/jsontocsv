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
  <div class="min-w-0 flex h-full flex-col gap-2">
    <div class="flex shrink-0 items-center justify-between px-1">
      <AppBadge variant="default">
        {{ filtersStore.filteredCount }} / {{ filtersStore.totalCount }} rows
      </AppBadge>
    </div>

    <div class="min-w-0 flex-1 overflow-auto rounded-[1.5rem] border border-slate-200 bg-white shadow-inner dark:border-gray-800 dark:bg-gray-950/70">
      <div
        v-if="table.getRowModel().rows.length === 0"
        class="flex h-full min-h-[320px] flex-col items-center justify-center px-6 text-center text-slate-400 dark:text-gray-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mb-4 opacity-40"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        <p class="text-base font-medium text-slate-600 dark:text-gray-300">
          Paste JSON data to see the table preview
        </p>
        <p class="mt-2 max-w-md text-sm leading-6 text-slate-400 dark:text-gray-500">
          After parsing, your rows appear here with sorting, filtering, and column edits already applied.
        </p>
      </div>

      <table v-else class="w-full border-collapse text-sm">
        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="bg-slate-50 dark:bg-gray-900"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="sticky top-0 z-1 cursor-pointer select-none border-b border-r border-slate-200 px-4 py-3 text-left font-semibold text-slate-700 transition-colors last:border-r-0 hover:bg-slate-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
              :style="{ width: header.getSize() + 'px', minWidth: header.getSize() + 'px' }"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <div class="flex items-center gap-1">
                <span>{{ header.column.columnDef.header }}</span>
                <span class="text-xs text-slate-400 dark:text-gray-500">
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
            class="border-b border-slate-100 transition-colors hover:bg-slate-50/80 dark:border-gray-900 dark:hover:bg-gray-900/60"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="border-r border-slate-100 px-4 py-3 align-top text-slate-700 last:border-r-0 dark:border-gray-900 dark:text-gray-200"
              :style="{ width: cell.column.getSize() + 'px', minWidth: cell.column.getSize() + 'px' }"
            >
              {{ cell.getValue() === null || cell.getValue() === undefined ? '' : String(cell.getValue()) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
