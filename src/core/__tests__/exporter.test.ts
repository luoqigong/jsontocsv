import { describe, it, expect } from 'vitest'
import { toCsv, toExcel } from '../exporter'
import type { FlatRow, ExportOptions, ExcelStyleOptions } from '@/types'

describe('toCsv', () => {
  it('exports simple rows', () => {
    const rows: FlatRow[] = [{ a: 1, b: 'hello' }]
    const options: ExportOptions = {
      delimiter: ',',
      includeBom: false,
      lineEnding: '\r\n',
      includeHeader: true,
      filteredOnly: false,
    }
    const result = toCsv(rows, options)
    expect(result).toContain('a,b')
    expect(result).toContain('1,hello')
  })

  it('adds BOM when enabled', () => {
    const rows: FlatRow[] = [{ a: 1 }]
    const options: ExportOptions = {
      delimiter: ',',
      includeBom: true,
      lineEnding: '\r\n',
      includeHeader: true,
      filteredOnly: false,
    }
    const result = toCsv(rows, options)
    expect(result.charCodeAt(0)).toBe(0xfeff)
  })

  it('uses semicolon delimiter', () => {
    const rows: FlatRow[] = [{ a: 1, b: 2 }]
    const options: ExportOptions = {
      delimiter: ';',
      includeBom: false,
      lineEnding: '\r\n',
      includeHeader: true,
      filteredOnly: false,
    }
    const result = toCsv(rows, options)
    expect(result).toContain('a;b')
  })

  it('quotes values with commas', () => {
    const rows: FlatRow[] = [{ a: 'hello, world' }]
    const options: ExportOptions = {
      delimiter: ',',
      includeBom: false,
      lineEnding: '\r\n',
      includeHeader: true,
      filteredOnly: false,
    }
    const result = toCsv(rows, options)
    expect(result).toContain('"hello, world"')
  })

  it('escapes quotes', () => {
    const rows: FlatRow[] = [{ a: 'say "hello"' }]
    const options: ExportOptions = {
      delimiter: ',',
      includeBom: false,
      lineEnding: '\r\n',
      includeHeader: true,
      filteredOnly: false,
    }
    const result = toCsv(rows, options)
    expect(result).toContain('"say ""hello"""')
  })

  it('respects line ending option', () => {
    const rows: FlatRow[] = [{ a: 1 }]
    const options: ExportOptions = {
      delimiter: ',',
      includeBom: false,
      lineEnding: '\n',
      includeHeader: true,
      filteredOnly: false,
    }
    const result = toCsv(rows, options)
    expect(result.endsWith('\n')).toBe(true)
    expect(result.includes('\r\n')).toBe(false)
  })
})

describe('toExcel', () => {
  it('returns a blob', async () => {
    const rows: FlatRow[] = [{ a: 1, b: 'hello' }]
    const style: ExcelStyleOptions = {
      boldHeader: false,
      freezeHeader: false,
      autoColumnWidth: false,
    }
    const result = await toExcel(rows, style)
    expect(result).toBeInstanceOf(Blob)
  }, 30000)

  it('blob has correct mime type', async () => {
    const rows: FlatRow[] = [{ a: 1 }]
    const style: ExcelStyleOptions = {
      boldHeader: false,
      freezeHeader: false,
      autoColumnWidth: false,
    }
    const result = await toExcel(rows, style)
    expect(result.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  }, 30000)
})
