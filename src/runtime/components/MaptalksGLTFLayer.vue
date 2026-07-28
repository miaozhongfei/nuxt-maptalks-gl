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
import { computed, inject, watch } from 'vue'

import { useMaptalksGLTFLayer } from '../composables/presets/useMaptalksGLTFLayer'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksGLTFLayerOptions, MaptalksSource } from '../types'

const props = withDefaults(
  defineProps<{
    /** 数据源：源名（字符串，按配置解析）或内联源对象 */
    source?: string | MaptalksSource
    /** 图层 id，缺省自动生成 */
    id?: string
    /** 透传给 GLTFLayer 构造器的选项 */
    options?: MaptalksGLTFLayerOptions
    /** 组件销毁时自动移除图层，默认 true */
    autoDispose?: boolean
    /** 是否可见，默认 true */
    visible?: boolean
    /** 事件名 → 处理器（自动 on/off） */
    events?: Record<string, MaptalksEventHandler>
  }>(),
  { options: () => ({}), autoDispose: true, visible: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksGLTFLayer 必须在 MaptalksMap 内使用')
const { layer, show, hide } = useMaptalksGLTFLayer(map, {
  source: props.source,
  id: props.id,
  options: computed(() => props.options),
  autoDispose: props.autoDispose,
  events: props.events,
})

watch([() => props.visible, layer], ([v, l]) => { if (!l) return; if (v) show(); else hide() }, { immediate: true })

/** 暴露 layer 实例与 show/hide 方法，供 template ref 访问 */
defineExpose({ layer, show, hide })
</script>
