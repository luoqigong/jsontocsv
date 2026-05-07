<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import { useSchema } from '@/composables/useSchema'

const { t, tm, rt } = useI18n()

usePageMeta({
  title: 'Terms of Service | JSON to Table - Free JSON to Excel & CSV Converter',
  description: 'Terms of service for JSON to Table. By using this free online tool, you agree to these terms regarding data privacy, acceptable use, and liability.',
})

useSchema({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Terms of Service',
  description: 'Terms of service for JSON to Table converter tool',
})
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
      {{ t('terms.title') }}
    </h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
      {{ t('terms.lastUpdated', { date: '2026-05-07' }) }}
    </p>

    <div class="space-y-8">
      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('terms.section1Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('terms.section1Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('terms.section2Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('terms.section2Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('terms.section3Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('terms.section3Desc') }}
          <RouterLink to="/privacy" class="text-primary-600 dark:text-primary-400 hover:underline">
            {{ t('app.nav.privacy') }}
          </RouterLink>.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('terms.section4Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          {{ t('terms.section4Desc') }}
        </p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
          <li v-for="item in tm('terms.section4List')" :key="item">{{ rt(item) }}</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('terms.section5Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('terms.section5Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('terms.section6Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('terms.section6Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('terms.section7Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('terms.section7Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('terms.section8Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('terms.section8Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('terms.section9Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('terms.section9Desc') }}
          <a href="mailto:support@manytools.cc" class="text-primary-600 dark:text-primary-400 hover:underline">
            support@manytools.cc
          </a>.
        </p>
      </section>

      <div>
        <RouterLink
          to="/"
          class="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          <span class="mr-1">&larr;</span>
          {{ t('terms.back') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>
