import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { createLogger } from '../../utils/logger';
import type { MaptalksGLNamespace, MaptalksLayer } from '../../types';

const logger = createLogger('useMaptalksLayerSerialize');

/**
 * 图层 JSON 序列化与反序列化。
 *
 * @description 封装 maptalks `layer.toJSON()` 与静态 `Layer.fromJSON()`，提供图层状态的导出与复制。
 * 静态 fromJSON 返回独立图层副本（不挂到任何地图），由调用方决定 `addTo(map)` 的目标。
 * layer 为 null（未就绪）时 `toJSON` 返回 null、`fromJSON` 返回 null。
 * @param {MaybeRefOrGetter<MaptalksLayer | null>} layer - 图层引用（VectorLayer / TileLayer 等均可序列化）
 * @returns {{ toJSON: () => unknown | null; fromJSON: (json: unknown) => Promise<MaptalksLayer | null> }}
 *
 * @example
 * const { layer } = useMaptalksVectorLayer(map, { id: 'v0' });
 * const { toJSON, fromJSON } = useMaptalksLayerSerialize(layer);
 * const copy = await fromJSON(toJSON()); // 重建独立副本
 * copy?.addTo(otherMap);                 // 复制到目标地图
 */
export function useMaptalksLayerSerialize(layer: MaybeRefOrGetter<MaptalksLayer | null>) {
  /** 导出图层为 JSON（layer 为 null 返回 null） */
  function toJSON(): unknown | null {
    const l = toValue(layer);
    return l?.toJSON?.() ?? null;
  }

  /** 从图层 JSON 重建独立副本（静态 Layer.fromJSON，不挂载，由调用方 addTo） */
  async function fromJSON(json: unknown): Promise<MaptalksLayer | null> {
    if (!json) return null;
    try {
      const mt = await import('maptalks-gl');
      return (mt as unknown as MaptalksGLNamespace).Layer.fromJSON(json as Record<string, unknown>);
    } catch (e) {
      // 图层 JSON 结构不兼容时记录日志并返回 null，由调用方决定是否继续
      logger.error('Layer.fromJSON 重建失败', e);
      return null;
    }
  }

  return { toJSON, fromJSON };
}
