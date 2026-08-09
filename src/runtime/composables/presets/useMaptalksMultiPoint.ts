import { toValue } from 'vue';
import { buildGeometryOptions } from '../../core/geometry-options';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksMultiPointGeometry,
  MaptalksVectorLayer,
  UseMaptalksGeometryReturn,
  UseMaptalksMultiPointOpts,
} from '../../types';
import { useMaptalksGeometry } from '../useMaptalksGeometry';

/**
 * 预设：多点（MultiPoint），= useMaptalksGeometry + mt.MultiPoint + 精确坐标类型。
 *
 * @description 在给定 VectorLayer 上创建并响应式纳管一个 MultiPoint。坐标为点序列。
 * symbol / properties 从 `options` 中提取并响应式绑定；其余原生字段经 `buildGeometryOptions` 一次性传入构造器。
 * MultiPoint 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksMultiPointOpts} opts - 坐标（必填）+ options（全部原生字段）+ visible + events + id + autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksMultiPoint(layer, {
 *   coordinates: () => points.value,
 *   options: { symbol: { markerType: 'ellipse' } },
 * });
 */
export function useMaptalksMultiPoint(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksMultiPointOpts,
): UseMaptalksGeometryReturn<MaptalksMultiPointGeometry> {
  return useMaptalksGeometry<MaptalksMultiPointGeometry>(
    layer,
    (mt) => {
      const Ctor = mt.MultiPoint;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 MultiPoint');
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
