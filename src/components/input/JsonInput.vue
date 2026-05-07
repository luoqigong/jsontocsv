<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataStore } from '@/stores/data'
import AppButton from '@/components/common/AppButton.vue'
import FileUploader from './FileUploader.vue'

const { t } = useI18n()
const dataStore = useDataStore()
const activeTab = ref<'paste' | 'upload'>('paste')

const examples = {
  flatArray: JSON.stringify([
    { id: 1, name: 'Alice', age: 30, city: 'Beijing' },
    { id: 2, name: 'Bob', age: 25, city: 'Shanghai' },
    { id: 3, name: 'Carol', age: 28, city: 'Shenzhen' },
  ], null, 2),
  nested: JSON.stringify([
    {
      id: 1,
      user: { name: 'Alice', email: 'alice@example.com' },
      tags: ['admin', 'active'],
    },
    {
      id: 2,
      user: { name: 'Bob', email: 'bob@example.com' },
      tags: ['user'],
    },
  ], null, 2),
  apiWrap: JSON.stringify({
    code: 200,
    message: 'success',
    data: {
      list: [
        { id: 1, title: 'Item 1', status: 'active' },
        { id: 2, title: 'Item 2', status: 'pending' },
      ],
      total: 2,
    },
  }, null, 2),
  jsonLines: [
    '{"id":1,"event":"click","time":"2024-01-01T00:00:00Z"}',
    '{"id":2,"event":"scroll","time":"2024-01-01T00:01:00Z"}',
    '{"id":3,"event":"submit","time":"2024-01-01T00:02:00Z"}',
  ].join('\n'),
}

function loadExample(key: keyof typeof examples) {
  dataStore.setInput(examples[key])
}

function onTextareaInput(e: Event) {
  dataStore.setInput((e.target as HTMLTextAreaElement).value)
}

function onFileLoaded(content: string) {
  dataStore.setInput(content)
  activeTab.value = 'paste'
}
</script>

<template>
  <div class="min-w-0 flex flex-col gap-4">
    <div class="min-w-0 flex gap-1 rounded-2xl border border-slate-200 bg-slate-100/90 p-1 dark:border-gray-700 dark:bg-gray-800/90">
      <button
        class="flex-1 cursor-pointer rounded-xl px-3 py-2 text-sm font-medium transition-all"
        :class="activeTab === 'paste'
          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600'
          : 'text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200'"
        @click="activeTab = 'paste'"
      >
        {{ t('input.paste') }}
      </button>
      <button
        class="flex-1 cursor-pointer rounded-xl px-3 py-2 text-sm font-medium transition-all"
        :class="activeTab === 'upload'
          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600'
          : 'text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200'"
        @click="activeTab = 'upload'"
      >
        {{ t('input.file') }}
      </button>
    </div>

    <div v-if="activeTab === 'paste'" class="min-w-0 flex flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-gray-500">
          {{ t('input.rawInput') }}
        </p>
        <p class="text-xs text-slate-500 dark:text-gray-400">
          {{ t('input.rawInputDesc') }}
        </p>
      </div>
      <textarea
        :value="dataStore.rawInput"
        class="box-border h-72 max-w-full w-full min-w-0 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4 font-mono text-sm leading-6 text-slate-900 shadow-inner outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-950/80 dark:text-gray-100 dark:focus:border-primary-500 dark:focus:ring-primary-900/30"
        :placeholder="t('input.placeholder')"
        @input="onTextareaInput"
      />
      <p v-if="dataStore.parseError" class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
        {{ dataStore.parseError }}
      </p>
    </div>

    <div v-else>
      <FileUploader @load="onFileLoaded" />
    </div>

    <div class="space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-gray-500">
          {{ t('input.quickExamples') }}
        </p>
        <p class="text-xs text-slate-500 dark:text-gray-400">
          {{ t('input.examplesDesc') }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <AppButton size="sm" variant="secondary" @click="loadExample('flatArray')">
          {{ t('input.samples.flat') }}
        </AppButton>
        <AppButton size="sm" variant="secondary" @click="loadExample('nested')">
          {{ t('input.samples.nested') }}
        </AppButton>
        <AppButton size="sm" variant="secondary" @click="loadExample('apiWrap')">
          {{ t('input.samples.api') }}
        </AppButton>
        <AppButton size="sm" variant="secondary" @click="loadExample('jsonLines')">
          {{ t('input.samples.jsonl') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>
