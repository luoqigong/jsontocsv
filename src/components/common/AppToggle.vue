<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div class="min-w-0 flex flex-wrap items-center gap-3">
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      class="relative h-6 w-11 cursor-pointer rounded-full border transition-all focus:outline-none"
      :class="modelValue ? 'border-primary-500 bg-primary-600' : 'border-slate-300 bg-slate-200 dark:border-gray-700 dark:bg-gray-700'"
      @click="toggle"
    >
      <span
        class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
      />
    </button>
    <label v-if="label" class="cursor-pointer break-words text-sm font-medium text-slate-600 dark:text-gray-300" @click="toggle">
      {{ label }}
    </label>
  </div>
</template>
