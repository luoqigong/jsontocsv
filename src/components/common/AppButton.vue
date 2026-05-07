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
  primary: 'border border-primary-500 bg-primary-600 text-white shadow-sm shadow-primary-600/20 hover:border-primary-600 hover:bg-primary-700',
  secondary: 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-700',
  danger: 'border border-red-500 bg-red-500 text-white shadow-sm shadow-red-500/20 hover:border-red-600 hover:bg-red-600',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
      variantClasses[variant],
      sizeClasses[size],
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
