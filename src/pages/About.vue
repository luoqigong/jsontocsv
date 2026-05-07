<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import { useSchema } from '@/composables/useSchema'

const { t } = useI18n()

usePageMeta({
  title: 'About JSON to Table - Free JSON to Excel & CSV Converter',
  description: 'Learn about JSON to Table, a free browser-based tool that converts JSON to Excel and CSV. 100% client-side processing means your data never leaves your computer.',
})

useSchema({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About JSON to Table',
  description: 'About page for JSON to Table converter tool',
  mainEntity: {
    '@type': 'Organization',
    name: 'JSON to Table',
    description: 'Free browser-based JSON to Excel and CSV converter',
    url: 'https://jsontotable.app',
  },
})
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
      About JSON to Table
    </h1>
    <p class="text-gray-500 dark:text-gray-400 mb-6 text-sm">
      A free, privacy-first tool for converting JSON data to Excel and CSV formats.
    </p>

    <div class="space-y-6">
      <!-- Privacy -->
      <section class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-5">
        <h2 class="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {{ t('about.privacy.title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('about.privacy.body') }}
        </p>
      </section>

      <!-- How It Works -->
      <section class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-5">
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          How It Works
        </h2>
        <div class="space-y-3">
          <div>
            <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-1">
              Browser-Side Processing
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              All JSON parsing, table generation, filtering, and file export runs entirely in your browser using JavaScript. No server-side processing is involved.
            </p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-1">
              No Account Required
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Open the website, paste your JSON, and download your file. No registration, no login, no data collection.
            </p>
          </div>
        </div>
      </section>

      <!-- Limits -->
      <section class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-5">
        <h2 class="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {{ t('about.limits.title') }}
        </h2>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
          <li>{{ t('about.limits.size') }}</li>
          <li>{{ t('about.limits.browser') }}</li>
        </ul>
      </section>

      <!-- Tech Stack -->
      <section class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-5">
        <h2 class="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Built With
        </h2>
        <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          Vue 3, TypeScript, Vite, TanStack Table, TanStack Virtual, ExcelJS, Pinia, and UnoCSS.
          Open source libraries power the conversion engine; your data stays local.
        </p>
      </section>

      <!-- Back link -->
      <div>
        <RouterLink
          to="/"
          class="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          <span class="mr-1">&larr;</span>
          {{ t('about.back') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>
