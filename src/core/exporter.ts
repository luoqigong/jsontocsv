import type { FlatRow, ExportOptions, ExcelStyleOptions } from '@/types'

function escapeCsvValue(value: unknown, delimiter: string): string {
  const str = value === null || value === undefined ? '' : String(value)
  const needsQuotes = str.includes(delimiter) || str.includes('\n') || str.includes('\r') || str.includes('"')
  if (needsQuotes) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

export function toCsv(rows: FlatRow[], options: ExportOptions): string {
  if (rows.length === 0) {
    return ''
  }

  const delimiter = options.delimiter ?? ','
  const lineEnding = options.lineEnding ?? '\r\n'
  const keys = Object.keys(rows[0])

  let result = ''

  if (options.includeBom) {
    result += '﻿'
  }

  if (options.includeHeader) {
    result += keys.map((k) => escapeCsvValue(k, delimiter)).join(delimiter) + lineEnding
  }

  for (const row of rows) {
    const line = keys.map((k) => escapeCsvValue(row[k], delimiter)).join(delimiter)
    result += line + lineEnding
  }

  return result
}

export async function toExcel(
  rows: FlatRow[],
  style: ExcelStyleOptions,
): Promise<Blob> {
  const ExcelJS = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')

  if (rows.length === 0) {
    const buffer = await workbook.xlsx.writeBuffer()
    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
  }

  const keys = Object.keys(rows[0])

  // Header row
  const headerRow = worksheet.addRow(keys)

  if (style.boldHeader) {
    headerRow.eachCell((cell) => {
      cell.font = { bold: true }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' },
      }
    })
  }

  if (style.freezeHeader) {
    worksheet.views = [
      { state: 'frozen', ySplit: 1 },
    ]
  }

  // AutoFilter on header row
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: keys.length },
  }

  // Data rows
  for (const row of rows) {
    worksheet.addRow(keys.map((k) => row[k]))
  }

  if (style.autoColumnWidth) {
    worksheet.columns.forEach((column) => {
      let maxLength = 0
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value
        const text = cellValue === null || cellValue === undefined ? '' : String(cellValue)
        maxLength = Math.max(maxLength, text.length)
      })
      column.width = Math.min(maxLength + 4, 50)
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}
