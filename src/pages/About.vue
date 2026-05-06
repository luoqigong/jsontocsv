<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
      {{ t('about.title') }}
    </h1>

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
