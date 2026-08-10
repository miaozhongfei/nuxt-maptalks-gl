<p align="center">
  <h1 align="center">@lacqjs/nuxt-maptalks-gl</h1>
</p>

<p align="center">
  <a href="https://npmjs.com/package/@lacqjs/nuxt-maptalks-gl"><img src="https://img.shields.io/npm/v/@lacqjs/nuxt-maptalks-gl?style=flat-square&colorA=202128&colorB=36936A" alt="Version"></a>
  <a href="https://npmjs.com/package/@lacqjs/nuxt-maptalks-gl"><img src="https://img.shields.io/npm/dm/@lacqjs/nuxt-maptalks-gl?style=flat-square&colorA=202128&colorB=36936A" alt="Downloads"></a>
  <a href="https://github.com/miaozhongfei/nuxt-maptalks-gl/blob/main/LICENSE"><img src="https://img.shields.io/github/license/miaozhongfei/nuxt-maptalks-gl?style=flat-square&colorA=202128&colorB=36936A" alt="License"></a>
  <a href="https://miaozhongfei.github.io/nuxt-maptalks-gl/"><img src="https://img.shields.io/badge/Docs-202128?style=flat-square&logo=gitbook&logoColor=DDDDD4" alt="Docs"></a>
</p>

> Nuxt 4 的 maptalks-gl 模块：SSR 守卫、按需动态加载、map/layer 生命周期纳管、多地图命名实例与注册表、横切 composable 与类型化图层预设。

## 特性

- **SSR 安全** — 客户端渲染守卫，服务端不引入 maptalks-gl，避免水合报错
- **按需动态加载** — 运行时才加载 `maptalks-gl`，不影响首屏体积
- **声明式组件（26+）** — `MaptalksMap` + 图层/几何/控件/工具/信息框组件，模板嵌套即可建图
- **类型化预设（31+ composable）** — `useMaptalksTileLayer` / `useMaptalksMarker` 等图层与几何预设，构造选项带中文注释与完整 IDE 补全
- **响应式纳管** — 地图/图层/几何/控件生命周期自动创建与销毁，`options` 变化响应式重建或增量更新
- **多地图注册表** — `MapRegistry` + `LayerRegistry`，命名实例经 `useMaptalksInstance` / `useMaptalksRegistry` 跨组件访问
- **逃生舱** — `useMaptalksLayer` / `useMaptalksGeometry` 通用原语，任意原生 API 无缝接入
- **三语文档** — 中文 / 英文 / 波斯语（RTL）文档站，零基础友好

## 快速开始

### 安装

```bash
pnpm add @lacqjs/nuxt-maptalks-gl maptalks-gl
```

> `maptalks-gl` 是 peerDependency，由你的项目显式安装（模块不打包它，避免重复打包与版本漂移）。

### 注册模块

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@lacqjs/nuxt-maptalks-gl'],
  maptalksGl: {
    sources: {
      // 命名数据源：此处配置后，代码中 base-layer="osm" 即可引用
      osm: {
        kind: 'public',
        type: 'tile',
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        options: {
          subdomains: ['b', 'c', 'd'],
          attribution: '© OpenStreetMap contributors, © CARTO',
        },
      },
    },
  },
})
```

> `sources` 是可选的。不配置 `maptalksGl.sources` 也可以直接在 `baseLayer` 中内联传参（见下方示例）。

### 第一张地图（组件声明式）

```vue
<template>
  <!-- 方式一：base-layer 引用 nuxt.config.ts 中 maptalksGl.sources.osm -->
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />

  <!-- 方式二：内联传参，无需在 nuxt.config.ts 中配置 sources -->
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    :base-layer="{
      urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      subdomains: ['b', 'c', 'd'],
      attribution: '© OpenStreetMap contributors, © CARTO',
    }"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>
```

### 第一张地图（composable 命令式）

```vue
<template>
  <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)

// 方式一：baseLayer 引用 nuxt.config.ts 中 maptalksGl.sources.osm
const { map, isReady } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 13,
  baseLayer: 'osm',
})

// 方式二：内联传参，无需在 nuxt.config.ts 中配置 sources
// const { map, isReady } = useMaptalks(el, {
//   center: [121.5057, 31.2453],
//   zoom: 13,
//   baseLayer: {
//     urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
//     subdomains: ['b', 'c', 'd'],
//     attribution: '© OpenStreetMap contributors, © CARTO',
//   },
// })
</script>
```

## 使用模式

| 模式 | 写法 | 适用场景 |
|------|------|---------|
| 组件声明式 | `<MaptalksMap>` + `<MaptalksMarker>` 等 | 静态/模板化地图，零脚本逻辑 |
| composable 命令式 | `useMaptalks` + `useMaptalksMarker` 等 | 动态数据、响应式联动 |
| 混合 | `<MaptalksMap ref="mc">` + composable | 组件建图 + composable 扩展 |
| 逃生舱 | `useMaptalksLayer` / `useMaptalksGeometry` / 原生 import | 模块未覆盖的原生能力 |

## 示例

仓库内置完整示例应用（`examples/demo-suite`），覆盖两种组织方式：

- **示例1** — 按模块能力组织：组件单独 / composable 单独 / 组合 / 进阶（29 页）
- **示例2** — 按 maptalks 官网章节组织：地图 / 瓦片图层 / 图形 / 三维 / 样式 / 图层 / 工具 / 交互 / 动画 / UI 控件 / JSON 序列化 / 插件（14 组 97 示例，每组含组件 / Composable / 组合 / 逃生舱 4 种实现）

```bash
pnpm demo:demo-suite:dev   # 启动示例应用
```

## 开发

```bash
pnpm dev            # 启动开发服务器（先 dev:prepare 再起 playground）
pnpm dev:prepare    # stub 模块 + 准备 playground
pnpm prepack        # 构建产物
pnpm lint           # 代码检查（oxlint）
pnpm typecheck      # 类型检查（根 + playground）
pnpm docs:dev       # 文档站开发
pnpm e2e            # E2E 测试
```

## 文档

完整用法与配置请查看 → [文档](https://miaozhongfei.github.io/nuxt-maptalks-gl/)

## 致谢

本项目受益于以下优秀开源项目：

- [Nuxt](https://nuxt.com/) — Vue 全栈框架
- [maptalks-gl](https://github.com/maptalks/maptalks.gl) — 二维/三维一体化 WebGL 地图引擎
- [@nuxt/kit](https://github.com/nuxt/nuxt) — Nuxt 模块开发工具包
- [defu](https://github.com/unjs/defu) — 深度合并配置
- [consola](https://github.com/unjs/consola) — 日志工具

## 许可证

[MIT](./LICENSE) License © 2026-PRESENT [miaozhongfei](https://github.com/miaozhongfei)
