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
    class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer"
    :class="isDragging
      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
      : 'border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750'"
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
    <div class="i-carbon-upload text-4xl text-gray-400 dark:text-gray-500" />
    <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
      拖拽文件到此处，或点击上传
    </p>
    <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
      支持 .json, .jsonl, .txt (最大 50MB)
    </p>
  </div>
</template>
