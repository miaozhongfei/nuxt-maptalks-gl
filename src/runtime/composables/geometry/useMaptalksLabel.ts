import { toValue } from 'vue';
import { buildGeometryOptions } from '../../core/geometry-options';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksLabelGeometry,
  MaptalksVectorLayer,
  UseMaptalksGeometryReturn,
  UseMaptalksLabelOpts,
} from '../../types';
import { useMaptalksGeometry } from './useMaptalksGeometry';

/**
 * 预设：文字标签（Label），= useMaptalksGeometry + mt.Label + content extraProp。
 *
 * @description 文本内容与锚点坐标均响应式。注意构造签名为 (content, coordinate, options)。
 * symbol / properties 从 `options` 中提取并响应式绑定；其余原生字段（textSymbol / draggable 等）经 `buildGeometryOptions` 一次性传入构造器。
 * Label 构造器缺失抛 geometry-failed。
 * @param {MaybeRefOrGetter<MaptalksVectorLayer | null>} layer - 矢量图层引用
 * @param {UseMaptalksLabelOpts} opts - 文本内容 + 锚点坐标 + options（全部原生字段）+ visible + events + id + autoDispose
 * @returns {UseMaptalksGeometryReturn} `{ geometry, remove }`
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map);
 * const { geometry } = useMaptalksLabel(layer, {
 *   content: () => text.value,
 *   coordinates: () => anchor.value,
 *   options: { symbol: { textSize: 16 }, draggable: true },
 * });
 */
export function useMaptalksLabel(
  layer: MaybeRefOrGetter<MaptalksVectorLayer | null>,
  opts: UseMaptalksLabelOpts,
): UseMaptalksGeometryReturn<MaptalksLabelGeometry> {
  return useMaptalksGeometry<MaptalksLabelGeometry>(
    layer,
    (mt) => {
      const Ctor = mt.Label;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('geometry-failed', '当前 maptalks-gl 未导出 Label');
      }
      return new Ctor(
        toValue(opts.content),
        toValue(opts.coordinates),
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
      extraProps: [{ value: opts.content, apply: (g, v) => (g as MaptalksLabelGeometry).setContent(v as string) }],
    },
  );
}
