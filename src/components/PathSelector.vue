<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataStore } from '@/stores/data'
import AppSelect from '@/components/common/AppSelect.vue'

const { t } = useI18n()
const dataStore = useDataStore()

const options = computed(() => {
  return dataStore.pathCandidates.map((c) => ({
    value: c.path,
    label: `${c.path} (${c.count} items)`,
  }))
})

function handleChange(path: string) {
  dataStore.setPath(path)
}
</script>

<template>
  <div v-if="dataStore.pathCandidates.length > 1" class="min-w-0 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50/85 p-4 dark:border-gray-800 dark:bg-gray-950/70">
    <label class="text-sm font-semibold text-slate-900 dark:text-white">
      {{ t('path.dataPath') }}
    </label>
    <p class="text-sm text-slate-500 dark:text-gray-400">
      {{ t('path.desc') }}
    </p>
    <AppSelect
      class="w-full"
      :model-value="dataStore.selectedPath"
      :options="options"
      @update:model-value="handleChange"
    />
  </div>
</template>
