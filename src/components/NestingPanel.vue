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
  <div class="min-w-0 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/85 p-4 dark:border-gray-800 dark:bg-gray-950/70">
    <label class="text-sm font-semibold text-slate-900 dark:text-white">
      嵌套策略 / Nesting Strategy
    </label>
    <p class="text-sm text-slate-500 dark:text-gray-400">
      控制数组与嵌套对象在结果表格中的展开方式。
    </p>
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
