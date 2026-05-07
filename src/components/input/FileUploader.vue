<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  load: [content: string]
}>()

const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const MAX_SIZE = 50 * 1024 * 1024 // 50MB
const ACCEPT_TYPES = '.json,.jsonl,.txt'

function handleFile(file: File) {
  if (file.size > MAX_SIZE) {
    alert('文件大小超过 50MB 限制 / File size exceeds 50MB limit')
    return
  }
  file.text().then((content) => {
    emit('load', content)
  }).catch((err) => {
    alert('读取文件失败 / Failed to read file: ' + err.message)
  })
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) {
    handleFile(file)
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    handleFile(file)
  }
}

function onClick() {
  fileInputRef.value?.click()
}
</script>

<template>
  <div
    class="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed p-10 text-center transition-all"
    :class="isDragging
      ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10 dark:bg-primary-900/20'
      : 'border-slate-300 bg-slate-50/80 hover:border-primary-300 hover:bg-white dark:border-gray-700 dark:bg-gray-900/60 dark:hover:border-primary-700 dark:hover:bg-gray-900'"
    @click="onClick"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
  >
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      :accept="ACCEPT_TYPES"
      @change="onFileChange"
    >
    <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-sm ring-1 ring-slate-200 dark:bg-gray-800 dark:text-primary-300 dark:ring-gray-700">
      <div class="i-carbon-upload text-4xl" />
    </div>
    <p class="mt-5 text-base font-medium text-slate-800 dark:text-gray-100">
      拖拽文件到此处，或点击上传
    </p>
    <p class="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-gray-400">
      支持将本地文件直接载入当前工作区，无需上传到服务器。
    </p>
    <p class="mt-3 text-xs text-slate-400 dark:text-gray-500">
      支持 .json, .jsonl, .txt (最大 50MB)
    </p>
  </div>
</template>
