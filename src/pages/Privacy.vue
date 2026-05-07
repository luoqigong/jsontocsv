<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import { useSchema } from '@/composables/useSchema'

const { t, tm, rt } = useI18n()

usePageMeta({
  title: 'Privacy Policy | JSON to Table - Your Data Stays in Your Browser',
  description: 'JSON to Table privacy policy: all data processing happens 100% in your browser. We never collect, store, or transmit your JSON data to any server.',
})

useSchema({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Privacy Policy',
  description: 'Privacy policy for JSON to Table converter tool',
})
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
      {{ t('privacy.title') }}
    </h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
      {{ t('privacy.lastUpdated', { date: '2026-05-07' }) }}
    </p>

    <div class="space-y-8">
      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('privacy.section1Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('privacy.section1Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('privacy.section2Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          {{ t('privacy.section2Desc') }}
        </p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
          <li v-for="item in tm('privacy.section2List')" :key="item">{{ rt(item) }}</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('privacy.section3Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('privacy.section3Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('privacy.section4Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('privacy.section4Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('privacy.section5Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('privacy.section5Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('privacy.section6Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('privacy.section6Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('privacy.section7Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('privacy.section7Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('privacy.section8Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('privacy.section8Desc') }}
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
          {{ t('privacy.back') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>
