<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { usePageMeta } from '@/composables/usePageMeta'
import { useSchema } from '@/composables/useSchema'

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
      Terms of Service
    </h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
      Last updated: May 7, 2026
    </p>

    <div class="space-y-8">
      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          1. Acceptance of Terms
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          By accessing and using JSON to Table ("the Service"), you accept and agree to be bound
          by these Terms of Service. If you do not agree to these terms, please do not use the Service.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          2. Description of Service
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          JSON to Table is a free, browser-based tool that allows users to convert JSON data into
          table formats (CSV and Excel). All processing occurs client-side in your browser.
          No account registration is required.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          3. Privacy and Data Security
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          We do not collect, store, or have access to any data you process through the Service.
          All JSON parsing, transformation, and export operations happen entirely within your browser.
          For full details, please refer to our
          <RouterLink to="/privacy" class="text-primary-600 dark:text-primary-400 hover:underline">
            Privacy Policy
          </RouterLink>.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          4. Acceptable Use
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          You agree to use the Service only for lawful purposes. You may not:
        </p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
          <li>Use the Service to process data that violates any applicable laws or regulations</li>
          <li>Attempt to interfere with or disrupt the Service or its infrastructure</li>
          <li>Use automated scripts or bots to access the Service in ways that place unreasonable load on our systems</li>
          <li>Reverse engineer or attempt to extract the source code of the Service</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          5. Intellectual Property
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          The Service, including its code, design, and branding, is the property of JSON to Table.
          You retain all rights to the data you process through the Service. We claim no ownership
          over your JSON data, CSV files, or Excel exports.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          6. Limitation of Liability
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          The Service is provided "as is" without warranties of any kind. Because all processing
          happens in your browser, we have no control over the accuracy of conversions or the
          integrity of your data. You are solely responsible for verifying the output before use.
          In no event shall we be liable for any damages arising from the use of the Service.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          7. Modifications to the Service
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
          We may also update these Terms of Service from time to time. Continued use of the Service
          after any changes constitutes acceptance of the updated terms.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          8. Governing Law
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          These terms shall be governed by and construed in accordance with applicable laws,
          without regard to conflict of law principles.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          9. Contact Information
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          For any questions about these Terms of Service, please contact us at
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
