import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDataStore } from '../data'
import { useColumnsStore } from '../columns'
import { useFiltersStore } from '../filters'

describe('filters store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function setupData() {
    const dataStore = useDataStore()
    dataStore.setInput(JSON.stringify([
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
      { id: 3, name: 'Charlie', age: 35 },
    ]))
    return { dataStore, columnsStore: useColumnsStore(), filtersStore: useFiltersStore() }
  }

  it('filters by global search', () => {
    const { filtersStore } = setupData()

    expect(filtersStore.filteredRows).toHaveLength(3)
    filtersStore.setGlobalSearch('Bob')
    expect(filtersStore.filteredRows).toHaveLength(1)
    expect(filtersStore.filteredRows[0]).toHaveProperty('name', 'Bob')
  })

  it('filters by condition', () => {
    const { filtersStore } = setupData()

    expect(filtersStore.filteredRows).toHaveLength(3)
    filtersStore.addCondition({ column: 'age', operator: '>', value: '28' })
    expect(filtersStore.filteredRows).toHaveLength(2)
    expect(filtersStore.filteredRows.map((r) => r.name)).toContain('Alice')
    expect(filtersStore.filteredRows.map((r) => r.name)).toContain('Charlie')
  })

  it('clears filters', () => {
    const { filtersStore } = setupData()

    filtersStore.setGlobalSearch('Bob')
    filtersStore.addCondition({ column: 'age', operator: '>', value: '28' })
    expect(filtersStore.filteredRows).toHaveLength(0)

    filtersStore.clearFilters()
    expect(filtersStore.filteredRows).toHaveLength(3)
    expect(filtersStore.globalSearch).toBe('')
    expect(filtersStore.conditions).toEqual([])
  })
})
