import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError, toMaptalksError } from '../core/errors';
import { loadMaptalks } from '../core/loader';
import type {
  MaptalksControl,
  MaptalksEventHandler,
  MaptalksMap,
  MaptalksOverviewControl,
  UseMaptalksControlReturn,
  UseMaptalksOverviewOpts,
} from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger('nuxt-maptalks-gl');

/** 批量绑定事件到控件实例 */
function bindEvents(control: MaptalksControl, events: Record<string, MaptalksEventHandler>): void {
  if (control.on) {
    for (const [event, handler] of Object.entries(events)) {
      control.on(event, handler);
    }
  }
}

/** 批量解绑事件 */
function unbindEvents(control: MaptalksControl, events: Record<string, MaptalksEventHandler>): void {
  if (control.off) {
    for (const [event, handler] of Object.entries(events)) {
      control.off(event, handler);
    }
  }
}

/**
 * 地图控件：鹰眼（Overview）。
 *
 * @description 在 map 就绪后创建 Overview 控件并 `addTo(map)`；响应式 `options` 变化时移除旧控件并重建；
 * events 自动 on/off；作用域销毁或 `autoDispose` 时自动 cleanup。构造器缺失抛 `control-failed`。
 * 控件事件包括 add / remove / positionchange（展开/收起用窄类型的 maxmize/minimize 方法）。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {UseMaptalksOverviewOpts} [opts] - 控件选项、事件绑定与自动销毁控制
 * @returns {UseMaptalksControlReturn} `{ control, show, hide, remove }`
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { control } = useMaptalksOverview(map, {
 *   options: { position: 'bottom-right', size: [150, 110], maximize: true },
 * });
 * control.value?.minimize(); // 收起鹰眼
 */
export function useMaptalksOverview(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksOverviewOpts = {},
): UseMaptalksControlReturn<MaptalksOverviewControl> {
  const control = shallowRef<MaptalksOverviewControl | null>(null);
  let creating = false;
  const events = opts.events ?? {};

  async function reload() {
    const m = toValue(map);
    if (!m || creating) return;
    creating = true;
    if (control.value) {
      unbindEvents(control.value, events);
      control.value.remove();
      control.value = null;
    }
    try {
      const mt = await loadMaptalks();
      const Ctor = mt.control?.Overview;
      if (typeof Ctor !== 'function')
        throw new MaptalksError('control-failed', '当前 maptalks-gl 未导出 Overview 控件');
      const ctrl = new Ctor(toValue(opts.options)) as MaptalksOverviewControl;
      ctrl.addTo(m);
      bindEvents(ctrl, events);
      control.value = ctrl;
    } catch (cause) {
      logger.error('控件创建失败', toMaptalksError(cause, 'control-failed', '控件创建失败'));
    } finally {
      creating = false;
    }
  }

  // map 就绪或 options 变化 → 创建/重建
  const stop = watch([() => toValue(map), () => toValue(opts.options)], () => { void reload(); }, { immediate: true });

  function show(): void { control.value?.show(); }
  function hide(): void { control.value?.hide(); }

  const remove = () => {
    stop();
    if (control.value) {
      unbindEvents(control.value, events);
      control.value.remove();
      control.value = null;
    }
  };
  if (opts.autoDispose !== false) onScopeDispose(remove);
  return { control, show, hide, remove };
}
