import { computed, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksImageLayer,
  MaptalksMap,
  UseMaptalksLayerReturn,
  UseMaptalksImageLayerOpts,
} from '../../types';
import { useMaptalksLayer } from '../useMaptalksLayer';

/** 自动生成 id 的计数器 */
let imgSeq = 0;

/**
 * 预设：ImageLayer（图片叠加图层），= useMaptalksLayer + 配置注入。
 *
 * @description 创建 ImageLayer，支持传入多个图片（url + extent + opacity）。
 * 响应式 images 变化时重建图层。其余生命周期复用 useMaptalksLayer。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {UseMaptalksImageLayerOpts} [opts] - 图片数组 / id / 选项 / 自动销毁
 * @returns {UseMaptalksLayerReturn<MaptalksImageLayer>} 图层句柄
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { layer } = useMaptalksImageLayer(map, {
 *   images: [{ url: 'https://example.com/overlay.png', extent: [121.4, 31.2, 121.5, 31.3] }],
 * });
 */
export function useMaptalksImageLayer(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksImageLayerOpts = {},
): UseMaptalksLayerReturn<MaptalksImageLayer> {
  imgSeq += 1;
  const id = opts.id ?? `maptalks-image-${imgSeq}`;
  const imagesVal = computed(() => toValue(opts.images) ?? undefined);

  const handle = useMaptalksLayer(
    map,
    (mt) => {
      const Ctor = mt.ImageLayer;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('layer-failed', '当前 maptalks-gl 未导出 ImageLayer');
      }
      return new Ctor(id, imagesVal.value, toValue(opts.options));
    },
    { options: opts.options, autoDispose: opts.autoDispose, events: opts.events },
  );

  return {
    ...handle,
    show: () => handle.layer.value?.show?.(),
    hide: () => handle.layer.value?.hide?.(),
  };
}
