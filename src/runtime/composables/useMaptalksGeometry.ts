import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';
import { dequal } from 'dequal';

import { toMaptalksError } from '../core/errors';
import { loadMaptalks } from '../core/loader';
import type {
  MaptalksEventHandler,
  MaptalksGeometry,
  MaptalksGLNamespace,
  MaptalksVectorLayer,
  UseMaptalksGeometryOpts,
  UseMaptalksGeometryReturn,
} from '../types';
import { createLogger } from '../utils/logger';

/** 日志实例（单例） */
const logger = createLogger('nuxt-maptalks-gl');

/** bindGeometry 维护的可变状态 */
interface GeometryState {
  geometry: ShallowRef<MaptalksGeometry | null>;
  creating: boolean;
  boundEvents: Array<[string, MaptalksEventHandler]>;
}

/**
 * 绑定事件到几何并记录，便于后续解绑。
 *
 * @description 逐项 `geometry.on(name, handler)` 并把 [name, handler] 推入 state.boundEvents。
 * @param {MaptalksGeometry} geo - 目标几何
 * @param {Record<string, MaptalksEventHandler> | undefined} events - 事件名 → 处理器
 * @param {GeometryState} state - 可变状态（记录已绑定事件）
 * @returns {void}
 *
 * @example
 * bindGeometryEvents(geo, { click: onClick }, state);
 */
function bindGeometryEvents(
  geo: MaptalksGeometry,
  events: Record<string, MaptalksEventHandler> | undefined,
  state: GeometryState,
): void {
  if (!events) return;
  for (const [name, handler] of Object.entries(events)) {
    geo.on(name, handler);
    state.boundEvents.push([name, handler]);
  }
}

/**
 * 图层就绪且尚未创建时，加载命名空间并创建几何、加入图层、绑定事件。
 *
 * @description 带并发门闩；`loadMaptalks` → `factory(mt)` → `layer.addGeometry` → 绑定事件。失败记录为 geometry-failed。
 * @param {() => MaptalksVectorLayer | null} getLayer - 取当前矢量图层
 * @param {(mt: MaptalksGLNamespace) => MaptalksGeometry} factory - 几何工厂
 * @param {Record<string, MaptalksEventHandler> | undefined} events - 事件
 * @param {GeometryState} state - 可变状态
 * @returns {Promise<void>}
 *
 * @example
 * await createGeometryInto(getLayer, factory, events, state);
 */
async function createGeometryInto(
  getLayer: () => MaptalksVectorLayer | null,
  factory: (mt: MaptalksGLNamespace) => MaptalksGeometry,
  events: Record<string, MaptalksEventHandler> | undefined,
  state: GeometryState,
): Promise<void> {
  const layer = getLayer();
  if (!layer || state.geometry.value || state.creating) return;
  state.creating = true;
  try {
    const mt = await loadMaptalks();
    const geo = factory(mt);
    layer.addGeometry(geo);
    bindGeometryEvents(geo, events, state);
    state.geometry.value = geo;
  } catch (cause) {
    logger.error('几何创建失败', toMaptalksError(cause, 'geometry-failed', '几何创建失败'));
  } finally {
    state.creating = false;
  }
}

/**
 * 监听响应式坐标/symbol/properties（shallow，非 immediate），变化时写回几何。
 *
 * @description 仅在几何存在且值非 undefined 时调用 setCoordinates/setSymbol/setProperties。
 * @param {() => MaptalksGeometry | null} getGeo - 取当前几何
 * @param {UseMaptalksGeometryOpts} options - 响应式选项
 * @returns {() => void} 停止全部 watcher
 *
 * @example
 * const stop = bindGeometryUpdates(() => state.geometry.value, options);
 */
function bindGeometryUpdates(
  getGeo: () => MaptalksGeometry | null,
  options: UseMaptalksGeometryOpts,
): () => void {
  const stops = [
    watch(
      () => toValue(options.coordinates),
      (c) => {
        if (c !== undefined) getGeo()?.setCoordinates(c);
      },
    ),
    watch(
      () => toValue(options.symbol),
      (s) => {
        if (s !== undefined) getGeo()?.setSymbol(s);
      },
    ),
    watch(
      () => toValue(options.properties),
      (p) => {
        if (p !== undefined) getGeo()?.setProperties(p);
      },
    ),
    watch(
      () => toValue(options.visible),
      (v) => {
        if (v !== undefined) {
          const geo = getGeo();
          if (geo) {
            if (v) geo.show?.();
            else geo.hide?.();
          }
        }
      },
    ),
  ];
  return () => {
    for (const stop of stops) stop();
  };
}

/**
 * 监听额外响应式属性（shallow，非 immediate），变化时调 apply 写回几何。
 *
 * @description 形状/文本几何的 radius/width/height/angles/content 等经此响应式更新；几何存在且值非 undefined 才 apply。
 * @param {() => MaptalksGeometry | null} getGeo - 取当前几何
 * @param {UseMaptalksGeometryOpts['extraProps']} extraProps - 额外属性列表
 * @returns {() => void} 停止全部 watcher
 *
 * @example
 * const stop = bindExtraProps(() => state.geometry.value, [{ value: () => r.value, apply: (g, v) => g.setRadius?.(v as number) }]);
 */
