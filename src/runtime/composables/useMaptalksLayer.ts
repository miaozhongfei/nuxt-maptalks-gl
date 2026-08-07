import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';

import { toMaptalksError } from '../core/errors';
import { loadMaptalks } from '../core/loader';
import { layerRegistry } from '../core/registry';
import type {
  MaptalksGLNamespace,
  MaptalksLayer,
  MaptalksMap,
  UseMaptalksLayerOpts,
  UseMaptalksLayerReturn,
} from '../types';
import { createLogger } from '../utils/logger';

/** 日志实例（单例） */
const logger = createLogger('nuxt-maptalks-gl');

/** bindLayer 维护的可变状态 */
interface LayerState<T extends MaptalksLayer> {
  layer: ShallowRef<T | null>;
  regId: number | null;
  creating: boolean;
}

/**
 * 按图层能力择优应用一组选项。
 *
 * @description 不同图层暴露的可写方法不同，这里按 `config` → `setOptions` → `setStyle` 优先级
 * 选择存在者调用一次。需要更精细控制时请直接使用 `layer.value` 的原生方法。
 * @param {MaptalksLayer} layer - 目标图层
 * @param {Record<string, unknown> | undefined} options - 待应用的选项
 * @returns {void}
 *
 * @example
 * applyLayerOptions(layer, { opacity: 0.5 });
 */
function applyLayerOptions(
  layer: MaptalksLayer,
  options: Record<string, unknown> | undefined,
): void {
  if (!options) return;
  if (typeof layer.config === 'function') {
    layer.config(options);
    return;
  }
  if (typeof layer.setOptions === 'function') {
    layer.setOptions(options);
    return;
  }
  if (typeof layer.setStyle === 'function') {
    layer.setStyle(options);
  }
}

/**
 * 用 factory 创建图层、加入地图、入册注册表并应用初始选项。
 *
 * @template T - 图层具体类型（由工厂返回类型推断）
 * @param {MaptalksMap} m - 已就绪的地图实例
 * @param {(mt: MaptalksGLNamespace) => T} factory - 接收命名空间、返回图层
 * @param {Record<string, unknown> | undefined} options - 初始图层选项
 * @returns {Promise<{ layer: T; regId: number }>} 创建的图层与注册表 id
 *
 * @example
 * const { layer, regId } = await buildAndAddLayer(map, (mt) => new mt.TileLayer('base', {}), undefined);
 */
async function buildAndAddLayer<T extends MaptalksLayer>(
  m: MaptalksMap,
  factory: (mt: MaptalksGLNamespace) => T,
  options: Record<string, unknown> | undefined,
): Promise<{ layer: T; regId: number }> {
  const mt = await loadMaptalks();
  const layer = factory(mt);
  m.addLayer(layer);
  const regId = layerRegistry.register(layer);
  applyLayerOptions(layer, options);
  return { layer, regId };
}

/**
 * 地图就绪且门控开启时创建图层并写入状态（带并发门闩与错误上报）。
 *
 * @template T - 图层具体类型（由工厂返回类型推断）
 * @param {() => MaptalksMap | null} getMap - 取当前地图实例
 * @param {(mt: MaptalksGLNamespace) => T} factory - 图层工厂
 * @param {() => Record<string, unknown> | undefined} getOptions - 取当前图层选项
 * @param {() => boolean} getEnabled - 取创建门控
 * @param {LayerState<T>} state - 可变状态（layer/regId/creating）
 * @returns {Promise<void>}
 *
 * @example
 * await createLayerInto(getMap, factory, getOptions, getEnabled, state);
 */
async function createLayerInto<T extends MaptalksLayer>(
  getMap: () => MaptalksMap | null,
  factory: (mt: MaptalksGLNamespace) => T,
  getOptions: () => Record<string, unknown> | undefined,
  getEnabled: () => boolean,
  state: LayerState<T>,
): Promise<void> {
  const m = getMap();
  if (!m || state.layer.value || state.creating || !getEnabled()) return;
  state.creating = true;
  try {
    const built = await buildAndAddLayer(m, factory, getOptions());
    state.layer.value = built.layer;
    state.regId = built.regId;
  } catch (cause) {
    logger.error('图层创建失败', toMaptalksError(cause, 'layer-failed', '图层创建失败'));
  } finally {
    state.creating = false;
  }
}

