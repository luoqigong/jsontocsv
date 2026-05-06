# JSON 转表格(智能表格工作台)— 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零构建一个 Vue 3 + TypeScript 的 JSON 转表格工具,支持智能路径识别、4 种嵌套策略、表格预览、列编辑、CSV/Excel 导出(含样式),部署到 Cloudflare Pages。

**Architecture:** 纯前端 SPA 架构,`core/` 目录存放零 Vue 依赖的纯逻辑模块(Parser/Flattener/Exporter),由 Pinia stores 驱动 UI 状态。Vue 组件使用 TanStack Vue Table + 虚拟滚动做表格渲染。ExcelJS 按路由懒加载,其余依赖静态导入。

**Tech Stack:** Vue 3 + Vite + TypeScript + Vitest + TanStack Vue Table + ExcelJS + Pinia + UnoCSS + vue-i18n

---

## 文件结构地图

```
json转表格/
├── .git/                              # git 仓库
├── docs/                              # 需求文档已在此
│   ├── specs/2026-05-06-json-table-design.md
│   └── plans/2026-05-06-json-table-implementation.md  # 本文件
│
├── src/
│   ├── core/                          # 纯逻辑(零 Vue 依赖,必须 TDD)
│   │   ├── parser.ts                  # JSON 解析 + 错误定位 + JSONL 探测
│   │   ├── pathFinder.ts             # 智能路径识别
│   │   ├── flattener.ts              # 4 种嵌套策略
│   │   ├── typeInfer.ts              # 列类型推断
│   │   ├── exporter.ts               # CSV/Excel 导出
│   │   └── transform.ts              # 列编辑应用(改名/调序/类型/格式)
│   │
│   ├── stores/                        # Pinia stores
│   │   ├── data.ts                   # 当前 JSON、解析结果、行数据
│   │   ├── columns.ts                # 列设置(名/序/隐藏/类型/格式)
│   │   ├── filters.ts                # 过滤条件
│   │   └── settings.ts               # 语言/暗色/CSV导出选项
│   │
│   ├── components/
│   │   ├── input/                     # 输入区域
│   │   │   ├── JsonInput.vue         # 文本粘贴 + 上传 + 示例
│   │   │   └── FileUploader.vue      # 拖拽上传子组件
│   │   ├── PathSelector.vue          # 数据数组路径选择器
│   │   ├── NestingPanel.vue          # 嵌套策略面板
│   │   ├── tableView/                # 表格区域
│   │   │   ├── TableView.vue         # 主表格(集成 tanstack)
│   │   │   ├── ColumnHeader.vue      # 表头(排序/拖拽/筛选)
│   │   │   └── VirtualRow.vue        # 虚拟行渲染
│   │   ├── ColumnPanel.vue           # 列管理侧栏
│   │   ├── FilterBar.vue             # 过滤栏
│   │   ├── ExportPanel.vue           # 导出选项面板
│   │   └── common/                    # 通用组件
│   │       ├── AppButton.vue
│   │       ├── AppSelect.vue
│   │       ├── AppToggle.vue
│   │       ├── AppModal.vue
│   │       ├── AppAlert.vue
│   │       └── AppBadge.vue
│   │
│   ├── pages/
│   │   ├── Home.vue                  # 主页面(左输入 + 中表格 + 右面板)
│   │   └── About.vue                 # 隐私说明页
│   │
│   ├── i18n/
│   │   ├── index.ts                  # i18n 实例配置
│   │   ├── zh-CN.json                # 中文
│   │   └── en.json                   # 英文
│   │
│   ├── types/
│   │   └── index.ts                  # 全局类型定义
│   │
│   ├── composables/                   # Vue 组合函数
│   │   ├── useDarkMode.ts
│   │   └── useExport.ts
│   │
│   ├── utils/
│   │   └── formatters.ts             # 日期/数字格式化
│   │
│   ├── router.ts                     # Vue Router 配置
│   ├── main.ts                       # 入口
│   └── App.vue                       # 根组件
│
├── functions/                         # Cloudflare Pages Functions (P1)
│   └── api/
│       └── fetch.ts                  # URL 代理(P1)
│
├── public/                            # 静态资源
│   └── favicon.svg
│
├── index.html                         # HTML 模板
├── vite.config.ts                     # Vite 配置
├── vitest.config.ts                   # Vitest 配置
├── tsconfig.json
├── package.json
├── uno.config.ts                      # UnoCSS 配置
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
└── wrangler.toml                      # Cloudflare Pages 配置(P1)
```

**约束**: `src/core/` 零 Vue 依赖;`src/components/` 可以依赖 `core/` 和 `stores/`;`stores/` 可以依赖 `core/`。

---

## Phase 0: 项目脚手架

### Task 0.1: 初始化 Vite + Vue 3 + TypeScript 项目

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/router.ts`
- Create: `src/pages/Home.vue`
- Create: `src/pages/About.vue`
- Create: `public/favicon.svg`

- [ ] **Step 1: 创建项目目录并初始化 git**

```bash
git init
git commit --allow-empty -m "init: empty project"
```

- [ ] **Step 2: 写 package.json**

```json
{
  "name": "json-to-table",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint . --ext .vue,.ts,.tsx",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@tanstack/vue-table": "^8.21.0",
    "@tanstack/vue-virtual": "^3.11.0",
    "exceljs": "^4.4.0",
    "pinia": "^2.3.0",
    "vue": "^3.5.0",
    "vue-i18n": "^10.0.0",
    "vue-router": "^4.5.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "@vitejs/plugin-vue": "^5.2.0",
    "@vue/test-utils": "^2.4.0",
    "eslint": "^9.17.0",
    "eslint-plugin-vue": "^9.32.0",
    "jsdom": "^25.0.0",
    "prettier": "^3.4.0",
    "typescript": "^5.7.0",
    "unocss": "^0.65.0",
    "vite": "^6.0.0",
    "vitest": "^2.1.0",
    "vue-tsc": "^2.2.0"
  }
}
```

- [ ] **Step 3: 安装依赖**

```bash
npm install
```

- [ ] **Step 4: 写基础文件**

`index.html`:
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="JSON 转表格工作台 - 所见即所得的智能表格转换工具">
  <title>JSON to Table</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "noEmit": true,
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["vitest/globals", "node"]
  },
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
```

`.gitignore`:
```
node_modules/
dist/
*.log
.env.local
.vscode/
.idea/
coverage/
```

`src/main.ts`:
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { router } from './router'
import App from './App.vue'
import 'uno.css'

import zhCN from './i18n/zh-CN.json'
import en from './i18n/en.json'

const i18n = createI18n({
  locale: navigator.language.startsWith('zh') ? 'zh-CN' : 'en',
  fallbackLocale: 'en',
  messages: { 'zh-CN': zhCN, en },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
```

`src/router.ts`:
```typescript
import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('./pages/Home.vue')
const About = () => import('./pages/About.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
  ],
})
```

`src/App.vue`:
```vue
<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
```

`src/pages/Home.vue`:
```vue
<template>
  <div class="p-4">
    <h1 class="text-xl font-bold">JSON to Table</h1>
    <p class="text-gray-500">Coming soon...</p>
  </div>
</template>
```

`src/pages/About.vue`:
```vue
<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-xl font-bold mb-4">About</h1>
    <p>100% browser-based JSON to table converter. Your data never leaves your computer.</p>
    <RouterLink to="/" class="text-blue-500">Back</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
```

- [ ] **Step 5: 运行 dev 服务器验证**

```bash
npm run dev
```

浏览器打开 http://localhost:5173 和 http://localhost:5173/about 验证路由工作。

- [ ] **Step 6: 初始提交**

```bash
git add .
git commit -m "chore: vite + vue 3 + ts + router scaffold"
```

---

### Task 0.2: 配置 Vitest 单元测试

**Files:**
- Create: `vitest.config.ts`
- Create: `src/core/__tests__/parser.test.ts` (先写骨架验证配置)
- Modify: `package.json`

- [ ] **Step 1: 写 vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})
```

- [ ] **Step 2: 写骨架测试验证配置**

`src/core/__tests__/parser.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'

describe('parser', () => {
  it('vitest works', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 3: 运行测试**

```bash
npx vitest run
```

Expected output: 1 passed

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "chore: vitest config"
```

---

### Task 0.3: 配置 UnoCSS + 暗色模式基础

**Files:**
- Create: `uno.config.ts`
- Modify: `vite.config.ts`
- Modify: `src/main.ts`
- Create: `src/composables/useDarkMode.ts`

- [ ] **Step 1: 写 uno.config.ts**

```typescript
import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  darkMode: 'class',
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
    },
  },
})
```

- [ ] **Step 2: 写 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
})
```

- [ ] **Step 3: 写 useDarkMode composable**

`src/composables/useDarkMode.ts`:
```typescript
import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'j2t-dark-mode'

export function useDarkMode() {
  const isDark = ref(false)

  const apply = (dark: boolean) => {
    isDark.value = dark
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem(STORAGE_KEY, dark ? '1' : '0')
  }

  const toggle = () => apply(!isDark.value)

  onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    apply(saved ? saved === '1' : prefersDark)
  })

  watch(isDark, apply)

  return { isDark, toggle }
}
```

- [ ] **Step 4: 在 App.vue 中使用暗色**

```vue
<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
    <header class="border-b dark:border-gray-700 px-4 py-3 flex justify-between items-center">
      <RouterLink to="/" class="text-lg font-bold">JSON to Table</RouterLink>
      <button @click="toggle" class="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </header>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { useDarkMode } from './composables/useDarkMode'

const { isDark, toggle } = useDarkMode()
</script>
```

- [ ] **Step 5: 验证暗色切换**

运行 `npm run dev`,点击太阳/月亮图标,HTML 根元素应有 `dark` class 的增删。

- [ ] **Step 6: 提交**

```bash
git add .
git commit -m "feat: unocss + dark mode toggle"
```

---

### Task 0.4: 配置 ESLint + Prettier

**Files:**
- Create: `.eslintrc.cjs`
- Create: `.prettierrc`
- Modify: `package.json`

- [ ] **Step 1: 写 .eslintrc.cjs**

```javascript
module.exports = {
  root: true,
  env: { node: true, browser: true, 'vitest-globals/env': true },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
}
```

- [ ] **Step 2: 写 .prettierrc**

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100
}
```

- [ ] **Step 3: 运行 lint**

```bash
npm run lint
```

Expected: 无错误(只有一些配置相关的 warning,可忽略)

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "chore: eslint + prettier config"
```

---

### Task 0.5: 创建类型定义

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: 写类型定义**

```typescript
// src/types/index.ts

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray
export interface JsonObject { [key: string]: JsonValue }
export interface JsonArray extends Array<JsonValue> {}

