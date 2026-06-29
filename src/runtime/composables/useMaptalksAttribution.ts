import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { MaptalksError, toMaptalksError } from '../core/errors';
import { loadMaptalks } from '../core/loader';
import type { MaptalksControl, MaptalksMap, UseMaptalksControlReturn } from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger('nuxt-maptalks-gl');

/**
 * 地图控件：归属信息（Attribution）。
 * @description map+options 就绪后创建控件并 addTo(map)；options 变化时重建控件（shallow watch）；scope dispose 移除。
 * @param map
 * @param options
 * @returns { control, remove }
 * @example useMaptalksAttribution(map, { content: 'powered by maptalks-gl' })
 */
export function useMaptalksAttribution(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  options: MaybeRefOrGetter<Record<string, unknown> | undefined> = {},
): UseMaptalksControlReturn {
  const control = shallowRef<MaptalksControl | null>(null);
  let creating = false;

  const reload = async () => {
    const m = toValue(map);
    const opts = toValue(options);
    if (!m || creating) return;
    creating = true;
    if (control.value) { control.value.remove(); control.value = null; }
    try {
      const mt = await loadMaptalks();
      const Ctor = mt.control?.Attribution;
      if (typeof Ctor !== 'function') throw new MaptalksError('control-failed', '当前 maptalks-gl 未导出 Attribution 控件');
      const ctrl = new Ctor(opts);
      ctrl.addTo(m);
      control.value = ctrl;
    } catch (cause) {
      logger.error('控件创建失败', toMaptalksError(cause, 'control-failed', '控件创建失败'));
    } finally { creating = false; }
  };
  const stop = watch([() => toValue(map), () => toValue(options)], reload, { immediate: true });

  const remove = () => { stop(); if (control.value) { control.value.remove(); control.value = null; } };
  onScopeDispose(remove);
  return { control, remove };
}
