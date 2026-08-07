import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';
import { dequal } from 'dequal';

import { MaptalksError, toMaptalksError } from '../core/errors';
import { loadMaptalks } from '../core/loader';
import type { MaptalksEventHandler, MaptalksInfoWindow, MaptalksInfoWindowOptions, MaptalksMap } from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger('nuxt-maptalks-gl');

/** 提取 options 中除 content 外的部分（content 变化走 setContent 增量，不走 reload 重建） */
function buildRest(opts: UseMaptalksInfoWindowOpts): Record<string, unknown> | undefined {
  const raw = toValue(opts.options);
  if (!raw) return undefined;
  const { content: _, ...rest } = raw as Record<string, unknown>;
  return rest;
}

/**
 * `useMaptalksInfoWindow` 的可选项。
 *
 * @description 控制 InfoWindow 的构造参数、内容、坐标、事件绑定与自动销毁。
 *
 * @example
 * useMaptalksInfoWindow(map, {
 *   options: { title: '信息', content: '<div>动态内容</div>' },
 * });
 */
export interface UseMaptalksInfoWindowOpts {
  /** 透传给 maptalks InfoWindow 构造器的选项（含中文字段注释，详见 MaptalksInfoWindowOptions） */
  options?: MaybeRefOrGetter<
    MaptalksInfoWindowOptions
    | undefined
  >;
  /** 事件名 → 处理器（自动 on/off，事件名为 maptalks 原生名：add / showstart / showend / hide / remove） */
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
 * @param {UseMaptalksInfoWindowOpts} [opts] - InfoWindow 选项、内容、坐标、事件与自动销毁控制
 * @returns {UseMaptalksInfoWindowReturn} `{ infoWindow, show, hide, remove }`
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { infoWindow, show } = useMaptalksInfoWindow(map, {
 *   content: computed(() => `<div>${detail.value}</div>`),
 *   coordinates: () => markerCoord.value,
 *   events: { showstart: () => console.warn('opened') },
 * });
 * // 在 marker click 中：
 * show(markerCoord.value);
 */

/** 移除 InfoWindow 实例并清理 watcher，路由切换时地图可能已销毁，对 remove 用 try-catch 兜底 */
function removeIW(
  infoWindow: ShallowRef<MaptalksInfoWindow | null>,
  s1: () => void,
  s2: () => void,
  s3: () => void,
  events: Record<string, MaptalksEventHandler>,
): void {
  s1(); s2(); s3();
  const iw = infoWindow.value;
  if (!iw) return;
  unbindEvents(iw, events);
  // 路由切换/组件卸载时地图可能已销毁，hide→_updatePosition 会报错，用 try-catch 兜底
  try { iw.remove(); } catch {
    /* 忽略因地图销毁导致的清理报错 */
  }
  infoWindow.value = null;
}
// oxlint-disable-next-line max-lines-per-function —— 逻辑行超 50（预存），后续适配时重构
export function useMaptalksInfoWindow(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksInfoWindowOpts = {},
): UseMaptalksInfoWindowReturn {
  const infoWindow = shallowRef<MaptalksInfoWindow | null>(null);
  let creating = false;
  // prevRest 在 reload 创建成功后捕获——后续仅 content 变化时 dequal 命中跳过重建，弹框保持打开
  let prevRest: Record<string, unknown> | undefined;
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
      const rawOpts = { ...toValue(opts.options) };
      const c = toValue(rawOpts.content as MaybeRefOrGetter<string | HTMLElement | undefined> | undefined);
      delete rawOpts.content;
      const iw = new Ctor(rawOpts) as MaptalksInfoWindow;
      iw.addTo(m);
      bindEvents(iw, events);
      infoWindow.value = iw;
      if (c !== undefined) iw.setContent(c);
      // 创建成功后同步捕获 prevRest——content 变化不再触发 reload 重建
      prevRest = buildRest(opts);
      // show 由 MaptalksInfoWindow 组件在 mountSlotContent 之后统一调用，避免双重 show 导致 buildOn 重复构建
    } catch (cause) {
      logger.error('InfoWindow 创建失败', toMaptalksError(cause, 'control-failed', 'InfoWindow 创建失败'));
    } finally {
      creating = false;
    }
  }

  // map 就绪 → 创建/重建
  const stop1Map = watch(() => toValue(map), (m) => { if (m) void reload(); }, { immediate: true });
  // options（不含 content）真实变化 → 重建；content 由 stop2 增量处理（弹框保持打开）
  const stop1Rest = watch(
    () => buildRest(opts),
    (rest) => {
      if (!rest || dequal(rest, prevRest)) return;
      prevRest = rest;
      void reload();
    },
  );
  // content 变化 → setContent（从 options.content 读取并 unwrap）
  const stop2 = watch(
    () => { const r = toValue(opts.options); return r ? toValue(r.content as MaybeRefOrGetter<string | HTMLElement | undefined> | undefined) : undefined; },
    (c) => { if (infoWindow.value && c !== undefined) infoWindow.value.setContent(c as string | HTMLElement); },
  );

  function show(coord?: unknown): void { requestAnimationFrame(() => infoWindow.value?.show(coord)); }
  function hide(): void { infoWindow.value?.hide(); }

  if (opts.autoDispose !== false) onScopeDispose(() => removeIW(infoWindow, stop1Map, stop1Rest, stop2, events));
  return { infoWindow, show, hide, remove: () => removeIW(infoWindow, stop1Map, stop1Rest, stop2, events) };
}
