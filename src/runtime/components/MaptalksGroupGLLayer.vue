<template><!-- maptalks group gl layer · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * GroupGLLayer 组件（承载 GL 子图层的容器图层）。
 *
 * @description 对 `useMaptalksGroupGLLayer` 的声明式封装。从 runtimeConfig 读取默认 sceneConfig
 * 并合并用户 options，创建 GroupGLLayer 承载子 GL 图层。支持 `:visible` 声明式显隐、`:events` 原生事件绑定、
 * `defineExpose({ layer, show, hide })` 程序式控制。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksGroupGLLayer :layers="[vtLayer]" :options="{ sceneConfig: { light: { ambient: '#fff' } } }" />
 * ```
 */
import { inject, watch } from 'vue'

import { useMaptalksGroupGLLayer } from '../composables/presets/useMaptalksGroupGLLayer'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksLayer, MaptalksGroupGLLayerCombinedOptions } from '../types'

const props = withDefaults(
  defineProps<{
    id?: string
    layers?: MaptalksLayer[]
    options?: MaptalksGroupGLLayerCombinedOptions
    autoDispose?: boolean
    visible?: boolean
    events?: Record<string, MaptalksEventHandler>
  }>(),
  { layers: () => [], options: () => ({}), autoDispose: true, visible: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksGroupGLLayer 必须在 MaptalksMap 内使用')
const { layer, show, hide } = useMaptalksGroupGLLayer(map, {
  id: props.id,
  layers: props.layers,
  options: props.options,
  autoDispose: props.autoDispose,
  events: props.events,
})

watch([() => props.visible, layer], ([v, l]) => { if (!l) return; if (v) show(); else hide() }, { immediate: true })

defineExpose({ layer, show, hide })
</script>
