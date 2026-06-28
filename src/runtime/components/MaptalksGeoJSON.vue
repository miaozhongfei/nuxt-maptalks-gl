<template><!-- maptalks geojson · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue';
import type { ShallowRef } from 'vue';

import { useMaptalksGeoJSON } from '../composables/useMaptalksGeoJSON';
import { GEOMETRY_LAYER_KEY } from '../core/map-context';
import type { GeoJSONData, MaptalksVectorLayer } from '../types';

const props = withDefaults(
  defineProps<{
    data: GeoJSONData;
    symbol?: Record<string, unknown>;
    autoDispose?: boolean;
  }>(),
  { autoDispose: true },
);

const layer = inject<ShallowRef<MaptalksVectorLayer | null>>(GEOMETRY_LAYER_KEY);
useMaptalksGeoJSON(layer!, {
  data: () => props.data,
  symbol: () => props.symbol,
  autoDispose: props.autoDispose,
});
</script>
