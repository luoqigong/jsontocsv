import { describe, it, expect } from 'vitest'
import { applyColumnTransform, formatValue } from '../transform'
import type { FlatRow, ColumnMeta } from '@/types'

describe('applyColumnTransform', () => {
  it('reorders columns', () => {
    const rows: FlatRow[] = [{ a: 1, b: 2, c: 3 }]
    const columns: ColumnMeta[] = [
      { key: 'c', name: 'c', type: 'integer', hidden: false },
      { key: 'a', name: 'a', type: 'integer', hidden: false },
      { key: 'b', name: 'b', type: 'integer', hidden: false },
    ]
    const result = applyColumnTransform(rows, columns)
    expect(Object.keys(result[0])).toEqual(['c', 'a', 'b'])
  })

  it('hides columns', () => {
    const rows: FlatRow[] = [{ a: 1, b: 2 }]
    const columns: ColumnMeta[] = [
      { key: 'a', name: 'a', type: 'integer', hidden: false },
      { key: 'b', name: 'b', type: 'integer', hidden: true },
    ]
    const result = applyColumnTransform(rows, columns)
    expect(Object.keys(result[0])).toEqual(['a'])
  })

  it('uses custom names', () => {
    const rows: FlatRow[] = [{ a: 1 }]
    const columns: ColumnMeta[] = [
      { key: 'a', name: 'Custom A', type: 'integer', hidden: false },
    ]
    const result = applyColumnTransform(rows, columns)
    expect(result[0]).toHaveProperty('Custom A')
    expect(result[0]['Custom A']).toBe(1)
  })

  it('formats date to YYYY-MM-DD', () => {
    const rows: FlatRow[] = [{ d: '2024-01-15T10:30:00Z' }]
    const columns: ColumnMeta[] = [
      { key: 'd', name: 'd', type: 'date', hidden: false, format: 'YYYY-MM-DD' },
    ]
    const result = applyColumnTransform(rows, columns)
    expect(result[0].d).toBe('2024-01-15')
  })

  it('formats decimal to 2 places', () => {
    const rows: FlatRow[] = [{ v: 1.234 }]
    const columns: ColumnMeta[] = [
      { key: 'v', name: 'v', type: 'decimal', hidden: false, format: '.2' },
    ]
    const result = applyColumnTransform(rows, columns)
    expect(result[0].v).toBe('1.23')
  })

  it('handles null as empty string', () => {
    const rows: FlatRow[] = [{ a: null }]
    const columns: ColumnMeta[] = [
      { key: 'a', name: 'a', type: 'text', hidden: false },
    ]
    const result = applyColumnTransform(rows, columns)
    expect(result[0].a).toBe('')
  })
})

describe('formatValue', () => {
  it('returns empty string for null', () => {
    expect(formatValue(null, 'text')).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(formatValue(undefined, 'text')).toBe('')
  })
})
