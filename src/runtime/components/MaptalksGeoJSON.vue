<template><!-- maptalks geojson · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * GeoJSON 数据导入组件。
 *
 * @description 对 `useMaptalksGeoJSON` 的声明式封装。在父级 MaptalksVectorLayer 内，将 GeoJSON 数据
 * 自动解析为几何图形并添加到图层。支持响应式 data / symbol 更新、自动清理。
 * 必须在 MaptalksVectorLayer 内使用。
 *
 * @example
 * ```vue
 * <MaptalksVectorLayer>
 *   <MaptalksGeoJSON :data="geojsonData" :symbol="{ lineColor: '#00f' }" />
 * </MaptalksVectorLayer>
 * ```
 */
import { inject } from 'vue'

import { useMaptalksGeoJSON } from '../composables/useMaptalksGeoJSON'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { GeoJSONData } from '../types'

const props = withDefaults(
  defineProps<{
    /** GeoJSON 数据（FeatureCollection / Feature / Geometry） */
    data: GeoJSONData
    /** 几何图形样式（symbol），GeoJSON 中无 style 时用作默认 */
    symbol?: Record<string, unknown>
    /** 组件销毁时自动移除几何图形，默认 true */
    autoDispose?: boolean
  }>(),
  { autoDispose: true },
)

const layer = inject(GEOMETRY_LAYER_KEY)
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksGeoJSON 必须在 MaptalksVectorLayer 内使用')
const { geometries, remove } = useMaptalksGeoJSON(layer, {
  data: () => props.data,
  symbol: () => props.symbol,
  autoDispose: props.autoDispose,
});
defineExpose({ geometries, remove })
</script>
