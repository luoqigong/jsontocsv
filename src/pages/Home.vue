<script setup lang="ts">
import JsonInput from '@/components/input/JsonInput.vue'
import PathSelector from '@/components/PathSelector.vue'
import NestingPanel from '@/components/NestingPanel.vue'
import TableView from '@/components/tableView/TableView.vue'
import ColumnPanel from '@/components/ColumnPanel.vue'
import FilterBar from '@/components/FilterBar.vue'
import ExportPanel from '@/components/ExportPanel.vue'
import { usePageMeta } from '@/composables/usePageMeta'
import { useSchema } from '@/composables/useSchema'

usePageMeta({
  title: 'JSON to Table: Convert JSON to Excel & CSV Online — Free Browser Tool',
  description: 'Free online JSON to Excel and CSV converter. 100% client-side: your data never leaves your browser. Supports nested JSON, smart path detection, column editing, filtering, and styled Excel export.',
})

useSchema({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'JSON to Table',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Convert JSON to Excel',
    'Convert JSON to CSV',
    'Nested JSON flattening',
    'Smart path detection for API responses',
    'Column editing and reordering',
    'Row filtering with conditions',
    'Styled Excel export with headers and formatting',
    '100% client-side processing',
  ],
  author: {
    '@type': 'Organization',
    name: 'JSON to Table',
  },
})
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
    <section class="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/80 backdrop-blur-xl dark:border-gray-800/90 dark:bg-gray-900/80 dark:ring-gray-800/80">
      <div class="grid gap-8 px-6 py-7 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)] lg:px-8 lg:py-8">
        <div class="space-y-5">
          <div class="flex flex-wrap items-center gap-3 text-sm">
            <span class="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              <span class="h-2 w-2 rounded-full bg-emerald-500" />
              100% Client-Side
            </span>
            <span class="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 font-medium text-primary-700 dark:border-primary-800/70 dark:bg-primary-950/60 dark:text-primary-300">
              Excel / CSV Export
            </span>
            <span class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-medium text-slate-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Nested JSON Ready
            </span>
          </div>

          <div class="space-y-4">
            <h1 class="max-w-4xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
              JSON to Table: Convert JSON to Excel &amp; CSV Online
            </h1>
            <p class="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg dark:text-gray-300">
              Paste JSON, preview structured rows instantly, fine-tune columns and filters, then export polished Excel or CSV files without sending your data anywhere.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50/85 p-4 dark:border-gray-800 dark:bg-gray-950/70">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500">
                Workflow
              </p>
              <p class="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                Paste, configure, export in one screen
              </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50/85 p-4 dark:border-gray-800 dark:bg-gray-950/70">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500">
                Privacy
              </p>
              <p class="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                Data stays inside your browser session
              </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50/85 p-4 dark:border-gray-800 dark:bg-gray-950/70">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500">
                Structure
              </p>
              <p class="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                Handles flat, wrapped, nested, and JSONL input
              </p>
            </div>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div class="rounded-2xl border border-slate-200 bg-slate-50/90 p-5 dark:border-gray-800 dark:bg-gray-950/70">
            <p class="text-sm font-semibold text-slate-900 dark:text-white">
              Fast local workspace
            </p>
            <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">
              Built for large everyday API payloads with path detection, nested strategies, editable columns, and filterable preview tables.
            </p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-gradient-to-br from-primary-600 to-blue-700 p-5 text-white shadow-lg shadow-primary-600/20 dark:border-primary-700/40">
            <p class="text-sm font-semibold">
              Need the full privacy details?
            </p>
            <p class="mt-2 text-sm leading-6 text-white/85">
              Every transformation runs in-browser. No upload pipeline, no server processing.
            </p>
            <RouterLink
              to="/privacy"
              class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition-opacity hover:opacity-85"
            >
              Read Privacy Policy
              <span aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_340px]">
      <div class="min-w-0 grid gap-6">
        <div class="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div class="min-w-0 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_22px_70px_-38px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/80 backdrop-blur-xl dark:border-gray-800/90 dark:bg-gray-900/80 dark:ring-gray-800/80">
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-semibold text-slate-900 dark:text-white">
                  Data Input
                </p>
                <p class="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  Paste raw JSON, load an example, or drop a local file.
                </p>
              </div>
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                Step 1
              </span>
            </div>
            <JsonInput />
          </div>

          <div class="min-w-0 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_22px_70px_-38px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/80 backdrop-blur-xl dark:border-gray-800/90 dark:bg-gray-900/80 dark:ring-gray-800/80">
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-semibold text-slate-900 dark:text-white">
                  Structure Setup
                </p>
                <p class="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  Choose the array path and define how nested data should expand.
                </p>
              </div>
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                Step 2
              </span>
            </div>
            <div class="grid gap-4">
              <PathSelector />
              <NestingPanel />
            </div>
          </div>
        </div>

        <div class="min-w-0 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_80px_-38px_rgba(15,23,42,0.38)] ring-1 ring-slate-200/80 backdrop-blur-xl dark:border-gray-800/90 dark:bg-gray-900/80 dark:ring-gray-800/80">
          <div class="mb-4 flex flex-col gap-3 border-b border-slate-200/80 pb-4 dark:border-gray-800/90">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-sm font-semibold text-slate-900 dark:text-white">
                  Preview &amp; Filters
                </p>
                <p class="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  Search, refine, and inspect the resulting table before export.
                </p>
              </div>
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                Step 3
              </span>
            </div>
            <FilterBar />
          </div>

          <div class="min-h-[420px]">
            <TableView class="h-full min-h-[420px]" />
          </div>
        </div>
      </div>

      <aside class="min-w-0 grid gap-6 self-start xl:sticky xl:top-24">
        <div class="min-w-0 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.38)] ring-1 ring-slate-200/80 backdrop-blur-xl dark:border-gray-800/90 dark:bg-gray-900/80 dark:ring-gray-800/80">
          <div class="mb-4 flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-slate-900 dark:text-white">
                Column Manager
              </p>
              <p class="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Rename, show or hide columns, and adjust detected data types.
              </p>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-gray-300">
              Step 4
            </span>
          </div>
          <ColumnPanel />
        </div>

        <div class="min-w-0 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.38)] ring-1 ring-slate-200/80 backdrop-blur-xl dark:border-gray-800/90 dark:bg-gray-900/80 dark:ring-gray-800/80">
          <div class="mb-4 flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-slate-900 dark:text-white">
                Export Studio
              </p>
              <p class="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Finalize CSV options or export a styled Excel workbook.
              </p>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-gray-300">
              Step 5
            </span>
          </div>
          <ExportPanel />
        </div>
      </aside>
    </section>

    <details class="group overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.34)] ring-1 ring-slate-200/80 backdrop-blur-xl dark:border-gray-800/90 dark:bg-gray-900/80 dark:ring-gray-800/80" open>
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left">
        <div>
          <p class="text-sm font-semibold text-slate-900 dark:text-white">
            How It Works &amp; FAQ
          </p>
          <p class="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Understand the supported input structures, nested handling, and export options.
          </p>
        </div>
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-transform duration-200 group-open:rotate-180 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </summary>

      <div class="border-t border-slate-200/80 px-6 pb-8 pt-6 dark:border-gray-800/90">
        <section class="grid gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-slate-200 bg-slate-50/85 p-5 dark:border-gray-800 dark:bg-gray-950/70">
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">
              Step 1: Paste or Upload Your JSON Data
            </h2>
            <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-gray-300">
              Paste JSON directly into the text area, or use JSON Lines (JSONL). The tool accepts arrays, nested objects, and API-wrapped responses.
            </p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50/85 p-5 dark:border-gray-800 dark:bg-gray-950/70">
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">
              Step 2: Configure Columns and Filters
            </h2>
            <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-gray-300">
              Rename columns, reorder their meaning through type selection, hide unused fields, and add filter conditions to focus on matching rows.
            </p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50/85 p-5 dark:border-gray-800 dark:bg-gray-950/70">
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">
              Step 3: Download Excel or CSV File
            </h2>
            <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-gray-300">
              Export styled Excel files with formatting or generate CSV output with your preferred delimiter, header behavior, and BOM settings.
            </p>
          </div>
        </section>

        <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section class="space-y-4">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">
                Convert Nested JSON to Excel Without Coding
              </h2>
              <p class="mt-2 break-words text-sm leading-6 text-slate-600 dark:text-gray-300">
                Objects like <code class="rounded bg-slate-100 px-1.5 py-0.5 break-all dark:bg-gray-800">{"user": {"name": "Alice"}}</code> become columns <code class="rounded bg-slate-100 px-1.5 py-0.5 break-all dark:bg-gray-800">user.name</code> automatically. No manual transformation needed.
              </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50/85 p-5 dark:border-gray-800 dark:bg-gray-950/70">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
                Handle Array Fields with 4 Built-In Strategies
              </h3>
              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">
                Choose <strong>Flatten</strong>, <strong>Stringify</strong>, <strong>Explode</strong>, or <strong>Multi-Sheet</strong> depending on whether you want dot-notation columns, JSON text, extra rows, or separate worksheets.
              </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50/85 p-5 dark:border-gray-800 dark:bg-gray-950/70">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
                JSON to CSV: Custom Delimiters and UTF-8 BOM
              </h3>
              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">
                Export CSV with comma, semicolon, tab, or pipe delimiters. Include headers, enable UTF-8 BOM for Excel on Windows, and export only filtered rows when needed.
              </p>
            </div>
          </section>

          <section class="space-y-4">
            <div class="rounded-2xl border border-primary-200 bg-primary-50/85 p-5 dark:border-primary-800/60 dark:bg-primary-950/40">
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">
                Is My JSON Data Safe?
              </h2>
              <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-gray-300">
                All parsing, transformation, filtering, and export operations happen inside your browser. Your JSON data is never uploaded to a server or stored remotely.
              </p>
              <RouterLink to="/privacy" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:underline dark:text-primary-300">
                Read the Privacy Policy
                <span aria-hidden="true">→</span>
              </RouterLink>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50/85 p-5 dark:border-gray-800 dark:bg-gray-950/70">
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">
                What JSON Formats Are Supported?
              </h2>
              <div class="mt-4 space-y-4">
                <div>
                  <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
                    Standard JSON Arrays
                  </h3>
                  <p class="mt-1 break-words text-sm leading-6 text-slate-600 dark:text-gray-300">
                    Arrays of objects with flat or nested properties, such as <code class="rounded bg-slate-100 px-1.5 py-0.5 break-all dark:bg-gray-800">[{"id": 1, "name": "Alice"}, ...]</code>.
                  </p>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
                    API Response Wrappers
                  </h3>
                  <p class="mt-1 break-words text-sm leading-6 text-slate-600 dark:text-gray-300">
                    The tool detects paths such as <code class="rounded bg-slate-100 px-1.5 py-0.5 break-all dark:bg-gray-800">data.list</code> from wrapped payloads like <code class="rounded bg-slate-100 px-1.5 py-0.5 break-all dark:bg-gray-800">{"code": 200, "data": {"list": [...]}}</code>.
                  </p>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
                    JSON Lines (JSONL)
                  </h3>
                  <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-gray-300">
                    One JSON object per line for logs or streams. JSONL is detected automatically and normalized into a table.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </details>
  </div>
</template>
