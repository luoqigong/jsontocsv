<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { usePageMeta } from '@/composables/usePageMeta'
import { useSchema } from '@/composables/useSchema'

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
      Privacy Policy
    </h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
      Last updated: May 7, 2026
    </p>

    <div class="space-y-8">
      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          1. Data Processing: 100% Client-Side
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          JSON to Table is designed with privacy as a core principle. All JSON parsing,
          table transformation, filtering, and export operations happen entirely within your
          web browser. Your data is never uploaded to, stored on, or processed by any server.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          2. What Data We Do Not Collect
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          We do not collect, store, or have access to:
        </p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
          <li>Any JSON data you paste, upload, or convert</li>
          <li>Your IP address or geolocation</li>
          <li>Your browser history or browsing behavior</li>
          <li>Any personally identifiable information (PII)</li>
          <li>Files you upload for conversion</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          3. Local Storage
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          We use your browser's localStorage to remember your preferences (language selection
          and dark/light mode). This data stays on your device and is never transmitted to us
          or any third party. You can clear this data at any time through your browser settings.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          4. Cookies and Analytics
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          We do not use tracking cookies, analytics services (such as Google Analytics),
          or advertising cookies. The only cookies or local storage items are those used
          for your interface preferences as described above.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          5. Third-Party Services
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          JSON to Table does not integrate with any third-party services that process your data.
          The application is hosted on Cloudflare Pages, which may log basic access information
          (such as IP addresses) for security and performance purposes. This is standard CDN
          logging and is not linked to your conversion activities.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          6. Your Rights
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          Because we do not collect or store your personal data, there is no data to access,
          modify, or delete on our servers. All your data remains under your control on your
          own device. You can clear all locally stored preferences at any time through your
          browser settings.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          7. Changes to This Policy
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          We may update this privacy policy from time to time. Any changes will be posted
          on this page with an updated revision date. We encourage you to review this policy
          periodically.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          8. Contact Us
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          If you have any questions about this privacy policy, please contact us at
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
