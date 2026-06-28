<template><!-- maptalks marker · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue';
import type { ShallowRef } from 'vue';

import { useMaptalksMarker } from '../composables/presets/useMaptalksMarker';
import { GEOMETRY_LAYER_KEY } from '../core/map-context';
import type { MarkerCoordinates, MaptalksVectorLayer } from '../types';

const props = withDefaults(
  defineProps<{
    coordinates: MarkerCoordinates;
    symbol?: Record<string, unknown>;
    properties?: Record<string, unknown>;
    id?: string;
    autoDispose?: boolean;
  }>(),
  { autoDispose: true },
);

const emit = defineEmits<{
  click: [e: unknown];
  dblclick: [e: unknown];
  mouseenter: [e: unknown];
  mouseout: [e: unknown];
}>();

const layer = inject<ShallowRef<MaptalksVectorLayer | null>>(GEOMETRY_LAYER_KEY);
useMaptalksMarker(layer!, {
  coordinates: () => props.coordinates,
  symbol: () => props.symbol,
  properties: () => props.properties,
  id: props.id,
  autoDispose: props.autoDispose,
  events: {
    click: (e) => emit('click', e),
    dblclick: (e) => emit('dblclick', e),
    mouseenter: (e) => emit('mouseenter', e),
    mouseout: (e) => emit('mouseout', e),
  },
});
</script>
