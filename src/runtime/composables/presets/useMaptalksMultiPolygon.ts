import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksVectorLayer,
  UseMaptalksGeometryReturn,
  UseMaptalksMultiPolygonOptions,
} from '../../types';
import { useMaptalksGeometry } from '../useMaptalksGeometry';

/**
 * 预设：多面（MultiPolygon），= useMaptalksGeometry + mt.MultiPolygon + 精确坐标类型。
 *
 * @description 在给定 VectorLayer 上创建并响应式纳管一个 MultiPolygon。坐标为多边形序列。
 * MultiPolygon 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksMultiPolygonOptions} opts - 坐标（必填）+ symbol/properties/events/id/autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksMultiPolygon(layer, { coordinates: () => polygons.value });
 */
export function useMaptalksMultiPolygon(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksMultiPolygonOptions,
): UseMaptalksGeometryReturn {
  return useMaptalksGeometry(
    layer,
    (mt) => {
      const Ctor = mt.MultiPolygon;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 MultiPolygon');
      }
      const options: Record<string, unknown> = {
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
      }
      for (const key of Object.keys(options)) {
        if (options[key] === undefined) delete options[key];
      }
      return new Ctor(toValue(opts.coordinates), options);

    },
    {
      coordinates: opts.coordinates,
      symbol: opts.symbol,
      properties: opts.properties,
      events: opts.events,
      autoDispose: opts.autoDispose,
    },
  );
}
