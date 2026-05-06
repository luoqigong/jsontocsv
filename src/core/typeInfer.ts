import type { FlatRow, ColumnMeta, JsonValue } from '@/types'

export function inferColumnTypes(rows: FlatRow[]): ColumnMeta[] {
  if (rows.length === 0) return []

  // Collect all unique keys
  const keySet = new Set<string>()
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      keySet.add(key)
    }
  }

  const keys = Array.from(keySet)
  const result: ColumnMeta[] = []

  for (const key of keys) {
    const values: JsonValue[] = []
    for (const row of rows) {
      if (key in row) {
        values.push(row[key])
      }
    }

    const type = inferType(values)
    result.push({
      key,
      name: key,
      type,
      hidden: false,
    })
  }

  return result
}

function inferType(values: JsonValue[]): ColumnMeta['type'] {
  if (values.length === 0) return 'text'

  // Filter out undefined
  const defined = values.filter((v) => v !== undefined)
  if (defined.length === 0) return 'text'

  // Check if all are the same primitive type
  const types = new Set(defined.map((v) => typeof v))

  // All boolean
  if (types.size === 1 && defined.every((v) => typeof v === 'boolean')) {
    return 'boolean'
  }

  // All number
  if (types.size === 1 && defined.every((v) => typeof v === 'number')) {
    if (defined.every((v) => Number.isInteger(v as number))) {
      return 'integer'
    }
    return 'decimal'
  }

  // All string: check for date pattern
  if (types.size === 1 && defined.every((v) => typeof v === 'string')) {
    if (defined.every((v) => isIsoDateString(v as string))) {
      return 'date'
    }
    return 'text'
  }

  // Mixed types or objects/arrays
  return 'text'
}

function isIsoDateString(value: string): boolean {
  // ISO 8601 patterns:
  // 2024-01-15T10:30:00Z
  // 2024-01-15T10:30:00+08:00
  // 2024-01-15T10:30:00.000Z
  // 2024-01-15
  const isoPattern = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?)?$/
  if (!isoPattern.test(value)) return false

  const date = new Date(value)
  return !isNaN(date.getTime())
}
