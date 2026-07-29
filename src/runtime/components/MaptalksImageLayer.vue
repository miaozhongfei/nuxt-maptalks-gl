<template><!-- maptalks image layer · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * ImageLayer 组件（图片叠加图层）。
 *
 * @description 对 `useMaptalksImageLayer` 的声明式封装。支持传入图片数组（url + extent），
 * 支持 `:visible` 声明式显隐、`:events` 原生事件绑定、`defineExpose({ layer, show, hide })` 程序式控制。
 * 必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksImageLayer :images="[{ url: 'overlay.png', extent: [121.4, 31.2, 121.5, 31.3] }]" />
 * ```
 */
import { computed, inject, watch } from 'vue'

import { useMaptalksImageLayer } from '../composables/presets/useMaptalksImageLayer'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksImageLayerOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** 图片数组 */
    images?: Array<{ url: string; extent: unknown; opacity?: number }>
    /** 图层 id，缺省自动生成 */
    id?: string | number
    /** 透传给 ImageLayer 构造器的选项 */
    options?: MaptalksImageLayerOptions
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
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksImageLayer 必须在 MaptalksMap 内使用')
const { layer, show, hide } = useMaptalksImageLayer(map, {
  images: computed(() => props.images),
  id: props.id,
  options: computed(() => props.options),
  autoDispose: props.autoDispose,
  events: props.events,
})

watch([() => props.visible, layer], ([v, l]) => { if (!l) return; if (v) show(); else hide() }, { immediate: true })

/** 暴露 layer 实例与 show/hide 方法，供 template ref 访问 */
defineExpose({ layer, show, hide })
</script>
