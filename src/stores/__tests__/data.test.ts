import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDataStore } from '../data'

describe('data store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has initial empty state', () => {
    const store = useDataStore()
    expect(store.rawInput).toBe('')
    expect(store.parsedValue).toBeNull()
    expect(store.parseError).toBeUndefined()
    expect(store.isJsonl).toBe(false)
    expect(store.pathCandidates).toEqual([])
    expect(store.selectedPath).toBe('')
    expect(store.nestingStrategy).toBe('flatten')
    expect(store.flatRows).toEqual([])
    expect(store.columnMeta).toEqual([])
    expect(store.hasError).toBe(false)
    expect(store.arrayAtPath).toEqual([])
  })

  it('parses json input', () => {
    const store = useDataStore()
    store.setInput('{"a":1}')
    expect(store.parsedValue).toEqual({ a: 1 })
    expect(store.parseError).toBeUndefined()
    expect(store.hasError).toBe(false)
  })

  it('finds path candidates', () => {
    const store = useDataStore()
    store.setInput(JSON.stringify({
      status: 'ok',
      data: {
        items: [
          { id: 1, name: 'a' },
          { id: 2, name: 'b' },
        ],
      },
    }))
    expect(store.pathCandidates.length).toBeGreaterThan(0)
    expect(store.pathCandidates.some(c => c.path === 'data.items')).toBe(true)
  })

  it('recomputes rows on path change', () => {
    const store = useDataStore()
    store.setInput(JSON.stringify({
      a: [
        { x: 1 },
        { x: 2 },
      ],
      b: [
        { y: 10 },
        { y: 20 },
      ],
    }))
    // Default path should be the first candidate (a)
    const firstPath = store.selectedPath
    expect(firstPath).toBe('a')
    expect(store.flatRows).toHaveLength(2)
    expect(store.flatRows[0]).toHaveProperty('x')

    store.setPath('b')
    expect(store.selectedPath).toBe('b')
    expect(store.flatRows).toHaveLength(2)
    expect(store.flatRows[0]).toHaveProperty('y')
  })

  it('recomputes rows on strategy change', () => {
    const store = useDataStore()
    store.setInput(JSON.stringify([
      { id: 1, nested: { foo: 'bar' } },
      { id: 2, nested: { foo: 'baz' } },
      { id: 3, nested: { foo: 'qux' } },
    ]))
    expect(store.nestingStrategy).toBe('flatten')
    expect(store.flatRows[0]).toHaveProperty('nested.foo')

    store.setStrategy('stringify')
    expect(store.flatRows[0]).toHaveProperty('nested')
    expect(typeof store.flatRows[0].nested).toBe('string')
  })
})
