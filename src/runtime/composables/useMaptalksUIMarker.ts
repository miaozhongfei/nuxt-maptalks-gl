import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';

import { MaptalksError, toMaptalksError } from '../core/errors';
import { loadMaptalks } from '../core/loader';
import type { MaptalksMap, MaptalksUIMarker } from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger('nuxt-maptalks-gl');

/**
 * `useMaptalksUIMarker` 的可选项。
 *
 * @description 控制 UIMarker 的坐标、内容、拖拽与自动销毁。
 *
 * @example
 * useMaptalksUIMarker(map, { coordinates: [121.5, 31.2], content: '<div>HTML</div>' });
 */
export interface UseMaptalksUIMarkerOptions {
  /** UIMarker 坐标 */
  coordinates: MaybeRefOrGetter<[number, number]>;
  /** HTML 内容字符串 */
  content: MaybeRefOrGetter<string>;
  /** 是否可拖拽，默认 false */
  draggable?: MaybeRefOrGetter<boolean | undefined>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**
 * `useMaptalksUIMarker` 的返回。
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

/**
 * HTML 自定义标注（UIMarker）。
 *
 * @description 在 map 就绪后创建 `mt.ui.UIMarker` 并 `addTo(map).show()`；
 * 响应式 `coordinates` / `content` / `draggable` 变化时重建；
 * 作用域销毁时自动 `remove()`。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用
 * @param {UseMaptalksUIMarkerOptions} opts - UIMarker 选项
 * @returns {UseMaptalksUIMarkerReturn} `{ uiMarker, show, hide, remove }`
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { uiMarker } = useMaptalksUIMarker(map, {
 *   coordinates: [121.5057, 31.2453],
 *   content: '<div class="text_marker">HTML Marker</div>',
 *   draggable: true,
 * });
 */
export function useMaptalksUIMarker(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksUIMarkerOptions,
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
      const coord = toValue(opts.coordinates);
      const draggable = toValue(opts.draggable) ?? false;
      const uim = new Ctor(coord, { content: toValue(opts.content), draggable }) as MaptalksUIMarker;
      uim.addTo(m);
      uim.show();
      uiMarker.value = uim;
    } catch (cause) {
      logger.error('UIMarker 创建失败', toMaptalksError(cause, 'control-failed', 'UIMarker 创建失败'));
    } finally {
      creating = false;
    }
  }

  // map / coordinates / content / draggable 变化 → 重建
  const stop = watch(
    [() => toValue(map), () => toValue(opts.coordinates), () => toValue(opts.content), () => toValue(opts.draggable)],
    reload,
    { immediate: true },
  );

  function show(): void { uiMarker.value?.show(); }
  function hide(): void { uiMarker.value?.hide(); }

  function remove(): void {
    stop();
    if (uiMarker.value) { uiMarker.value.remove(); uiMarker.value = null; }
  }

  if (opts.autoDispose !== false) onScopeDispose(remove);
  return { uiMarker, show, hide, remove };
}