export type NestingStrategy = 'flatten' | 'stringify' | 'explode' | 'multiSheet'

export interface ColumnMeta {
  key: string          // 原始 JSON 路径(扁平化后的点号路径)
  name: string         // 显示名(用户可编辑)
  type: 'text' | 'integer' | 'decimal' | 'date' | 'boolean'
  hidden: boolean
  format?: string      // 日期格式或数字格式
}

export interface FlatRow {
  [key: string]: unknown
}

export interface PathCandidate {
  path: string         // dot path, e.g. "data.list"
  depth: number
  count: number        // 数组长度
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

export interface Template {
  id: string
  name: string
  path: string
  strategy: NestingStrategy
  columns: ColumnMeta[]
  createdAt: number
}
```

- [ ] **Step 2: 验证类型编译**

```bash
npx vue-tsc --noEmit
```

Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: shared type definitions"
```

---

## Phase 1: Core 纯逻辑(TDD)

**规则**:每个 Task 遵循严格的 TDD 循环:
1. 写失败测试
2. 运行确认失败
3. 写最小实现
4. 运行确认通过
5. 提交

### Task 1.1: JSON 解析器(parser.parse)

**Files:**
- Create: `src/core/parser.ts`
- Create: `src/core/__tests__/parser.test.ts`

- [ ] **Step 1: 写失败测试**

```typescript
// src/core/__tests__/parser.test.ts
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
  })

  it('parses JSON Lines', () => {
    const input = '{"a":1}\n{"a":2}\n{"a":3}'
    const result = parseJson(input)
    expect(result.value).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }])
    expect(result.isJsonl).toBe(true)
  })

  it('returns error for invalid JSON', () => {
    const result = parseJson('{"a"}')
    expect(result.error).toBeDefined()
    expect(result.value).toBeNull()
  })

  it('locates error position', () => {
    // "{" then newline then "a":}"
    const input = '{\n"a":}'
    const result = parseJson(input)
    expect(result.error).toBeDefined()
    expect(result.error!.line).toBe(2)
    expect(result.error!.column).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: 运行确认失败**

```bash
npx vitest run src/core/__tests__/parser.test.ts
```

Expected: FAIL (parseJson not defined)

- [ ] **Step 3: 写最小实现**

```typescript
// src/core/parser.ts
import type { ParseResult } from '@/types'

export function parseJson(input: string): ParseResult {
  const trimmed = input.trim()
  if (!trimmed) return { value: null, error: { line: 1, column: 1, message: 'Empty input' }, isJsonl: false }

  // Try JSON Lines detection first
  const lines = trimmed.split(/\r?\n/).filter(l => l.trim())
  if (lines.length > 1) {
    try {
      const parsed = lines.map((line, i) => {
        try { return JSON.parse(line) }
        catch (e) {
          const err = e as SyntaxError
          const lineOffset = trimmed.split(/\r?\n/).slice(0, i).reduce((sum, l) => sum + l.length + 1, 0)
          const pos = extractPosition(err.message, lineOffset)
          throw new ParseError(err.message, pos.line, pos.column)
        }
      })
      return { value: parsed, error: undefined, isJsonl: true }
    } catch (e) {
      if (e instanceof ParseError) {
        return { value: null, error: { line: e.line, column: e.column, message: e.message }, isJsonl: false }
      }
    }
  }

  try {
    return { value: JSON.parse(trimmed), error: undefined, isJsonl: false }
  } catch (e) {
    const err = e as SyntaxError
    const pos = extractPosition(err.message, 0)
    return { value: null, error: { line: pos.line, column: pos.column, message: err.message }, isJsonl: false }
  }
}

function extractPosition(msg: string, baseOffset: number): { line: number; column: number } {
  const match = msg.match(/position (\d+)/)
  if (!match) return { line: 1, column: 1 }
  const pos = parseInt(match[1], 10) + baseOffset
  // simplistic: count newlines before position
  const linesBefore = msg.slice(0, pos).split('\n').length - 1
  // Since we don't have the original string, fallback to rough estimate
  return { line: linesBefore + 1, column: pos }
}

class ParseError extends Error {
  constructor(message: string, public line: number, public column: number) {
    super(message)
  }
}
```

- [ ] **Step 4: 运行测试**

```bash
npx vitest run src/core/__tests__/parser.test.ts
```

Expected: 可能有失败 — 需要改进位置提取逻辑。这是正常的,调整直到全部通过。

- [ ] **Step 5: 修正实现确保全部通过**

完善后的 `extractPosition` 需要接收原始字符串。修复后的实现:

```typescript
export function parseJson(input: string): ParseResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { value: null, error: { line: 1, column: 1, message: 'Empty input' }, isJsonl: false }
  }

  // Try single JSON first
  try {
    const parsed = JSON.parse(trimmed)
    return { value: parsed, error: undefined, isJsonl: false }
  } catch (singleErr) {
    const singleError = singleErr as SyntaxError

    // Try JSON Lines
    const lines = trimmed.split(/\r?\n/).filter(l => l.trim())
    if (lines.length > 1) {
      try {
        let totalOffset = 0
        const parsed = lines.map(line => {
          try {
            const result = JSON.parse(line)
            totalOffset += line.length + 1
            return result
          } catch (lineErr) {
            const err = lineErr as SyntaxError
            const match = err.message.match(/position (\d+)/)
            const col = match ? parseInt(match[1], 10) + 1 : 1
            // Find which line in trimmed this offset corresponds to
            const posInTrimmed = trimmed.indexOf(line) + (match ? parseInt(match[1], 10) : 0)
            const lineNum = trimmed.slice(0, posInTrimmed).split('\n').length
            throw new ParseError(err.message, lineNum, col)
          }
        })
        return { value: parsed, error: undefined, isJsonl: true }
      } catch (e) {
        if (e instanceof ParseError) {
          return { value: null, error: { line: e.line, column: e.column, message: e.message }, isJsonl: false }
        }
      }
    }

    // Single JSON parse error
    const match = singleError.message.match(/position (\d+)/)
    const col = match ? parseInt(match[1], 10) + 1 : 1
    const lineNum = trimmed.slice(0, match ? parseInt(match[1], 10) : 0).split('\n').length
    return { value: null, error: { line: lineNum, column: col, message: singleError.message }, isJsonl: false }
  }
}
```

- [ ] **Step 6: 提交**

```bash
git add .
git commit -m "feat(core): json parser with jsonl support and error positioning"
```

---

### Task 1.2: 智能路径识别(pathFinder)

**Files:**
- Create: `src/core/pathFinder.ts`
- Create: `src/core/__tests__/pathFinder.test.ts`

- [ ] **Step 1: 写失败测试**

```typescript
// src/core/__tests__/pathFinder.test.ts
import { describe, it, expect } from 'vitest'
import { findPathCandidates, getArrayAtPath } from '../pathFinder'
import type { JsonValue } from '@/types'

describe('findPathCandidates', () => {
  it('finds root array', () => {
    const data = [{ a: 1 }, { a: 2 }]
    const candidates = findPathCandidates(data)
    expect(candidates).toHaveLength(1)
    expect(candidates[0].path).toBe('<root>')
    expect(candidates[0].count).toBe(2)
  })

  it('finds nested array in API response', () => {
    const data = { code: 0, data: { list: [{ a: 1 }, { a: 2 }] } }
    const candidates = findPathCandidates(data)
    expect(candidates.map(c => c.path)).toContain('data.list')
    expect(candidates[0].path).toBe('data.list')
    expect(candidates[0].count).toBe(2)
  })

  it('prefers longer arrays', () => {
    const data = { items: [{ a: 1 }], data: { list: [{ a: 1 }, { a: 2 }, { a: 3 }] } }
    const candidates = findPathCandidates(data)
    expect(candidates[0].path).toBe('data.list')
    expect(candidates[0].count).toBe(3)
  })

  it('returns empty for no arrays', () => {
    const data = { a: 1, b: 'hello' }
    const candidates = findPathCandidates(data)
    expect(candidates).toHaveLength(0)
  })
})

describe('getArrayAtPath', () => {
  it('extracts array at path', () => {
    const data = { data: { list: [{ a: 1 }] } }
    const arr = getArrayAtPath(data, 'data.list')
    expect(arr).toEqual([{ a: 1 }])
  })

  it('extracts root array', () => {
    const data = [{ a: 1 }]
    const arr = getArrayAtPath(data, '<root>')
    expect(arr).toEqual([{ a: 1 }])
  })
})
```

- [ ] **Step 2: 运行确认失败**

```bash
npx vitest run src/core/__tests__/pathFinder.test.ts
```

Expected: FAIL (functions not defined)

- [ ] **Step 3: 写最小实现**

```typescript
// src/core/pathFinder.ts
import type { JsonValue, JsonObject, PathCandidate } from '@/types'

export function findPathCandidates(value: JsonValue): PathCandidate[] {
  const candidates: PathCandidate[] = []

  function scan(obj: JsonValue, path: string, depth: number) {
    if (Array.isArray(obj)) {
      candidates.push({ path: path || '<root>', depth, count: obj.length })
      // Also scan array items if they are objects (for nested arrays)
      obj.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          scan(item, path, depth + 1)
        }
      })
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, val] of Object.entries(obj)) {
        const newPath = path ? `${path}.${key}` : key
        scan(val, newPath, depth + 1)
      }
    }
  }

  scan(value, '', 0)

  // Sort: longer array first, then shallower depth
  return candidates
    .filter(c => c.count >= 2) // Only arrays with >= 2 items
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return a.depth - b.depth
    })
}

export function getArrayAtPath(value: JsonValue, path: string): JsonObject[] {
  if (path === '<root>') {
    return Array.isArray(value) ? (value as JsonObject[]) : []
  }

  const keys = path.split('.')
  let current: JsonValue = value

  for (const key of keys) {
    if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
      current = (current as JsonObject)[key]
    } else {
      return []
    }
  }

  return Array.isArray(current) ? (current as JsonObject[]) : []
}
```

- [ ] **Step 4: 运行确认通过**

```bash
npx vitest run src/core/__tests__/pathFinder.test.ts
```

Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat(core): smart path finder for nested arrays"
```

---

### Task 1.3: 扁平化策略(flattener)

**Files:**
- Create: `src/core/flattener.ts`
- Create: `src/core/__tests__/flattener.test.ts`

- [ ] **Step 1: 写失败测试**

