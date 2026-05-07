<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { usePageMeta } from '@/composables/usePageMeta'
import { useSchema } from '@/composables/useSchema'

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
      Contact Us
    </h1>
    <p class="text-gray-600 dark:text-gray-400 mb-8">
      Have a question, suggestion, or found a bug? We would love to hear from you.
    </p>

    <div class="space-y-6">
      <section class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-5">
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Email Support
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          For general inquiries, bug reports, or feature requests, send us an email.
          We typically respond within 24-48 hours.
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
          Response Time
        </h2>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
          <li>Bug reports: within 24 hours</li>
          <li>Feature requests: within 48 hours</li>
          <li>General questions: within 48 hours</li>
        </ul>
      </section>

      <section class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-5">
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Before You Contact Us
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          JSON to Table is a 100% client-side tool. We do not have access to your data,
          nor can we recover lost conversions. If you are experiencing issues with a specific
          JSON file, please include a minimal sample that reproduces the problem.
        </p>
      </section>

      <div>
        <RouterLink
          to="/"
          class="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          <span class="mr-1">&larr;</span>
          Back to Tool
        </RouterLink>
      </div>
    </div>
  </div>
</template>
