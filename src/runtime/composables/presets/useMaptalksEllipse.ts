import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksVectorLayer,
  UseMaptalksEllipseOptions,
  UseMaptalksGeometryReturn,
} from '../../types';
import { useMaptalksGeometry } from '../useMaptalksGeometry';

/**
 * 预设：椭圆（Ellipse），= useMaptalksGeometry + mt.Ellipse + width/height extraProps。
 *
 * @description 中心坐标与宽高均响应式。Ellipse 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksEllipseOptions} opts - 中心坐标 + 宽高 + symbol/properties/events/id/autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksEllipse(layer, { coordinates: () => center.value, width: () => w.value, height: () => h.value });
 */
export function useMaptalksEllipse(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksEllipseOptions,
): UseMaptalksGeometryReturn {
  return useMaptalksGeometry(
    layer,
    (mt) => {
      const Ctor = mt.Ellipse;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 Ellipse');
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
      return new Ctor(toValue(opts.coordinates), toValue(opts.width), toValue(opts.height), options);

    },
    {
      coordinates: opts.coordinates,
      symbol: opts.symbol,
      properties: opts.properties,
      events: opts.events,
      autoDispose: opts.autoDispose,
      extraProps: [
        { value: opts.width, apply: (g, v) => g.setWidth?.(v as number) },
        { value: opts.height, apply: (g, v) => g.setHeight?.(v as number) },
      ],
    },
  );
}
