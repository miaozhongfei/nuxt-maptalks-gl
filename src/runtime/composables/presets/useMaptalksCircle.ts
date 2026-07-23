import { toValue } from 'vue';
import { buildGeometryOptions } from '../../core/geometry-options';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksVectorLayer,
  UseMaptalksCircleOptions,
  UseMaptalksGeometryReturn,
} from '../../types';
import { useMaptalksGeometry } from '../useMaptalksGeometry';

/**
 * 预设：圆（Circle），= useMaptalksGeometry + mt.Circle + radius extraProp。
 *
 * @description 在给定 VectorLayer 上创建并响应式纳管一个 Circle。中心坐标与半径均响应式。
 * Circle 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksCircleOptions} opts - 中心坐标 + 半径（必填）+ symbol/properties/events/id/autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksCircle(layer, { coordinates: () => center.value, radius: () => r.value });
 */
export function useMaptalksCircle(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksCircleOptions,
): UseMaptalksGeometryReturn {
  return useMaptalksGeometry(
    layer,
    (mt) => {
      const Ctor = mt.Circle;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 Circle');
      }
      return new Ctor(toValue(opts.coordinates), toValue(opts.radius), buildGeometryOptions(opts as unknown as Record<string, unknown>));

    },
    {
      coordinates: opts.coordinates,
      symbol: opts.symbol,
      properties: opts.properties,
      events: opts.events,
      autoDispose: opts.autoDispose,
      extraProps: [{ value: opts.radius, apply: (g, v) => g.setRadius?.(v as number) }],
    },
  );
}
