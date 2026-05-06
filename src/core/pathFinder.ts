import type { JsonValue, JsonObject, PathCandidate } from '@/types'

export function findPathCandidates(value: JsonValue): PathCandidate[] {
  const candidates: PathCandidate[] = []

  // Check root array
  if (Array.isArray(value) && value.length >= 2) {
    const allObjects = value.every((item) => item !== null && typeof item === 'object' && !Array.isArray(item))
    if (allObjects) {
      candidates.push({ path: '<root>', depth: 0, count: value.length })
    }
  }

  // Recursively scan nested objects
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    scanObject(value, '', 0, candidates)
  }

  // Sort: count descending, then depth ascending
  candidates.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    return a.depth - b.depth
  })

  return candidates
}

function scanObject(obj: JsonObject, prefix: string, depth: number, candidates: PathCandidate[]): void {
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    const path = prefix ? `${prefix}.${key}` : key

    if (Array.isArray(val) && val.length >= 2) {
      const allObjects = val.every((item) => item !== null && typeof item === 'object' && !Array.isArray(item))
      if (allObjects) {
        candidates.push({ path, depth: depth + 1, count: val.length })
      }
    }

    // Recurse into nested objects (but not arrays)
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      scanObject(val, path, depth + 1, candidates)
    }
  }
}

export function getArrayAtPath(value: JsonValue, path: string): JsonObject[] {
  if (path === '<root>') {
    if (Array.isArray(value)) {
      return value.filter((item): item is JsonObject =>
        item !== null && typeof item === 'object' && !Array.isArray(item)
      )
    }
    return []
  }

  const parts = path.split('.')
  let current: JsonValue = value

  for (const part of parts) {
    if (current !== null && typeof current === 'object' && !Array.isArray(current)) {
      current = current[part]
    } else {
      return []
    }
  }

  if (Array.isArray(current)) {
    return current.filter((item): item is JsonObject =>
      item !== null && typeof item === 'object' && !Array.isArray(item)
    )
  }

  return []
}
