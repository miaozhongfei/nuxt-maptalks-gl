# Tool Components & Composables Standardization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor DistanceTool/AreaTool/DrawTool components and composables to follow the same design conventions as standard layer components (TileLayer).

**Architecture:** DrawTool keeps its standalone state-machine composable but aligns all external contracts (types, events, error handling, autoDispose). All three component templates unified to mirror MaptalksTileLayer (withDefaults, autoDispose prop, events pass-through). DistanceTool/AreaTool composables unchanged (already use tool-factory).

**Tech Stack:** Vue 3 + TypeScript, maptalks-gl peer dependency

**Source Spec:** `docs/superpowers/specs/2026-07-30-tool-components-standardization-design.md`

## Global Constraints

- Follow existing code conventions (2-space indent, LF, oxlint zero-warning)
- `import type` for all type-only imports
- `withDefaults(defineProps<...>(), { ... })` pattern for all component props
- `throw MaptalksError` for missing constructors, not `logger.warn`
- `autoDispose !== false` conditional check before `onScopeDispose`

---

### Task 1: Add `MaptalksDrawToolOptions` type

**Files:**
- Modify: `src/runtime/types/options.ts:1043`

**Interfaces:**
- Produces: `MaptalksDrawToolOptions` — exported type alias

- [ ] **Step 1: Insert type after MaptalksAreaToolOptions**

```ts
export type MaptalksAreaToolOptions = Record<string, unknown>

/**
 * DrawTool 构造选项的用户输入类型。
 *
 * @description `Record<string, unknown>`。后续可按 maptalks-gl API 补全原生字段（symbol / vertexSymbol / labelOptions 等）。
 *
 * @example
 * const opts: MaptalksDrawToolOptions = { symbol: { lineColor: '#ff0000' }, language: 'zh' };
 */
export type MaptalksDrawToolOptions = Record<string, unknown>
```

- [ ] **Step 2: Lint**

```bash
pnpm lint
```

- [ ] **Step 3: Commit**

```bash
git add src/runtime/types/options.ts
git commit -m "feat: 新增 MaptalksDrawToolOptions 类型"
```

---

### Task 2: Refactor DrawTool composable types into composables.ts

**Files:**
- Modify: `src/runtime/types/composables.ts:938` (after `UseMaptalksToolReturn`)
- Modify: `src/runtime/composables/useMaptalksDrawTool.ts:19-51` (remove local type defs, import from types)

**Interfaces:**
- Consumes: `UseMaptalksToolOpts`, `UseMaptalksToolReturn`, `MaptalksDrawTool`, `MaptalksDrawToolOptions` from `../types`
- Produces: `UseMaptalksDrawToolOpts`, `UseMaptalksDrawToolReturn` — exported from `composables.ts`

- [ ] **Step 1: Insert types after `UseMaptalksToolReturn` in composables.ts**

```ts
// ───────────────────────────────── UseMaptalksDrawTool ─────────────────────────────────

/**
 * `useMaptalksDrawTool` 的可选项。
 *
 * @description extends `UseMaptalksToolOpts`，增加 `mode` 初始绘制模式。支持 Point / LineString / Polygon / Circle / Rectangle。
 *
 * @example
 * useMaptalksDrawTool(map, { mode: 'Polygon', options: { symbol: { lineColor: '#f00' } } });
 */
export interface UseMaptalksDrawToolOpts extends UseMaptalksToolOpts<MaptalksDrawToolOptions> {
  /** 初始绘制模式，默认 'Point' */
  mode?: string;
}

/**
 * `useMaptalksDrawTool` 的返回值。
 *
 * @description extends `UseMaptalksToolReturn`，增加 `enabled`/`mode` 双向 ref、`result` 绘制结果和 `enable`/`disable`/`setMode` 命令式方法。
 *
 * @example
 * const { enabled, mode, result, enable, setMode } = useMaptalksDrawTool(map, { mode: 'Polygon' });
 */
export interface UseMaptalksDrawToolReturn extends UseMaptalksToolReturn {
  /** 是否处于绘制启用状态（双向，写入即生效） */
  enabled: Ref<boolean>;
  /** 当前绘制模式（双向，写入即切换） */
  mode: Ref<string>;
  /** 最近一次绘制结果（drawend 事件的 geometry） */
  result: ShallowRef<unknown>;
  /** 启用绘制 */
  enable: () => void;
  /** 关闭绘制 */
  disable: () => void;
  /** 切换绘制模式 */
  setMode: (mode: string) => void;
}
```

