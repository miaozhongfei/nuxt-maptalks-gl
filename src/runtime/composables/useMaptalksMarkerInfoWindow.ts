import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { toMaptalksError } from '../core/errors';
import type { MaptalksEventHandler, MaptalksGeometry } from '../types';
import { createLogger } from '../utils/logger';

/** 日志实例 */
const logger = createLogger('nuxt-maptalks-gl');

/** 原生 Marker 的 setInfoWindow 入参 */
interface MarkerInfoWindowOptions {
  title?: string | HTMLElement;
  content?: string | HTMLElement;
  width?: number;
  height?: number;
  custom?: boolean;
  autoPan?: boolean;
  single?: boolean;
  animation?: boolean;
  dx?: number;
  dy?: number;
  /** 自定义选项透传 */
  [key: string]: unknown;
}

/** 带 setInfoWindow/openInfoWindow/closeInfoWindow 的原生 Marker 接口 */
interface NativeMarker {
  setInfoWindow(opts: MarkerInfoWindowOptions): void;
  openInfoWindow(): void;
  closeInfoWindow(): void;
  on(event: string, handler: MaptalksEventHandler): void;
  off(event: string, handler: MaptalksEventHandler): void;
}

/** useMaptalksMarkerInfoWindow 的选项 */
export interface UseMaptalksMarkerInfoWindowOptions {
  /** 标题（响应式），可用空字符串隐藏内置标题栏 */
  title?: MaybeRefOrGetter<string | undefined>;
  /** 信息框内容（响应式），支持 HTML 字符串 */
  content?: MaybeRefOrGetter<string | undefined>;
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 自定义模板（禁用 maptalks 内置 chrome） */
  custom?: boolean;
  /** 自动移动地图使信息框可见 */
  autoPan?: boolean;
  /** 是否唯一（同时只显示一个） */
  single?: boolean;
  /** 动画 */
  animation?: boolean;
  /** 水平偏移 */
  dx?: number;
  /** 垂直偏移 */
  dy?: number;
  /** 信息框事件（open/close 等） */
  events?: Record<string, MaptalksEventHandler>;
  /** 组件销毁时自动移除信息框，默认 true */
  autoDispose?: boolean;
}

/** useMaptalksMarkerInfoWindow 的返回值 */
export interface UseMaptalksMarkerInfoWindowReturn {
  /** 打开该 Marker 的信息框 */
  open: () => void;
  /** 关闭该 Marker 的信息框 */
  close: () => void;
  /** 移除该 Marker 的信息框配置并关闭 */
  remove: () => void;
}

/** 给原生 Marker 绑定事件 */
function bindEvents(marker: NativeMarker, events: Record<string, MaptalksEventHandler>): void {
  for (const [name, handler] of Object.entries(events)) {
    marker.on(name, handler);
  }
}

/** 解绑原生 Marker 的事件 */
function unbindEvents(marker: NativeMarker, events: Record<string, MaptalksEventHandler>): void {
  for (const [name, handler] of Object.entries(events)) {
    marker.off(name, handler);
  }
}

/**
 * 标记级信息框：在给定 Marker 几何上注册 setInfoWindow，响应式纳管 content/title，返回 open/close。
 *
 * @description 对应 maptalks 原生的 `marker.setInfoWindow()` + `openInfoWindow()` / `closeInfoWindow()`。
 * 与 useMaptalksInfoWindow（地图级）不同，此 composable 创建的信息框**只属于这一个 Marker**——点击 Marker
 * 自动弹出、点击别处自动关闭，不需手动操控坐标；内容/标题支持响应式更新。
 * @param {MaybeRefOrGetter<MaptalksGeometry | null>} geometry - useMaptalksMarker 返回的 geometry
 * @param {UseMaptalksMarkerInfoWindowOptions} [opts] - 信息框配置（title/content/width/custom/events 等）
 * @returns {UseMaptalksMarkerInfoWindowReturn} `{ open, close, remove }`
 *
 * @example
 * const { geometry } = useMaptalksMarker(layer, { coordinates: [113.27, 23.13] });
 * const { open } = useMaptalksMarkerInfoWindow(geometry, {
 *   title: '我的位置',
 *   content: () => `<div>${desc.value}</div>`,
 * });
 * // 点击该 Marker 时自动弹出（由 useMaptalksMarker 的 events.click 控制）
 */
export function useMaptalksMarkerInfoWindow(
  geometry: MaybeRefOrGetter<MaptalksGeometry | null>,
  opts: UseMaptalksMarkerInfoWindowOptions = {},
): UseMaptalksMarkerInfoWindowReturn {
  const events = opts.events ?? {};
  const hasSet = shallowRef(false);

  /** 构建 setInfoWindow 的选项对象 */
  function buildOptions(): MarkerInfoWindowOptions {
    const result: MarkerInfoWindowOptions = {};
    const t = toValue(opts.title); if (t !== undefined) result.title = t;
    const c = toValue(opts.content); if (c !== undefined) result.content = c;
    if (opts.width !== undefined) result.width = opts.width;
    if (opts.height !== undefined) result.height = opts.height;
    if (opts.custom !== undefined) result.custom = opts.custom;
    if (opts.autoPan !== undefined) result.autoPan = opts.autoPan;
    if (opts.single !== undefined) result.single = opts.single;
    if (opts.animation !== undefined) result.animation = opts.animation;
    if (opts.dx !== undefined) result.dx = opts.dx;
    if (opts.dy !== undefined) result.dy = opts.dy;
    return result;
  }

  /** 对原生 Marker 调用 setInfoWindow 并绑定事件 */
  function setup(marker: NativeMarker): void {
    try {
      marker.setInfoWindow(buildOptions());
      bindEvents(marker, events);
      hasSet.value = true;
    } catch (cause) {
      logger.error('MarkerInfoWindow 配置失败', toMaptalksError(cause, 'control-failed', 'MarkerInfoWindow 配置失败'));
    }
  }

  // 几何就绪时配置信息框
  watch(
    () => toValue(geometry) as NativeMarker | null,
    (m) => {
      if (m && !hasSet.value) setup(m);
    },
    { immediate: true },
  );

  // title / content 变化时重新 setInfoWindow
  watch(
    [() => toValue(opts.title), () => toValue(opts.content)],
    () => {
      const m = toValue(geometry) as NativeMarker | null;
      if (m && hasSet.value) {
        m.setInfoWindow(buildOptions());
      }
    },
  );

  function open(): void {
    (toValue(geometry) as NativeMarker | null)?.openInfoWindow();
  }

  function close(): void {
    (toValue(geometry) as NativeMarker | null)?.closeInfoWindow();
  }

  function remove(): void {
    const m = toValue(geometry) as NativeMarker | null;
    if (m && hasSet.value) {
      unbindEvents(m, events);
      m.closeInfoWindow();
      hasSet.value = false;
    }
  }

  if (opts.autoDispose ?? true) onScopeDispose(remove);

  return { open, close, remove };
}
