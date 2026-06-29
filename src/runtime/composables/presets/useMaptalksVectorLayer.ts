import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksMap,
  MaptalksNativeVectorLayerOptions,
  UseMaptalksLayerReturn,
  UseMaptalksVectorLayerOptions,
} from '../../types';
import { useMaptalksLayer } from '../useMaptalksLayer';

/** 自动生成 id 的计数器 */
let vectorSeq = 0;

/**
 * 预设：矢量图层（VectorLayer，承载几何），= useMaptalksLayer 包一层 + 自动 id。
 *
 * @description 创建一个 VectorLayer 并纳管；几何经 useMaptalksMarker/LineString/Polygon 加到它上面。
 * 生命周期（addLayer / dispose）复用 useMaptalksLayer。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {UseMaptalksVectorLayerOptions} [opts] - id / 选项 / 自动销毁
 * @returns {UseMaptalksLayerReturn} `{ layer, update, remove }`
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { layer } = useMaptalksVectorLayer(map, { id: 'geo' });
 */
export function useMaptalksVectorLayer(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksVectorLayerOptions & { options?: Partial<MaptalksNativeVectorLayerOptions> } = {},
): UseMaptalksLayerReturn {
  vectorSeq += 1;
  const id = opts.id ?? `maptalks-vector-${vectorSeq}`;
  return useMaptalksLayer(
    map,
    (mt) => {
      const Ctor = mt.VectorLayer;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('layer-failed', '当前 maptalks-gl 未导出 VectorLayer');
      }
      return new Ctor(id, opts.options);
    },
    { options: opts.options, autoDispose: opts.autoDispose },
  );
}
