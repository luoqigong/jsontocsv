import { describe, it, expect } from 'vitest'
import { parseJson } from '../parser'

describe('parseJson', () => {
  it('parses simple object', () => {
    const result = parseJson('{"a":1}')
    expect(result.value).toEqual({ a: 1 })
    expect(result.error).toBeUndefined()
    expect(result.isJsonl).toBe(false)
  })

  it('parses simple array', () => {
    const result = parseJson('[{"b":2}]')
    expect(result.value).toEqual([{ b: 2 }])
    expect(result.error).toBeUndefined()
    expect(result.isJsonl).toBe(false)
  })

  it('parses JSON Lines', () => {
    const result = parseJson('{"a":1}\n{"a":2}\n{"a":3}')
    expect(result.value).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }])
    expect(result.error).toBeUndefined()
    expect(result.isJsonl).toBe(true)
  })

  it('returns error for invalid JSON', () => {
    const result = parseJson('{"a"}')
    expect(result.value).toBeNull()
    expect(result.error).toBeDefined()
    expect(result.error!.message).toBeDefined()
  })

  it('locates error position', () => {
    const result = parseJson('\n"a":}')
    expect(result.error).toBeDefined()
    expect(result.error!.line).toBeGreaterThanOrEqual(1)
  })

  it('returns error for empty input', () => {
    const result = parseJson('')
    expect(result.value).toBeNull()
    expect(result.error).toBeDefined()
  })
})
