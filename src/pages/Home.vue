<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import JsonInput from '@/components/input/JsonInput.vue'
import FileUploader from '@/components/input/FileUploader.vue'
import PathSelector from '@/components/PathSelector.vue'
import NestingPanel from '@/components/NestingPanel.vue'
import TableView from '@/components/tableView/TableView.vue'
import ColumnPanel from '@/components/ColumnPanel.vue'
import FilterBar from '@/components/FilterBar.vue'
import ExportPanel from '@/components/ExportPanel.vue'

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-3.25rem)]">
    <!-- Privacy Badge -->
    <div class="bg-green-600 text-white text-center text-sm py-1.5 px-4 flex items-center justify-center gap-2">
      <span>{{ t('app.privacyBadge') }}</span>
      <RouterLink to="/about" class="underline hover:text-green-100">
        {{ t('app.learnMore') }}
      </RouterLink>
    </div>

    <!-- Three-column workspace -->
    <div class="flex flex-1 overflow-hidden gap-3 p-3 bg-gray-50 dark:bg-gray-950">
      <!-- Left column: input controls -->
      <div class="flex flex-col gap-3 w-1/3 min-w-[280px] max-w-[420px] overflow-y-auto">
        <JsonInput />
        <FileUploader />
        <PathSelector />
        <NestingPanel />
      </div>

      <!-- Middle column: table view -->
      <div class="flex-1 flex flex-col gap-3 min-w-[300px] overflow-hidden">
        <FilterBar />
        <TableView class="flex-1 overflow-hidden" />
      </div>

      <!-- Right column: column & export panels -->
      <div class="flex flex-col gap-3 w-64 min-w-[240px] max-w-[300px] overflow-y-auto">
        <ColumnPanel />
        <ExportPanel />
      </div>
    </div>
  </div>
</template>
