<template><!-- maptalks distance tool · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue';
import type { ShallowRef } from 'vue';

import { useMaptalksDistanceTool } from '../composables/useMaptalksDistanceTool';
import { MAP_KEY } from '../core/map-context';
import type { MaptalksMap } from '../types';

const props = defineProps<{
  options?: Record<string, unknown>;
  events?: Record<string, (event: unknown) => void>;
}>();

const emit = defineEmits<{
  measure: [event: unknown];
  click: [event: unknown];
}>();

const map = inject<ShallowRef<MaptalksMap | null>>(MAP_KEY);

const allEvents: Record<string, (event: unknown) => void> = { ...props.events };
const origMeasure = allEvents['measure'];
const origClick = allEvents['click'];
allEvents['measure'] = (e: unknown) => {
  origMeasure?.(e);
  emit('measure', e);
};
allEvents['click'] = (e: unknown) => {
  origClick?.(e);
  emit('click', e);
};

useMaptalksDistanceTool(map!, { options: () => props.options, events: allEvents });
</script>
