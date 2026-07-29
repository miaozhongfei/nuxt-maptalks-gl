import { toValue } from 'vue';
import { buildGeometryOptions } from '../../core/geometry-options';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksMultiPolygonGeometry,
  MaptalksVectorLayer,
  UseMaptalksGeometryReturn,
  UseMaptalksMultiPolygonOpts,
} from '../../types';
import { useMaptalksGeometry } from '../useMaptalksGeometry';

/**
 * 预设：多面（MultiPolygon），= useMaptalksGeometry + mt.MultiPolygon + 精确坐标类型。
 *
 * @description 在给定 VectorLayer 上创建并响应式纳管一个 MultiPolygon。坐标为多边形序列。
 * symbol / properties 从 `options` 中提取并响应式绑定；其余原生字段经 `buildGeometryOptions` 一次性传入构造器。
 * MultiPolygon 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksMultiPolygonOpts} opts - 坐标（必填）+ options（全部原生字段）+ visible + events + id + autoDispose
 * @returns {UseMaptalksGeometryReturn<MaptalksMultiPolygonGeometry>} `{ geometry, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksMultiPolygon(layer, {
 *   coordinates: () => polygons.value,
 *   options: { symbol: { polygonFill: '#1bbc9b' } },
 * });
 */
export function useMaptalksMultiPolygon(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksMultiPolygonOpts,
): UseMaptalksGeometryReturn<MaptalksMultiPolygonGeometry> {
  return useMaptalksGeometry<MaptalksMultiPolygonGeometry>(
    layer,
    (mt) => {
      const Ctor = mt.MultiPolygon;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 MultiPolygon');
      }
      return new Ctor(toValue(opts.coordinates), buildGeometryOptions({ id: opts.id, ...toValue(opts.options) }));

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
