import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';
import { dequal } from 'dequal';

import { toMaptalksError } from '../core/errors';
import type { MaptalksEventHandler, MaptalksGeometry, MaptalksInfoWindowOptions } from '../types';
import { createLogger } from '../utils/logger';

/** 日志实例 */
const logger = createLogger('nuxt-maptalks-gl');

/** 原生 Marker 的 setInfoWindow 入参 */
interface GeometryInfoWindowOptions {
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
  setInfoWindow(opts: GeometryInfoWindowOptions): void;
  getInfoWindow(): { setContent(content: string | HTMLElement): void; on?(event: string, handler: MaptalksEventHandler): void; off?(event: string, handler: MaptalksEventHandler): void } | null;
  openInfoWindow(): void;
  closeInfoWindow(): void;
  on(event: string, handler: MaptalksEventHandler): void;
  off(event: string, handler: MaptalksEventHandler): void;
}

/**
 * useMaptalksGeometryInfoWindow 的选项。
 *
 * @description 配置 Marker 级信息框：透传给 marker.setInfoWindow() 的选项（title / content / custom 等）、
 * 事件绑定（open / close）、自动销毁开关。与 useMaptalksInfoWindow（地图级）不同，此信息框只属于单个 Marker。
 *
 * @example
 * const opts: UseMaptalksGeometryInfoWindowOpts = {
 *   options: { title: '站点', custom: true, content: '<div>详情</div>', autoOpenOn: 'click' },
 *   events: { open: () => console.log('opened'), close: () => console.log('closed') },
 * };
 */
export interface UseMaptalksGeometryInfoWindowOpts {
  /** 透传给 marker.setInfoWindow() 的选项（含中文字段注释，详见 MaptalksInfoWindowOptions） */
  options?: MaybeRefOrGetter<
    MaptalksInfoWindowOptions
    | undefined
  >;
  /** 信息框事件（open/close 等） */
  events?: Record<string, MaptalksEventHandler>;
  /** 组件销毁时自动移除信息框，默认 true */
  autoDispose?: boolean;
}

/**
 * useMaptalksGeometryInfoWindow 的返回值。
 *
 * @description 提供 Marker 级信息框的三项控制：`show`（弹出）、`hide`（关闭）、`remove`（移除配置并关闭）。
 *
 * @example
 * const { show, hide, remove } = useMaptalksGeometryInfoWindow(geometry, { options: { title: '站点' } });
 * show(); // 弹出该 Marker 的信息框
 */
export interface UseMaptalksGeometryInfoWindowReturn {
  /** 显示该 Marker 的信息框 */
  show: () => void;
  /** 隐藏该 Marker 的信息框 */
  hide: () => void;
  /** 移除该 Marker 的信息框配置并隐藏 */
  remove: () => void;
}

/**
 * 标记级信息框：在给定 Marker 几何上注册 setInfoWindow，响应式纳管 content/title，返回 show/hide。
 *
 * @description 对应 maptalks 原生的 `marker.setInfoWindow()` + `openInfoWindow()` / `closeInfoWindow()`。
 * 与 useMaptalksInfoWindow（地图级）不同，此 composable 创建的信息框**只属于这一个 Marker**——点击 Marker
 * 自动弹出、点击别处自动关闭，不需手动操控坐标；内容/标题支持响应式更新。
 * @param {MaybeRefOrGetter<MaptalksGeometry | null>} geometry - useMaptalksMarker 返回的 geometry
 * @param {UseMaptalksGeometryInfoWindowOpts} [opts] - 信息框配置（options/events/autoDispose）
 * @returns {UseMaptalksGeometryInfoWindowReturn} `{ show, hide, remove }`
 *
 * @example
 * const { geometry } = useMaptalksMarker(layer, { coordinates: [113.27, 23.13] });
 * const { show } = useMaptalksGeometryInfoWindow(geometry, {
 *   options: { title: '我的位置', custom: true, content: '<div>内容</div>' },
 * });
 */

/** 从选项构建原生 setInfoWindow 入参 */
function buildMarkerIWOptions(opts: UseMaptalksGeometryInfoWindowOpts): GeometryInfoWindowOptions {
  return { ...toValue(opts.options) } as GeometryInfoWindowOptions;
}

/** 设置 Marker 信息框的响应式 watch（几何就绪配置 + options 变化重建） */
function setupMarkerIW(
  geometry: MaybeRefOrGetter<MaptalksGeometry | null>,
  opts: UseMaptalksGeometryInfoWindowOpts,
  hasSet: ShallowRef<boolean>,
  events: Record<string, MaptalksEventHandler>,
): void {
  watch(
    () => toValue(geometry) as NativeMarker | null,
    (m) => {
      if (m && !hasSet.value) {
        try { m.setInfoWindow(buildMarkerIWOptions(opts)); hasSet.value = true; }
        catch (cause) { logger.error('GeometryInfoWindow 配置失败', toMaptalksError(cause, 'control-failed', 'GeometryInfoWindow 配置失败')); }
      }
    },
    { immediate: true },
  );
  // options（不含 content）变化 → setInfoWindow() 重建；content 由单独 watch 处理
  let prevRest: Record<string, unknown> | undefined;
  watch(
    () => {
      const raw = toValue(opts.options);
      if (!raw) return;
      const { content: _, ...rest } = raw as Record<string, unknown>;
      return rest;
    },
    (rest) => {
      if (!rest || dequal(rest, prevRest)) return;
      prevRest = rest;
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
  // 原生 InfoWindow 事件全量透传到 events（add / showstart / showend / hide / remove）
  // 点击 Marker 自动弹出（autoOpenOn:'click'）走原生 openInfoWindow()，不经 show() 包装，
  // 需在此把原生实例上的事件绑定到用户 events，保证日志/联动一致。
  // options 重建（setInfoWindow）会生成新 InfoWindow 实例 → getInfoWindow() 引用变化 → watch 重新触发重新绑定。
  watch(
    () => {
      const m = toValue(geometry) as NativeMarker | null;
      return m?.getInfoWindow?.() ?? null;
    },
    (iw) => {
      if (!iw) return;
      for (const [event, handler] of Object.entries(events)) {
        iw.on?.(event, handler);
      }
    },
  );
}

export function useMaptalksGeometryInfoWindow(
  geometry: MaybeRefOrGetter<MaptalksGeometry | null>,
  opts: UseMaptalksGeometryInfoWindowOpts = {},
): UseMaptalksGeometryInfoWindowReturn {
  const events = opts.events ?? {};
  const hasSet = shallowRef(false);
  setupMarkerIW(geometry, opts, hasSet, events);

  const show = (): void => {
    (toValue(geometry) as NativeMarker | null)?.openInfoWindow();
    events.show?.({} as never);
  };
  const hide = (): void => {
    (toValue(geometry) as NativeMarker | null)?.closeInfoWindow();
    events.hide?.({} as never);
  };
  function remove(): void {
    const m = toValue(geometry) as NativeMarker | null;
    if (m && hasSet.value) { m.closeInfoWindow(); hasSet.value = false; }
  }

  if (opts.autoDispose ?? true) onScopeDispose(remove);
  return { show, hide, remove };
}
