<script setup lang="ts">
import { useDataStore } from '@/stores/data'
import AppButton from '@/components/common/AppButton.vue'
import type { NestingStrategy } from '@/types'

const dataStore = useDataStore()

const strategies: { key: NestingStrategy; label: string }[] = [
  { key: 'flatten', label: 'Flatten' },
  { key: 'stringify', label: 'Stringify' },
  { key: 'explode', label: 'Explode' },
  { key: 'multiSheet', label: 'Multi Sheet' },
]

function selectStrategy(strategy: NestingStrategy) {
  dataStore.setStrategy(strategy)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm text-gray-700 dark:text-gray-300">
      嵌套策略 / Nesting Strategy
    </label>
    <div class="flex flex-wrap gap-2">
      <AppButton
        v-for="s in strategies"
        :key="s.key"
        size="sm"
        :variant="dataStore.nestingStrategy === s.key ? 'primary' : 'secondary'"
        @click="selectStrategy(s.key)"
      >
        {{ s.label }}
      </AppButton>
    </div>
  </div>
</template>
