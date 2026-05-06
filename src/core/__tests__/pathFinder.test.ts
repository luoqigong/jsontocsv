import { describe, it, expect } from 'vitest'
import { findPathCandidates, getArrayAtPath } from '../pathFinder'
import type { JsonValue } from '@/types'

describe('findPathCandidates', () => {
  it('finds root array', () => {
    const value: JsonValue = [{ a: 1 }, { a: 2 }]
    const result = findPathCandidates(value)
    expect(result).toEqual([{ path: '<root>', depth: 0, count: 2 }])
  })

  it('finds nested array in API response', () => {
    const value: JsonValue = { code: 0, data: { list: [{ a: 1 }, { a: 2 }] } }
    const result = findPathCandidates(value)
    expect(result).toContainEqual({ path: 'data.list', depth: 2, count: 2 })
  })

  it('prefers longer arrays', () => {
    const value: JsonValue = {
      items: [{ a: 1 }],
      data: { list: [{ a: 1 }, { a: 2 }, { a: 3 }] },
    }
    const result = findPathCandidates(value)
    expect(result[0]).toEqual({ path: 'data.list', depth: 2, count: 3 })
  })

  it('returns empty for no arrays', () => {
    const value: JsonValue = { a: 1, b: 'hello' }
    const result = findPathCandidates(value)
    expect(result).toEqual([])
  })
})

describe('getArrayAtPath', () => {
  it('getArrayAtPath extracts array', () => {
    const value: JsonValue = { data: { list: [{ a: 1 }] } }
    const result = getArrayAtPath(value, 'data.list')
    expect(result).toEqual([{ a: 1 }])
  })

  it('getArrayAtPath extracts root', () => {
    const value: JsonValue = [{ a: 1 }]
    const result = getArrayAtPath(value, '<root>')
    expect(result).toEqual([{ a: 1 }])
  })
})