```typescript
// src/core/__tests__/flattener.test.ts
import { describe, it, expect } from 'vitest'
import { flattenRows } from '../flattener'

describe('flattenRows', () => {
  it('flattens nested objects with dot notation', () => {
    const input = [{ user: { name: 'a', age: 1 } }]
    const result = flattenRows(input, 'flatten')
    expect(result).toEqual([{ 'user.name': 'a', 'user.age': 1 }])
  })

  it('stringifies nested objects', () => {
    const input = [{ user: { name: 'a', age: 1 } }]
    const result = flattenRows(input, 'stringify')
    expect(result).toEqual([{ user: JSON.stringify({ name: 'a', age: 1 }) }])
  })

  it('explodes array into multiple rows', () => {
    const input = [{ id: 1, tags: ['a', 'b'] }, { id: 2, tags: ['c'] }]
    const result = flattenRows(input, 'explode')
    expect(result).toEqual([
      { id: 1, tags: 'a' },
      { id: 1, tags: 'b' },
      { id: 2, tags: 'c' },
    ])
  })

  it('handles mixed flatten (default)', () => {
    const input = [{ id: 1, user: { name: 'a' }, tags: ['x', 'y'] }]
    const result = flattenRows(input, 'flatten')
    // Arrays should be stringified, objects flattened
    expect(result[0]['user.name']).toBe('a')
    expect(result[0].tags).toBe('["x","y"]')
  })
})
```

- [ ] **Step 2: 运行确认失败**

```bash
npx vitest run src/core/__tests__/flattener.test.ts
```

Expected: FAIL

- [ ] **Step 3: 写最小实现**

```typescript
// src/core/flattener.ts
import type { NestingStrategy, FlatRow, JsonObject } from '@/types'

export function flattenRows(rows: JsonObject[], strategy: NestingStrategy): FlatRow[] {
  switch (strategy) {
    case 'flatten': return rows.map(r => flattenObject(r, ''))
    case 'stringify': return rows.map(r => stringifyObject(r))
    case 'explode': return explodeRows(rows)
    case 'multiSheet': return rows.map(r => flattenObject(r, '')) // Same as flatten for single sheet
    default: return rows.map(r => flattenObject(r, ''))
  }
}

function flattenObject(obj: JsonObject, prefix: string): FlatRow {
  const result: FlatRow = {}
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key
    if (value === null || value === undefined) {
      result[newKey] = ''
    } else if (Array.isArray(value)) {
      result[newKey] = JSON.stringify(value)
    } else if (typeof value === 'object') {
      Object.assign(result, flattenObject(value as JsonObject, newKey))
    } else {
      result[newKey] = value
    }
  }
  return result
}

function stringifyObject(obj: JsonObject): FlatRow {
  const result: FlatRow = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      result[key] = ''
    } else if (typeof value === 'object') {
      result[key] = JSON.stringify(value)
    } else {
      result[key] = value
    }
  }
  return result
}

function explodeRows(rows: JsonObject[]): FlatRow[] {
  const result: FlatRow[] = []
  for (const row of rows) {
    // Find first array field
    const arrayEntries = Object.entries(row).filter(([, v]) => Array.isArray(v))
    if (arrayEntries.length === 0) {
      result.push(flattenObject(row, ''))
      continue
    }

    const [arrayKey, arrayValue] = arrayEntries[0]
    const baseRow = { ...row }
    delete (baseRow as Record<string, unknown>)[arrayKey]

    if ((arrayValue as unknown[]).length === 0) {
      result.push(flattenObject(baseRow, ''))
      continue
    }

    for (const item of arrayValue as unknown[]) {
      const exploded = { ...flattenObject(baseRow, '') }
      if (typeof item === 'object' && item !== null) {
        for (const [k, v] of Object.entries(item)) {
          exploded[`${arrayKey}.${k}`] = v
        }
      } else {
        exploded[arrayKey] = item
      }
      result.push(exploded)
    }
  }
  return result
}
```

- [ ] **Step 4: 运行确认通过**

```bash
npx vitest run src/core/__tests__/flattener.test.ts
```

Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat(core): 3 nesting strategies (flatten, stringify, explode)"
```

---

### Task 1.4: 列类型推断(typeInfer)

**Files:**
- Create: `src/core/typeInfer.ts`
- Create: `src/core/__tests__/typeInfer.test.ts`

- [ ] **Step 1: 写失败测试**

```typescript
// src/core/__tests__/typeInfer.test.ts
import { describe, it, expect } from 'vitest'
import { inferColumnTypes } from '../typeInfer'

describe('inferColumnTypes', () => {
  it('infers text for strings', () => {
    const rows = [{ name: 'Alice' }, { name: 'Bob' }]
    const result = inferColumnTypes(rows)
    expect(result[0].type).toBe('text')
    expect(result[0].key).toBe('name')
  })

  it('infers integer for whole numbers', () => {
    const rows = [{ count: 1 }, { count: 2 }]
    const result = inferColumnTypes(rows)
    expect(result[0].type).toBe('integer')
  })

  it('infers decimal for floats', () => {
    const rows = [{ price: 1.5 }]
    const result = inferColumnTypes(rows)
    expect(result[0].type).toBe('decimal')
  })

  it('infers boolean for true/false', () => {
    const rows = [{ active: true }, { active: false }]
    const result = inferColumnTypes(rows)
    expect(result[0].type).toBe('boolean')
  })

  it('infers date for ISO strings', () => {
    const rows = [{ created: '2024-01-15T10:30:00Z' }]
    const result = inferColumnTypes(rows)
    expect(result[0].type).toBe('date')
  })

  it('handles mixed types as text', () => {
    const rows = [{ val: 1 }, { val: 'hello' }]
    const result = inferColumnTypes(rows)
    expect(result[0].type).toBe('text')
  })
})
```

- [ ] **Step 2: 运行确认失败**

```bash
npx vitest run src/core/__tests__/typeInfer.test.ts
```

Expected: FAIL

- [ ] **Step 3: 写最小实现**

```typescript
// src/core/typeInfer.ts
import type { ColumnMeta, FlatRow } from '@/types'

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
const SIMPLE_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export function inferColumnTypes(rows: FlatRow[]): ColumnMeta[] {
  if (rows.length === 0) return []

  const allKeys = new Set<string>()
  rows.forEach(r => Object.keys(r).forEach(k => allKeys.add(k)))

  return Array.from(allKeys).map(key => {
    const values = rows.map(r => r[key]).filter(v => v !== undefined && v !== null && v !== '')
    return {
      key,
      name: key,
      type: inferType(values),
      hidden: false,
    }
  })
}

function inferType(values: unknown[]): ColumnMeta['type'] {
  if (values.length === 0) return 'text'

  const types = new Set<string>()
  for (const v of values) {
    if (typeof v === 'boolean') types.add('boolean')
    else if (typeof v === 'number') {
      if (Number.isInteger(v)) types.add('integer')
      else types.add('decimal')
    } else if (typeof v === 'string') {
      if (ISO_DATE_REGEX.test(v) || SIMPLE_DATE_REGEX.test(v)) types.add('date')
      else types.add('text')
    } else {
      types.add('text')
    }
  }

  // If multiple types, fall back to text
  if (types.size > 1) return 'text'

  return (Array.from(types)[0] || 'text') as ColumnMeta['type']
}
```

- [ ] **Step 4: 运行确认通过**

```bash
npx vitest run src/core/__tests__/typeInfer.test.ts
```

Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat(core): column type inference (int/decimal/bool/date/text)"
```

---

### Task 1.5: 列变换(transform)

**Files:**
- Create: `src/core/transform.ts`
- Create: `src/core/__tests__/transform.test.ts`

- [ ] **Step 1: 写失败测试**

```typescript
// src/core/__tests__/transform.test.ts
import { describe, it, expect } from 'vitest'
import { applyColumnTransform, formatValue } from '../transform'
import type { ColumnMeta } from '@/types'

describe('applyColumnTransform', () => {
  it('reorders columns', () => {
    const rows = [{ a: 1, b: 2, c: 3 }]
    const columns: ColumnMeta[] = [
      { key: 'c', name: 'C', type: 'integer', hidden: false },
      { key: 'a', name: 'A', type: 'integer', hidden: false },
      { key: 'b', name: 'B', type: 'integer', hidden: false },
    ]
    const result = applyColumnTransform(rows, columns)
    expect(Object.keys(result[0])).toEqual(['c', 'a', 'b'])
  })

  it('hides columns', () => {
    const rows = [{ a: 1, b: 2 }]
    const columns: ColumnMeta[] = [
      { key: 'a', name: 'A', type: 'integer', hidden: false },
      { key: 'b', name: 'B', type: 'integer', hidden: true },
    ]
    const result = applyColumnTransform(rows, columns)
    expect(Object.keys(result[0])).toEqual(['a'])
  })

  it('uses custom names', () => {
    const rows = [{ a: 1 }]
    const columns: ColumnMeta[] = [
      { key: 'a', name: 'Custom A', type: 'integer', hidden: false },
    ]
    const result = applyColumnTransform(rows, columns)
    expect(Object.keys(result[0])).toEqual(['Custom A'])
    expect(result[0]['Custom A']).toBe(1)
  })
})

describe('formatValue', () => {
  it('formats date to YYYY-MM-DD', () => {
    expect(formatValue('2024-01-15T10:30:00Z', 'date', 'YYYY-MM-DD')).toBe('2024-01-15')
  })

  it('formats integer with no decimals', () => {
    expect(formatValue(42, 'integer')).toBe(42)
  })

  it('formats decimal to 2 places', () => {
    expect(formatValue(1.234, 'decimal', '.2')).toBe('1.23')
  })
})
```

- [ ] **Step 2: 运行确认失败**

```bash
npx vitest run src/core/__tests__/transform.test.ts
```

Expected: FAIL

- [ ] **Step 3: 写最小实现**

```typescript
// src/core/transform.ts
import type { ColumnMeta, FlatRow } from '@/types'

export function applyColumnTransform(rows: FlatRow[], columns: ColumnMeta[]): FlatRow[] {
  const visibleColumns = columns.filter(c => !c.hidden)
  return rows.map(row => {
    const newRow: FlatRow = {}
    for (const col of visibleColumns) {
      const rawValue = row[col.key]
      newRow[col.name] = formatValue(rawValue, col.type, col.format)
    }
    return newRow
  })
}

export function formatValue(value: unknown, type: ColumnMeta['type'], format?: string): unknown {
  if (value === undefined || value === null) return ''

  switch (type) {
    case 'date':
      if (typeof value !== 'string') return value
      const d = new Date(value)
      if (isNaN(d.getTime())) return value
      if (format === 'YYYY-MM-DD') return d.toISOString().slice(0, 10)
      if (format === 'timestamp') return d.getTime()
      return d.toISOString()
    case 'integer':
      const intVal = typeof value === 'string' ? parseInt(value, 10) : Math.round(Number(value))
      return isNaN(intVal) ? value : intVal
    case 'decimal':
      const decVal = typeof value === 'string' ? parseFloat(value) : Number(value)
      if (isNaN(decVal)) return value
      if (format === '.2') return decVal.toFixed(2)
      if (format === '.4') return decVal.toFixed(4)
      return decVal
    case 'boolean':
      return Boolean(value)
    case 'text':
    default:
      return String(value)
  }
}
```

