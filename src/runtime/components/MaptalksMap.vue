<template>
  <div style="height: 100%; width: 100%">
    <div ref="el" style="height: 100%; width: 100%"></div>
    <div style="display: none"><slot /></div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, onBeforeUnmount, onScopeDispose, provide, ref, shallowRef, watch } from 'vue';

import { loadMaptalks, isWebGLAvailable } from '../core/loader';
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
const map = shallowRef<MaptalksMap | null>(null);
const isReady = ref(false);
const error = ref<MaptalksError | null>(null);

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

// 直接创建地图（绕过 useMaptalks，排除 composable 生命周期冲突）
onMounted(async () => {
  const domEl = el.value;
  if (!domEl) return;
  if (!isWebGLAvailable()) {
    error.value = { code: 'webgl-unsupported' as any, message: 'WebGL 不可用', name: 'MaptalksError' } as MaptalksError;
    return;
  }
  try {
    const mt = await loadMaptalks();
    const options = buildMapOptions();
    // 剥离 name/onError
    const mapOpts: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(options)) {
      if (k !== 'name' && k !== 'onError') mapOpts[k] = v;
    }
    const m = new mt.Map(domEl, mapOpts);
    map.value = m;
    isReady.value = true;
    emit('ready', m);
  } catch (e) {
    error.value = e as MaptalksError;
    emit('error', e as MaptalksError);
  }
});

function destroy() {
  if (map.value) { map.value.remove(); map.value = null; }
  isReady.value = false;
}
onBeforeUnmount(destroy);
onScopeDispose(destroy);

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

watch(error, (e) => { if (e) emit('error', e); });

defineExpose({ map, isReady, error });
</script>
