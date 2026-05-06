<script setup lang="ts">
import { computed } from 'vue'
import { useDataStore } from '@/stores/data'
import AppSelect from '@/components/common/AppSelect.vue'

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
  <div v-if="dataStore.pathCandidates.length > 1" class="flex flex-col gap-1">
    <label class="text-sm text-gray-700 dark:text-gray-300">
      数据路径 / Data Path
    </label>
    <AppSelect
      :model-value="dataStore.selectedPath"
      :options="options"
      @update:model-value="handleChange"
    />
  </div>
</template>
