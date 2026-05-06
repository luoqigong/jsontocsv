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
  <div class="flex items-center gap-2">
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      class="relative h-6 w-11 rounded-full transition-colors focus:outline-none cursor-pointer"
      :class="modelValue ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-700'"
      @click="toggle"
    >
      <span
        class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
      />
    </button>
    <label v-if="label" class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer" @click="toggle">
      {{ label }}
    </label>
  </div>
</template>
