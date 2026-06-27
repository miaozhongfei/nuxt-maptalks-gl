<template>
  <div ref="el" style="height: 100%; width: 100%">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, ref, watch } from 'vue';

import { useMaptalks } from '../composables/useMaptalks';
import { MAP_KEY } from '../core/map-context';
import type { MaptalksError } from '../core/errors';
import type { MaptalksCoordinate, MaptalksMap, UseMaptalksOptions } from '../types';

const props = withDefaults(
  defineProps<{
    // 常用快捷 props（优先级高于 options）
    center?: MaptalksCoordinate | [number, number];
    zoom?: number;
    pitch?: number;
    bearing?: number;
    // 命名实例
    name?: string;
    // 兜底：透传任意 maptalks Map 选项
    options?: Record<string, unknown>;
  }>(),
  { options: () => ({}) },
);

const emit = defineEmits<{
  ready: [map: MaptalksMap];
  error: [err: MaptalksError];
}>();

const el = ref<HTMLElement | null>(null);

// 组装 UseMaptalksOptions：顶级 props 优先覆盖 options 兜底
function buildMapOptions(): UseMaptalksOptions {
  const base: UseMaptalksOptions = { ...props.options };
  if (props.center !== undefined) base.center = props.center;
  if (props.zoom !== undefined) base.zoom = props.zoom;
  if (props.pitch !== undefined) base.pitch = props.pitch;
  if (props.bearing !== undefined) base.bearing = props.bearing;
  if (props.name !== undefined) base.name = props.name;
  return base;
}

const { map, isReady, error } = useMaptalks(el, buildMapOptions());

provide(MAP_KEY, map);

watch(isReady, (v) => {
  if (v && map.value) emit('ready', map.value);
});
watch(error, (e) => {
  if (e) emit('error', e);
});

defineExpose({ map, isReady, error });
</script>
