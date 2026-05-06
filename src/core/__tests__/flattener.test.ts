import { describe, it, expect } from 'vitest'
import { flattenRows } from '../flattener'
import type { JsonObject } from '@/types'

describe('flattenRows', () => {
  it('flattens nested objects with dot notation', () => {
    const rows: JsonObject[] = [{ user: { name: 'a', age: 1 } }]
    const result = flattenRows(rows, 'flatten')
    expect(result).toEqual([{ 'user.name': 'a', 'user.age': 1 }])
  })

  it('stringifies nested objects', () => {
    const rows: JsonObject[] = [{ user: { name: 'a', age: 1 } }]
    const result = flattenRows(rows, 'stringify')
    expect(result).toEqual([{ user: '{"name":"a","age":1}' }])
  })

  it('explodes array into multiple rows', () => {
    const rows: JsonObject[] = [
      { id: 1, tags: ['a', 'b'] },
      { id: 2, tags: ['c'] },
    ]
    const result = flattenRows(rows, 'explode')
    expect(result).toHaveLength(3)
    expect(result).toContainEqual({ id: 1, tags: 'a' })
    expect(result).toContainEqual({ id: 1, tags: 'b' })
    expect(result).toContainEqual({ id: 2, tags: 'c' })
  })

  it('handles mixed flatten', () => {
    const rows: JsonObject[] = [{ id: 1, user: { name: 'a' }, tags: ['x', 'y'] }]
    const result = flattenRows(rows, 'flatten')
    expect(result).toEqual([{ id: 1, 'user.name': 'a', tags: '["x","y"]' }])
  })
})
