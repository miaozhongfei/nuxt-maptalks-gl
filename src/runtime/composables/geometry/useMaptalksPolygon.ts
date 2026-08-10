import { toValue } from 'vue';
import { buildGeometryOptions } from '../../core/geometry-options';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksPolygonGeometry,
  MaptalksVectorLayer,
  UseMaptalksGeometryReturn,
  UseMaptalksPolygonOpts,
} from '../../types';
import { useMaptalksGeometry } from './useMaptalksGeometry';

/**
 * 预设：多边形（Polygon），= useMaptalksGeometry + mt.Polygon + 精确坐标类型。
 *
 * @description 在给定 VectorLayer 上创建并响应式纳管一个 Polygon。坐标为环数组（外环 + 内环）。
 * symbol / properties 从 `options` 中提取并响应式绑定；其余原生字段经 `buildGeometryOptions` 一次性传入构造器。
 * Polygon 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksPolygonOpts} opts - 坐标（必填）+ options（全部原生字段）+ visible + events + id + autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksPolygon(layer, {
 *   coordinates: () => rings.value,
 *   options: { symbol: { polygonFill: '#1bbc9b', polygonOpacity: 0.4 } },
 * });
 */
export function useMaptalksPolygon(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksPolygonOpts,
): UseMaptalksGeometryReturn<MaptalksPolygonGeometry> {
  return useMaptalksGeometry<MaptalksPolygonGeometry>(
    layer,
    (mt) => {
      const Ctor = mt.Polygon;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 Polygon');
      }
      const rawCoords = toValue(opts.coordinates);
      const rings = Array.isArray(rawCoords[0]?.[0]) ? (rawCoords as number[][][]) : [rawCoords as number[][]];
      return new Ctor(rings, buildGeometryOptions({ id: opts.id, ...toValue(opts.options) }));
    },
    {
      coordinates: opts.coordinates,
      symbol: () => toValue(opts.options)?.symbol as Record<string, unknown> | Array<[number, Record<string, unknown>]> | undefined,
      properties: () => toValue(opts.options)?.properties as Record<string, unknown> | undefined,
      visible: opts.visible,
      events: opts.events,
      autoDispose: opts.autoDispose,
      id: opts.id,
      options: opts.options,
    },
  );
}
