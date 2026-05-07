<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import { useSchema } from '@/composables/useSchema'

const { t } = useI18n()

usePageMeta({
  title: 'Contact Us | JSON to Table - Free JSON to Excel & CSV Converter',
  description: 'Contact the JSON to Table team for questions, feedback, or bug reports. We typically respond within 24-48 hours.',
})

useSchema({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact JSON to Table',
  description: 'Contact page for JSON to Table converter tool',
  mainEntity: {
    '@type': 'Organization',
    name: 'JSON to Table',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@manytools.cc',
      availableLanguage: ['English', 'Chinese'],
    },
  },
})
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
      {{ t('contact.title') }}
    </h1>
    <p class="text-gray-600 dark:text-gray-400 mb-8">
      {{ t('contact.desc') }}
    </p>

    <div class="space-y-6">
      <section class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-5">
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('contact.emailTitle') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          {{ t('contact.emailDesc') }}
        </p>
        <a
          href="mailto:support@manytools.cc"
          class="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          support@manytools.cc
        </a>
      </section>

      <section class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-5">
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('contact.responseTime') }}
        </h2>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
          <li>{{ t('contact.bugReports') }}</li>
          <li>{{ t('contact.featureRequests') }}</li>
          <li>{{ t('contact.generalQuestions') }}</li>
        </ul>
      </section>

      <section class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-5">
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('contact.beforeContact') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('contact.beforeContactDesc') }}
        </p>
      </section>

      <div>
        <RouterLink
          to="/"
          class="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          <span class="mr-1">&larr;</span>
          {{ t('contact.back') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>
