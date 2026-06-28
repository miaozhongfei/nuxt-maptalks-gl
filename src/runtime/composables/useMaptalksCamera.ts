import { nextTick, onScopeDispose, ref, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';

import type {
  MaptalksCoordinate,
  MaptalksMap,
  MaptalksViewLike,
  UseMaptalksCameraReturn,
} from '../types';

/** 默认监听的地图视图变更事件 */
const DEFAULT_CAMERA_EVENTS = 'moveend zoomend pitch rotate';

/** 参与双向同步的相机 ref 集合 */
interface CameraRefs {
  center: Ref<MaptalksCoordinate | null>;
  zoom: Ref<number | null>;
  pitch: Ref<number | null>;
  bearing: Ref<number | null>;
}

/** 共享的同步门闩：true 时正在「地图 → ref」回填，ref → 地图 的写回应跳过，以此避免回环 */
interface SyncState {
  syncing: boolean;
}

/**
 * 地图 → ref：订阅视图变更事件并回填四个 ref，返回 teardown。
 *
 * @description 地图变更时把相机状态拉入 ref（带门闩，避免触发写回）；地图引用变化时解绑旧、绑定新并拉取初值。
 * @param {() => MaptalksMap | null} getMap - 取当前地图实例
 * @param {CameraRefs} refs - 四个相机 ref
 * @param {string} events - 监听的视图变更事件（空格分隔）
 * @param {SyncState} state - 共享门闩状态
 * @returns {() => void} 解除订阅
 *
 * @example
 * const stop = bindViewToRefs(() => map.value, refs, 'moveend', state);
 */
function bindViewToRefs(
  getMap: () => MaptalksMap | null,
  refs: CameraRefs,
  events: string,
  state: SyncState,
): () => void {
  let boundMap: MaptalksMap | null = null;
  const pull = (m: MaptalksMap) => {
    state.syncing = true;
    refs.center.value = m.getCenter();
    refs.zoom.value = m.getZoom();
    refs.pitch.value = m.getPitch();
    refs.bearing.value = m.getBearing();
    void nextTick(() => {
      state.syncing = false;
    });
  };
  const onViewChange = () => {
    if (boundMap) pull(boundMap);
  };
  const stop = watch(
    getMap,
    (m) => {
      if (boundMap) boundMap.off(events, onViewChange);
      boundMap = m ?? null;
      if (m) {
        m.on(events, onViewChange);
        pull(m);
      }
    },
    { immediate: true },
  );
  return () => {
    stop();
    if (boundMap) boundMap.off(events, onViewChange);
  };
}

/**
 * ref → 地图：监听四个 ref，带门闩写回地图，返回 teardown。
 *
 * @description 仅在非门闩、地图存在且值非空时写回，避免与「地图 → ref」回填形成回环。
 * @param {() => MaptalksMap | null} getMap - 取当前地图实例
 * @param {CameraRefs} refs - 四个相机 ref
 * @param {SyncState} state - 共享门闩状态
 * @returns {() => void} 停止全部写回 watcher
 *
 * @example
 * const stop = bindRefsToMap(() => map.value, refs, state);
 */
function bindRefsToMap(
  getMap: () => MaptalksMap | null,
  refs: CameraRefs,
  state: SyncState,
): () => void {
  const guard = <T>(v: T | null, write: (m: MaptalksMap, value: T) => void) => {
    const m = getMap();
    if (!state.syncing && m && v !== null) write(m, v);
  };
  const stops = [
    watch(refs.zoom, (v) => guard(v, (m, z) => m.setZoom(z))),
    watch(refs.pitch, (v) => guard(v, (m, p) => m.setPitch(p))),
    watch(refs.bearing, (v) => guard(v, (m, b) => m.setBearing(b))),
    watch(refs.center, (v) => guard(v, (m, c) => m.setCenter(c)), { deep: true }),
  ];
  return () => {
    for (const stop of stops) stop();
  };
}

/**
 * 组合相机双向同步，返回统一 teardown。
 *
 * @param {() => MaptalksMap | null} getMap - 取当前地图实例
 * @param {CameraRefs} refs - 四个相机 ref
 * @param {string} events - 监听的视图变更事件
 * @returns {() => void} 解除全部同步
 *
 * @example
 * const teardown = bindCameraSync(() => map.value, refs, 'moveend zoomend');
 */
function bindCameraSync(
  getMap: () => MaptalksMap | null,
  refs: CameraRefs,
  events: string,
): () => void {
  const state: SyncState = { syncing: false };
  const stopView = bindViewToRefs(getMap, refs, events, state);
  const stopWrite = bindRefsToMap(getMap, refs, state);
  return () => {
    stopView();
    stopWrite();
  };
}

/**
 * 相机双向同步：`center/zoom/pitch/bearing` 与地图互相同步，并提供命令式过渡。
 *
 * @description 地图就绪后把当前相机状态拉入 ref，并监听视图变更事件回填 ref（地图 → ref）；
 * 同时监听 ref 变化写回地图（ref → 地图）。用同步门闩避免回环。作用域销毁时解绑并停止 watcher。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {{ events?: string }} [options] - 可选项，`events` 覆盖监听的视图变更事件（空格分隔）
 * @returns {UseMaptalksCameraReturn} `{ center, zoom, pitch, bearing, flyTo, animateTo, fitExtent }`
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { center, zoom, flyTo } = useMaptalksCamera(map);
 * // 双向：拖动地图后 center/zoom 自动更新；修改 zoom.value = 14 会驱动地图缩放
 * function focus() { flyTo({ center: [113.27, 23.13], zoom: 16 }); }
 */
export function useMaptalksCamera(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  options: { events?: string } = {},
): UseMaptalksCameraReturn {
  const center = ref<MaptalksCoordinate | null>(null);
  const zoom = ref<number | null>(null);
  const pitch = ref<number | null>(null);
  const bearing = ref<number | null>(null);
  const events = options.events ?? DEFAULT_CAMERA_EVENTS;

  const teardown = bindCameraSync(() => toValue(map), { center, zoom, pitch, bearing }, events);
  onScopeDispose(teardown);

  const get = () => toValue(map);

  return {
    center,
    zoom,
    pitch,
    bearing,
    flyTo: (view: MaptalksViewLike, opts?: Record<string, unknown>) => {
      get()?.flyTo(view, opts);
    },
    animateTo: (view: MaptalksViewLike, opts?: Record<string, unknown>) => {
      get()?.animateTo(view, opts);
    },
    fitExtent: (extent: unknown, zoomOffset?: number, opts?: Record<string, unknown>) => {
      get()?.fitExtent(extent, zoomOffset, opts);
    },
    ...cameraExtensions(get),
  };
}

/**
 * 创建相机扩展方法（平移 / 只读状态 / 约束 setter）。
 *
 * @description 七个方法按功能分为：平移（panTo/panBy）、只读查询（getExtent/getResolution/getScale）、
 * 约束设置（setMaxExtent/setZoomRange）。所有方法以 null-safe 方式委托给地图实例。
 * @param {() => MaptalksMap | null} getMap - 取地图实例的函数（map 为 null 时各方法 no-op / 返回 null）
 * @returns {object} 七个相机扩展方法的集合（panTo / panBy / getExtent / getResolution / getScale / setMaxExtent / setZoomRange）
 *
 * @example
 * const ext = cameraExtensions(() => map.value);
 * ext.panTo([121.47, 31.23]);
 * const resolution = ext.getResolution();
 */
function cameraExtensions(getMap: () => MaptalksMap | null) {
  return {
    panTo: (coord: MaptalksCoordinate | [number, number], opts?: Record<string, unknown>) => {
      getMap()?.panTo(coord, opts);
    },
    panBy: (offset: [number, number] | Record<string, unknown>, opts?: Record<string, unknown>) => {
      getMap()?.panBy(offset, opts);
    },
    getExtent: () => {
      const m = getMap();
      return m ? m.getExtent() : null;
    },
    getResolution: (z?: number) => {
      const m = getMap();
      return m ? m.getResolution(z) : null;
    },
    getScale: (z?: number) => {
      const m = getMap();
      return m ? m.getScale(z) : null;
    },
    setMaxExtent: (extent: unknown | null) => {
      getMap()?.setMaxExtent(extent);
    },
    setZoomRange: (min?: number, max?: number) => {
      const m = getMap();
      if (!m) return;
      if (min !== undefined) m.setMinZoom(min);
      if (max !== undefined) m.setMaxZoom(max);
    },
  };
}
