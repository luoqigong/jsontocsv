import { onMounted, onUnmounted } from 'vue'

export function useSchema(schema: Record<string, unknown>) {
  onMounted(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    script.id = 'page-schema'
    document.head.appendChild(script)
  })

  onUnmounted(() => {
    const existing = document.getElementById('page-schema')
    if (existing) existing.remove()
  })
}
