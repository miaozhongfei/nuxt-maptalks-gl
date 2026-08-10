# AGENTS.md

## 构建 / 开发

- **开发前必须准备**：直接运行 `pnpm dev` 即可（内部先执行 `dev:prepare`，再启动 playground）
- **单独准备**：`pnpm dev:prepare`（stub 模块 → prepare → prepare playground，跳过会导致 playground 无法解析模块引用）
- **开发服务器**：`pnpm dev`
- **构建产物**：`pnpm prepack`（底层调用 `nuxt-module-build build`）

## 检查 / 类型 / 测试

- **Lint**：`pnpm lint`（执行 `oxlint . && oxlint docs`，两个独立目标目录）
- **Lint 修复**：`pnpm lint:fix`
- **格式化**：`pnpm fmt`（oxfmt），`pnpm fmt:check`（仅检查不写入）
- **类型检查**：`pnpm typecheck`（先根目录 `vue-tsc --noEmit`，再 `cd playground && vue-tsc --noEmit`，两者都必须通过）
- **E2E 测试**：`pnpm e2e`（进入 playground 目录执行）

## 环境要求

- **Node**：26.1.0（通过 vfox 管理，见 `.tool-versions` / `.vfox.toml`）
- **包管理器**：仅支持 **pnpm 10.22.0**。`.npmrc` 中 `engine-strict=true` 且 `strict-peer-dependencies=true`，用 npm 安装会失败
- **镜像源**：`https://registry.npmmirror.com/`（淘宝镜像，`.npmrc` 中配置）
- **peerDependency 安装**：`maptalks-gl` 为 peerDependency，因 `.npmrc` 中 `strict-peer-dependencies=true`，`playground/` 与各示例必须显式安装 `maptalks-gl`，否则 `pnpm install` 失败

## 架构

- **入口**：`src/module.ts`，使用 `defineNuxtModule`，`configKey` 为 `'maptalksGl'`（对应 `runtimeConfig.public.maptalksGl`）
- **运行时代码**：`src/runtime/`，构建时会加入 transpile 列表
- **安装期行为**（`src/module.ts` setup）：注入 `maptalks-gl/dist/maptalks-gl.css` 到 `nuxt.options.css`、将 `maptalks-gl` 加入 `build.transpile`、按实测调优 Vite `optimizeDeps`；`addImportsDir` 自动导入 `runtime/composables`（含 `presets`）
- **构建外部化**（`build.config.ts`）：`nuxt`、`@nuxt/schema`、`@nuxt/kit`、`vue`、`defu`、`maptalks-gl` 均标记为 external，不可打包进产物
- **tsconfig** 继承 `.nuxt/tsconfig.json`（Nuxt prepare 时自动生成，必须先运行 `dev:prepare`）
- **工作区**：pnpm workspace，根包 + `docs/` + `playground/` + `examples/*`
- **运行时依赖**：`@nuxt/kit`、`consola`、`defu`、`compare-versions`
- **peerDependency**：`maptalks-gl`（范围 `">=0.124 <1"`），由各项目控制确切版本、不打包进产物，避免重复打包与版本漂移
- **多地图与注册表**：核心含 `MapRegistry`（与 `LayerRegistry` 并列），多地图经命名实例 + 注册表访问（`useMaptalks` 创建 / `useMaptalksInstance` 获取 / `useMaptalksRegistry` 枚举），不引入 `$` 全局注入
- **声明式组件（v2 薄壳）**：`addComponentsDir` 自动导入 `MaptalksMap` 与 4 个图层预设组件（`MaptalksTileLayer` / `MaptalksVectorTileLayer` / `MaptalksGroupGLLayer` / `MaptalksGLTFLayer`），通过 provide/inject 传递 map context；组件只做 composable 的模板封装，绝不自建逻辑

## superpowers 文档规范

> **强制规则**：使用 superpowers 插件工作流时，设计文档（spec）与开发计划文档（plan）必须写入以下固定目录，且文件名带日期前缀。

