import { describe, it, expect } from 'vitest'
import { applyFilters } from '../filter'
import type { FlatRow, FilterCondition } from '@/types'

describe('applyFilters', () => {
  it('filters by contains', () => {
    const rows: FlatRow[] = [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
    ]
    const conditions: FilterCondition[] = [
      { column: 'name', operator: 'contains', value: 'li' },
    ]
    const result = applyFilters(rows, conditions)
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.name)).toContain('Alice')
    expect(result.map((r) => r.name)).toContain('Charlie')
  })

  it('filters by equals', () => {
    const rows: FlatRow[] = [{ age: 25 }, { age: 30 }]
    const conditions: FilterCondition[] = [
      { column: 'age', operator: '=', value: '25' },
    ]
    const result = applyFilters(rows, conditions)
    expect(result).toHaveLength(1)
    expect(result[0].age).toBe(25)
  })

  it('filters by greater than', () => {
    const rows: FlatRow[] = [{ age: 20 }, { age: 30 }]
    const conditions: FilterCondition[] = [
      { column: 'age', operator: '>', value: '22' },
    ]
    const result = applyFilters(rows, conditions)
    expect(result).toHaveLength(1)
    expect(result[0].age).toBe(30)
  })

  it('filters by regex', () => {
    const rows: FlatRow[] = [{ name: 'Alice' }, { name: 'Bob' }]
    const conditions: FilterCondition[] = [
      { column: 'name', operator: 'regex', value: '^A' },
    ]
    const result = applyFilters(rows, conditions)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice')
  })

  it('combines filters with AND', () => {
    const rows: FlatRow[] = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Alice', age: 30 },
    ]
    const conditions: FilterCondition[] = [
      { column: 'name', operator: '=', value: 'Alice' },
      { column: 'age', operator: '>', value: '25' },
    ]
    const result = applyFilters(rows, conditions)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice')
    expect(result[0].age).toBe(30)
  })
})
