import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';

import { MaptalksError, toMaptalksError } from '../core/errors';
import { loadMaptalks } from '../core/loader';
import type { MaptalksEventHandler, MaptalksInfoWindow, MaptalksMap } from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger('nuxt-maptalks-gl');

/**
 * `useMaptalksInfoWindow` 的可选项。
 *
 * @description 控制 InfoWindow 的构造参数、内容、坐标、事件绑定与自动销毁。
 *
 * @example
 * useMaptalksInfoWindow(map, {
 *   options: { title: '信息' },
 *   content: () => '<div>动态内容</div>',
 *   coordinates: () => [113.27, 23.13],
 * });
 */
export interface UseMaptalksInfoWindowOptions {
  /** 透传给 InfoWindow 构造器的选项 */
  options?: MaybeRefOrGetter<Record<string, unknown> | undefined>;
  /** 响应式弹出框内容（HTML 字符串或 DOM 元素） */
  content?: MaybeRefOrGetter<string | HTMLElement | undefined>;
  /** 响应式弹出框坐标 */
  coordinates?: MaybeRefOrGetter<unknown>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 `true` */
  autoDispose?: boolean;
}

/**
 * `useMaptalksInfoWindow` 的返回。
 *
 * @description 暴露响应式 InfoWindow 实例与命令式显隐/移除方法。
 *
 * @example
 * const { infoWindow, show, hide, remove } = useMaptalksInfoWindow(map);
 * show([113.27, 23.13]);
 */
export interface UseMaptalksInfoWindowReturn {
  /** InfoWindow 实例（创建前为 null） */
  infoWindow: ShallowRef<MaptalksInfoWindow | null>;
  /** 显示弹出框，可传入坐标 */
  show: (coord?: unknown) => void;
  /** 隐藏弹出框 */
  hide: () => void;
  /** 命令式移除并销毁 InfoWindow */
  remove: () => void;
}

/** 批量绑定事件 */
function bindEvents(iw: MaptalksInfoWindow, events: Record<string, MaptalksEventHandler>) {
  if (iw.on) {
    for (const [event, handler] of Object.entries(events)) {
      iw.on(event, handler);
    }
  }
}

/** 批量解绑事件 */
function unbindEvents(iw: MaptalksInfoWindow, events: Record<string, MaptalksEventHandler>) {
  if (iw.off) {
    for (const [event, handler] of Object.entries(events)) {
      iw.off(event, handler);
    }
  }
}

/**
 * 地图 InfoWindow 弹出框。
 *
 * @description 在 map 就绪后创建 `mt.ui.InfoWindow` 并 `addTo(map)`；
 * 响应式 `options` 变化时移除旧框并重建；`content` / `coordinates` 变化时调用
 * `setContent` / `setCoordinates`（不重建）；`events` 中的事件自动 on/off；
 * 作用域销毁时自动 `remove()`。InfoWindow 构造器缺失抛 `control-failed`。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {UseMaptalksInfoWindowOptions} [opts] - InfoWindow 选项、内容、坐标、事件与自动销毁控制
 * @returns {UseMaptalksInfoWindowReturn} `{ infoWindow, show, hide, remove }`
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { infoWindow, show } = useMaptalksInfoWindow(map, {
 *   content: computed(() => `<div>${detail.value}</div>`),
 *   coordinates: () => markerCoord.value,
 *   events: { open: () => console.warn('opened') },
 * });
 * // 在 marker click 中：
 * show(markerCoord.value);
 */
export function useMaptalksInfoWindow(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksInfoWindowOptions = {},
): UseMaptalksInfoWindowReturn {
  const infoWindow = shallowRef<MaptalksInfoWindow | null>(null);
  let creating = false;
  const events = opts.events ?? {};

  /** 创建 InfoWindow、addTo、bindEvents、初始 content/coordinates */
  async function reload() {
    const m = toValue(map);
    if (!m || creating) return;
    creating = true;
    if (infoWindow.value) { unbindEvents(infoWindow.value, events); infoWindow.value.remove(); infoWindow.value = null; }
    try {
      const mt = await loadMaptalks();
      const Ctor = mt.ui?.InfoWindow;
      if (typeof Ctor !== 'function')
        throw new MaptalksError('control-failed', '当前 maptalks-gl 未导出 ui.InfoWindow');
      const iw = new Ctor(toValue(opts.options) ?? {}) as MaptalksInfoWindow;
      iw.addTo(m);
      bindEvents(iw, events);
      infoWindow.value = iw;
      const c = toValue(opts.content); if (c !== undefined) iw.setContent(c);
      const coord = toValue(opts.coordinates); if (coord !== undefined) iw.show(coord);
    } catch (cause) {
      logger.error('InfoWindow 创建失败', toMaptalksError(cause, 'control-failed', 'InfoWindow 创建失败'));
    } finally {
      creating = false;
    }
  }

  // map / options 变化 → 重建
  const stop1 = watch([() => toValue(map), () => toValue(opts.options)], reload, { immediate: true });
  // content 变化 → setContent
  const stop2 = watch(() => toValue(opts.content), (c) => { if (infoWindow.value && c !== undefined) infoWindow.value.setContent(c); });

  function show(coord?: unknown): void { infoWindow.value?.show(coord); }
  function hide(): void { infoWindow.value?.hide(); }

  function remove(): void {
    stop1(); stop2();
    if (infoWindow.value) { unbindEvents(infoWindow.value, events); infoWindow.value.remove(); infoWindow.value = null; }
  }

  if (opts.autoDispose !== false) onScopeDispose(remove);
  return { infoWindow, show, hide, remove };
}