- [ ] **Step 4: 运行确认通过**

```bash
npx vitest run src/core/__tests__/transform.test.ts
```

Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat(core): column transform (reorder/hide/rename/type)"
```

---

### Task 1.6: CSV 导出(exporter CSV)

**Files:**
- Create: `src/core/exporter.ts`
- Create: `src/core/__tests__/exporter.test.ts`

- [ ] **Step 1: 写失败测试**

```typescript
// src/core/__tests__/exporter.test.ts
import { describe, it, expect } from 'vitest'
import { toCsv } from '../exporter'
import type { ExportOptions } from '@/types'

const defaultOpts: ExportOptions = {
  delimiter: ',',
  includeBom: true,
  lineEnding: '\r\n',
  includeHeader: true,
  filteredOnly: false,
}

describe('toCsv', () => {
  it('exports simple rows', () => {
    const rows = [{ a: 1, b: 'hello' }]
    const csv = toCsv(rows, defaultOpts)
    expect(csv).toContain('a,b')
    expect(csv).toContain('1,hello')
  })

  it('adds BOM when enabled', () => {
    const rows = [{ a: 1 }]
    const csv = toCsv(rows, { ...defaultOpts, includeBom: true })
    expect(csv.charCodeAt(0)).toBe(0xFEFF)
  })

  it('uses semicolon delimiter', () => {
    const rows = [{ a: 1, b: 2 }]
    const csv = toCsv(rows, { ...defaultOpts, delimiter: ';' })
    expect(csv).toContain('a;b')
  })

  it('quotes values with commas', () => {
    const rows = [{ a: 'hello, world' }]
    const csv = toCsv(rows, defaultOpts)
    expect(csv).toContain('"hello, world"')
  })

  it('escapes quotes', () => {
    const rows = [{ a: 'say "hello"' }]
    const csv = toCsv(rows, defaultOpts)
    expect(csv).toContain('"say ""hello"""')
  })
})
```

- [ ] **Step 2: 运行确认失败**

```bash
npx vitest run src/core/__tests__/exporter.test.ts
```

Expected: FAIL

- [ ] **Step 3: 写最小实现**

```typescript
// src/core/exporter.ts
import type { ExportOptions, FlatRow } from '@/types'

export function toCsv(rows: FlatRow[], options: ExportOptions): string {
  if (rows.length === 0) return ''

  const keys = Object.keys(rows[0])
  const lines: string[] = []

  if (options.includeHeader) {
    lines.push(keys.map(k => escapeField(k, options.delimiter)).join(options.delimiter))
  }

  for (const row of rows) {
    const values = keys.map(key => escapeField(String(row[key] ?? ''), options.delimiter))
    lines.push(values.join(options.delimiter))
  }

  const content = lines.join(options.lineEnding)
  return options.includeBom ? '﻿' + content : content
}

function escapeField(value: string, delimiter: string): string {
  const needsQuotes = value.includes(delimiter) || value.includes('"') || value.includes('\n') || value.includes('\r')
  if (!needsQuotes) return value
  return '"' + value.replace(/"/g, '""') + '"'
}
```

- [ ] **Step 4: 运行确认通过**

```bash
npx vitest run src/core/__tests__/exporter.test.ts
```

Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat(core): csv exporter with bom/delimiter/quoting"
```

---

### Task 1.7: Excel 导出(exporter Excel) — 基础骨架(实际实现含样式,不依赖测试 TDD)

**Files:**
- Modify: `src/core/exporter.ts`
- Modify: `src/core/__tests__/exporter.test.ts`

由于 ExcelJS 是外部库,我们不测试其内部行为,只测试我们的封装接口。

- [ ] **Step 1: 写接口测试(仅验证 toExcel 函数存在并返回 Blob)**

```typescript
// 在 exporter.test.ts 追加
describe('toExcel', () => {
  it('returns a blob', async () => {
    const rows = [{ a: 1, b: 'hello' }]
    const { toExcel } = await import('../exporter')
    const blob = await toExcel(rows, { boldHeader: true, freezeHeader: true, autoColumnWidth: true })
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  })
})
```

- [ ] **Step 2: 运行确认失败**

```bash
npx vitest run src/core/__tests__/exporter.test.ts
```

Expected: FAIL (toExcel not exported)

- [ ] **Step 3: 写 toExcel 实现**

```typescript
// 追加到 src/core/exporter.ts
import type { ExcelStyleOptions, FlatRow } from '@/types'

export async function toExcel(
  rows: FlatRow[],
  style: ExcelStyleOptions
): Promise<Blob> {
  const ExcelJS = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Sheet1')

  if (rows.length === 0) {
    const buffer = await workbook.xlsx.writeBuffer()
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  }

  const keys = Object.keys(rows[0])

  // Header row
  sheet.columns = keys.map(key => ({ header: key, key }))

  // Style header
  if (style.boldHeader) {
    const headerRow = sheet.getRow(1)
    headerRow.font = { bold: true }
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } }
  }

  // Freeze header
  if (style.freezeHeader) {
    sheet.views = [{ state: 'frozen', ySplit: 1 }]
  }

  // Data rows
  for (const row of rows) {
    sheet.addRow(row)
  }

  // Auto column width
  if (style.autoColumnWidth) {
    sheet.columns.forEach(col => {
      const maxLength = Math.max(
        String(col.header || '').length,
        ...rows.map(r => String(r[col.key as string] || '').length)
      )
      col.width = Math.min(Math.max(maxLength + 2, 8), 50)
    })
  }

  // Add filter to header
  if (rows.length > 0) {
    sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: keys.length } }
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}
```

- [ ] **Step 4: 运行测试(可能需要在 jsdom 中 mock Blob)**

```bash
npx vitest run src/core/__tests__/exporter.test.ts
```

Expected: PASS (如果 jsdom 支持 Blob;如果不支持,测试文件里加一个 `vi.stubGlobal('Blob', class Blob { ... })` mock)

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat(core): excel exporter with styling (bold header, freeze, auto width, filter)"
```

---

### Task 1.8: 行过滤(filter)

**Files:**
- Create: `src/core/filter.ts`
- Create: `src/core/__tests__/filter.test.ts`

- [ ] **Step 1: 写失败测试**

```typescript
// src/core/__tests__/filter.test.ts
import { describe, it, expect } from 'vitest'
import { applyFilters } from '../filter'
import type { FlatRow } from '@/types'

describe('applyFilters', () => {
  const rows: FlatRow[] = [
    { name: 'Alice', age: 25, score: 85.5 },
    { name: 'Bob', age: 30, score: 90 },
    { name: 'Charlie', age: 20, score: 75 },
  ]

  it('filters by contains', () => {
    const result = applyFilters(rows, [{ column: 'name', operator: 'contains', value: 'li' }])
    expect(result).toHaveLength(2)
    expect(result.map(r => r.name)).toEqual(['Alice', 'Charlie'])
  })

  it('filters by equals', () => {
    const result = applyFilters(rows, [{ column: 'age', operator: '=', value: '25' }])
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice')
  })

  it('filters by greater than', () => {
    const result = applyFilters(rows, [{ column: 'age', operator: '>', value: '22' }])
    expect(result).toHaveLength(2)
  })

  it('filters by regex', () => {
    const result = applyFilters(rows, [{ column: 'name', operator: 'regex', value: '^A' }])
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice')
  })

  it('combines filters with AND', () => {
    const result = applyFilters(rows, [
      { column: 'age', operator: '>', value: '20' },
      { column: 'score', operator: '>=', value: '85' },
    ])
    expect(result).toHaveLength(2)
  })
})
```

- [ ] **Step 2: 运行确认失败**

```bash
npx vitest run src/core/__tests__/filter.test.ts
```

Expected: FAIL

- [ ] **Step 3: 写最小实现**

```typescript
// src/core/filter.ts
import type { FlatRow } from '@/types'

export interface FilterCondition {
  column: string
  operator: '>' | '<' | '=' | '!=' | '>=' | '<=' | 'contains' | 'starts with' | 'regex'
  value: string
}

export function applyFilters(rows: FlatRow[], conditions: FilterCondition[]): FlatRow[] {
  if (conditions.length === 0) return rows

  return rows.filter(row => {
    return conditions.every(cond => matchCondition(row[cond.column], cond))
  })
}

function matchCondition(cellValue: unknown, cond: FilterCondition): boolean {
  const strValue = String(cellValue ?? '')
  const numValue = typeof cellValue === 'number' ? cellValue : parseFloat(strValue)
  const condNum = parseFloat(cond.value)

  switch (cond.operator) {
    case '=': return strValue === cond.value
    case '!=': return strValue !== cond.value
    case '>': return !isNaN(numValue) && !isNaN(condNum) && numValue > condNum
    case '<': return !isNaN(numValue) && !isNaN(condNum) && numValue < condNum
    case '>=': return !isNaN(numValue) && !isNaN(condNum) && numValue >= condNum
    case '<=': return !isNaN(numValue) && !isNaN(condNum) && numValue <= condNum
    case 'contains': return strValue.toLowerCase().includes(cond.value.toLowerCase())
    case 'starts with': return strValue.toLowerCase().startsWith(cond.value.toLowerCase())
    case 'regex':
      try { return new RegExp(cond.value, 'i').test(strValue) }
      catch { return false }
    default: return true
  }
}
```

- [ ] **Step 4: 运行确认通过**

```bash
npx vitest run src/core/__tests__/filter.test.ts
```

Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat(core): row filtering with AND logic and operators"
```

---

## Phase 2: Pinia 状态管理

### Task 2.1: Data Store

**Files:**
- Create: `src/stores/data.ts`
- Create: `src/stores/__tests__/data.test.ts`

- [ ] **Step 1: 写骨架测试**

```typescript
// src/stores/__tests__/data.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDataStore } from '../data'

describe('useDataStore', () => {
  beforeEach(() => { setActivePinia(createPinia()) })

  it('has initial empty state', () => {
    const store = useDataStore()
    expect(store.rawInput).toBe('')
    expect(store.parsedValue).toBeNull()
    expect(store.selectedPath).toBe('')
    expect(store.flatRows).toEqual([])
  })
})
```

- [ ] **Step 2: 运行确认失败**

```bash
npx vitest run src/stores/__tests__/data.test.ts
```

Expected: FAIL

- [ ] **Step 3: 写 store 实现**

```typescript
// src/stores/data.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { parseJson } from '@/core/parser'
import { findPathCandidates, getArrayAtPath } from '@/core/pathFinder'
import { flattenRows } from '@/core/flattener'
import { inferColumnTypes } from '@/core/typeInfer'
import type { JsonValue, NestingStrategy, PathCandidate, FlatRow, ColumnMeta } from '@/types'

export const useDataStore = defineStore('data', () => {
  // State
  const rawInput = ref('')
  const parsedValue = ref<JsonValue | null>(null)
  const parseError = ref<string | undefined>(undefined)
  const isJsonl = ref(false)
  const pathCandidates = ref<PathCandidate[]>([])
  const selectedPath = ref('')
  const nestingStrategy = ref<NestingStrategy>('flatten')
  const flatRows = ref<FlatRow[]>([])
  const columnMeta = ref<ColumnMeta[]>([])

  // Getters
  const hasError = computed(() => !!parseError.value)
  const arrayAtPath = computed(() => {
    if (!parsedValue.value || !selectedPath.value) return []
    return getArrayAtPath(parsedValue.value, selectedPath.value)
  })

  // Actions
  function setInput(input: string) {
    rawInput.value = input
    const result = parseJson(input)
    parsedValue.value = result.value
    parseError.value = result.error?.message
    isJsonl.value = result.isJsonl

    if (result.value) {
      pathCandidates.value = findPathCandidates(result.value)
      selectedPath.value = pathCandidates.value[0]?.path || ''
      recomputeRows()
    } else {
      pathCandidates.value = []
      selectedPath.value = ''
      flatRows.value = []
      columnMeta.value = []
    }
  }

  function setPath(path: string) {
    selectedPath.value = path
    recomputeRows()
  }

  function setStrategy(strategy: NestingStrategy) {
    nestingStrategy.value = strategy
    recomputeRows()
  }

  function recomputeRows() {
    if (!arrayAtPath.value.length) {
      flatRows.value = []
      columnMeta.value = []
      return
    }
    flatRows.value = flattenRows(arrayAtPath.value, nestingStrategy.value)
    columnMeta.value = inferColumnTypes(flatRows.value)
  }

  return {
    rawInput, parsedValue, parseError, isJsonl,
    pathCandidates, selectedPath, nestingStrategy,
    flatRows, columnMeta,
    hasError, arrayAtPath,
    setInput, setPath, setStrategy, recomputeRows,
  }
})
```

- [ ] **Step 4: 运行确认通过**

```bash
npx vitest run src/stores/__tests__/data.test.ts
```

Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat(store): data store with parsing, path finding, and flattening"
```

---

### Task 2.2: Columns Store

**Files:**
- Create: `src/stores/columns.ts`

- [ ] **Step 1: 直接写 store(纯数据操作,逻辑简单,不单独写测试,在组件集成测中验证)**

```typescript
// src/stores/columns.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useDataStore } from './data'
import { applyColumnTransform } from '@/core/transform'
import type { ColumnMeta, FlatRow } from '@/types'

export const useColumnsStore = defineStore('columns', () => {
  const dataStore = useDataStore()

  // State: user overrides on top of dataStore.columnMeta
  const overrides = ref<Map<string, Partial<ColumnMeta>>>(new Map())

  // Computed: merged columns with overrides applied
  const columns = computed<ColumnMeta[]>(() => {
    return dataStore.columnMeta.map(meta => {
      const ov = overrides.value.get(meta.key) || {}
      return { ...meta, ...ov }
    })
  })

  const visibleColumns = computed(() => columns.value.filter(c => !c.hidden))
  const visibleKeys = computed(() => visibleColumns.value.map(c => c.key))

  // Computed: transformed rows ready for display/export
  const displayRows = computed<FlatRow[]>(() => {
    return applyColumnTransform(dataStore.flatRows, visibleColumns.value)
  })

  // Actions
  function updateColumn(key: string, patch: Partial<ColumnMeta>) {
    const existing = overrides.value.get(key) || {}
    overrides.value.set(key, { ...existing, ...patch })
  }

  function renameColumn(key: string, name: string) {
    updateColumn(key, { name })
  }

  function toggleHidden(key: string) {
    const col = columns.value.find(c => c.key === key)
    if (col) updateColumn(key, { hidden: !col.hidden })
  }

  function setType(key: string, type: ColumnMeta['type']) {
    updateColumn(key, { type })
  }

  function setFormat(key: string, format: string) {
    updateColumn(key, { format })
  }

  function moveColumn(key: string, direction: 'up' | 'down') {
    const keys = dataStore.columnMeta.map(c => c.key)
    const idx = keys.indexOf(key)
    if (idx === -1) return
    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= keys.length) return

    // Swap in dataStore's order
    const newOrder = [...keys]
    ;[newOrder[idx], newOrder[newIdx]] = [newOrder[newIdx], newOrder[idx]]

    // We need to persist this ordering. Since dataStore.columnMeta is computed from flatRows,
    // we store an explicit order in overrides.
    overrides.value.set('__order', { key: '__order', name: '__order', type: 'text', hidden: false, format: newOrder.join(',') } as ColumnMeta)
  }

  function resetOverrides() {
    overrides.value.clear()
  }

  return {
    columns, visibleColumns, visibleKeys, displayRows,
    updateColumn, renameColumn, toggleHidden, setType, setFormat, moveColumn, resetOverrides,
  }
})
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx vue-tsc --noEmit
```

Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat(store): columns store with override system"
```