| 文档类型 | 产出技能 | 路径 |
|----------|----------|------|
| 设计文档（spec） | `brainstorming` | `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` |
| 开发计划文档（plan） | `writing-plans` | `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md` |

- **流程顺序**：brainstorming（写 spec）→ writing-plans（写 plan）→ 执行
- **两者均带日期前缀**（`YYYY-MM-DD`）
- 违反此路径约定的文档在 code review 中视为不通过

## 发版流程

| 命令 | 版本升级 | 说明 |
|------|----------|------|
| `pnpm release` | 自动推断 | 标准发布，不带 flag，由 changelogen 按 commit 前缀推断（major > minor > patch） |
| `pnpm release:patch` | patch | 显式 patch 发布（`--patch`） |
| `pnpm release:minor` | minor | 显式小版本发布（`--minor`） |
| `pnpm release:major` | major | 显式大版本发布（`--major`） |

### 发布流水线（每条命令的执行顺序）

```
lint → typecheck → prepack
  → changelogen --release [--patch|--minor|--major] --no-github   # 在 dev 上升版本 + 写 CHANGELOG + commit + 打 tag（本地，flag 省略则按 commit 前缀推断）
  → git push origin dev --follow-tags                          # 推 dev 含 tag
  → git checkout main && git merge dev                         # 切换到 main 并合并 dev
  → git push origin main --follow-tags                         # 推 main 含 tag（tag 落在 main 上）
  → pnpm publish                                               # 在 main 上发布到 npm
  → changelogen gh release                                     # 基于已推送的 tag 创建 GitHub Release
  → git checkout dev                                           # 切回 dev 继续开发
```

> **顺序强制规则**：`git push --follow-tags` 必须在 `changelogen gh release` 之前。
> 原因：GitHub Release 的 Target 由 tag 指向的 commit 决定；若 tag 还没推到远端就建 Release，GitHub 会把 Target 默认到仓库默认分支（`main`），导致 Release 指向错误的提交、且后续 push 与远端 tag 冲突。

> **升级类型两种模式**：`release` **不带 flag**，由 changelogen 按上次 tag 以来的 commit 前缀自动推断版本号（major > minor > patch）；`:patch` / `:minor` / `:major` 变体则用 `--patch` / `--minor` / `--major` **显式强制**升级幅度。无论哪种模式，commit 前缀都用于 CHANGELOG 分类。

> **`--no-github` 的作用**：抑制 `changelogen --release` 内置的、过早触发（tag 未推送）的 GitHub Release，改由末尾独立的 `changelogen gh release` 在 tag 推送后创建。

> **GitHub Release 鉴权**：`changelogen gh release` 检测 `GITHUB_TOKEN` / `GH_TOKEN`（或 changelogen 配置中的 token）：
> - **有 token** → 调 GitHub API **全自动**创建 Release，无浏览器
> - **无 token** → **打开浏览器**跳到预填好的 `releases/new` 页面（Target 已正确），人工点击 "Publish release" 确认

## Commit 规范

> **强制规则**：所有 commit message 必须遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。changelogen 依赖 commit 前缀自动分类和确定版本号，不符合规范的 commit 会被忽略或错误分类。

### 格式

```
<type>: <简短中文描述>
```

### Type 与版本号映射

| type | 用途 | semver |
|------|------|--------|
| `feat` | 新功能 | minor |
| `fix` | Bug 修复 | patch |
| `refactor` | 重构，不改功能 | patch |
| `perf` | 性能优化 | patch |
| `docs` | 文档 | patch |
| `build` | 构建系统 / 依赖 | patch |
| `types` | 类型定义 | patch |
| `chore` | 杂项 | 不升级 |
| `test` | 测试 | 不升级 |
| `style` | 代码风格 | 不升级 |
| `ci` | CI 配置 | 不升级 |

### 破坏性变更

