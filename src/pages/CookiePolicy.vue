<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import { useSchema } from '@/composables/useSchema'

const { t, tm, rt } = useI18n()

usePageMeta({
  title: 'Cookie Policy | JSON to Table - No Tracking Cookies',
  description: 'JSON to Table cookie policy: we do not use tracking or advertising cookies. Only essential localStorage preferences are stored on your device.',
})

useSchema({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Cookie Policy',
  description: 'Cookie policy for JSON to Table converter tool',
})
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
      {{ t('cookies.title') }}
    </h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
      {{ t('cookies.lastUpdated', { date: '2026-05-07' }) }}
    </p>

    <div class="space-y-8">
      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('cookies.section1Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('cookies.section1Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('cookies.section2Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('cookies.section2Desc') }}
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('cookies.section3Title') }}
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-600 dark:text-gray-300 border dark:border-gray-700 rounded-lg">
            <thead class="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold">
              <tr>
                <th class="px-4 py-3">{{ t('cookies.tableKey') }}</th>
                <th class="px-4 py-3">{{ t('cookies.tablePurpose') }}</th>
                <th class="px-4 py-3">{{ t('cookies.tableType') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t dark:border-gray-700">
                <td class="px-4 py-3 font-mono">{{ t('cookies.localeKey') }}</td>
                <td class="px-4 py-3">{{ t('cookies.localePurpose') }}</td>
                <td class="px-4 py-3">{{ t('cookies.localeType') }}</td>
              </tr>
              <tr class="border-t dark:border-gray-700">
                <td class="px-4 py-3 font-mono">{{ t('cookies.consentKey') }}</td>
                <td class="px-4 py-3">{{ t('cookies.consentPurpose') }}</td>
                <td class="px-4 py-3">{{ t('cookies.consentType') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('cookies.section4Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          {{ t('cookies.section4Desc') }}
        </p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
          <li v-for="item in tm('cookies.section4List')" :key="item">{{ rt(item) }}</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('cookies.section5Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('cookies.section5Desc') }}
        </p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mt-2">
          <li><strong>Chrome:</strong> {{ t('cookies.chrome') }}</li>
          <li><strong>Firefox:</strong> {{ t('cookies.firefox') }}</li>
          <li><strong>Safari:</strong> {{ t('cookies.safari') }}</li>
          <li><strong>Edge:</strong> {{ t('cookies.edge') }}</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {{ t('cookies.section6Title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ t('cookies.section6Desc') }}
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
          {{ t('cookies.back') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>
