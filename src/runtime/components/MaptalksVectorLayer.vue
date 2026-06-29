<template><!-- maptalks vector layer · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject, provide } from 'vue';
import type { ShallowRef } from 'vue';

import { useMaptalksVectorLayer } from '../composables/presets/useMaptalksVectorLayer';
import { GEOMETRY_LAYER_KEY, MAP_KEY } from '../core/map-context';
import type { MaptalksMap, MaptalksNativeVectorLayerOptions } from '../types';

const props = withDefaults(
  defineProps<{
    id?: string;
    options?: Partial<MaptalksNativeVectorLayerOptions> & Record<string, unknown>;
    autoDispose?: boolean;
  }>(),
  { options: () => ({}), autoDispose: true },
);

const map = inject<ShallowRef<MaptalksMap | null>>(MAP_KEY);
const { layer } = useMaptalksVectorLayer(map!, {
  id: props.id,
  options: props.options,
  autoDispose: props.autoDispose,
});
// 把 VectorLayer 引用 provide 给子几何组件
provide(GEOMETRY_LAYER_KEY, layer);
</script>
