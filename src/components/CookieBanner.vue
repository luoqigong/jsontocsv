<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const CONSENT_KEY = 'j2t-cookie-consent'
const visible = ref(false)

onMounted(() => {
  const saved = localStorage.getItem(CONSENT_KEY)
  if (!saved) {
    visible.value = true
  }
})

function accept() {
  localStorage.setItem(CONSENT_KEY, 'accepted')
  visible.value = false
}

function dismiss() {
  localStorage.setItem(CONSENT_KEY, 'dismissed')
  visible.value = false
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="visible"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg px-4 py-4 md:py-3"
    >
      <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div class="flex-1 text-sm text-gray-600 dark:text-gray-300">
          <p>
            {{ t('app.cookieBanner') }}
            <RouterLink
              to="/cookies"
              class="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              {{ t('app.learnMore') }}
            </RouterLink>
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            @click="accept"
          >
            {{ t('app.accept') }}
          </button>
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            @click="dismiss"
          >
            {{ t('app.dismiss') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
