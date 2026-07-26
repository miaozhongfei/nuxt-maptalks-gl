import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';

import { MaptalksError, toMaptalksError } from '../core/errors';
import { loadMaptalks } from '../core/loader';
import type { MaptalksMap, MaptalksUIMarker, MaptalksUIMarkerCombinedOptions } from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger('nuxt-maptalks-gl');

/**
 * `useMaptalksUIMarker` 的可选项。
 *
 * @description 控制 UIMarker 的构造参数、内容、坐标与自动销毁。
 *
 * @example
 * useMaptalksUIMarker(map, {
 *   options: () => ({ content: '<div>HTML</div>', draggable: true, single: false }),
 * });
 */
export interface UseMaptalksUIMarkerOptions {
  /** 透传给 UIMarker 构造器的选项（含中文字段注释，详见 MaptalksUIMarkerOptions） */
  options?: MaybeRefOrGetter<MaptalksUIMarkerCombinedOptions | undefined>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**
 * `useMaptalksUIMarker` 的返回。
 *
 * @description 暴露响应式 UIMarker 实例与命令式显隐/移除方法。
 *
 * @example
 * const { uiMarker, show, hide, remove } = useMaptalksUIMarker(map);
 * show();
 */
export interface UseMaptalksUIMarkerReturn {
  /** UIMarker 实例（创建前为 null） */
  uiMarker: ShallowRef<MaptalksUIMarker | null>;
  /** 显示标注 */
  show: () => void;
  /** 隐藏标注 */
  hide: () => void;
  /** 命令式移除并销毁 */
  remove: () => void;
}

/** 移除 UIMarker 实例并清理 watcher */
function removeUIM(
  uiMarker: ShallowRef<MaptalksUIMarker | null>,
  s1: () => void,
): void {
  s1();
  const uim = uiMarker.value;
  if (!uim) return;
  try { uim.remove(); } catch { }
  uiMarker.value = null;
}

/**
 * HTML 自定义标注（UIMarker）。
 *
 * @description 在 map 就绪后创建 `mt.ui.UIMarker` 并 `addTo(map).show()`；
 * 响应式 `options` 变化时移除旧实例并重建（dequal 深比较）；
 * 作用域销毁时自动 `remove()`。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用
 * @param {UseMaptalksUIMarkerOptions} [opts] - UIMarker 选项与自动销毁控制
 * @returns {UseMaptalksUIMarkerReturn} `{ uiMarker, show, hide, remove }`
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { uiMarker, show } = useMaptalksUIMarker(map, {
 *   options: () => ({ content: '<div>HTML Marker</div>', draggable: true }),
 * });
 */
export function useMaptalksUIMarker(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksUIMarkerOptions = {},
): UseMaptalksUIMarkerReturn {
  const uiMarker = shallowRef<MaptalksUIMarker | null>(null);
  let creating = false;

  async function reload() {
    const m = toValue(map);
    if (!m || creating) return;
    creating = true;
    if (uiMarker.value) { uiMarker.value.remove(); uiMarker.value = null; }
    try {
      const mt = await loadMaptalks();
      const Ctor = mt.ui?.UIMarker;
      if (typeof Ctor !== 'function')
        throw new MaptalksError('control-failed', '当前 maptalks-gl 未导出 ui.UIMarker');
      // content 兜底，避免构造器初始化失败
      const rawOpts: Record<string, unknown> = { content: '', ...toValue(opts.options) };
      const coord = rawOpts.coordinates as [number, number] | undefined;
      delete rawOpts.coordinates;
      const uim = new Ctor(coord ?? [0, 0], rawOpts) as MaptalksUIMarker;
      uim.addTo(m);
      uim.show();
      uiMarker.value = uim;
    } catch (cause) {
      logger.error('UIMarker 创建失败', toMaptalksError(cause, 'control-failed', 'UIMarker 创建失败'));
    } finally {
      creating = false;
    }
  }

  // map / options 变化 → 重建
  const stop = watch([() => toValue(map), () => toValue(opts.options)], reload, { immediate: true });

  function show(): void { uiMarker.value?.show(); }
  function hide(): void { uiMarker.value?.hide(); }

  function remove(): void { removeUIM(uiMarker, stop); }

  if (opts.autoDispose !== false) onScopeDispose(remove);
  return { uiMarker, show, hide, remove };
}