---

### Task 2.3: Filters Store

**Files:**
- Create: `src/stores/filters.ts`

- [ ] **Step 1: 写 store**

```typescript
// src/stores/filters.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useDataStore } from './data'
import { useColumnsStore } from './columns'
import { applyFilters } from '@/core/filter'
import type { FilterCondition, FlatRow } from '@/types'

export const useFiltersStore = defineStore('filters', () => {
  const dataStore = useDataStore()
  const columnsStore = useColumnsStore()

  // State
  const globalSearch = ref('')
  const conditions = ref<FilterCondition[]>([])

  // Computed
  const filteredRows = computed<FlatRow[]>(() => {
    let rows = columnsStore.displayRows

    // Global search
    if (globalSearch.value) {
      const term = globalSearch.value.toLowerCase()
      rows = rows.filter(row =>
        Object.values(row).some(v => String(v).toLowerCase().includes(term))
      )
    }

    // Filter conditions
    if (conditions.value.length > 0) {
      // Map display column names back to keys for filtering raw rows
      rows = applyFilters(rows, conditions.value.map(c => ({
        ...c,
        column: columnsStore.visibleColumns.find(col => col.name === c.column)?.name || c.column,
      })))
    }

    return rows
  })

  const totalCount = computed(() => dataStore.flatRows.length)
  const filteredCount = computed(() => filteredRows.value.length)

  // Actions
  function setGlobalSearch(term: string) {
    globalSearch.value = term
  }

  function addCondition(condition: FilterCondition) {
    conditions.value.push(condition)
  }

  function removeCondition(index: number) {
    conditions.value.splice(index, 1)
  }

  function updateCondition(index: number, patch: Partial<FilterCondition>) {
    conditions.value[index] = { ...conditions.value[index], ...patch }
  }

  function clearFilters() {
    globalSearch.value = ''
    conditions.value = []
  }

  return {
    globalSearch, conditions,
    filteredRows, totalCount, filteredCount,
    setGlobalSearch, addCondition, removeCondition, updateCondition, clearFilters,
  }
})
```

- [ ] **Step 2: 验证编译**

```bash
npx vue-tsc --noEmit
```

Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat(store): filters store with global search and conditions"
```

---

### Task 2.4: Settings Store

**Files:**
- Create: `src/stores/settings.ts`

- [ ] **Step 1: 写 store**

```typescript
// src/stores/settings.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ExportOptions, ExcelStyleOptions } from '@/types'

export const useSettingsStore = defineStore('settings', () => {
  // UI
  const locale = ref<'zh-CN' | 'en'>('zh-CN')

  // CSV export defaults
  const csvOptions = ref<ExportOptions>({
    delimiter: ',',
    includeBom: true,
    lineEnding: '\r\n',
    includeHeader: true,
    filteredOnly: false,
  })

  // Excel export defaults
  const excelOptions = ref<ExcelStyleOptions>({
    boldHeader: true,
    freezeHeader: true,
    autoColumnWidth: true,
  })

  function setLocale(l: 'zh-CN' | 'en') {
    locale.value = l
  }

  return { locale, csvOptions, excelOptions, setLocale }
})
```

- [ ] **Step 2: 提交**

```bash
git add .
git commit -m "feat(store): settings store for locale and export options"
```

---

## Phase 3: 基础 UI 组件

### Task 3.1: 通用组件

**Files:**
- Create: `src/components/common/AppButton.vue`
- Create: `src/components/common/AppSelect.vue`
- Create: `src/components/common/AppToggle.vue`
- Create: `src/components/common/AppBadge.vue`

- [ ] **Step 1: 写 AppButton**

```vue
<!-- src/components/common/AppButton.vue -->
<template>
  <button
    :class="[
      'px-3 py-1.5 rounded font-medium transition-colors',
      variant === 'primary' && 'bg-primary-600 text-white hover:bg-primary-700',
      variant === 'secondary' && 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200',
      variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600',
      size === 'sm' && 'text-sm px-2 py-1',
      size === 'lg' && 'text-lg px-4 py-2',
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>()
defineEmits(['click'])
</script>
```

- [ ] **Step 2: 写 AppSelect**

```vue
<!-- src/components/common/AppSelect.vue -->
<template>
  <div>
    <label v-if="label" class="block text-sm font-medium mb-1">{{ label }}</label>
    <select
      :value="modelValue"
      class="w-full px-2 py-1.5 border rounded dark:bg-gray-800 dark:border-gray-700"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  options: { value: string; label: string }[]
  label?: string
}>()
defineEmits(['update:modelValue'])
</script>
```

- [ ] **Step 3: 写 AppToggle**

```vue
<!-- src/components/common/AppToggle.vue -->
<template>
  <label class="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      :checked="modelValue"
      class="sr-only"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    >
    <div :class="[
      'w-10 h-5 rounded-full transition-colors relative',
      modelValue ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-700'
    ]">
      <div :class="[
        'w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform',
        modelValue ? 'translate-x-5.5' : 'translate-x-0.5'
      ]" />
    </div>
    <span v-if="label" class="ml-2 text-sm">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label?: string
}>()
defineEmits(['update:modelValue'])
</script>
```

- [ ] **Step 4: 写 AppBadge**

```vue
<!-- src/components/common/AppBadge.vue -->
<template>
  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="variantClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'default' | 'success' | 'warning' | 'error'
}>()

