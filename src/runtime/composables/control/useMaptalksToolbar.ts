import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError, toMaptalksError } from '../../core/errors';
import { loadMaptalks } from '../../core/loader';
import type {
  MaptalksControl,
  MaptalksEventHandler,
  MaptalksMap,
  MaptalksToolbarControl,
  MaptalksToolbarOptions,
  UseMaptalksControlReturn,
} from '../../types';
import { createLogger } from '../../utils/logger';

const logger = createLogger('nuxt-maptalks-gl');

/**
 * useMaptalksToolbar 的选项。
 *
 * @description 配置 Toolbar 工具条控件：透传给 `control.Toolbar` 构造器的选项（position / vertical / items 等）、
 * 控件事件绑定（仅 add / remove / positionchange，Control 基类无 show/hide 事件）、自动销毁开关。
 *
 * @example
 * const opts: UseMaptalksToolbarOpts = {
 *   options: { position: 'top-right', items: [{ item: '放大' }] },
 *   events: { positionchange: () => console.log('位置变化') },
 * };
 */
export interface UseMaptalksToolbarOpts {
  /** 透传给 `control.Toolbar` 构造器的选项（含中文字段注释，详见 MaptalksToolbarOptions），变化时重建控件 */
  options?: MaybeRefOrGetter<MaptalksToolbarOptions | undefined>;
  /** 控件事件名 → 处理器（自动 on/off，仅 add / remove / positionchange） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动 `remove`，默认 true */
  autoDispose?: boolean;
}

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
 * 地图控件：工具条（Toolbar）。
 *
 * @description 在 map 就绪后创建 Toolbar 控件并 `addTo(map)`；响应式 `options` 变化时移除旧控件并重建
 * （items / position / vertical 等均需重建 DOM）；events 自动 on/off；作用域销毁或 `autoDispose` 时自动 cleanup。
 * 构造器缺失抛 `control-failed`。控件事件仅 add / remove / positionchange（Control 基类无 show/hide 事件，
 * 显隐用返回的 show/hide 方法）。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {UseMaptalksToolbarOpts} [opts] - 控件选项、事件绑定与自动销毁控制
 * @returns {UseMaptalksControlReturn} `{ control, show, hide, remove }`
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { control } = useMaptalksToolbar(map, {
 *   options: {
 *     position: 'top-right',
 *     items: [{ item: '放大', click: () => map.value?.zoomIn() }],
 *   },
 *   events: { positionchange: () => console.log('位置变化') },
 * });
 */
export function useMaptalksToolbar(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksToolbarOpts = {},
): UseMaptalksControlReturn<MaptalksToolbarControl> {
  const control = shallowRef<MaptalksToolbarControl | null>(null);
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
      const Ctor = mt.control?.Toolbar;
      if (typeof Ctor !== 'function')
        throw new MaptalksError('control-failed', '当前 maptalks-gl 未导出 Toolbar 控件');
      const ctrl = new Ctor(toValue(opts.options)) as MaptalksToolbarControl;
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
