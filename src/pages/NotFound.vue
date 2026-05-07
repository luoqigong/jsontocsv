<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { usePageMeta } from '@/composables/usePageMeta'
import { useSchema } from '@/composables/useSchema'

usePageMeta({
  title: 'Page Not Found | JSON to Table',
  description: 'The page you are looking for does not exist. Go back to JSON to Table and convert JSON to Excel or CSV online.',
})

useSchema({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '404 Not Found',
  description: 'Page not found on JSON to Table',
})
</script>

<template>
  <div class="min-h-[calc(100vh-3.25rem)] flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <h1 class="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">
        404
      </h1>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Page Not Found
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <RouterLink
        to="/"
        class="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
      >
        Back to JSON to Table
      </RouterLink>
    </div>
  </div>
</template>
