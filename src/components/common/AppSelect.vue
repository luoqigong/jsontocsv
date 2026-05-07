<script setup lang="ts">
interface Option {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: Option[]
  label?: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="min-w-0 max-w-full flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-slate-600 dark:text-gray-300">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      class="box-border max-w-full min-w-[120px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-all focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
      @change="handleChange"
    >
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>
