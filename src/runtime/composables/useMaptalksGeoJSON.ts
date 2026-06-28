import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';

import { toMaptalksError } from '../core/errors';
import type {
  GeoJSONData,
  MaptalksGeometry,
  MaptalksVectorLayer,
  UseMaptalksGeoJSONOptions,
  UseMaptalksGeoJSONReturn,
} from '../types';
import { createLogger } from '../utils/logger';
import { geoJSONToGeometry } from './geojson-utils';

/** 日志实例（单例） */
const logger = createLogger('nuxt-maptalks-gl');

/** useMaptalksGeoJSON 维护的可变状态 */
interface GeoJSONState {
  geometries: ShallowRef<MaptalksGeometry[]>;
  seq: number;
}

/**
 * 把 GeoJSON 转为几何并加入图层（可选统一 symbol），用 generation token 取最新。
 *
 * @description 每次加载递增 `state.seq`；await 完成后若 seq 已被更新的加载抢占，则丢弃本次结果（移除已创建几何），
 * 避免飞行期间 data 变化导致的陈旧数据（lost-update）。失败记 geometry-failed。
 * @param {() => MaptalksVectorLayer | null} getLayer - 取当前图层
 * @param {() => GeoJSONData | undefined} getData - 取当前 GeoJSON 数据
 * @param {() => Record<string, unknown> | undefined} getSymbol - 取当前 symbol
 * @param {GeoJSONState} state - 可变状态
 * @returns {Promise<void>}
 *
 * @example
 * await loadGeoJSONInto(getLayer, getData, getSymbol, state);
 */
async function loadGeoJSONInto(
  getLayer: () => MaptalksVectorLayer | null,
  getData: () => GeoJSONData | undefined,
  getSymbol: () => Record<string, unknown> | undefined,
  state: GeoJSONState,
): Promise<void> {
  const layer = getLayer();
  const data = getData();
  if (!layer || !data) return;
  const mySeq = (state.seq += 1);
  const symbol = getSymbol();
  try {
    const geometries = await geoJSONToGeometry(data);
    if (mySeq !== state.seq) {
      for (const g of geometries) g.remove();
      return;
    }
    if (symbol) for (const g of geometries) g.setSymbol(symbol);
    layer.addGeometry(geometries);
    state.geometries.value = geometries;
  } catch (cause) {
    logger.error('GeoJSON 加载失败', toMaptalksError(cause, 'geometry-failed', 'GeoJSON 加载失败'));
  }
}

/**
 * 移除并清空当前几何数组。
 *
 * @description 逐个 `geometry.remove()` 并清空 state.geometries。
 * @param {GeoJSONState} state - 可变状态
 * @returns {void}
 *
 * @example
 * clearGeometries(state);
 */
function clearGeometries(state: GeoJSONState): void {
  for (const g of state.geometries.value) g.remove();
  state.geometries.value = [];
}

/**
 * 把 GeoJSON 响应式加载到 VectorLayer（数据驱动地图）。
 *
 * @description layer 就绪 + data 时加载几何并 addGeometry；data 替换时清空重建（shallow watch）；
 * 作用域销毁移除全部。GeoJSON 可能产生多个几何，故不复用 useMaptalksGeometry，自管几何数组。几何不入注册表。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksGeoJSONOptions} options - 响应式 data + 统一 symbol + 自动销毁
 * @returns {UseMaptalksGeoJSONReturn} `{ geometries, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometries } = useMaptalksGeoJSON(layer, { data: () => geojson.value });
 */
export function useMaptalksGeoJSON(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  options: UseMaptalksGeoJSONOptions,
): UseMaptalksGeoJSONReturn {
  const state: GeoJSONState = { geometries: shallowRef<MaptalksGeometry[]>([]), seq: 0 };
  const getLayer = () => toValue(layer);
  const getData = () => toValue(options.data);
  const getSymbol = () => toValue(options.symbol);

  const reload = (): void => {
    clearGeometries(state);
    void loadGeoJSONInto(getLayer, getData, getSymbol, state);
  };
  const stopGate = watch([getLayer, getData], reload, { immediate: true });

  const remove = (): void => {
    stopGate();
    clearGeometries(state);
  };
  if (options.autoDispose ?? true) onScopeDispose(remove);
  return { geometries: state.geometries, remove };
}
