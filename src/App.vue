<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
    <header class="border-b dark:border-gray-700 px-4 py-3 flex justify-between items-center">
      <RouterLink to="/" class="text-lg font-bold">JSON to Table</RouterLink>
      <button @click="toggle" class="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </header>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { useDarkMode } from './composables/useDarkMode'

const { isDark, toggle } = useDarkMode()
</script>