function bindExtraProps(
  getGeo: () => MaptalksGeometry | null,
  extraProps: UseMaptalksGeometryOpts['extraProps'],
): () => void {
  if (!extraProps || extraProps.length === 0) return () => {};
  const stops = extraProps.map((p) =>
    watch(
      () => toValue(p.value),
      (v) => {
        const geo = getGeo();
        if (geo && v !== undefined) p.apply(geo, v);
      },
    ),
  );
  return () => {
    for (const stop of stops) stop();
  };
}

/**
 * 监听 options 整体变化 → remove + recreate（对标 useMaptalksInfoWindow 的 options 重建机制）。
 *
 * @description 仅在 options.options 存在时生效；通过 dequal 深比较过滤引用变化但内容不变的情况，
 * 避免父组件 re-render 导致内联对象字面量产生新引用 → 不必要的全量 remove + addGeometry。
 * 内容确实变化时才重建几何。
 * @param {() => MaptalksVectorLayer | null} getLayer - 取矢量图层
 * @param {(mt: MaptalksGLNamespace) => MaptalksGeometry} factory - 几何工厂
 * @param {UseMaptalksGeometryOpts} options - 响应式选项
 * @param {GeometryState} state - 可变状态
 * @returns {() => void} 停止 watcher
 */
function bindOptionsRebuild(
  getLayer: () => MaptalksVectorLayer | null,
  factory: (mt: MaptalksGLNamespace) => MaptalksGeometry,
  options: UseMaptalksGeometryOpts,
  state: GeometryState,
): () => void {
  if (!options.options) return () => {};
  let prevOpts: Record<string, unknown> | undefined;
  return watch(
    () => toValue(options.options),
    (opts) => {
      // 首次触发仅初始化 prevOpts，不重建（模板内联 :options 产生新引用但内容未变时，避免无谓 remove + create）
      if (prevOpts === undefined) { prevOpts = opts as Record<string, unknown>; return; }
      if (dequal(opts, prevOpts)) return;
      prevOpts = opts as Record<string, unknown> | undefined;
      const geo = state.geometry.value;
      if (geo) {
        for (const [name, handler] of state.boundEvents) geo.off(name, handler);
        state.boundEvents = [];
        geo.remove();
        state.geometry.value = null;
      }
      void createGeometryInto(getLayer, factory, options.events, state);
    },
  );
}

/**
 * 通用几何原语：把任意 maptalks 几何响应式纳管到 VectorLayer，自动创建/更新/事件/dispose。
 *
 * @description 图层就绪后 `loadMaptalks` → `factory(mt)` 创建几何并 `layer.addGeometry`；
 * 响应式 coordinates/symbol/properties 变化时写回（shallow watch）；events 自动 on/off；
 * 作用域销毁时 remove 几何并解绑。几何不入注册表。layer 为 null 时不创建。
 * @param {(mt: MaptalksGLNamespace) => MaptalksGeometry} factory - 接收命名空间返回几何实例
 * @param {UseMaptalksGeometryOpts} [options] - 响应式坐标/symbol/properties + 事件 + 自动销毁
 * @returns {UseMaptalksGeometryReturn<T>} `{ geometry, show, hide, remove }`
 * @template T - 几何具体类型，默认 MaptalksGeometry
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksGeometry(layer, (mt) => new mt.Marker!([113.27, 23.13]), {
 *   coordinates: () => pos.value,
 *   events: { click: () => console.warn('hit') },
 * });
 */
export function useMaptalksGeometry<T extends MaptalksGeometry = MaptalksGeometry>(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  factory: (mt: MaptalksGLNamespace) => MaptalksGeometry,
  options: UseMaptalksGeometryOpts = {},
): UseMaptalksGeometryReturn<T> {
  const state: GeometryState = {
    geometry: shallowRef<MaptalksGeometry | null>(null),
    creating: false,
    boundEvents: [],
  };
  const getLayer = () => toValue(layer);

  const stopGate = watch(
    getLayer,
    () => {
      void createGeometryInto(getLayer, factory, options.events, state);
    },
    { immediate: true },
  );
  const stopUpdates = bindGeometryUpdates(() => state.geometry.value, options);
  const stopExtra = bindExtraProps(() => state.geometry.value, options.extraProps);
  const stopOptions = bindOptionsRebuild(getLayer, factory, options, state);

  const remove = (): void => {
    stopGate();
    stopUpdates();
    stopExtra();
    stopOptions();
    const geo = state.geometry.value;
    if (!geo) return;
    for (const [name, handler] of state.boundEvents) geo.off(name, handler);
    state.boundEvents = [];
    geo.remove();
    state.geometry.value = null;
  };

  const show = (): void => { state.geometry.value?.show?.(); };
  const hide = (): void => { state.geometry.value?.hide?.(); };

  if (options.autoDispose ?? true) onScopeDispose(remove);
  return { geometry: state.geometry as ShallowRef<T | null>, show, hide, remove };
}
