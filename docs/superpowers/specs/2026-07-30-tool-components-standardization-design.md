# Tool Components & Composables Standardization

Date: 2026-07-30

Status: Approved

## Overview

Standardize the three maptalks tool components (DistanceTool, AreaTool, DrawTool) and their composables to follow the same design conventions as the standard layer/geometry components (TileLayer, VectorLayer, Marker).

## Problem

| Concern | TileLayer (standard) | DistanceTool | AreaTool | DrawTool |
|---------|---------------------|--------------|----------|----------|
| `withDefaults` | Yes | No | No | No |
| `autoDispose` prop | Yes | No | No | No |
| Options reactivity | `computed()` getter | `() =>` getter | `() =>` getter | Direct value (not reactive) |
| Options typing | `MaptalksTileLayerOptions` | `MaptalksDistanceToolOptions` | `MaptalksAreaToolOptions` | `Record<string, unknown>` |
| Events handling | Direct pass to composable | Manual merge + overwrite | Manual merge + overwrite | Watch + emit, no `events` prop |
| Missing constructor | `throw MaptalksError` | `throw MaptalksError` | `throw MaptalksError` | `logger.warn` + return null |
| Uses shared factory | `useMaptalksLayer` | `tool-factory` | `tool-factory` | Standalone 190 lines |
| Exposed remove | No | Yes | Yes | No |

## Design Decisions

**Decision: DrawTool keeps standalone implementation, aligns on external contracts.**

DrawTool has fundamentally different requirements from DistanceTool/AreaTool — it needs runtime state machine control (mode switching, enable/disable, result tracking) while DistanceTool/AreaTool are fire-and-forget. Forcing DrawTool into `tool-factory` would require adding complexity to a simple factory. Instead, DrawTool keeps its core state machine but aligns all external interfaces with the other tools.

**Decision: Components follow MaptalksTileLayer template.**

The TileLayer component provides the canonical pattern: `withDefaults`, `autoDispose` prop, reactive options via getter, events passed directly to composable via spread+emit merging, and a clean `defineExpose`. All three tool components will adopt this template.

## Target State

### All 3 Tool Components (Unified Template)

```vue
<script setup lang="ts">
import { inject } from 'vue'
import { useMaptalksXxxTool } from '../composables/useMaptalksXxxTool'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksXxxToolOptions, MaptalksEventHandler } from '../types'

const props = withDefaults(defineProps<{
  options?: MaptalksXxxToolOptions
  autoDispose?: boolean
  events?: Record<string, MaptalksEventHandler>
}>(), { options: () => ({}), autoDispose: true })

const emit = defineEmits<{ measure: [e: unknown]; click: [e: unknown] }>()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksXxxTool 必须在 MaptalksMap 内使用')

const { tool, remove } = useMaptalksXxxTool(map, {
  options: () => props.options,
  autoDispose: props.autoDispose,
  events: { ...props.events, measure: (e) => emit('measure', e), click: (e) => emit('click', e) },
})
defineExpose({ tool, remove })
</script>
```

**DrawTool variant**: adds `mode?: string` prop and extends expose with `{ enabled, mode, enable, disable, setMode }`.

### Types (types/composables.ts)

- `UseMaptalksDrawToolOpts` extends `UseMaptalksToolOpts`, adds `mode?: string`
- `UseMaptalksDrawToolReturn` extends `UseMaptalksToolReturn`, adds `enabled`, `mode`, `result`, `enable`, `disable`, `setMode`

### Types (types/options.ts)

- New `MaptalksDrawToolOptions` interface (replaces `Record<string, unknown>`)

### Composable (useMaptalksDrawTool.ts)

- Core state machine (mode/enabled/result watch) preserved
- External contract aligned:
  - Options: `() => toValue(opts.options)` getter for reactivity
  - Events: accept `opts.events` parameter
  - AutoDispose: check `opts.autoDispose !== false`
  - Missing constructor: `throw MaptalksError` instead of `logger.warn` + null

### DistanceTool / AreaTool

- Composable: no changes (already use `tool-factory` correctly)
- Component: adopt unified template

### Demo Impact

- `draw-tool/ComponentImpl.vue`: adapt to new `mode` prop (now defaults to `'Point'` via `withDefaults`, no longer needs manual default)
- All other demo implementations: no changes needed

## Files Changed

| File | Change |
|------|--------|
| `src/runtime/types/options.ts` | New: `MaptalksDrawToolOptions` |
| `src/runtime/types/composables.ts` | Refactor: `UseMaptalksDrawToolOpts` extends `UseMaptalksToolOpts`; `UseMaptalksDrawToolReturn` extends `UseMaptalksToolReturn` |
| `src/runtime/composables/useMaptalksDrawTool.ts` | Refactor: align contracts, keep core state machine |
| `src/runtime/components/MaptalksDistanceTool.vue` | Refactor: withDefaults + autoDispose + unified events |
| `src/runtime/components/MaptalksAreaTool.vue` | Refactor: withDefaults + autoDispose + unified events |
| `src/runtime/components/MaptalksDrawTool.vue` | Refactor: withDefaults + autoDispose + unified events + mode prop + extended expose |
| `examples/demo-suite/app/components/example2/interaction/draw-tool/ComponentImpl.vue` | Adapt: mode default now on component |

## Non-Goals

- Does not create a tool registry (no equivalent of `layerRegistry`)
- Does not enforce DrawTool integration into `tool-factory`
- Does not change the `UseMaptalksToolOpts`/`UseMaptalksToolReturn` types used by DistanceTool/AreaTool