/**
 * 建立图层与地图/选项的联动，返回 `{ layer, update, remove }`。
 *
 * @description 地图就绪/门控开启后创建图层；响应式选项变化时重新应用；remove 时停止 watcher、移除并注销。
 * @template T - 图层具体类型（由工厂返回类型推断）
 * @param {() => MaptalksMap | null} getMap - 取当前地图实例
 * @param {(mt: MaptalksGLNamespace) => T} factory - 图层工厂
 * @param {UseMaptalksLayerOpts} options - 响应式选项 / 创建门控
 * @returns {UseMaptalksLayerReturn<T>} 图层句柄
 *
 * @example
 * const handle = bindLayer(() => map.value, factory, {});
 */
// oxlint-disable-next-line max-lines-per-function —— 逻辑行超 50（预存），后续适配时重构
function bindLayer<T extends MaptalksLayer>(
  getMap: () => MaptalksMap | null,
  factory: (mt: MaptalksGLNamespace) => T,
  options: UseMaptalksLayerOpts,
): UseMaptalksLayerReturn<T> {
  const state: LayerState<T> = {
    layer: shallowRef<T | null>(null),
    regId: null,
    creating: false,
  };
  const getEnabled = () => toValue(options.enabled ?? true);
  const getOptions = () => toValue(options.options);

  const stopGate = watch(
    () => [getMap(), getEnabled()] as const,
    () => {
      void createLayerInto(getMap, factory, getOptions, getEnabled, state);
    },
    { immediate: true },
  );
    const events = options.events ?? {};
    // 图层创建/销毁时自动 bind/unbind 事件
    let boundEvents = false;
    const stopEvents = watch(
      () => state.layer.value,
      (l) => {
        if (l && !boundEvents && events) {
          const lu = l as unknown as Record<string, unknown>;
          for (const [event, handler] of Object.entries(events)) (lu.on as (e: string, h: (...args: unknown[]) => void) => void)(event, handler);
          boundEvents = true;
        }
      },
      { immediate: true },
    );
  const stopOptions = watch(
    getOptions,
    (opts) => {
      if (state.layer.value) applyLayerOptions(state.layer.value, opts);
    },
    { deep: true },
  );
  const update = (opts: Record<string, unknown>) => {
    if (state.layer.value) applyLayerOptions(state.layer.value, opts);
  };
  const remove = () => {
    stopGate();
    stopEvents();
    stopOptions();
    if (!state.layer.value) return;
    const m = getMap();
    if (m) m.removeLayer(state.layer.value);
      // unbind events before remove
      if (boundEvents && events) {
        const lu = state.layer.value as unknown as Record<string, unknown>;
        for (const [event, handler] of Object.entries(events)) (lu.off as (e: string, h: (...args: unknown[]) => void) => void)(event, handler);
        boundEvents = false;
      }
    state.layer.value.remove();
    if (state.regId !== null) {
      layerRegistry.unregister(state.regId);
      state.regId = null;
    }
    state.layer.value = null;
  };
  return { layer: state.layer, show: () => state.layer.value?.show?.(), hide: () => state.layer.value?.hide?.(), update, remove };
}

/**
 * 通用图层原语：把任意 maptalks 图层响应式纳管，自动 addLayer / 应用选项 / dispose。
 *
 * @description 对任意图层类型（含未来新增）零改动可用。地图就绪且 `enabled` 为真后，调用 `factory(mt)`
 * 创建图层并 addLayer，入册 LayerRegistry；响应式 `options` 变化时按图层能力应用；作用域销毁时
 * removeLayer + dispose。factory 抛错被捕获并记录，不拖垮整张地图。
 * @template T - 图层具体类型，默认 MaptalksLayer（由工厂返回类型推断更窄类型）
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {(mt: MaptalksGLNamespace) => T} factory - 接收已加载命名空间、返回图层实例
 * @param {UseMaptalksLayerOpts} [options] - 响应式选项 / 自动销毁 / 创建门控
 * @returns {UseMaptalksLayerReturn<T>} `{ layer, update, remove }`
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { layer } = useMaptalksLayer(
 *   map,
 *   (mt) => new mt.TileLayer('base', { urlTemplate: 'https://.../{z}/{x}/{y}.png' }),
 * );
 */
export function useMaptalksLayer<T extends MaptalksLayer = MaptalksLayer>(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  factory: (mt: MaptalksGLNamespace) => T,
  options: UseMaptalksLayerOpts = {},
): UseMaptalksLayerReturn<T> {
  const handle = bindLayer(() => toValue(map), factory, options);
  if (options.autoDispose ?? true) onScopeDispose(handle.remove);
  return handle;
}
