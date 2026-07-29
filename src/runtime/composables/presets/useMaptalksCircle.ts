import { toValue } from 'vue';
import { buildGeometryOptions } from '../../core/geometry-options';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksCircleGeometry,
  MaptalksVectorLayer,
  UseMaptalksCircleOpts,
  UseMaptalksGeometryReturn,
} from '../../types';
import { useMaptalksGeometry } from '../useMaptalksGeometry';

/**
 * 预设：圆（Circle），= useMaptalksGeometry + mt.Circle + radius extraProp。
 *
 * @description 在给定 VectorLayer 上创建并响应式纳管一个 Circle。中心坐标与半径均响应式。
 * symbol / properties 从 `options` 中提取并响应式绑定；其余原生字段经 `buildGeometryOptions` 一次性传入构造器。
 * Circle 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksCircleOpts} opts - 中心坐标 + 半径（必填）+ options（全部原生字段）+ visible + events + id + autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksCircle(layer, {
 *   coordinates: () => center.value,
 *   radius: () => r.value,
 *   options: { symbol: { polygonFill: '#1bbc9b' } },
 * });
 */
export function useMaptalksCircle(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksCircleOpts,
): UseMaptalksGeometryReturn<MaptalksCircleGeometry> {
  return useMaptalksGeometry<MaptalksCircleGeometry>(
    layer,
    (mt) => {
      const Ctor = mt.Circle;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 Circle');
      }
      return new Ctor(toValue(opts.coordinates), toValue(opts.radius), buildGeometryOptions({ id: opts.id, ...toValue(opts.options) }));

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
      extraProps: [{ value: opts.radius, apply: (g, v) => g.setRadius?.(v as number) }],
    },
  );
}
