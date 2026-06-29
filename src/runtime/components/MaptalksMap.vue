<template>
  <slot />
  <div ref="el" style="height: 100%; width: 100%" />
</template>

<script setup lang="ts">
import { provide, ref, watch } from 'vue';

import { useMaptalks } from '../composables/useMaptalks';
import type { MaptalksError } from '../core/errors';
import { MAP_KEY } from '../core/map-context';
import { applyMapConfigProps } from '../core/map-props';
import type { MaptalksCoordinate, MaptalksMap, UseMaptalksOptions } from '../types';

const props = withDefaults(
  defineProps<{
    // 常用快捷 props（优先级高于 options）
    center?: MaptalksCoordinate | [number, number];
    zoom?: number;
    pitch?: number;
    bearing?: number;
    // 限制与交互开关（运行时响应式）
    minZoom?: number;
    maxZoom?: number;
    draggable?: boolean;
    dragPitch?: boolean;
    dragRotate?: boolean;
    zoomable?: boolean;
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
  if (props.minZoom !== undefined) base.minZoom = props.minZoom;
  if (props.maxZoom !== undefined) base.maxZoom = props.maxZoom;
  if (props.draggable !== undefined) base.draggable = props.draggable;
  if (props.dragPitch !== undefined) base.dragPitch = props.dragPitch;
  if (props.dragRotate !== undefined) base.dragRotate = props.dragRotate;
  if (props.zoomable !== undefined) base.zoomable = props.zoomable;
  if (props.name !== undefined) base.name = props.name;
  return base;
}

const { map, isReady, error } = useMaptalks(el, buildMapOptions());

provide(MAP_KEY, map);

  // 运行时同步快捷 prop（仅响应 prop 本身的变化，不与 isReady 联动——初值已由 buildMapOptions 透传构造器）
  watch(
    () => [
      props.minZoom,
      props.maxZoom,
      props.draggable,
      props.dragPitch,
      props.dragRotate,
      props.zoomable,
    ],
    () => {
      if (!map.value) return;
      applyMapConfigProps(map.value, {
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        draggable: props.draggable,
        dragPitch: props.dragPitch,
        dragRotate: props.dragRotate,
        zoomable: props.zoomable,
      });
    },
  );

watch(isReady, (v) => {
  if (v && map.value) emit('ready', map.value);
});
watch(error, (e) => {
  if (e) emit('error', e);
});

defineExpose({ map, isReady, error });
</script>
