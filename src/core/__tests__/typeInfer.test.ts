import { describe, it, expect } from 'vitest'
import { inferColumnTypes } from '../typeInfer'
import type { FlatRow } from '@/types'

describe('inferColumnTypes', () => {
  it('infers text for strings', () => {
    const rows: FlatRow[] = [{ name: 'Alice' }, { name: 'Bob' }]
    const result = inferColumnTypes(rows)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ key: 'name', name: 'name', type: 'text', hidden: false })
  })

  it('infers integer for whole numbers', () => {
    const rows: FlatRow[] = [{ count: 1 }, { count: 2 }]
    const result = inferColumnTypes(rows)
    expect(result[0].type).toBe('integer')
  })

  it('infers decimal for floats', () => {
    const rows: FlatRow[] = [{ price: 1.5 }]
    const result = inferColumnTypes(rows)
    expect(result[0].type).toBe('decimal')
  })

  it('infers boolean', () => {
    const rows: FlatRow[] = [{ active: true }, { active: false }]
    const result = inferColumnTypes(rows)
    expect(result[0].type).toBe('boolean')
  })

  it('infers date for ISO strings', () => {
    const rows: FlatRow[] = [{ created: '2024-01-15T10:30:00Z' }]
    const result = inferColumnTypes(rows)
    expect(result[0].type).toBe('date')
  })

  it('handles mixed types as text', () => {
    const rows: FlatRow[] = [{ val: 1 }, { val: 'hello' }]
    const result = inferColumnTypes(rows)
    expect(result[0].type).toBe('text')
  })
})