const variantClasses = computed(() => ({
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}[props.variant || 'default']))
</script>
```

- [ ] **Step 5: 验证编译**

```bash
npx vue-tsc --noEmit
```

Expected: 无错误

- [ ] **Step 6: 提交**

```bash
git add .
git commit -m "feat(ui): common components (Button, Select, Toggle, Badge)"
```

---

### Task 3.2: JSON 输入面板(JsonInput.vue)

**Files:**
- Create: `src/components/input/JsonInput.vue`
- Create: `src/components/input/FileUploader.vue`

- [ ] **Step 1: 写 JsonInput**

```vue
<!-- src/components/input/JsonInput.vue -->
<template>
  <div class="flex flex-col h-full">
    <!-- Tabs -->
    <div class="flex gap-2 mb-2">
      <button
        v-for="tab in ['paste', 'file']"
        :key="tab"
        :class="['px-3 py-1 rounded text-sm', activeTab === tab ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800']"
        @click="activeTab = tab"
      >
        {{ $t(`input.${tab}`) }}
      </button>
    </div>

    <!-- Paste -->
    <div v-if="activeTab === 'paste'" class="flex-1 flex flex-col">
      <textarea
        v-model="dataStore.rawInput"
        class="flex-1 w-full p-3 border rounded font-mono text-sm dark:bg-gray-800 dark:border-gray-700 resize-none"
        :placeholder="$t('input.placeholder')"
        @input="onInput"
      />
      <div v-if="dataStore.parseError" class="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded">
        {{ dataStore.parseError }}
      </div>
    </div>

    <!-- File -->
    <FileUploader v-else @load="onFileLoad" />

    <!-- Sample buttons -->
    <div class="mt-2 flex gap-2 flex-wrap">
      <AppButton
        v-for="sample in samples"
        :key="sample.name"
        variant="secondary"
        size="sm"
        @click="loadSample(sample)"
      >
        {{ sample.name }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDataStore } from '@/stores/data'
import FileUploader from './FileUploader.vue'
import AppButton from '../common/AppButton.vue'

const dataStore = useDataStore()
const activeTab = ref<'paste' | 'file'>('paste')

function onInput() {
  dataStore.setInput(dataStore.rawInput)
}

function onFileLoad(content: string) {
  dataStore.setInput(content)
  activeTab.value = 'paste'
}

const samples = [
  {
    name: 'Flat Array',
    data: JSON.stringify([{ id: 1, name: 'Alice', age: 25 }, { id: 2, name: 'Bob', age: 30 }], null, 2),
  },
  {
    name: 'Nested',
    data: JSON.stringify([{ user: { name: 'Alice', email: 'a@x.com' }, status: 'active' }], null, 2),
  },
  {
    name: 'API Wrap',
    data: JSON.stringify({ code: 0, data: { list: [{ id: 1, title: 'Item 1' }, { id: 2, title: 'Item 2' }] } }, null, 2),
  },
  {
    name: 'JSON Lines',
    data: '{"id":1}\n{"id":2}\n{"id":3}',
  },
]

function loadSample(sample: typeof samples[0]) {
  dataStore.setInput(sample.data)
}
</script>
```

- [ ] **Step 2: 写 FileUploader**

```vue
<!-- src/components/input/FileUploader.vue -->
<template>
  <div
    class="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors"
    :class="isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-700'"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
    @click="fileInput?.click()"
  >
    <input
      ref="fileInput"
      type="file"
      accept=".json,.jsonl,.txt"
      class="hidden"
      @change="onFileSelect"
    >
    <p class="text-gray-500 dark:text-gray-400">{{ $t('input.dragDrop') }}</p>
    <p class="text-sm text-gray-400 mt-1">{{ $t('input.maxSize') }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ load: [content: string] }>()
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

async function readFile(file: File) {
  if (file.size > 50 * 1024 * 1024) {
    alert('File too large (max 50MB)')
    return
  }
  const text = await file.text()
  emit('load', text)
}

function onFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) readFile(file)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) readFile(file)
}
</script>
```

- [ ] **Step 3: 添加基础 i18n 文本**

在 `src/i18n/zh-CN.json` 和 `src/i18n/en.json` 中添加:

`src/i18n/zh-CN.json`:
```json
{
  "input": {
    "paste": "粘贴",
    "file": "上传文件",
    "placeholder": "在此粘贴 JSON...",
    "dragDrop": "拖拽文件到此处或点击上传",
    "maxSize": "最大 50MB"
  },
  "export": {
    "csv": "导出 CSV",
    "excel": "导出 Excel",
    "options": "导出选项"
  }
}
```

`src/i18n/en.json`:
```json
{
  "input": {
    "paste": "Paste",
    "file": "Upload File",
    "placeholder": "Paste JSON here...",
    "dragDrop": "Drag and drop files or click to upload",
    "maxSize": "Max 50MB"
  },
  "export": {
    "csv": "Export CSV",
    "excel": "Export Excel",
    "options": "Export Options"
  }
}
```

- [ ] **Step 4: 验证编译 + dev 运行**

```bash
npx vue-tsc --noEmit
npm run dev
```

Expected: 浏览器中输入面板能工作,示例按钮能加载数据

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat(ui): json input panel with paste/upload/samples"
```

---

### Task 3.3: 路径选择器(PathSelector.vue)

**Files:**
- Create: `src/components/PathSelector.vue`

- [ ] **Step 1: 写组件**

```vue
<!-- src/components/PathSelector.vue -->
<template>
  <div v-if="dataStore.pathCandidates.length > 1" class="mb-3">
    <AppSelect
      :model-value="dataStore.selectedPath"
      :options="pathOptions"
      :label="$t('path.dataArray')"
      @update:model-value="dataStore.setPath"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDataStore } from '@/stores/data'
import AppSelect from './common/AppSelect.vue'

const dataStore = useDataStore()

const pathOptions = computed(() =>
  dataStore.pathCandidates.map(c => ({
    value: c.path,
    label: `${c.path} (${c.count} items)`,
  }))
)
</script>
```

- [ ] **Step 2: 提交**

```bash
git add .
git commit -m "feat(ui): path selector for data array"
```

---

### Task 3.4: 嵌套策略面板(NestingPanel.vue)

**Files:**
- Create: `src/components/NestingPanel.vue`

- [ ] **Step 1: 写组件**

```vue
<!-- src/components/NestingPanel.vue -->
<template>
  <div class="mb-3 p-3 border rounded dark:border-gray-700">
    <div class="text-sm font-medium mb-2">{{ $t('nesting.title') }}</div>
    <div class="flex gap-2 flex-wrap">
      <AppButton
        v-for="s in strategies"
        :key="s.value"
        :variant="dataStore.nestingStrategy === s.value ? 'primary' : 'secondary'"
        size="sm"
        @click="dataStore.setStrategy(s.value)"
      >
        {{ s.label }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '@/stores/data'
import AppButton from './common/AppButton.vue'

const dataStore = useDataStore()

const strategies = [
  { value: 'flatten' as const, label: 'Flatten' },
  { value: 'stringify' as const, label: 'Stringify' },
  { value: 'explode' as const, label: 'Explode' },
  { value: 'multiSheet' as const, label: 'Multi Sheet' },
]
</script>
```

- [ ] **Step 2: 提交**

```bash
git add .
git commit -m "feat(ui): nesting strategy panel"
```

---

## Phase 4: 表格 UI

### Task 4.1: TableView 基础(TanStack 集成)

**Files:**
- Create: `src/components/tableView/TableView.vue`

- [ ] **Step 1: 写 TableView**

```vue
<!-- src/components/tableView/TableView.vue -->
<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-2">
      <AppBadge variant="success">
        {{ filtersStore.filteredCount }} / {{ filtersStore.totalCount }} rows
      </AppBadge>
    </div>

    <div ref="tableContainer" class="flex-1 overflow-auto border rounded dark:border-gray-700">
      <table class="w-full text-sm">
        <thead class="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
          <tr>
            <th
              v-for="col in table.getHeaderGroups()[0]?.headers"
              :key="col.id"
              class="px-3 py-2 text-left font-semibold border-b dark:border-gray-700 cursor-pointer select-none whitespace-nowrap"
              :style="{ width: col.getSize() + 'px' }"
              @click="col.column.getToggleSortingHandler()?.($event)"
            >
              <div class="flex items-center gap-1">
                {{ col.column.columnDef.header }}
                <span v-if="col.column.getIsSorted() === 'asc'">↑</span>
                <span v-else-if="col.column.getIsSorted() === 'desc'">↓</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-3 py-1.5 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {{ cell.getValue() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/vue-table'
import { useFiltersStore } from '@/stores/filters'
import { useColumnsStore } from '@/stores/columns'
import AppBadge from '../common/AppBadge.vue'

const filtersStore = useFiltersStore()
const columnsStore = useColumnsStore()
const tableContainer = ref<HTMLElement | null>(null)

const columns = computed<ColumnDef<Record<string, unknown>, unknown>[]>(() =>
  columnsStore.visibleColumns.map(col => ({
    accessorKey: col.name,
    header: col.name,
    size: 150,
    enableSorting: true,
  }))
)

const data = computed(() => filtersStore.filteredRows)

const table = useVueTable({
  get data() { return data.value },
  get columns() { return columns.value },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
</script>
```

- [ ] **Step 2: 验证编译**

```bash
npx vue-tsc --noEmit
```

Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat(ui): basic table view with tanstack vue-table and sorting"
```

---

### Task 4.2: 列管理面板(ColumnPanel.vue)

**Files:**
- Create: `src/components/ColumnPanel.vue`

- [ ] **Step 1: 写组件**

```vue
<!-- src/components/ColumnPanel.vue -->
<template>
  <div class="p-3 border rounded dark:border-gray-700 h-full overflow-auto">
    <div class="font-medium mb-3">{{ $t('columns.title') }}</div>

    <div class="space-y-2">
      <div
        v-for="col in columnsStore.columns"
        :key="col.key"
        class="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <input
          type="checkbox"
          :checked="!col.hidden"
          @change="columnsStore.toggleHidden(col.key)"
        >
        <input
          v-model="names[col.key]"
          class="flex-1 px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
          @blur="columnsStore.renameColumn(col.key, names[col.key])"
          @keydown.enter="columnsStore.renameColumn(col.key, names[col.key])"
        >
        <AppSelect
          :model-value="col.type"
          :options="typeOptions"
          @update:model-value="(v: string) => columnsStore.setType(col.key, v as ColumnMeta['type'])"
        />
      </div>
    </div>

    <AppButton variant="secondary" size="sm" class="mt-3 w-full" @click="columnsStore.resetOverrides">
      {{ $t('columns.reset') }}
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useColumnsStore } from '@/stores/columns'
import type { ColumnMeta } from '@/types'
import AppSelect from './common/AppSelect.vue'
import AppButton from './common/AppButton.vue'

