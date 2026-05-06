import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDataStore } from '../data'
import { useColumnsStore } from '../columns'

describe('columns store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('reflects data store columns', () => {
    const dataStore = useDataStore()
    const columnsStore = useColumnsStore()

    dataStore.setInput(JSON.stringify([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ]))

    expect(columnsStore.columns).toHaveLength(2)
    expect(columnsStore.columns.map((c) => c.key)).toContain('id')
    expect(columnsStore.columns.map((c) => c.key)).toContain('name')
  })

  it('renames column', () => {
    const dataStore = useDataStore()
    const columnsStore = useColumnsStore()

    dataStore.setInput(JSON.stringify([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ]))

    columnsStore.renameColumn('id', 'ID')
    const idCol = columnsStore.columns.find((c) => c.key === 'id')
    expect(idCol?.name).toBe('ID')
  })

  it('hides column', () => {
    const dataStore = useDataStore()
    const columnsStore = useColumnsStore()

    dataStore.setInput(JSON.stringify([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ]))

    expect(columnsStore.visibleColumns).toHaveLength(2)
    columnsStore.toggleHidden('id')
    expect(columnsStore.visibleColumns).toHaveLength(1)
    expect(columnsStore.visibleColumns[0].key).toBe('name')
  })

  it('transforms display rows', () => {
    const dataStore = useDataStore()
    const columnsStore = useColumnsStore()

    dataStore.setInput(JSON.stringify([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ]))

    columnsStore.renameColumn('id', 'ID')
    const rows = columnsStore.displayRows
    expect(rows).toHaveLength(3)
    expect(rows[0]).toHaveProperty('ID')
    expect(rows[0]).toHaveProperty('name')
    expect(rows[0].ID).toBe(1)
  })
})
