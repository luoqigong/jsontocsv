<script setup lang="ts">
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'error'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const variantClasses = {
  default: 'border border-slate-200 bg-slate-50 text-slate-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
  success: 'border border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-900/40 dark:text-green-300',
  warning: 'border border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-300',
  error: 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
      variantClasses[variant],
    ]"
  >
    <slot />
  </span>
</template>