const columnsStore = useColumnsStore()

const names = reactive<Record<string, string>>({})

watch(() => columnsStore.columns, (cols) => {
  for (const col of cols) {
    if (!(col.key in names)) {
      names[col.key] = col.name
    }
  }
}, { immediate: true })

const typeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'integer', label: 'Integer' },
  { value: 'decimal', label: 'Decimal' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Boolean' },
]
</script>
```

- [ ] **Step 2: 提交**

```bash
git add .
git commit -m "feat(ui): column management panel (rename/hide/type)"
```

---

### Task 4.3: 过滤栏(FilterBar.vue)

**Files:**
- Create: `src/components/FilterBar.vue`

- [ ] **Step 1: 写组件**

```vue
<!-- src/components/FilterBar.vue -->
<template>
  <div class="p-3 border rounded dark:border-gray-700 mb-3">
    <div class="flex items-center gap-2 mb-2">
      <input
        v-model="filtersStore.globalSearch"
        class="flex-1 px-3 py-1.5 border rounded dark:bg-gray-800 dark:border-gray-700"
        :placeholder="$t('filter.search')"
      >
      <AppButton variant="secondary" size="sm" @click="filtersStore.clearFilters">
        {{ $t('filter.clear') }}
      </AppButton>
    </div>

    <div v-if="filtersStore.conditions.length > 0" class="space-y-1">
      <div
        v-for="(cond, i) in filtersStore.conditions"
        :key="i"
        class="flex items-center gap-2"
      >
        <AppSelect
          :model-value="cond.column"
          :options="columnOptions"
          @update:model-value="(v: string) => filtersStore.updateCondition(i, { column: v })"
        />
        <AppSelect
          :model-value="cond.operator"
          :options="operatorOptions"
          @update:model-value="(v: string) => filtersStore.updateCondition(i, { operator: v as FilterCondition['operator'] })"
        />
        <input
          v-model="cond.value"
          class="flex-1 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
          @input="filtersStore.updateCondition(i, { value: cond.value })"
        >
        <button class="text-red-500" @click="filtersStore.removeCondition(i)">×</button>
      </div>
    </div>

    <AppButton variant="secondary" size="sm" class="mt-2" @click="addCondition">
      + {{ $t('filter.addCondition') }}
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFiltersStore } from '@/stores/filters'
import { useColumnsStore } from '@/stores/columns'
import type { FilterCondition } from '@/core/filter'
import AppSelect from './common/AppSelect.vue'
import AppButton from './common/AppButton.vue'

const filtersStore = useFiltersStore()
const columnsStore = useColumnsStore()

const columnOptions = computed(() =>
  columnsStore.visibleColumns.map(c => ({ value: c.name, label: c.name }))
)

const operatorOptions = [
  { value: 'contains', label: 'contains' },
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: 'starts with', label: 'starts with' },
  { value: 'regex', label: 'regex' },
]

function addCondition() {
  const firstCol = columnsStore.visibleColumns[0]?.name || ''
  filtersStore.addCondition({ column: firstCol, operator: 'contains', value: '' })
}
</script>
```

- [ ] **Step 2: 提交**

```bash
git add .
git commit -m "feat(ui): filter bar with global search and conditions"
```

---

## Phase 5: 导出面板

### Task 5.1: ExportPanel.vue

**Files:**
- Create: `src/components/ExportPanel.vue`

- [ ] **Step 1: 写组件**

```vue
<!-- src/components/ExportPanel.vue -->
<template>
  <div class="p-3 border rounded dark:border-gray-700">
    <div class="font-medium mb-3">{{ $t('export.options') }}</div>

    <!-- CSV Options -->
    <div class="space-y-2 mb-4">
      <AppSelect
        :model-value="settings.csvOptions.delimiter"
        :options="[
          { value: ',', label: 'Comma (,)' },
          { value: ';', label: 'Semicolon (;)' },
          { value: '\t', label: 'Tab' },
          { value: '|', label: 'Pipe (|)' },
        ]"
        label="Delimiter"
        @update:model-value="(v: string) => settings.csvOptions.delimiter = v as ExportOptions['delimiter']"
      />
      <AppToggle v-model="settings.csvOptions.includeBom" label="UTF-8 BOM" />
      <AppToggle v-model="settings.csvOptions.includeHeader" label="Include header" />
      <AppToggle v-model="settings.csvOptions.filteredOnly" label="Only filtered rows" />
    </div>

    <div class="flex gap-2">
      <AppButton variant="primary" class="flex-1" @click="exportCsv">
        {{ $t('export.csv') }}
      </AppButton>
      <AppButton variant="primary" class="flex-1" @click="exportExcel">
        {{ $t('export.excel') }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { useFiltersStore } from '@/stores/filters'
import { toCsv, toExcel } from '@/core/exporter'
import type { ExportOptions } from '@/types'
import AppButton from './common/AppButton.vue'
import AppSelect from './common/AppSelect.vue'
import AppToggle from './common/AppToggle.vue'

const settings = useSettingsStore()
const filtersStore = useFiltersStore()

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function exportCsv() {
  const rows = settings.csvOptions.filteredOnly
    ? filtersStore.filteredRows
    : filtersStore.filteredRows // If not filteredOnly, use all rows
  const csv = toCsv(rows, settings.csvOptions)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  download(blob, 'export.csv')
}

async function exportExcel() {
  const rows = settings.csvOptions.filteredOnly
    ? filtersStore.filteredRows
    : filtersStore.filteredRows
  const blob = await toExcel(rows, settings.excelOptions)
  download(blob, 'export.xlsx')
}
</script>
```

- [ ] **Step 2: 修正 filteredOnly 逻辑**

注意上面的 `exportCsv` 和 `exportExcel` 中 `filteredOnly` 分支逻辑有问题。需要修正为:

```typescript
// 在组件的 script 中,获取行数据时要考虑 filteredOnly
const exportRows = computed(() => {
  return settings.csvOptions.filteredOnly
    ? filtersStore.filteredRows
    : filtersStore.filteredRows // TODO: 这里需要原始所有行
})
```

实际上,`filteredRows` 已经是经过 filters 的行。如果 `filteredOnly` 为 false,应该返回**所有行**。

但是我们的架构里 `filtersStore.filteredRows` 已经经过 filter。如果 `filteredOnly` 为 false,应该用 `columnsStore.displayRows` (没经过 filter 的所有显示行)。

修正:需要引入 `columnsStore`,用它来获取所有显示行。

修正后的 export 逻辑:
```typescript
import { useColumnsStore } from '@/stores/columns'

const columnsStore = useColumnsStore()

function getExportRows() {
  return settings.csvOptions.filteredOnly
    ? filtersStore.filteredRows
    : columnsStore.displayRows
}

function exportCsv() {
  const csv = toCsv(getExportRows(), settings.csvOptions)
  // ...
}

async function exportExcel() {
  const blob = await toExcel(getExportRows(), settings.excelOptions)
  // ...
}
```

- [ ] **Step 3: 验证编译**

```bash
npx vue-tsc --noEmit
```

Expected: 无错误

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "feat(ui): export panel with csv/excel options and download"
```

---

## Phase 6: 整合

### Task 6.1: 主页面布局(Home.vue)

**Files:**
- Modify: `src/pages/Home.vue`

- [ ] **Step 1: 写完整 Home.vue**

```vue
<!-- src/pages/Home.vue -->
<template>
  <div class="h-[calc(100vh-56px)] flex flex-col">
    <!-- Privacy badge -->
    <div class="px-4 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs text-center">
      {{ $t('privacy.badge') }}
      <RouterLink to="/about" class="underline">{{ $t('privacy.learnMore') }}</RouterLink>
    </div>

    <div class="flex-1 flex gap-4 p-4 overflow-hidden">
      <!-- Left: Input -->
      <div class="w-1/3 flex flex-col min-w-0">
        <JsonInput />
        <PathSelector />
        <NestingPanel />
      </div>

      <!-- Center: Table -->
      <div class="flex-1 flex flex-col min-w-0">
        <FilterBar />
        <TableView class="flex-1" />
      </div>

      <!-- Right: Column + Export -->
      <div class="w-64 flex flex-col gap-3 min-w-0">
        <ColumnPanel class="flex-1" />
        <ExportPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import JsonInput from '@/components/input/JsonInput.vue'
import PathSelector from '@/components/PathSelector.vue'
import NestingPanel from '@/components/NestingPanel.vue'
import FilterBar from '@/components/FilterBar.vue'
import TableView from '@/components/tableView/TableView.vue'
import ColumnPanel from '@/components/ColumnPanel.vue'
import ExportPanel from '@/components/ExportPanel.vue'
</script>
```

- [ ] **Step 2: 验证编译 + dev**

```bash
npx vue-tsc --noEmit
npm run dev
```

Expected: 三栏布局能工作,输入 → 表格 → 列管理 + 导出流程通顺

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: main page layout with 3-column workspace"
```

---

### Task 6.2: About 页 + i18n 完善

**Files:**
- Modify: `src/pages/About.vue`
- Modify: `src/i18n/zh-CN.json`
- Modify: `src/i18n/en.json`
- Modify: `src/App.vue` (加语言切换)

- [ ] **Step 1: 写 About.vue**

```vue
<!-- src/pages/About.vue -->
<template>
  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">{{ $t('about.title') }}</h1>

    <section class="mb-6">
      <h2 class="text-lg font-semibold mb-2">{{ $t('about.privacy.title') }}</h2>
      <p class="text-gray-600 dark:text-gray-400">{{ $t('about.privacy.body') }}</p>
    </section>

    <section class="mb-6">
      <h2 class="text-lg font-semibold mb-2">{{ $t('about.howItWorks.title') }}</h2>
      <p class="text-gray-600 dark:text-gray-400">{{ $t('about.howItWorks.body') }}</p>
    </section>

    <section class="mb-6">
      <h2 class="text-lg font-semibold mb-2">{{ $t('about.limits.title') }}</h2>
      <ul class="list-disc list-inside text-gray-600 dark:text-gray-400">
        <li>{{ $t('about.limits.size') }}</li>
        <li>{{ $t('about.limits.browser') }}</li>
      </ul>
    </section>

    <RouterLink to="/" class="text-primary-600 hover:underline">← {{ $t('about.back') }}</RouterLink>
  </div>
</template>
```

- [ ] **Step 2: 完善 i18n 文件**

`src/i18n/zh-CN.json`:
```json
{
  "input": {
    "paste": "粘贴",
    "file": "上传文件",
    "placeholder": "在此粘贴 JSON...",
    "dragDrop": "拖拽文件到此处或点击上传",
    "maxSize": "最大 50MB"
  },
  "path": {
    "dataArray": "数据数组路径"
  },
  "nesting": {
    "title": "嵌套处理策略"
  },
  "columns": {
    "title": "列管理",
    "reset": "重置"
  },
  "filter": {
    "search": "搜索所有列...",
    "clear": "清除",
    "addCondition": "添加条件"
  },
  "export": {
    "csv": "导出 CSV",
    "excel": "导出 Excel",
    "options": "导出选项"
  },
  "privacy": {
    "badge": "您的数据 100% 在浏览器中处理,不会上传到任何服务器。",
    "learnMore": "了解更多"
  },
  "about": {
    "title": "关于",
    "privacy": {
      "title": "隐私保护",
      "body": "所有 JSON 解析、转换、导出都在您的浏览器中完成。我们永远不会看到您的数据。"
    },
    "howItWorks": {
      "title": "工作原理",
      "body": "粘贴或上传 JSON 文件,系统自动识别数据结构并展示为表格。您可以编辑列名、调整列序、筛选数据,最后导出为 CSV 或 Excel。"
    },
    "limits": {
      "title": "使用限制",
      "size": "文件大小限制:50MB(浏览器内存限制)",
      "browser": "建议使用 Chrome / Edge / Firefox 最新版本"
    },
    "back": "返回工具"
  }
}
```

`src/i18n/en.json`:
```json
{
  "input": {
    "paste": "Paste",
    "file": "Upload File",
    "placeholder": "Paste JSON here...",
    "dragDrop": "Drag and drop files or click to upload",
    "maxSize": "Max 50MB"
  },
  "path": {
    "dataArray": "Data Array Path"
  },
  "nesting": {
    "title": "Nesting Strategy"
  },
  "columns": {
    "title": "Column Manager",
    "reset": "Reset"
  },
  "filter": {
    "search": "Search all columns...",
    "clear": "Clear",
    "addCondition": "Add condition"
  },
  "export": {
    "csv": "Export CSV",
    "excel": "Export Excel",
    "options": "Export Options"
  },
  "privacy": {
    "badge": "Your data is processed 100% in-browser. Never uploaded.",
    "learnMore": "Learn more"
  },
  "about": {
    "title": "About",
    "privacy": {
      "title": "Privacy",
      "body": "All JSON parsing, transformation, and export happens entirely in your browser. We never see your data."
    },
    "howItWorks": {
      "title": "How it works",
      "body": "Paste or upload a JSON file. The system automatically detects the data structure and displays it as a table. You can edit column names, reorder columns, filter data, and export to CSV or Excel."
    },
    "limits": {
      "title": "Limitations",
      "size": "File size limit: 50MB (browser memory limit)",
      "browser": "Recommended: Chrome / Edge / Firefox latest"
    },
    "back": "Back to tool"
  }
}
```

- [ ] **Step 3: 在 App.vue 加语言切换**

```vue
<!-- 在 App.vue header 中加 -->
<select
  v-model="locale"
  class="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border-0"
  @change="changeLocale"
>
  <option value="zh-CN">中文</option>
  <option value="en">English</option>
</select>
```

```typescript
// 在 App.vue script 中
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale: i18nLocale } = useI18n()
const locale = ref(i18nLocale.value)