- `feat!: <描述>` — type 后加 `!`
- 或在 body 中包含 `BREAKING CHANGE: <描述>`
- 触发 **major** 版本升级

### 示例

```
feat: 新增 useMaptalksLayer 通用图层原语，支持任意图层响应式纳管
fix: 修复 SSR 下 useMaptalks 误导入 maptalks-gl
refactor: 将数据源解析逻辑抽取为 resolveSource
docs: 补充 useMaptalksCamera 的相机双向同步用法
chore: 更新 oxlint 到 1.71.0
```

### 与发版的关系

版本号升级幅度有两种模式：`release` **不带 flag**，由 changelogen 按上次 tag 以来的 commit 前缀**自动推断**（major > minor > patch）；`:patch` / `:minor` / `:major` 变体则通过 `--patch` / `--minor` / `--major` **显式强制**指定。无论哪种模式，commit 前缀都用于 `changelogen` 扫描提交并生成、分类 CHANGELOG。不遵循规范的 commit 会导致：
- 版本号推断错误（仅自动推断模式）
- CHANGELOG 分类错误
- 被 changelogen 忽略

## 分支规范

> **强制规则**：`main` 禁止直接提交代码，只能通过 PR 合并。

| 分支 | 用途 | 合并方向 |
|------|------|----------|
| `main` | 主分支，始终保持可发布状态 | ← `dev` / `hotfix/*` |
| `dev` | 开发分支，日常集成新功能 | ← `feat/*` / `fix/*` / `chore/*` / `docs/*` / `refactor/*` |
| `feat/*` | 功能分支，如 `feat/dark-mode` | → `dev` |
| `fix/*` | Bug 修复，如 `fix/memory-leak` | → `dev` |
| `chore/*` | 杂项（依赖更新、构建配置等） | → `dev` |
| `docs/*` | 文档变更 | → `dev` |
| `refactor/*` | 重构，不改功能 | → `dev` |
| `hotfix/*` | 紧急修复生产问题，从 `main` 拉出 | → `main`（发布），再同步回 `dev` |

**工作流程：**

1. **日常开发**：从 `dev` 拉出 `feat/*` / `fix/*` / `chore/*` / `docs/*` / `refactor/*` → 完成后以 PR 合回 `dev`
2. **发布**：在 `dev` 分支上执行 `pnpm release`（changelogen 在 dev 上升版本 → 推 dev → 自动 checkout main 合并 dev → 推 main → 在 main 上发布 npm → 创建 GitHub Release → 切回 dev）
3. **紧急修复**：从 `main` 拉出 `hotfix/*` → 修复后合回 `main`（发布）→ 同步回 `dev`

## 编码约定

- 2 空格缩进，LF 换行（`.editorconfig`）
- oxlint + oxfmt（配置文件 `.oxlintrc.json`、`.oxfmtrc.json`）
- **oxlint 零告警规则**：所有代码（手写或 AI 生成）必须通过 `pnpm lint`，不允许存在任何 error 和 warning
- `no-console: warn`——日志使用 `consola` 或 `src/runtime/utils/logger.ts` 中的 `createLogger`
- **强制注释规则**：所有代码（手写或 AI 生成）必须有注释，包括但不限于：
  - 导出函数/类/接口 —— **必须**包含完整的 JSDoc，包含 `@description`（用途说明）、`@param`（每个参数的说明）、`@returns`（返回值说明）、`@example`（至少一个可运行的代码示例）。缺少任一元素的代码在 code review 中视为不通过
  - 关键逻辑/分支 —— 行内注释解释意图
  - 非显而易见的代码 —— 说明为什么这样写而非其他方式
  - 违反此规则的代码在 code review 中视为不通过
