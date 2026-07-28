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
import { computed, inject, watch } from 'vue'

import { useMaptalksGroupGLLayer } from '../composables/presets/useMaptalksGroupGLLayer'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksLayer, MaptalksGroupGLLayerOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** 图层 id，缺省自动生成 */
    id?: string
    /** 承载的子 GL 图层（已创建实例） */
    layers?: MaptalksLayer[]
    /** 透传给 GroupGLLayer 构造器的额外选项（优先级高于默认 sceneConfig） */
    options?: MaptalksGroupGLLayerOptions
    /** 组件销毁时自动移除图层，默认 true */
    autoDispose?: boolean
    /** 是否可见，默认 true */
    visible?: boolean
    /** 事件名 → 处理器（自动 on/off） */
    events?: Record<string, MaptalksEventHandler>
  }>(),
  { layers: () => [], options: () => ({}), autoDispose: true, visible: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksGroupGLLayer 必须在 MaptalksMap 内使用')
const { layer, show, hide } = useMaptalksGroupGLLayer(map, {
  id: props.id,
  layers: props.layers,
  options: computed(() => props.options),
  autoDispose: props.autoDispose,
  events: props.events,
})

watch([() => props.visible, layer], ([v, l]) => { if (!l) return; if (v) show(); else hide() }, { immediate: true })

/** 暴露 layer 实例与 show/hide 方法，供 template ref 访问 */
defineExpose({ layer, show, hide })
</script>
