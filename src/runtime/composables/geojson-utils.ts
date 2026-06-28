import { MaptalksError } from '../core/errors';
import { loadMaptalks } from '../core/loader';
import type { GeoJSONData, MaptalksGeometry } from '../types';

/**
 * 几何序列化为 GeoJSON（同步）。
 *
 * @description 直接委托 maptalks `geometry.toGeoJSON()`。
 * @param {MaptalksGeometry} geometry - 几何实例
 * @returns {GeoJSONData} GeoJSON 对象
 *
 * @example
 * const json = geometryToGeoJSON(marker);
 */
export function geometryToGeoJSON(geometry: MaptalksGeometry): GeoJSONData {
  return geometry.toGeoJSON() as GeoJSONData;
}

/**
 * GeoJSON 转换为几何数组（异步，内部动态加载 maptalks）。
 *
 * @description `loadMaptalks` → `GeoJSON.toGeometry`，结果统一规整为数组。GeoJSON 工具缺失抛 geometry-failed。
 * @param {GeoJSONData} geojson - GeoJSON 数据
 * @returns {Promise<MaptalksGeometry[]>} 几何数组
 *
 * @example
 * const geometries = await geoJSONToGeometry({ type: 'FeatureCollection', features: [] });
 * layer.addGeometry(geometries);
 */
export async function geoJSONToGeometry(geojson: GeoJSONData): Promise<MaptalksGeometry[]> {
  const mt = await loadMaptalks();
  const ns = mt.GeoJSON;
  if (!ns || typeof ns.toGeometry !== 'function') {
    throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 GeoJSON.toGeometry');
  }
  const result = ns.toGeometry(geojson);
  return Array.isArray(result) ? result : [result];
}
