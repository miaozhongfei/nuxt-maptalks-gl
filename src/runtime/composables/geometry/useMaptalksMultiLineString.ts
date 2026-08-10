import { toValue } from 'vue';
import { buildGeometryOptions } from '../../core/geometry-options';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksMultiLineStringGeometry,
  MaptalksVectorLayer,
  UseMaptalksGeometryReturn,
  UseMaptalksMultiLineStringOpts,
} from '../../types';
import { useMaptalksGeometry } from './useMaptalksGeometry';

/**
 * 预设：多线（MultiLineString），= useMaptalksGeometry + mt.MultiLineString + 精确坐标类型。
 *
 * @description 在给定 VectorLayer 上创建并响应式纳管一个 MultiLineString。坐标为线序列。
 * symbol / properties 从 `options` 中提取并响应式绑定；其余原生字段经 `buildGeometryOptions` 一次性传入构造器。
 * MultiLineString 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksMultiLineStringOpts} opts - 坐标（必填）+ options（全部原生字段）+ visible + events + id + autoDispose
 * @returns {UseMaptalksGeometryReturn<MaptalksMultiLineStringGeometry>} `{ geometry, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksMultiLineString(layer, {
 *   coordinates: () => lines.value,
 *   options: { symbol: { lineColor: '#1bbc9b' } },
 * });
 */
export function useMaptalksMultiLineString(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksMultiLineStringOpts,
): UseMaptalksGeometryReturn<MaptalksMultiLineStringGeometry> {
  return useMaptalksGeometry<MaptalksMultiLineStringGeometry>(
    layer,
    (mt) => {
      const Ctor = mt.MultiLineString;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 MultiLineString');
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
