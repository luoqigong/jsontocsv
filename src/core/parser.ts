import type { JsonValue, ParseResult } from '@/types'

export function parseJson(input: string): ParseResult {
  if (input.trim() === '') {
    return {
      value: null,
      error: { line: 1, column: 1, message: 'Empty input' },
      isJsonl: false,
    }
  }

  const trimmed = input.trim()
  const lines = trimmed.split('\n')

  // Detect JSON Lines: multiple non-empty lines, each a valid JSON object
  if (lines.length >= 2) {
    const nonEmptyLines = lines.filter((l) => l.trim() !== '')
    if (nonEmptyLines.length >= 2) {
      const parsedLines: JsonValue[] = []
      let allValid = true
      for (const line of nonEmptyLines) {
        try {
          const parsed = JSON.parse(line) as JsonValue
          parsedLines.push(parsed)
        } catch {
          allValid = false
          break
        }
      }
      if (allValid) {
        return { value: parsedLines, isJsonl: true }
      }
    }
  }

  // Single JSON value
  try {
    const value = JSON.parse(trimmed) as JsonValue
    return { value, isJsonl: false }
  } catch (e) {
    const pos = computeErrorPosition(input, e)
    return {
      value: null,
      error: {
        line: pos.line,
        column: pos.column,
        message: e instanceof Error ? e.message : 'Invalid JSON',
      },
      isJsonl: false,
    }
  }
}

function computeErrorPosition(input: string, error: unknown): { line: number; column: number } {
  // Try to extract position from JSON.parse error message
  // Common formats: "Unexpected token ... at position N" or "at line X column Y"
  const message = error instanceof Error ? error.message : ''

  // Try line/column format first
  const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i)
  if (lineColMatch) {
    return {
      line: parseInt(lineColMatch[1], 10),
      column: parseInt(lineColMatch[2], 10),
    }
  }

  // Try position format
  const posMatch = message.match(/position\s+(\d+)/i)
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10)
    return offsetToLineColumn(input, pos)
  }

  // Fallback: scan for the problematic character
  // For "Unexpected token X in JSON at position N"
  const tokenPosMatch = message.match(/position\s+(\d+)$/)
  if (tokenPosMatch) {
    const pos = parseInt(tokenPosMatch[1], 10)
    return offsetToLineColumn(input, pos)
  }

  return { line: 1, column: 1 }
}

function offsetToLineColumn(input: string, offset: number): { line: number; column: number } {
  let line = 1
  let column = 1
  for (let i = 0; i < offset && i < input.length; i++) {
    if (input[i] === '\n') {
      line++
      column = 1
    } else {
      column++
    }
  }
  return { line, column }
}