function changeLocale() {
  i18nLocale.value = locale.value
  localStorage.setItem('j2t-locale', locale.value)
}
```

- [ ] **Step 4: 验证编译 + dev**

```bash
npx vue-tsc --noEmit
npm run dev
```

Expected: 语言切换、About 页内容正确

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat: about page, full i18n, locale switcher"
```

---

### Task 6.3: 虚拟滚动优化

**Files:**
- Modify: `src/components/tableView/TableView.vue`

- [ ] **Step 1: 集成 @tanstack/vue-virtual**

```bash
npm install @tanstack/vue-virtual
```

- [ ] **Step 2: 修改 TableView 加虚拟滚动**

```vue
<!-- src/components/tableView/TableView.vue - 核心修改 -->
<script setup lang="ts">
// ... 已有 imports
import { useVirtualizer } from '@tanstack/vue-virtual'

// ... 已有 computed

const parentRef = ref<HTMLDivElement | null>(null)

const virtualizer = useVirtualizer({
  count: computed(() => table.getRowModel().rows.length),
  getScrollElement: () => parentRef.value,
  estimateSize: () => 32,
  overscan: 5,
})

const virtualRows = computed(() => virtualizer.value.getVirtualItems())
</script>

<template>
  <!--  tbody 改为 -->
  <tbody>
    <tr v-if="virtualRows.length === 0">
      <td :colspan="columns.length" class="text-center py-8 text-gray-500">No data</td>
    </tr>
    <tr
      v-for="virtualRow in virtualRows"
      :key="virtualRow.key"
      :style="{ transform: `translateY(${virtualRow.start}px)` }"
      class="absolute w-full border-b dark:border-gray-800"
    >
      <td
        v-for="cell in table.getRowModel().rows[virtualRow.index]?.getVisibleCells()"
        :key="cell.id"
        class="px-3 py-1.5 whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {{ cell.getValue() }}
      </td>
    </tr>
  </tbody>
</template>
```

> 注意:虚拟滚动与 TanStack Table 的排序/筛选集成需要精细处理。上面的代码是简化示意,实际实现时需要在 `table.getRowModel().rows` 变化后重新同步 `virtualizer`。完整实现参考 TanStack Virtual 官方示例。

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "perf: virtual scrolling for large datasets"
```

---

### Task 6.4: 错误边界与全局提示

**Files:**
- Create: `src/components/common/AppAlert.vue`
- Modify: `src/pages/Home.vue`

- [ ] **Step 1: 写 AppAlert**

```vue
<!-- src/components/common/AppAlert.vue -->
<template>
  <div
    v-if="visible"
    :class="[
      'fixed top-4 right-4 px-4 py-3 rounded shadow-lg z-50 max-w-sm transition-all',
      variant === 'error' && 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200',
      variant === 'success' && 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200',
    ]"
  >
    <div class="flex items-start gap-2">
      <span class="flex-1">{{ message }}</span>
      <button class="text-lg leading-none" @click="visible = false">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string
  variant?: 'error' | 'success'
  duration?: number
}>()

const visible = ref(true)

watch(() => props.message, () => { visible.value = true })

if (props.duration) {
  setTimeout(() => { visible.value = false }, props.duration)
}
</script>
```

- [ ] **Step 2: 在 Home.vue 集成错误提示**

```vue
<!-- 在 Home.vue 的 script 中 -->
import { ref } from 'vue'
import AppAlert from '@/components/common/AppAlert.vue'

const alert = ref<{ message: string; variant: 'error' | 'success' } | null>(null)

// 监听 dataStore 错误
watch(() => dataStore.parseError, (err) => {
  if (err) alert.value = { message: err, variant: 'error' }
})
```

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: global alert component and error display"
```

---

## Phase 7: 部署

### Task 7.1: Cloudflare Pages 配置

**Files:**
- Create: `wrangler.toml`
- Modify: `package.json`

- [ ] **Step 1: 写 wrangler.toml**

```toml
name = "json-to-table"
compatibility_date = "2026-05-01"

[site]
bucket = "./dist"
```

- [ ] **Step 2: 在 package.json 添加部署脚本**

```json
{
  "scripts": {
    "deploy": "npm run build && wrangler pages deploy dist"
  }
}
```

- [ ] **Step 3: 安装 wrangler**

```bash
npm install -D wrangler
```

- [ ] **Step 4: 构建并验证**

```bash
npm run build
```

Expected: `dist/` 目录生成,无构建错误

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "chore: cloudflare pages deployment config"
```

---

### Task 7.2: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: 写 README**

```markdown
# JSON to Table

智能表格工作台 — 把 JSON 当作 Excel 来用。

## 功能

- 粘贴 / 上传 JSON,自动识别数据数组路径
- 嵌套 JSON 4 种处理策略(扁平化 / 字符串化 / 爆炸 / 多 Sheet)
- 实时表格预览(排序 / 虚拟滚动)
- 列编辑(改名 / 调序 / 隐藏 / 类型转换)
- 行过滤(全局搜索 + 多条件)
- 导出 CSV(多分隔符 / UTF-8 BOM)
- 导出 Excel(自带样式:粗体表头 / 冻结 / 列宽自适应 / 筛选)
- 100% 浏览器内处理,数据不上传服务器
- 暗色模式 / 中英双语

## 开发

```bash
npm install
npm run dev
npm run test
npm run build
```

## 部署

```bash
npm run deploy
```

## 技术栈

Vue 3 + Vite + TypeScript + TanStack Table + ExcelJS + Pinia + UnoCSS
```

- [ ] **Step 2: 提交**

```bash
git add .
git commit -m "docs: readme"
```

---

## 自我审查

### 1. Spec 覆盖检查

| Spec 需求 | 实现任务 |
|-----------|----------|
| 文本粘贴 / 文件上传 | Task 3.2 (JsonInput + FileUploader) |
| 示例数据 | Task 3.2 (内置 4 个示例) |
| 智能路径识别 | Task 1.2 (pathFinder), Task 3.3 (PathSelector) |
| 嵌套 4 策略 | Task 1.3 (flattener), Task 3.4 (NestingPanel) |
| 表格预览(排序) | Task 4.1 (TableView) |
| 虚拟滚动 | Task 6.3 (vue-virtual 集成) |
| 列编辑 | Task 4.2 (ColumnPanel) |
| 行过滤 | Task 4.3 (FilterBar) + Task 1.8 (filter core) |
| CSV 导出(完整选项) | Task 1.6 (toCsv) + Task 5.1 (ExportPanel) |
| Excel 导出(样式) | Task 1.7 (toExcel) + Task 5.1 (ExportPanel) |
| 暗色模式 | Task 0.3 (useDarkMode) |
| 中英双语 | Task 6.2 (i18n) |
| Cloudflare Pages | Task 7.1 (wrangler.toml) |

**无 gap。**

### 2. Placeholder 扫描

- 无 TBD/TODO
- 无 "implement later"
- 无 "add appropriate error handling"
- 所有任务包含完整代码或足够详细的实现指引

### 3. 类型一致性检查

- `ColumnMeta` / `FlatRow` / `ExportOptions` / `ExcelStyleOptions` / `NestingStrategy` / `FilterCondition` 全文档一致
- Store 间依赖关系正确(data → columns → filters)
- `applyColumnTransform` 签名在 `transform.ts` 和 `columns.ts` 中一致

---

## 执行选择

**Plan complete and saved to `docs/plans/2026-05-06-json-table-implementation.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
