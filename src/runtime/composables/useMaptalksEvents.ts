import { onScopeDispose, toValue, watch } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import type { MaptalksEventHandler, MaptalksMap } from '../types';

/**
 * 把一组事件处理器响应式绑定到地图，自动解绑。
 *
 * @description 地图就绪后批量 `map.on(...)`；地图引用变化时先解绑旧实例再绑定新实例；
 * 作用域销毁时自动解绑全部。处理器集合在调用时确定（v1 不监听 handlers 自身的增删）。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {Record<string, MaptalksEventHandler>} handlers - 事件名 → 处理器映射（事件名可含空格分隔的多事件）
 * @returns {void}
 *
 * @example
 * const { map } = useMaptalks(el);
 * useMaptalksEvents(map, {
 *   click: (e) => console.warn('clicked', e),
 *   'zoomend moveend': () => console.warn('view changed'),
 * });
 */
export function useMaptalksEvents(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  handlers: Record<string, MaptalksEventHandler>,
): void {
  /** 当前已绑定事件的地图实例 */
  let boundMap: MaptalksMap | null = null;

  /** RAF 包装的 handler，确保在 maptalks 事件上下文外执行，避免动画被抑制 */
  const wrappedHandlers: Record<string, MaptalksEventHandler> = {};
  for (const [key, handler] of Object.entries(handlers)) {
    wrappedHandlers[key] = (...args: unknown[]) => {
      requestAnimationFrame(() => (handler as (...a: unknown[]) => void)(...args));
    };
  }

  /** 绑定全部事件到指定地图 */
  function bind(m: MaptalksMap): void {
    for (const [eventTypes, handler] of Object.entries(wrappedHandlers)) m.on(eventTypes, handler);
    boundMap = m;
  }

  /** 从已绑定地图解绑全部事件 */
  function unbind(): void {
    if (!boundMap) return;
    for (const [eventTypes, handler] of Object.entries(wrappedHandlers)) boundMap.off(eventTypes, handler);
    boundMap = null;
  }

  const stop = watch(
    () => toValue(map),
    (m) => {
      unbind();
      if (m) bind(m);
    },
    { immediate: true },
  );

  onScopeDispose(() => {
    stop();
    unbind();
  });
}
