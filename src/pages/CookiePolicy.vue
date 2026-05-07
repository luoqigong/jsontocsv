<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { usePageMeta } from '@/composables/usePageMeta'
import { useSchema } from '@/composables/useSchema'

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
      Cookie Policy
    </h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
      Last updated: May 7, 2026
    </p>

    <div class="space-y-8">
      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          1. What Are Cookies?
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          Cookies are small text files that websites place on your computer or mobile device
          when you visit them. They are widely used to make websites work more efficiently
          and to provide information to the website owners.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          2. Our Approach: Minimal by Design
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          JSON to Table takes a minimal approach to data storage. We do not use traditional
          HTTP cookies for tracking, analytics, or advertising. Instead, we use your browser's
          localStorage for a small set of essential preferences, as described below.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          3. What We Store (and Why)
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-600 dark:text-gray-300 border dark:border-gray-700 rounded-lg">
            <thead class="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold">
              <tr>
                <th class="px-4 py-3">Storage Key</th>
                <th class="px-4 py-3">Purpose</th>
                <th class="px-4 py-3">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t dark:border-gray-700">
                <td class="px-4 py-3 font-mono">j2t-locale</td>
                <td class="px-4 py-3">Remember your language preference (Chinese or English)</td>
                <td class="px-4 py-3">Essential preference</td>
              </tr>
              <tr class="border-t dark:border-gray-700">
                <td class="px-4 py-3 font-mono">j2t-cookie-consent</td>
                <td class="px-4 py-3">Record your cookie consent choice</td>
                <td class="px-4 py-3">Essential compliance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          4. What We Do Not Use
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          We explicitly do not use:
        </p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
          <li>Analytics cookies (Google Analytics, Mixpanel, etc.)</li>
          <li>Advertising or targeting cookies</li>
          <li>Social media tracking pixels</li>
          <li>Third-party session cookies</li>
          <li>Cross-site tracking mechanisms</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          5. How to Manage or Clear Stored Data
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          You can clear all locally stored data at any time through your browser settings:
        </p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mt-2">
          <li><strong>Chrome:</strong> Settings &gt; Privacy and security &gt; Clear browsing data</li>
          <li><strong>Firefox:</strong> Settings &gt; Privacy & Security &gt; Clear Data</li>
          <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
          <li><strong>Edge:</strong> Settings &gt; Privacy, search, and services &gt; Clear browsing data</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          6. Contact
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          If you have any questions about our cookie policy, please contact us at
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
          Back to Tool
        </RouterLink>
      </div>
    </div>
  </div>
</template>
