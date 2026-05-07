<script setup lang="ts">
import { ref } from 'vue'
import { useColumnsStore } from '@/stores/columns'
import type { ColumnMeta } from '@/types'
import AppButton from '@/components/common/AppButton.vue'
import AppSelect from '@/components/common/AppSelect.vue'

const columnsStore = useColumnsStore()

const editingNames = ref<Map<string, string>>(new Map())

const typeOptions = [
  { value: 'text', label: 'text' },
  { value: 'integer', label: 'integer' },
  { value: 'decimal', label: 'decimal' },
  { value: 'date', label: 'date' },
  { value: 'boolean', label: 'boolean' },
]

function startEdit(col: ColumnMeta) {
  if (!editingNames.value.has(col.key)) {
    editingNames.value.set(col.key, col.name)
  }
}

function submitRename(key: string) {
  const newName = editingNames.value.get(key)
  if (newName !== undefined && newName.trim()) {
    columnsStore.renameColumn(key, newName.trim())
  }
  editingNames.value.delete(key)
}

function handleBlur(key: string) {
  submitRename(key)
}

function handleKeydown(e: KeyboardEvent, key: string) {
  if (e.key === 'Enter') {
    submitRename(key)
  }
}

function handleTypeChange(key: string, newType: string) {
  const validTypes: ColumnMeta['type'][] = ['text', 'integer', 'decimal', 'date', 'boolean']
  if (validTypes.includes(newType as ColumnMeta['type'])) {
    columnsStore.setType(key, newType as ColumnMeta['type'])
  }
}
</script>

<template>
  <div class="min-w-0 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
        列管理
      </h3>
      <AppButton variant="secondary" size="sm" @click="columnsStore.resetOverrides">
        重置
      </AppButton>
    </div>

    <div class="min-w-0 max-h-[480px] flex-1 overflow-auto rounded-[1.5rem] border border-slate-200 bg-slate-50/85 p-2 dark:border-gray-800 dark:bg-gray-950/70">
      <div
        v-for="col in columnsStore.columns"
        :key="col.key"
        class="mb-2 min-w-0 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm last:mb-0 dark:border-gray-800 dark:bg-gray-900"
      >
        <input
          type="checkbox"
          :checked="!col.hidden"
          class="h-4 w-4 cursor-pointer rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
          @change="columnsStore.toggleHidden(col.key)"
        >

        <input
          :value="editingNames.has(col.key) ? editingNames.get(col.key) : col.name"
          class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-primary-500 dark:focus:ring-primary-900/30"
          @focus="startEdit(col)"
          @input="editingNames.set(col.key, ($event.target as HTMLInputElement).value)"
          @blur="handleBlur(col.key)"
          @keydown="handleKeydown($event, col.key)"
        >

        <AppSelect
          :model-value="col.type"
          :options="typeOptions"
          @update:model-value="handleTypeChange(col.key, $event)"
        />
      </div>
    </div>
  </div>
</template>
