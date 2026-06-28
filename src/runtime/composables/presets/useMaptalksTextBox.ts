import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksVectorLayer,
  UseMaptalksGeometryReturn,
  UseMaptalksTextBoxOptions,
} from '../../types';
import { useMaptalksGeometry } from '../useMaptalksGeometry';

/**
 * 预设：文本框（TextBox），= useMaptalksGeometry + mt.TextBox + content/width/height extraProps。
 *
 * @description 文本内容、锚点坐标与宽高均响应式。构造签名为 (content, coordinate, width, height, options)。
 * TextBox 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksTextBoxOptions} opts - 文本 + 锚点 + 宽高 + symbol/properties/events/id/autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksTextBox(layer, { content: () => text.value, coordinates: () => anchor.value, width: () => w.value, height: () => h.value });
 */
export function useMaptalksTextBox(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksTextBoxOptions,
): UseMaptalksGeometryReturn {
  return useMaptalksGeometry(
    layer,
    (mt) => {
      const Ctor = mt.TextBox;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 TextBox');
      }
      return new Ctor(
        toValue(opts.content),
        toValue(opts.coordinates),
        toValue(opts.width),
        toValue(opts.height),
        { symbol: toValue(opts.symbol), properties: toValue(opts.properties), id: opts.id },
      );
    },
    {
      coordinates: opts.coordinates,
      symbol: opts.symbol,
      properties: opts.properties,
      events: opts.events,
      autoDispose: opts.autoDispose,
      extraProps: [
        { value: opts.content, apply: (g, v) => g.setContent?.(v as string) },
        { value: opts.width, apply: (g, v) => g.setWidth?.(v as number) },
        { value: opts.height, apply: (g, v) => g.setHeight?.(v as number) },
      ],
    },
  );
}
