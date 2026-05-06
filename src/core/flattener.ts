import type { JsonObject, JsonValue, FlatRow, NestingStrategy } from '@/types'

export function flattenRows(rows: JsonObject[], strategy: NestingStrategy): FlatRow[] {
  switch (strategy) {
    case 'stringify':
      return rows.map((row) => stringifyRow(row))
    case 'explode':
      return explodeRows(rows)
    case 'multiSheet':
    case 'flatten':
    default:
      return rows.map((row) => flattenRow(row))
  }
}

function flattenRow(row: JsonObject, prefix = ''): FlatRow {
  const result: FlatRow = {}

  for (const key of Object.keys(row)) {
    const value = row[key]
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Nested object: recurse with dot prefix
      const nested = flattenRow(value, fullKey)
      Object.assign(result, nested)
    } else if (Array.isArray(value)) {
      // Array: JSON.stringify
      result[fullKey] = JSON.stringify(value)
    } else {
      // Primitive
      result[fullKey] = value
    }
  }

  return result
}

function stringifyRow(row: JsonObject): FlatRow {
  const result: FlatRow = {}

  for (const key of Object.keys(row)) {
    const value = row[key]
    if (value !== null && (typeof value === 'object' || Array.isArray(value))) {
      result[key] = JSON.stringify(value)
    } else {
      result[key] = value
    }
  }

  return result
}

function explodeRows(rows: JsonObject[]): FlatRow[] {
  const result: FlatRow[] = []

  for (const row of rows) {
    // Find first array field
    let arrayKey: string | undefined
    let arrayValues: JsonValue[] = []

    for (const key of Object.keys(row)) {
      const value = row[key]
      if (Array.isArray(value)) {
        arrayKey = key
        arrayValues = value
        break
      }
    }

    if (arrayKey !== undefined && arrayValues.length > 0) {
      // Explode: create one row per array element
      for (const item of arrayValues) {
        const base: FlatRow = {}
        for (const key of Object.keys(row)) {
          if (key === arrayKey) {
            base[key] = item
          } else if (row[key] !== null && typeof row[key] === 'object' && !Array.isArray(row[key])) {
            // Flatten nested objects in non-array fields
            const nested = flattenRow(row[key] as JsonObject, key)
            Object.assign(base, nested)
          } else if (Array.isArray(row[key])) {
            base[key] = JSON.stringify(row[key])
          } else {
            base[key] = row[key]
          }
        }
        result.push(base)
      }
    } else {
      // No array to explode: just flatten
      result.push(flattenRow(row))
    }
  }

  return result
}