- [ ] **Step 2: Verify types file has needed imports at top**

None needed — `Ref`, `ShallowRef` from Vue are used elsewhere; `UseMaptalksToolOpts`, `UseMaptalksToolReturn`, `MaptalksDrawToolOptions` are all in the same file or imported from it.

(`MaptalksDrawToolOptions` import: `composables.ts` line ~24 already imports from `'./options'`, we'll add `MaptalksDrawToolOptions` there.)

- [ ] **Step 3: Remove local type defs from useMaptalksDrawTool.ts, replace with imports**

Remove lines 8-51 (both `UseMaptalksDrawToolOpts` and `UseMaptalksDrawToolReturn` interfaces, plus `DrawToolState` — keep `DrawToolState` since it's internal). Replace with:

```ts
import type { MaptalksDrawTool, MaptalksMap, UseMaptalksDrawToolOpts, UseMaptalksDrawToolReturn } from '../types';
```

Delete these lines from the file:
- Line 8 (`const logger = ...`) — keep
- Lines 11-24 (`export interface UseMaptalksDrawToolOpts`) — REMOVE
- Lines 26-51 (`export interface UseMaptalksDrawToolReturn`) — REMOVE

- [ ] **Step 4: Update the barrel export in types/index.ts**

In the composables section, add `UseMaptalksDrawToolOpts` and `UseMaptalksDrawToolReturn`:

```ts
  UseMaptalksDrawToolOpts,
  UseMaptalksDrawToolReturn,
```

- [ ] **Step 5: Update public-types.ts**

Add the new types:

```ts
  // ── Composable Options ──
  UseMaptalksDrawToolOpts,
  ...
  
  // ── Composable Returns ──
  UseMaptalksDrawToolReturn,
```

- [ ] **Step 6: Lint**

```bash
pnpm lint
```

- [ ] **Step 7: Commit**

```bash
git add src/runtime/types/composables.ts src/runtime/types/index.ts src/runtime/composables/public-types.ts src/runtime/composables/useMaptalksDrawTool.ts
git commit -m "refactor: DrawTool composable 类型迁移到 composables.ts，extends UseMaptalksToolOpts/Return"
```

---

### Task 3: Refactor useMaptalksDrawTool composable (contract alignment)

**Files:**
- Modify: `src/runtime/composables/useMaptalksDrawTool.ts`

**Interfaces:**
- Consumes: `UseMaptalksDrawToolOpts`, `UseMaptalksDrawToolReturn`, `MaptalksDrawTool`, `MaptalksMap`, `MaptalksDrawToolOptions` from `../types`
- Produces: `useMaptalksDrawTool(map, opts)` — same external signature

- [ ] **Step 1: Fix options reactivity — replace direct `opts.options` with getter**

In `useMaptalksDrawTool` function body, change:

```ts
// Before (line 173):
onScopeDispose(bindDrawTool(() => toValue(map), { tool, enabled, mode, result }, options.options));
```

to:

```ts
const drawOpts = () => toValue(options.options)
const autoDispose = options.autoDispose !== false

const teardown = bindDrawTool(() => toValue(map), { tool, enabled, mode, result }, drawOpts)
if (autoDispose) onScopeDispose(teardown)
```

- [ ] **Step 2: Fix error handling — replace `logger.warn + return null` with `throw MaptalksError`**

In `createDrawTool` function (lines 80-93), change:

```ts
// Before (lines 82-85):
const Ctor = mt.DrawTool;
if (typeof Ctor !== 'function') {
  logger.warn('当前 maptalks-gl 未导出 DrawTool，绘制功能不可用');
  return null;
}

// After:
import { MaptalksError } from '../core/errors'; // add at top of file

const Ctor = mt.DrawTool;
if (typeof Ctor !== 'function') {
  throw new MaptalksError('control-failed', '当前 maptalks-gl 未导出 DrawTool');
}
```

- [ ] **Step 3: Fix `createDrawTool` return type from `Promise<MaptalksDrawTool | null>`**

Change the return type of `createDrawTool` (line 80):

```ts
async function createDrawTool(
  m: MaptalksMap,
  mode: string,
  options: Record<string, unknown> | undefined,
  onResult: (geometry: unknown) => void,
): Promise<MaptalksDrawTool> {
```

- [ ] **Step 4: Remove null guard in bindDrawTool since createDrawTool no longer returns null**

In `bindDrawTool` (line 117), remove `if (!dt) return;`

```ts
// Before:
const dt = await createDrawTool(m, state.mode.value, options, (geo) => {
  state.result.value = geo;
});
if (!dt) return;

// After:
const dt = await createDrawTool(m, state.mode.value, options, (geo) => {
  state.result.value = geo;
});
```

- [ ] **Step 5: Add events support**

In `useMaptalksDrawTool` function body, after `const result = shallowRef<unknown>(null);`, propagate events from options:

```ts
const events = options.events ?? {}
```

Already handled — events are not yet wired. We need to add event binding in `createDrawTool`. Change the `tool.on('drawend', ...)` call to bind both drawend + user events:

In `createDrawTool`, after `tool.addTo(m)`:

```ts
// Before:
tool.on('drawend', (event) => {
  onResult((event as { geometry?: unknown }).geometry ?? event);
});

// After:
for (const [event, handler] of Object.entries(events ?? {})) {
  tool.on(event, handler);
}
tool.on('drawend', (event) => {
  onResult((event as { geometry?: unknown }).geometry ?? event);
});
```

But `events` isn't passed to `createDrawTool` currently. Let's pass it from `bindDrawTool`. Update `bindDrawTool` signature:

```ts
function bindDrawTool(
  getMap: () => MaptalksMap | null,
  state: DrawToolState,
  options: Record<string, unknown> | undefined,
  events: Record<string, (event: unknown) => void>,
): () => void {
```

Update `createDrawTool` signature to accept events:

```ts
async function createDrawTool(
  m: MaptalksMap,
  mode: string,
  options: Record<string, unknown> | undefined,
  events: Record<string, (event: unknown) => void>,
  onResult: (geometry: unknown) => void,
): Promise<MaptalksDrawTool> {
```

Then in `bindDrawTool`:

```ts
const dt = await createDrawTool(m, state.mode.value, options, events, (geo) => {
  state.result.value = geo;
});
```

And in `useMaptalksDrawTool`:

```ts
const teardown = bindDrawTool(
  () => toValue(map),
  { tool, enabled, mode, result },
  drawOpts,
  events,
)
```

- [ ] **Step 6: Lint**

```bash
pnpm lint
```

- [ ] **Step 7: Commit**

```bash
git add src/runtime/composables/useMaptalksDrawTool.ts
git commit -m "refactor: useMaptalksDrawTool 契约对齐——响应式 options / events / autoDispose / MaptalksError"
```

---

### Task 4: Standardize MaptalksDistanceTool component

**Files:**
- Modify: `src/runtime/components/MaptalksDistanceTool.vue`

**Interfaces:**
- Consumes: `useMaptalksDistanceTool`, `MAP_KEY`, `MaptalksDistanceToolOptions`, `MaptalksEventHandler`
- Produces: `<MaptalksDistanceTool>` — same public API, refined template

- [ ] **Step 1: Rewrite component with unified template**

Replace entire file content:

```vue
<template><!-- maptalks distance tool · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 距离测量工具组件。
 *
 * @description 对 `useMaptalksDistanceTool` 的声明式封装。启用后用户可在地图上绘制线段测量距离，
 * 测量结果通过 `@measure` 事件返回。支持 `:options` 配置测量符号样式、`:events` 绑定原生事件。
 * 必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksDistanceTool :options="{ symbol: { lineColor: '#00f' } }" @measure="onMeasure" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksDistanceTool } from '../composables/useMaptalksDistanceTool'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksDistanceToolOptions, MaptalksEventHandler } from '../types'

const props = withDefaults(defineProps<{
  /** 距离测量工具配置（symbol 样式等） */
  options?: MaptalksDistanceToolOptions
  /** 组件销毁时自动移除工具，默认 true */
  autoDispose?: boolean
  /** 原生事件名 → 处理器映射 */
  events?: Record<string, MaptalksEventHandler>
}>(), { options: () => ({}), autoDispose: true })

const emit = defineEmits<{
  measure: [event: unknown]
  click: [event: unknown]
}>()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksDistanceTool 必须在 MaptalksMap 内使用')

const { tool, remove } = useMaptalksDistanceTool(map, {
  options: () => props.options,
  autoDispose: props.autoDispose,
  events: { ...props.events, measure: (e) => emit('measure', e), click: (e) => emit('click', e) },
})
defineExpose({ tool, remove })
</script>
```

- [ ] **Step 2: Lint**

```bash
pnpm lint
```

- [ ] **Step 3: Commit**

```bash
git add src/runtime/components/MaptalksDistanceTool.vue
git commit -m "refactor: MaptalksDistanceTool 统一组件模板——withDefaults/autoDispose/事件直传"
```

---

### Task 5: Standardize MaptalksAreaTool component

**Files:**
- Modify: `src/runtime/components/MaptalksAreaTool.vue`

**Interfaces:**
- Consumes: `useMaptalksAreaTool`, `MAP_KEY`, `MaptalksAreaToolOptions`, `MaptalksEventHandler`
- Produces: `<MaptalksAreaTool>` — same public API, refined template

- [ ] **Step 1: Rewrite component with unified template**

Replace entire file content:

```vue
<template><!-- maptalks area tool · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 面积测量工具组件。
 *
 * @description 对 `useMaptalksAreaTool` 的声明式封装。启用后用户可在地图上绘制多边形测量面积，
 * 测量结果通过 `@measure` 事件返回。支持 `:options` 配置测量符号样式、`:events` 绑定原生事件。
 * 必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksAreaTool :options="{ symbol: { lineColor: '#f00' } }" @measure="onMeasure" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksAreaTool } from '../composables/useMaptalksAreaTool'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksAreaToolOptions, MaptalksEventHandler } from '../types'

const props = withDefaults(defineProps<{
  /** 面积测量工具配置（symbol 样式等） */
  options?: MaptalksAreaToolOptions
  /** 组件销毁时自动移除工具，默认 true */
  autoDispose?: boolean
  /** 原生事件名 → 处理器映射 */
  events?: Record<string, MaptalksEventHandler>
}>(), { options: () => ({}), autoDispose: true })

const emit = defineEmits<{
  measure: [event: unknown]
  click: [event: unknown]
}>()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksAreaTool 必须在 MaptalksMap 内使用')

const { tool, remove } = useMaptalksAreaTool(map, {
  options: () => props.options,
  autoDispose: props.autoDispose,
  events: { ...props.events, measure: (e) => emit('measure', e), click: (e) => emit('click', e) },
})
defineExpose({ tool, remove })
</script>
```

- [ ] **Step 2: Lint**

```bash
pnpm lint
```

- [ ] **Step 3: Commit**

```bash
git add src/runtime/components/MaptalksAreaTool.vue
git commit -m "refactor: MaptalksAreaTool 统一组件模板——withDefaults/autoDispose/事件直传"
```

---

### Task 6: Standardize MaptalksDrawTool component

**Files:**
- Modify: `src/runtime/components/MaptalksDrawTool.vue`

**Interfaces:**
- Consumes: `useMaptalksDrawTool`, `MAP_KEY`, `MaptalksDrawToolOptions` (new), `MaptalksEventHandler`
- Produces: `<MaptalksDrawTool>` — extends unified template with `mode` prop and extended expose

- [ ] **Step 1: Rewrite component with unified template + DrawTool extensions**

Replace entire file content:

```vue
<template><!-- maptalks draw tool · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 绘制工具组件（DrawTool）。
 *
 * @description 对 `useMaptalksDrawTool` 的声明式封装。启用后用户可在地图上绘制点/线/面/圆/矩形。
 * 支持 `:mode` 初始绘制模式、`:options` 配置绘制样式、`@drawend` 事件获取结果。
 * 必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksDrawTool ref="dt" mode="Polygon" @drawend="(e) => result = e" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksDrawTool } from '../composables/useMaptalksDrawTool'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksDrawToolOptions, MaptalksEventHandler } from '../types'

const props = withDefaults(defineProps<{
  /** 初始绘制模式，默认 'Point' */
  mode?: string
  /** 透传给 DrawTool 构造器的选项 */
  options?: MaptalksDrawToolOptions
  /** 组件销毁时自动移除工具，默认 true */
  autoDispose?: boolean
  /** 原生事件名 → 处理器映射 */
  events?: Record<string, MaptalksEventHandler>
}>(), { mode: 'Point', options: () => ({}), autoDispose: true })

const emit = defineEmits<{ drawend: [geometry: unknown] }>()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksDrawTool 必须在 MaptalksMap 内使用')

const { tool, enabled, mode, enable, disable, setMode, remove } = useMaptalksDrawTool(map, {
  mode: props.mode,
  options: () => props.options,
  autoDispose: props.autoDispose,
  events: { ...props.events, drawend: (e) => emit('drawend', e) },
})
defineExpose({ tool, enabled, mode, enable, disable, setMode, remove })
</script>
```

- [ ] **Step 2: Lint**

```bash
pnpm lint
```

- [ ] **Step 3: Commit**

```bash
git add src/runtime/components/MaptalksDrawTool.vue
git commit -m "refactor: MaptalksDrawTool 统一组件模板——withDefaults/autoDispose/事件直传/extend-expose"
```

---

### Task 7: Adapt draw-tool ComponentImpl demo

**Files:**
- Modify: `examples/demo-suite/app/components/example2/interaction/draw-tool/ComponentImpl.vue`

**Interfaces:**
- Consumes: `<MaptalksMap>`, `<MaptalksDrawTool>` — auto-imported
- Produces: Updated demo file

- [ ] **Step 1: Remove manual `currentMode` ref and `switchMode` wrapper**

Since `mode` now defaults to `'Point'` via `withDefaults` on the component, and the component exposes `setMode`/`enable`/`disable`, simplify the component:

Replace full file content:

```vue
<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksDrawTool ref="dt" />
    </MaptalksMap>
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton
        v-for="m in modes" :key="m" size="xs"
        :variant="dt?.mode === m ? 'solid' : 'outline'"
        @click="switchMode(m)"
      >{{ m }}</UButton>
      <UDivider orientation="vertical" />
      <UButton size="xs" variant="outline" @click="dt?.disable()">禁用</UButton>
      <UButton size="xs" variant="outline" @click="dt?.enable()">启用</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const dt = ref<any>(null)
const modes = ['Point', 'LineString', 'Polygon', 'Circle', 'Rectangle'] as const

function switchMode(m: string) {
  dt.value?.setMode(m)
  dt.value?.enable()
}
</script>
```

Note: `dt?.mode` directly reads the exposed reactive `mode` ref (Vue template ref auto-unwraps it). This replaces the manual `currentMode` ref.

- [ ] **Step 2: Lint**

```bash
pnpm lint
```

- [ ] **Step 3: Commit**

```bash
git add examples/demo-suite/app/components/example2/interaction/draw-tool/ComponentImpl.vue
git commit -m "fix: 8.5 ComponentImpl 适配新 DrawTool 组件（mode 默认值/移除手动 currentMode）"
```

---

### Task 8: Verify typecheck

- [ ] **Step 1: Run typecheck**

```bash
pnpm typecheck
```

Expected: PASS (0 errors)

- [ ] **Step 2: If typecheck fails, fix and repeat**

---

### Task 9: Final push

- [ ] **Step 1: Push all commits**

```bash
git push
```
