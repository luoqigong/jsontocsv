<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(e: MouseEvent) {
  if (!props.disabled) {
    emit('click', e)
  }
}

const variantClasses = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200',
  danger: 'bg-red-500 text-white hover:bg-red-600',
}

const sizeClasses = {
  sm: 'text-sm px-2 py-1',
  md: 'px-3 py-1.5',
  lg: 'text-lg px-4 py-2',
}
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
      variantClasses[variant],
      sizeClasses[size],
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
