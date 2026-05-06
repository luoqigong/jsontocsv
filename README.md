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
