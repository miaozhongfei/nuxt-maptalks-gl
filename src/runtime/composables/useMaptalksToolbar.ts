import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError, toMaptalksError } from '../core/errors';
import { loadMaptalks } from '../core/loader';
import type { MaptalksControl, MaptalksMap, MaptalksToolbarOptions, UseMaptalksControlReturn } from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger('nuxt-maptalks-gl');

/**
 * 地图控件：工具条（Toolbar）。
 *
 * @description 在 map 就绪后创建 Toolbar 控件并 `addTo(map)`；响应式 `options` 变化时移除旧控件并重建
 * （items / position / vertical 等均需重建 DOM）；作用域销毁时自动 `remove()`。
 * Toolbar 构造器缺失抛 `control-failed`。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {MaybeRefOrGetter<MaptalksToolbarOptions | undefined>} [options] - 控件选项（position/vertical/reverseMenu/items），变化时重建控件
 * @returns {UseMaptalksControlReturn} `{ control, remove }`——control 为控件实例，remove 可命令式移除
 *
 * @example
 * const { map } = useMaptalks(el);
 * useMaptalksToolbar(map, {
 *   position: 'top-right',
 *   items: [{ item: '放大', click: () => map.value?.zoomIn() }],
 * });
 */
export function useMaptalksToolbar(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  options: MaybeRefOrGetter<MaptalksToolbarOptions | undefined> = {},
): UseMaptalksControlReturn {
  const control = shallowRef<MaptalksControl | null>(null);
  let creating = false;

  const reload = async () => {
    const m = toValue(map);
    const opts = toValue(options);
    if (!m || creating) return;
    creating = true;
    if (control.value) {
      control.value.remove();
      control.value = null;
    }
    try {
      const mt = await loadMaptalks();
      const Ctor = mt.control?.Toolbar;
      if (typeof Ctor !== 'function')
        throw new MaptalksError('control-failed', '当前 maptalks-gl 未导出 Toolbar 控件');
      const ctrl = new Ctor(opts);
      ctrl.addTo(m);
      control.value = ctrl;
    } catch (cause) {
      logger.error('控件创建失败', toMaptalksError(cause, 'control-failed', '控件创建失败'));
    } finally {
      creating = false;
    }
  };
  const stop = watch([() => toValue(map), () => toValue(options)], reload, { immediate: true });

  const remove = () => {
    stop();
    if (control.value) {
      control.value.remove();
      control.value = null;
    }
  };
  onScopeDispose(remove);
  return { control, remove };
}
