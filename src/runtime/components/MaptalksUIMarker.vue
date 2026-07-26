<template>
  <div style="display: none" />
</template>

<script setup lang="ts">
import { inject } from 'vue';

import { useMaptalksUIMarker } from '../composables/useMaptalksUIMarker';
import { MAP_KEY } from '../core/map-context';

const props = withDefaults(
  defineProps<{
    /** UIMarker 坐标 */
    coordinates: [number, number]
    /** HTML 内容字符串 */
    content: string
    /** 是否可拖拽 */
    draggable?: boolean
    /** 组件销毁时自动移除 UIMarker，默认 true */
    autoDispose?: boolean
  }>(),
  { draggable: false, autoDispose: true },
);

const map = inject(MAP_KEY);
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksUIMarker 必须在 MaptalksMap 内使用');

useMaptalksUIMarker(map, {
  coordinates: () => props.coordinates,
  content: () => props.content,
  draggable: () => props.draggable,
  autoDispose: props.autoDispose,
});
</script>
