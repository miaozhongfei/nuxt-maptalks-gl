import { toValue } from 'vue';
import { buildGeometryOptions } from '../../core/geometry-options';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksVectorLayer,
  UseMaptalksGeometryReturn,
  UseMaptalksLabelOptions,
} from '../../types';
import { useMaptalksGeometry } from '../useMaptalksGeometry';

/**
 * 预设：文字标签（Label），= useMaptalksGeometry + mt.Label + content extraProp。
 *
 * @description 文本内容与锚点坐标均响应式。注意构造签名为 (content, coordinate, options)。
 * Label 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksLabelOptions} opts - 文本内容 + 锚点坐标 + symbol/properties/events/id/autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksLabel(layer, { content: () => text.value, coordinates: () => anchor.value });
 */
export function useMaptalksLabel(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksLabelOptions,
): UseMaptalksGeometryReturn {
  return useMaptalksGeometry(
    layer,
    (mt) => {
      const Ctor = mt.Label;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 Label');
      }
      return new Ctor(toValue(opts.content), toValue(opts.coordinates), buildGeometryOptions(opts as unknown as Record<string, unknown>));

    },
    {
      coordinates: opts.coordinates,
      symbol: opts.symbol,
      properties: opts.properties,
      events: opts.events,
      autoDispose: opts.autoDispose,
      extraProps: [{ value: opts.content, apply: (g, v) => g.setContent?.(v as string) }],
    },
  );
}
