<template><!-- maptalks gltf layer · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue';
import type { ShallowRef } from 'vue';

import { useMaptalksGLTFLayer } from '../composables/presets/useMaptalksGLTFLayer';
import { MAP_KEY } from '../core/map-context';
import type { MaptalksMap, MaptalksNativeGLTFLayerOptions, MaptalksSource } from '../types';

const props = withDefaults(
  defineProps<{
    source?: string | MaptalksSource;
    id?: string;
    options?: Partial<MaptalksNativeGLTFLayerOptions> & Record<string, unknown>;
    autoDispose?: boolean;
  }>(),
  { options: () => ({}), autoDispose: true },
);

const map = inject<ShallowRef<MaptalksMap | null>>(MAP_KEY);
useMaptalksGLTFLayer(map!, {
  source: props.source,
  id: props.id,
  options: props.options,
  autoDispose: props.autoDispose,
});
</script>
