import type { FlatRow, ColumnMeta, JsonValue } from '@/types'

export function formatValue(
  value: unknown,
  type: ColumnMeta['type'],
  format?: string,
): JsonValue | undefined {
  if (value === null || value === undefined) {
    return ''
  }

  switch (type) {
    case 'date': {
      if (typeof value !== 'string') {
        return String(value)
      }
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return value
      }
      if (format === 'YYYY-MM-DD') {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
      }
      if (format === 'timestamp') {
        return date.getTime()
      }
      if (format === 'ISO') {
        return date.toISOString()
      }
      return value
    }
    case 'integer': {
      const n = Number(value)
      return Number.isNaN(n) ? String(value) : Math.floor(n)
    }
    case 'decimal': {
      const n = Number(value)
      if (Number.isNaN(n)) {
        return String(value)
      }
      if (format) {
        const match = format.match(/^\.(\d+)$/)
        if (match) {
          const digits = parseInt(match[1], 10)
          return n.toFixed(digits)
        }
      }
      return n
    }
    case 'boolean': {
      return Boolean(value)
    }
    case 'text':
    default:
      return String(value)
  }
}

export function applyColumnTransform(
  rows: FlatRow[],
  columns: ColumnMeta[],
): FlatRow[] {
  const visibleColumns = columns.filter((col) => !col.hidden)

  return rows.map((row) => {
    const newRow: FlatRow = {}
    for (const col of visibleColumns) {
      const rawValue = row[col.key]
      newRow[col.name] = formatValue(rawValue, col.type, col.format)
    }
    return newRow
  })
}
