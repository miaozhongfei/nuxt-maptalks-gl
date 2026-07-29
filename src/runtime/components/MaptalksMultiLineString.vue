<template><!-- maptalks multilinestring · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 多线段几何组件（MultiLineString）。
 *
 * @description 对 `useMaptalksMultiLineString` 的声明式封装。在父级 MaptalksVectorLayer 内创建 MultiLineString，
 * 一次性渲染多条不连续的线段。支持嵌套坐标数组、symbol 样式、显隐控制与事件绑定。纯逻辑组件，不渲染 DOM。
 * 必须在 MaptalksVectorLayer 内使用。
 *
 * @example
 * ```vue
 * <MaptalksVectorLayer>
 *   <MaptalksMultiLineString :coordinates="[[[121,31],[122,32]],[[120,30],[121,31]]]" :options="{ symbol: { lineColor: '#00f' } }" @click="onClick" />
 * </MaptalksVectorLayer>
 * ```
 */
import { inject } from 'vue'

import { useMaptalksMultiLineString } from '../composables/presets/useMaptalksMultiLineString'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { MaptalksMultiLineStringOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** 几何图形坐标 */
    coordinates: number[][][]
    /** 几何图形唯一标识 */
    id?: string | number
    /** 是否可见 */
    visible?: boolean
    /** 透传给几何构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
    options?: MaptalksMultiLineStringOptions
    /** 组件销毁时自动移除几何图形，默认 true */
    autoDispose?: boolean
  }>(),
  { autoDispose: true, options: undefined },
)

const emit = defineEmits<{
  click: [e: unknown]
  dblclick: [e: unknown]
  mouseenter: [e: unknown]
  mouseout: [e: unknown]
}>()

const layer = inject(GEOMETRY_LAYER_KEY)
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksMultiLineString 必须在 MaptalksVectorLayer 内使用')
const { geometry, show, hide, remove } = useMaptalksMultiLineString(layer, {
  coordinates: () => props.coordinates,
  options: () => props.options,
  visible: () => props.visible,
  id: props.id,
  autoDispose: props.autoDispose,
  events: {
    click: (e) => emit('click', e),
    dblclick: (e) => emit('dblclick', e),
    mouseenter: (e) => emit('mouseenter', e),
    mouseout: (e) => emit('mouseout', e),
  },
});
defineExpose({ geometry, show, hide, remove })
</script>
