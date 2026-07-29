import { toValue } from 'vue';
import { buildGeometryOptions } from '../../core/geometry-options';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksTextBoxGeometry,
  MaptalksVectorLayer,
  UseMaptalksGeometryReturn,
  UseMaptalksTextBoxOpts,
} from '../../types';
import { useMaptalksGeometry } from '../useMaptalksGeometry';

/**
 * 预设：文本框（TextBox），= useMaptalksGeometry + mt.TextBox + content/width/height extraProps。
 * @description 文本内容、锚点坐标与宽高均响应式。构造签名为 (content, coordinate, width, height, options)。
 * symbol / properties 从 `options` 中提取并响应式绑定；其余原生字段经 `buildGeometryOptions` 一次性传入构造器。
 * TextBox 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksTextBoxOpts} opts - 文本 + 锚点 + 宽高 + options（全部原生字段）+ visible + events + id + autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksTextBox(layer, {
 *   content: () => text.value,
 *   coordinates: () => anchor.value,
 *   width: () => w.value,
 *   height: () => h.value,
 *   options: { symbol: { textSize: 16 } },
 * });
 */
export function useMaptalksTextBox(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksTextBoxOpts,
): UseMaptalksGeometryReturn<MaptalksTextBoxGeometry> {
  return useMaptalksGeometry<MaptalksTextBoxGeometry>(layer, (mt) => {
      const Ctor = mt.TextBox;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 TextBox');
      }
      return new Ctor(
        toValue(opts.content),
        toValue(opts.coordinates),
        toValue(opts.width),
        toValue(opts.height),
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
        { value: opts.content, apply: (g, v) => g.setContent?.(v as string) },
        { value: opts.width, apply: (g, v) => g.setWidth?.(v as number) },
        { value: opts.height, apply: (g, v) => g.setHeight?.(v as number) },
      ],
    },
  );
}
