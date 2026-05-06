import type { FlatRow, FilterCondition } from '@/types'

function compareNumeric(a: unknown, b: string, op: '>' | '<' | '>=' | '<='): boolean {
  const numA = parseFloat(String(a))
  const numB = parseFloat(b)
  if (Number.isNaN(numA) || Number.isNaN(numB)) {
    return false
  }
  switch (op) {
    case '>':
      return numA > numB
    case '<':
      return numA < numB
    case '>=':
      return numA >= numB
    case '<=':
      return numA <= numB
  }
}

function evaluateCondition(row: FlatRow, condition: FilterCondition): boolean {
  const rawValue = row[condition.column]
  const strValue = rawValue === null || rawValue === undefined ? '' : String(rawValue)

  switch (condition.operator) {
    case '=': {
      // Strict equality: compare as string for consistency
      return strValue === condition.value
    }
    case '!=': {
      return strValue !== condition.value
    }
    case '>':
    case '<':
    case '>=':
    case '<=': {
      return compareNumeric(rawValue, condition.value, condition.operator)
    }
    case 'contains': {
      return strValue.toLowerCase().includes(condition.value.toLowerCase())
    }
    case 'starts with': {
      return strValue.toLowerCase().startsWith(condition.value.toLowerCase())
    }
    case 'regex': {
      try {
        const re = new RegExp(condition.value, 'i')
        return re.test(strValue)
      } catch {
        return false
      }
    }
    default:
      return true
  }
}

export function applyFilters(rows: FlatRow[], conditions: FilterCondition[]): FlatRow[] {
  if (conditions.length === 0) {
    return rows
  }
  return rows.filter((row) => conditions.every((cond) => evaluateCondition(row, cond)))
}
