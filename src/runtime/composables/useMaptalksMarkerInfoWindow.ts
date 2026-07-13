import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';

import { toMaptalksError } from '../core/errors';
import type { MaptalksEventHandler, MaptalksGeometry, MaptalksNativeMarkerIWOptions } from '../types';
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
  animation?: string;
  dx?: number;
  dy?: number;
  autoOpenOn?: string | null;
  /** 自定义选项透传 */
  [key: string]: unknown;
}

/** 带 setInfoWindow/openInfoWindow/closeInfoWindow 的原生 Marker 接口 */
interface NativeMarker {
  setInfoWindow(opts: MarkerInfoWindowOptions): void;
  getInfoWindow(): { setContent(content: string | HTMLElement): void } | null;
  openInfoWindow(): void;
  closeInfoWindow(): void;
  on(event: string, handler: MaptalksEventHandler): void;
  off(event: string, handler: MaptalksEventHandler): void;
}

/** useMaptalksMarkerInfoWindow 的选项 */
export interface UseMaptalksMarkerInfoWindowOptions {
  /**
   * 透传给 maptalks 原生 marker.setInfoWindow() 的选项。
   *
   * @description 常用字段：title / content / custom / animation / autoPan / single / width / height / dx / dy /
   * autoOpenOn 等。完整列表参考 maptalks-gl 的 `InfoWindowOptionsType`。
   */
  options?: MaybeRefOrGetter<Partial<MaptalksNativeMarkerIWOptions> | undefined>;
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

/**
 * 标记级信息框：在给定 Marker 几何上注册 setInfoWindow，响应式纳管 content/title，返回 open/close。
 *
 * @description 对应 maptalks 原生的 `marker.setInfoWindow()` + `openInfoWindow()` / `closeInfoWindow()`。
 * 与 useMaptalksInfoWindow（地图级）不同，此 composable 创建的信息框**只属于这一个 Marker**——点击 Marker
 * 自动弹出、点击别处自动关闭，不需手动操控坐标；内容/标题支持响应式更新。
 * @param {MaybeRefOrGetter<MaptalksGeometry | null>} geometry - useMaptalksMarker 返回的 geometry
 * @param {UseMaptalksMarkerInfoWindowOptions} [opts] - 信息框配置（options/events/autoDispose）
 * @returns {UseMaptalksMarkerInfoWindowReturn} `{ open, close, remove }`
 *
 * @example
 * const { geometry } = useMaptalksMarker(layer, { coordinates: [113.27, 23.13] });
 * const { open } = useMaptalksMarkerInfoWindow(geometry, {
 *   options: { title: '我的位置', custom: true, content: '<div>内容</div>' },
 * });
 */

/** 从选项构建原生 setInfoWindow 入参 */
function buildMarkerIWOptions(opts: UseMaptalksMarkerInfoWindowOptions): MarkerInfoWindowOptions {
  return { ...toValue(opts.options) } as MarkerInfoWindowOptions;
}

/** 设置 Marker 信息框的响应式 watch（几何就绪配置 + options 变化重建） */
function setupMarkerIW(
  geometry: MaybeRefOrGetter<MaptalksGeometry | null>,
  opts: UseMaptalksMarkerInfoWindowOptions,
  hasSet: ShallowRef<boolean>,
): void {
  watch(
    () => toValue(geometry) as NativeMarker | null,
    (m) => {
      if (m && !hasSet.value) {
        try { m.setInfoWindow(buildMarkerIWOptions(opts)); hasSet.value = true; }
        catch (cause) { logger.error('MarkerInfoWindow 配置失败', toMaptalksError(cause, 'control-failed', 'MarkerInfoWindow 配置失败')); }
      }
    },
    { immediate: true },
  );
  // options（不含 content）变化 → setInfoWindow() 重建；content 由单独 watch 处理
  watch(
    () => {
      const raw = toValue(opts.options);
      if (!raw) return;
      const { content: _, ...rest } = raw as Record<string, unknown>;
      return JSON.stringify(rest);
    },
    () => {
      const m = toValue(geometry) as NativeMarker | null;
      if (m && hasSet.value) m.setInfoWindow(buildMarkerIWOptions(opts));
    },
  );
  // options.content 变化 → 直接 setContent()，不重建 InfoWindow，保持弹框打开
  watch(
    () => {
      const raw = toValue(opts.options);
      if (!raw) return;
      return toValue(raw.content as MaybeRefOrGetter<string | HTMLElement | undefined> | undefined);
    },
    (c) => {
      const m = toValue(geometry) as NativeMarker | null;
      const iw = m?.getInfoWindow?.();
      if (iw && c !== undefined) iw.setContent(c);
    },
  );
}

export function useMaptalksMarkerInfoWindow(
  geometry: MaybeRefOrGetter<MaptalksGeometry | null>,
  opts: UseMaptalksMarkerInfoWindowOptions = {},
): UseMaptalksMarkerInfoWindowReturn {
  const events = opts.events ?? {};
  const hasSet = shallowRef(false);
  setupMarkerIW(geometry, opts, hasSet);

  const open = (): void => {
    (toValue(geometry) as NativeMarker | null)?.openInfoWindow();
    events.open?.({} as never);
  };
  const close = (): void => {
    (toValue(geometry) as NativeMarker | null)?.closeInfoWindow();
    events.close?.({} as never);
  };
  function remove(): void {
    const m = toValue(geometry) as NativeMarker | null;
    if (m && hasSet.value) { m.closeInfoWindow(); hasSet.value = false; }
  }

  if (opts.autoDispose ?? true) onScopeDispose(remove);
  return { open, close, remove };
}
