export type JsonValue = string | number | boolean | null | JsonObject | JsonArray
export interface JsonObject { [key: string]: JsonValue }
export type JsonArray = Array<JsonValue>

export type NestingStrategy = 'flatten' | 'stringify' | 'explode' | 'multiSheet'

export interface ColumnMeta {
  key: string
  name: string
  type: 'text' | 'integer' | 'decimal' | 'date' | 'boolean'
  hidden: boolean
  format?: string
  order?: number
}

export interface FlatRow {
  [key: string]: JsonValue | undefined
}

export interface PathCandidate {
  path: string
  depth: number
  count: number
}

export interface ParseResult {
  value: JsonValue | null
  error?: { line: number; column: number; message: string }
  isJsonl: boolean
}

export interface ExportOptions {
  delimiter: ',' | ';' | '\t' | '|'
  includeBom: boolean
  lineEnding: '\n' | '\r\n'
  includeHeader: boolean
  filteredOnly: boolean
}

export interface ExcelStyleOptions {
  boldHeader: boolean
  freezeHeader: boolean
  autoColumnWidth: boolean
}

export interface FilterCondition {
  column: string
  operator: '>' | '<' | '=' | '!=' | '>=' | '<=' | 'contains' | 'starts with' | 'regex'
  value: string
}

export interface Template {
  id: string
  name: string
  path: string
  strategy: NestingStrategy
  columns: ColumnMeta[]
  createdAt: number
}
