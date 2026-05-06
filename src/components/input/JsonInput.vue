<script setup lang="ts">
import { ref } from 'vue'
import { useDataStore } from '@/stores/data'
import AppButton from '@/components/common/AppButton.vue'
import FileUploader from './FileUploader.vue'

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
  <div class="flex flex-col gap-3">
    <!-- Tabs -->
    <div class="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
      <button
        class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer"
        :class="activeTab === 'paste'
          ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
        @click="activeTab = 'paste'"
      >
        粘贴 / Paste
      </button>
      <button
        class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer"
        :class="activeTab === 'upload'
          ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
        @click="activeTab = 'upload'"
      >
        上传文件 / Upload
      </button>
    </div>

    <!-- Paste Tab -->
    <div v-if="activeTab === 'paste'" class="flex flex-col gap-2">
      <textarea
        :value="dataStore.rawInput"
        class="h-64 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm text-gray-900 focus:border-primary-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        placeholder="在此粘贴 JSON 数据... / Paste JSON data here..."
        @input="onTextareaInput"
      />
      <p v-if="dataStore.parseError" class="text-sm text-red-500">
        {{ dataStore.parseError }}
      </p>
    </div>

    <!-- Upload Tab -->
    <div v-else>
      <FileUploader @load="onFileLoaded" />
    </div>

    <!-- Examples -->
    <div class="flex flex-wrap gap-2">
      <AppButton size="sm" variant="secondary" @click="loadExample('flatArray')">
        Flat Array
      </AppButton>
      <AppButton size="sm" variant="secondary" @click="loadExample('nested')">
        Nested
      </AppButton>
      <AppButton size="sm" variant="secondary" @click="loadExample('apiWrap')">
        API Wrap
      </AppButton>
      <AppButton size="sm" variant="secondary" @click="loadExample('jsonLines')">
        JSON Lines
      </AppButton>
    </div>
  </div>
</template>