- **强制调式与文档规则**：所有代码（手写或 AI 生成）必须提供以下两部分：
  - **playground/** — 调试验证代码，方便开发时调试功能
  - **docs/** — 模块使用文档，供模块使用者参考查阅（详见 [docs 文档编写规范](#docs-文档编写规范)）
  - 违反此规则的代码在 code review 中视为不通过
- **强制类型提示规则**：所有封装 maptalks 原生 Map/Layer/Geometry/InfoWindow 等构造器选项使用的 interface（如 `UseMaptalksOptions`、`MaptalksInfoWindowOptions`），除模块自身字段（如 `name`/`onError`）外，必须提供完整的 maptalks-gl 原生字段 IDE 自动补全。以 `MaptalksInfoWindowOptions` 为典范：先建一个带 JSDoc 中文注释的建模 interface（含 `[key: string]: unknown` 逃生舱），再用 `Partial<Model> & Omit<Partial<Native>, keyof Model>` 组合到最终 `options` 字段类型，确保 IDE 补全既包含中文字段说明又不丢失任何原生字段。不得仅依赖 `[key: string]: unknown` 索引签名兜底。违反者 code review 不通过。

## docs 文档编写规范

> 所有 AI 生成的文档内容必须严格遵守以下规范。违反者在 code review 中视为不通过。

### 目录结构

```
docs/                          # 独立 pnpm workspace 包
├── nuxt.config.ts             # modules: @nuxt/content + @nuxt/ui + @nuxtjs/i18n + @nuxtjs/color-mode
├── content.config.ts          # 按 locale 分 collection: content_zh / content_en / content_fa，均需 search: true
├── package.json               # 独立依赖
├── tsconfig.json              # extends ./.nuxt/tsconfig.json
├── .oxlintrc.json             # 与根目录相同 rules
├── .oxfmtrc.json              # 与根目录相同 rules
├── i18n/locales/              # zh.json / en.json / fa.json（UI 文案翻译）
├── content/
│   ├── zh/                    # 中文文档（按侧边栏 6 组组织的正文 + 1 篇测试）
│   ├── en/                    # 英文文档（镜像结构，独立撰写）
│   └── fa/                    # 波斯语文档（RTL，同上）
└── app/                       # Nuxt 4 srcDir
    ├── app.vue                # 根组件（全局样式 + 主题定制 + 搜索高亮样式）
    ├── components/            # 自定义组件（SearchDialog 等）
    ├── layouts/default.vue    # 顶栏 + 侧边栏 6 组 + 内容区 + TOC
    └── pages/[...slug].vue    # 唯一页面：动态 collection 查询 + ContentRenderer
```

### 技术栈（docs 包）

| 模块 | 用途 |
|------|------|
| `@nuxt/content` v3 | 内容引擎，SQLite 存储 |
| `@nuxt/ui` v4 | UI 组件（UApp, UHeader, UModal, UContentToc 等） |
| `@nuxtjs/i18n` v10 | 多语言路由 + UI 翻译 |
| `@nuxtjs/color-mode` | 亮色/暗色主题 |
| `better-sqlite3` | Nuxt Content v3 依赖 |

### 每章必须使用的统一模板

```markdown
---
title: 章节标题
description: 简短描述（用于 SEO 和搜索）
---

# 章节标题

**本章目标**：一句话说明学完能做什么。

## 什么时候需要看这章？（或：什么时候需要这个功能？）

- 列出 2-3 个具体使用场景

## 正文内容（按步骤/逻辑组织的多个 ## 小节）

每个小节包含：
- 简短说明段落
- 完整示例代码（含 `<template>` + `<script setup>`，关键行有注释）
- 逐行解释（零基础友好）

## 注意事项

> 常见的坑点和踩坑提示

## 本章你学会了

- [ ] 3-5 个可验证的检查点
```

### 零基础友好原则

所有文档（手写或 AI 生成）必须遵守以下新手友好规则：

- **不假设任何前置知识**：出现"npm"就解释 npm 是什么，出现"composable"就链接到解释章节
- **每个代码块可独立运行**：不出现 `// 省略其他代码` 这种片段代码。包含完整的 `<template>` + `<script setup>`
- **术语首次出现加解释**：如"数据源（source，地图数据的来源配置，如瓦片地址或矢量切片服务）"
- **错误处理必讲**：每个功能的章节都包含"如果请求失败了会怎样"的说明
- **步骤引导式叙述**：多用"第 1 步"、"第 2 步"，每步说明做了什么和为什么这样做
- **代码注释不遗漏**：关键代码行必须有行内注释解释意图，初学者通过注释就能理解
- **中文排版规范**：中文与英文/数字间加空格，使用"你"而非"您"，语气友好鼓励式

### 代码标签页（`::code-group`）

当两个以上相邻代码块是**同类替代方案**（如不同底图源、不同图层预设、不同框架集成、不同配置模板），必须合并为带标签的代码组：

```markdown
::code-group
  ```vue [天地图底图]
  <template>...</template>
  ```

  ```vue [矢量切片底图]
  <template>...</template>
  ```
::
```

已应用的章节：随 maptalks 章节落地后补（如不同底图源、不同图层预设、不同框架集成、配置模板）。

### 多语言规则

- **中文、英文、波斯语**三语独立撰写，不依赖自动翻译
- **每语言文件结构完全一致**——章节标题、代码注释、示例文本均需翻译
- **i18n JSON 文件**仅管理 UI 文案（导航、侧边栏、通用按钮文字）
- **代码块保持 LTR**——RTL 页面需在 `app.vue` 样式中加：
  ```css
  [dir="rtl"] pre, [dir="rtl"] code { direction: ltr; text-align: left; }
  ```

### Nuxt Content v3 配置要点

#### content.config.ts

```ts
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    content_zh: defineCollection({
      type: 'page',
      source: { include: 'zh/**', prefix: '' },  // prefix: '' 去掉 zh/ 前缀
      schema: commonSchema,
      search: true,
    }),
    // content_en、content_fa 同理
  },
})
```

#### [...slug].vue（唯一的 catch-all 页面）

- 使用 `useAsyncData` + 响应式 key（`computed(() => 'page-' + slug.value)`）
- `watch: [locale, slug]` 监听语言和路由变化
- 根据 `locale.value` 动态选择 collection：`('content_' + locale) as keyof Collections`
- 页面不存在时 `throw createError({ statusCode: 404, fatal: true })`

### 搜索实现（正式方案）

- 使用官方 `useSearchCollection` composable（客户端 FTS5，**零依赖**）
- 前提：`content.config.ts` 中每个 collection 必须设 `search: true`
- 在 `SearchDialog.vue` 中：

```ts
const collectionKey = computed(() => {
  if (onlyCurrent.value) return `content_${locale.value}`;
  return ['content_zh', 'content_en', 'content_fa'];
});
const { status, search } = useSearchCollection(collectionKey);

// 等 status === 'ready' 后检索
const results = await search(q, {
  limit: 10,
  snippet: { columns: ['content'], around: 30 },
});
```

- 搜索结果高亮样式（`app.vue` 中）：

```css
mark {
  background: color-mix(in oklab, var(--ui-color-primary-400) 20%, transparent);
  color: var(--ui-color-primary-600);
  border-radius: 2px; padding: 0 2px;
}
.dark mark {
  background: color-mix(in oklab, var(--ui-color-primary-500) 25%, transparent);
  color: var(--ui-color-primary-300);
}
```

### 布局规范

- **顶栏**：Logo（左）+ 主题切换按钮 + 搜索按钮 + 语言切换下拉框（右）
- **左侧栏**：使用 `UNavigationMenu` 组件（Nuxt UI），6 组按序排列：
  1. 新手入门（环境准备 / 安装模块 / 第一张地图）
  2. 核心（useMaptalks / useMaptalksLayer）
  3. 多地图（命名实例 / useMaptalksInstance / useMaptalksRegistry / provide-inject 模式）
  4. 横切（useMaptalksEvents / useMaptalksCamera / useMaptalksCoordinate / useMaptalksDrawTool / useMaptalksSource）
  5. 预设与鉴权（useMaptalksTileLayer / useMaptalksVectorTileLayer / useMaptalksGroupGLLayer / useMaptalksGLTFLayer / public+signed 源）
  6. 附录（API 速查表 / 常见问题 / 配置模板）
- **UNavigationMenu 配置**：`orientation="vertical"` + `highlight` + `navItems` 通过 computed 动态设置 `defaultOpen` 和 `localePath` 前缀
- **侧边栏链接**必须用 `useLocalePath()(item.to)` 包裹，保证语言前缀正确
- **中间**：主内容区，独立滚动（`overflow-y-auto`），路由切换时 `watch(() => route.path)` 重置 `scrollTop = 0`
- **右侧**：TOC（`UContentToc`），数据从布局层 `useAsyncData` 查询 `page.body.toc.links`
  - 布局层的查询 key 用 `'toc-'` 前缀，与 catch-all 页面的 `'page-'` 前缀不同，避免 "Incompatible options" 警告
- **滚动条**：侧边栏和主内容区用 `.scrollbar-hide` 样式类自动隐藏
- **主题切换**：CSS 圆形扩散动画（`.theme-transition-overlay` + `transition: clip-path 0.6s`），JS 按 View Transition API → 降级逻辑执行

### 功能变更 → 文档映射

| 模块变更类型 | 需更新的文档 |
|-------------|------------|
| 新增 composable | `guide/` 下新增章节（三语），`appendix/api-reference.md` 加签名 |
| 新增预设图层（use*Layer） | `guide/` 预设章节（三语） + `appendix/api-reference.md` 加签名 |
| 修改 API 签名 | `appendix/api-reference.md` 类型定义 + 所有引用该签名代码的章节 |
| 新增 / 修改多地图能力（命名实例 / 注册表） | `guide/` 多地图章节（三语） + `appendix/api-reference.md` |
| 新增配置项 | `advanced/full-config.md` + `appendix/config-templates.md` |
| 新增数据源类型（public / signed） | `advanced/` 鉴权章节 + `appendix/config-templates.md` |
| 新增组件（声明式图层 / Map） | `guide/components/` 下新增章节（三语） + `appendix/api-reference.md` 加签名 |
| 新增语言 | `content.config.ts` + `nuxt.config.ts` + `i18n/locales/` + `content/<lang>/` |
| 框架集成变更 | `integration/` 下对应文件 |
| 相邻同类代码块 | 合并为 `::code-group`，详见 [代码标签页](#代码标签页code-group) |

### docs 开发命令

```bash
pnpm docs:dev      # 启动 docs 开发服务器
pnpm docs:build    # 构建生产版本
# docs 目录独立 lint/fmt/typecheck：
cd docs && pnpm lint
cd docs && pnpm fmt
cd docs && pnpm typecheck
```

### 常见陷阱（务必检查）

| 陷阱 | 现象 | 解决 |
|------|------|------|
| `[...slug].vue` 文件名含方括号 | Windows PowerShell 把 `[...slug]` 当通配符，文件创建到错误位置 | 先写 `_slug.vue`，再用 Node.js `fs.renameSync` 改名 |
| `useAsyncData` key 冲突 | 控制台 "Incompatible options" 警告 | 布局和 catch-all 用不同 key 前缀（`'toc-'` vs `'page-'`） |
| `queryCollection().all()` 不返回 body | 搜索不到正文内容 | 搜索必须用 `useSearchCollection`，不可用 `.all()` + 客户端过滤 |
| `better-sqlite3` Node 版本不匹配 | 服务器启动报错 | 确保 PATH 中 Node 版本一致 |
| `UContentToc` 不显示内容 | 右侧 TOC 空白 | 需手动传 `:links="page.body.toc.links"`，不可依赖自动上下文 |
| 侧边栏点击后语言回退 | 切换到英文后点侧边栏回中文 | 链接必须用 `localePath(item.to)` 包裹 |
