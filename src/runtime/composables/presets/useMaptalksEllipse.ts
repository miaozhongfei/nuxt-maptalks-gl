import { toValue } from 'vue';
import { buildGeometryOptions } from '../../core/geometry-options';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksEllipseGeometry,
  MaptalksVectorLayer,
  UseMaptalksEllipseOpts,
  UseMaptalksGeometryReturn,
} from '../../types';
import { useMaptalksGeometry } from '../useMaptalksGeometry';

/**
 * 预设：椭圆（Ellipse），= useMaptalksGeometry + mt.Ellipse + width/height extraProps。
 *
 * @description 中心坐标与宽高均响应式。
 * symbol / properties 从 `options` 中提取并响应式绑定；其余原生字段经 `buildGeometryOptions` 一次性传入构造器。
 * Ellipse 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksEllipseOpts} opts - 中心坐标 + 宽高 + options（全部原生字段）+ visible + events + id + autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksEllipse(layer, {
 *   coordinates: () => center.value,
 *   width: () => w.value,
 *   height: () => h.value,
 *   options: { symbol: { polygonFill: '#1bbc9b' } },
 * });
 */
export function useMaptalksEllipse(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksEllipseOpts,
): UseMaptalksGeometryReturn<MaptalksEllipseGeometry> {
  return useMaptalksGeometry<MaptalksEllipseGeometry>(
    layer,
    (mt) => {
      const Ctor = mt.Ellipse;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 Ellipse');
      }
      return new Ctor(toValue(opts.coordinates), toValue(opts.width), toValue(opts.height), buildGeometryOptions({ ...toValue(opts.options) }));

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
      extraProps: [
        { value: opts.width, apply: (g, v) => g.setWidth?.(v as number) },
        { value: opts.height, apply: (g, v) => g.setHeight?.(v as number) },
      ],
    },
  );
}
