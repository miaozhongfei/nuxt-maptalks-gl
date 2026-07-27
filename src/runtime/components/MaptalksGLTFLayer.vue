<template><!-- maptalks gltf layer · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * GLTFLayer 组件（GLTF 三维模型图层容器）。
 *
 * @description 对 `useMaptalksGLTFLayer` 的声明式封装。创建 GLTF 模型标记容器图层，
 * 具体模型通过返回的 `layer.value` 原生 API 添加。支持命名/内联源、`:visible` 声明式显隐、
 * `:events` 原生事件绑定、`defineExpose({ layer, show, hide })` 程序式控制。
 * 必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksGLTFLayer ref="gltfLayer" source="myGLTF" />
 * <!-- 程序式添加模型：gltfLayer.value.layer.value?.addGeometry?.(new mt.GLTFMarker(...)) -->
 * ```
 */
import { inject, watch } from 'vue'

import { useMaptalksGLTFLayer } from '../composables/presets/useMaptalksGLTFLayer'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksGLTFLayerCombinedOptions, MaptalksSource } from '../types'

const props = withDefaults(
  defineProps<{
    source?: string | MaptalksSource
    id?: string
    options?: MaptalksGLTFLayerCombinedOptions
    autoDispose?: boolean
    visible?: boolean
    events?: Record<string, MaptalksEventHandler>
  }>(),
  { options: () => ({}), autoDispose: true, visible: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksGLTFLayer 必须在 MaptalksMap 内使用')
const { layer, show, hide } = useMaptalksGLTFLayer(map, {
  source: props.source,
  id: props.id,
  options: props.options,
  autoDispose: props.autoDispose,
  events: props.events,
})

watch([() => props.visible, layer], ([v, l]) => { if (!l) return; if (v) show(); else hide() }, { immediate: true })

defineExpose({ layer, show, hide })
</script>
