<template><!-- maptalks group gl layer · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue';
import type { ShallowRef } from 'vue';

import { useMaptalksGroupGLLayer } from '../composables/presets/useMaptalksGroupGLLayer';
import { MAP_KEY } from '../core/map-context';
import type { MaptalksLayer, MaptalksMap } from '../types';

const props = withDefaults(
  defineProps<{
    id?: string;
    layers?: MaptalksLayer[];
    options?: Record<string, unknown>;
    autoDispose?: boolean;
  }>(),
  { layers: () => [], options: () => ({}), autoDispose: true },
);

const map = inject<ShallowRef<MaptalksMap | null>>(MAP_KEY);
useMaptalksGroupGLLayer(map!, {
  id: props.id,
  layers: props.layers,
  options: props.options,
  autoDispose: props.autoDispose,
});
</script>
