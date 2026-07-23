import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksVectorLayer,
  UseMaptalksGeometryReturn,
  UseMaptalksSectorOptions,
} from '../../types';
import { useMaptalksGeometry } from '../useMaptalksGeometry';

/**
 * 预设：扇形（Sector），= useMaptalksGeometry + mt.Sector + radius/startAngle/endAngle extraProps。
 * @description 中心坐标、半径与起止角度均响应式。Sector 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksSectorOptions} opts - 中心坐标 + 半径 + 起止角 + symbol/properties/events/id/autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksSector(layer, { coordinates: () => center.value, radius: () => r.value, startAngle: () => 0, endAngle: () => 90 });
 */
export function useMaptalksSector(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksSectorOptions,
): UseMaptalksGeometryReturn {
  return useMaptalksGeometry(layer, (mt) => {
      const Ctor = mt.Sector;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 Sector');
      }
      return new Ctor(
        toValue(opts.coordinates),
        toValue(opts.radius),
        toValue(opts.startAngle),
        toValue(opts.endAngle),
        {
          symbol: toValue(opts.symbol),
          properties: toValue(opts.properties),
          id: opts.id,
          visible: toValue(opts.visible),
          interactive: toValue(opts.interactive),
          editable: toValue(opts.editable),
          cursor: toValue(opts.cursor),
          draggable: toValue(opts.draggable),
          dragShadow: toValue(opts.dragShadow),
          dragOnAxis: toValue(opts.dragOnAxis),
          dragOnScreenAxis: toValue(opts.dragOnScreenAxis),
          zIndex: toValue(opts.zIndex),
          antiMeridian: toValue(opts.antiMeridian),
          defaultProjection: toValue(opts.defaultProjection),
          measure: toValue(opts.measure),
          rotateAngle: toValue(opts.rotateAngle),
          rotatePivot: toValue(opts.rotatePivot),
        },
      );
    },
    {
      coordinates: opts.coordinates,
      symbol: opts.symbol,
      properties: opts.properties,
      events: opts.events,
      autoDispose: opts.autoDispose,
      extraProps: [
        { value: opts.radius, apply: (g, v) => g.setRadius?.(v as number) },
        { value: opts.startAngle, apply: (g, v) => g.setStartAngle?.(v as number) },
        { value: opts.endAngle, apply: (g, v) => g.setEndAngle?.(v as number) },
      ],
    },
  );
}
