import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { createLogger } from '../utils/logger';
import type { MaptalksGLNamespace, MaptalksGeometry } from '../types';

const logger = createLogger('useMaptalksGeometrySerialize');

/**
 * 几何 JSON 序列化与反序列化。
 *
 * @description 封装 maptalks `geometry.toJSON()` 与静态 `Geometry.fromJSON()`，提供几何状态的导出与复制。
 * 静态 fromJSON 返回独立几何副本（不挂到任何图层），由调用方决定 `addTo(layer)` 的目标。
 * geometry 为 null（未就绪）时 `toJSON` 返回 null、`fromJSON` 返回 null。
 * @param {MaybeRefOrGetter<MaptalksGeometry | null>} geometry - 几何引用（Marker / Rectangle 等均可序列化）
 * @returns {{ toJSON: () => unknown | null; fromJSON: (json: unknown) => Promise<MaptalksGeometry | null> }}
 *
 * @example
 * const { geometry } = useMaptalksRectangle(layer, { coordinates: c, width: 1000, height: 800 });
 * const { toJSON, fromJSON } = useMaptalksGeometrySerialize(geometry);
 * const copy = await fromJSON(toJSON()); // 重建独立副本
 * copy?.addTo(otherLayer);               // 复制到目标图层
 */
export function useMaptalksGeometrySerialize(geometry: MaybeRefOrGetter<MaptalksGeometry | null>) {
  /** 导出几何为 JSON（geometry 为 null 返回 null） */
  function toJSON(): unknown | null {
    const g = toValue(geometry);
    return g?.toJSON?.() ?? null;
  }

  /** 从几何 JSON 重建独立副本（静态 Geometry.fromJSON，不挂载，由调用方 addTo） */
  async function fromJSON(json: unknown): Promise<MaptalksGeometry | null> {
    if (!json) return null;
    try {
      const mt = await import('maptalks-gl');
      const built = (mt as unknown as MaptalksGLNamespace).Geometry?.fromJSON(json as Record<string, unknown>);
      return Array.isArray(built) ? (built[0] ?? null) : (built ?? null);
    } catch (e) {
      // 几何 JSON 结构不兼容时记录日志并返回 null，由调用方决定是否继续
      logger.error('Geometry.fromJSON 重建失败', e);
      return null;
    }
  }

  return { toJSON, fromJSON };
}
