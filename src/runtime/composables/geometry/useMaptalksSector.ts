import { toValue } from 'vue';
import { buildGeometryOptions } from '../../core/geometry-options';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksSectorGeometry,
  MaptalksVectorLayer,
  UseMaptalksGeometryReturn,
  UseMaptalksSectorOpts,
} from '../../types';
import { useMaptalksGeometry } from './useMaptalksGeometry';

/**
 * 预设：扇形（Sector），= useMaptalksGeometry + mt.Sector + radius/startAngle/endAngle extraProps。
 * @description 中心坐标、半径与起止角度均响应式。
 * symbol / properties 从 `options` 中提取并响应式绑定；其余原生字段经 `buildGeometryOptions` 一次性传入构造器。
 * Sector 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksSectorOpts} opts - 中心坐标 + 半径 + 起止角 + options（全部原生字段）+ visible + events + id + autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksSector(layer, {
 *   coordinates: () => center.value,
 *   radius: () => r.value,
 *   startAngle: () => 0,
 *   endAngle: () => 90,
 *   options: { symbol: { polygonFill: '#1bbc9b' } },
 * });
 */
export function useMaptalksSector(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksSectorOpts,
): UseMaptalksGeometryReturn<MaptalksSectorGeometry> {
  return useMaptalksGeometry<MaptalksSectorGeometry>(layer, (mt) => {
      const Ctor = mt.Sector;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 Sector');
      }
      return new Ctor(
        toValue(opts.coordinates),
        toValue(opts.radius),
        toValue(opts.startAngle),
        toValue(opts.endAngle),
        buildGeometryOptions({ id: opts.id, ...toValue(opts.options) }),
      );
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
        { value: opts.radius, apply: (g, v) => (g as MaptalksSectorGeometry).setRadius(v as number) },
        { value: opts.startAngle, apply: (g, v) => (g as MaptalksSectorGeometry).setStartAngle(v as number) },
        { value: opts.endAngle, apply: (g, v) => (g as MaptalksSectorGeometry).setEndAngle(v as number) },
      ],
    },
  );
}
