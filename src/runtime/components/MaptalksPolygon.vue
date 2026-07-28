<template><!-- maptalks polygon · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 多边形几何组件（Polygon）。
 *
 * @description 对 `useMaptalksPolygon` 的声明式封装。在父级 MaptalksVectorLayer 内创建 Polygon，
 * 支持响应式坐标（嵌套数组，含孔洞支持）、symbol 样式、显隐控制与事件绑定。纯逻辑组件，不渲染 DOM。
 * 必须在 MaptalksVectorLayer 内使用。
 *
 * @example
 * ```vue
 * <MaptalksVectorLayer>
 *   <MaptalksPolygon :coordinates="[[[121,31],[122,31],[122,32],[121,32]]]" :options="{ symbol: { polygonFill: '#0f0' } }" @click="onClick" />
 * </MaptalksVectorLayer>
 * ```
 */
import { inject } from 'vue';

import { useMaptalksPolygon } from '../composables/presets/useMaptalksPolygon';
import { GEOMETRY_LAYER_KEY } from '../core/map-context';
import type { MaptalksPolygonOptions } from '../types';

const props = withDefaults(
  defineProps<{
    /** 几何图形坐标 */
    coordinates: number[][][];
    /** 几何图形唯一标识 */
    id?: string;
    /** 是否可见 */
    visible?: boolean;
    /** 透传给几何构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
    options?: MaptalksPolygonOptions;
    /** 组件销毁时自动移除几何图形，默认 true */
    autoDispose?: boolean;
  }>(),
  { autoDispose: true, options: undefined },
);

const emit = defineEmits<{
  click: [e: unknown];
  dblclick: [e: unknown];
  mouseenter: [e: unknown];
  mouseout: [e: unknown];
}>();

const layer = inject(GEOMETRY_LAYER_KEY);
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksPolygon 必须在 MaptalksVectorLayer 内使用');
const { geometry, show, hide, remove } = useMaptalksPolygon(layer, {
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
defineExpose({ geometry, show, hide, remove });
</script>
