import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksVectorLayer,
  UseMaptalksGeometryReturn,
  UseMaptalksMarkerOptions,
} from '../../types';
import { useMaptalksGeometry } from '../useMaptalksGeometry';

/**
 * 预设：点标注（Marker），= useMaptalksGeometry + mt.Marker + 精确坐标类型。
 *
 * @description 在给定 VectorLayer 上创建并响应式纳管一个 Marker。坐标/symbol/properties 响应式，
 * events 自动绑定。Marker 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksMarkerOptions} opts - 坐标（必填）+ symbol/properties/events/id/autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksMarker(layer, {
 *   coordinates: () => pos.value,
 *   symbol: { markerType: 'ellipse', markerWidth: 20, markerHeight: 20 },
 *   events: { click: () => console.warn('marker clicked') },
 * });
 */
export function useMaptalksMarker(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksMarkerOptions,
): UseMaptalksGeometryReturn {
  return useMaptalksGeometry(
    layer,
    (mt) => {
      const Ctor = mt.Marker;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 Marker');
      }
      return new Ctor(toValue(opts.coordinates), {
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
      });
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
