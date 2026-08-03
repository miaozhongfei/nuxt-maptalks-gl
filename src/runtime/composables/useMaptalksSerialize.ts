import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { createLogger } from '../utils/logger';
import type { MaptalksGLNamespace, MaptalksMap } from '../types';

const logger = createLogger('useMaptalksSerialize');

/**
 * 地图 JSON 序列化与反序列化。
 *
 * @description 封装 maptalks `map.toJSON()` 与静态 `Map.fromJSON()`，提供地图状态的导出与导入。
 * maptalks 的 fromJSON 仅静态方法（实例无 fromJSON），故导入时先移除当前地图实例、
 * 再在同一容器上用静态 fromJSON 重建。map 为 null（SSR/未就绪）时 `toJSON` 返回 null、
 * `fromJSON` no-op。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（fromJSON 时取容器并移除实例）
 * @returns {{ toJSON: () => unknown | null; fromJSON: (json: unknown) => Promise<void> }}
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { toJSON, fromJSON } = useMaptalksSerialize(map);
 * const state = toJSON();
 * await fromJSON(state); // 在同一容器重建地图
 */
export function useMaptalksSerialize(map: MaybeRefOrGetter<MaptalksMap | null>) {
  /** 导出地图为 JSON（map 为 null 返回 null） */
  function toJSON(): unknown | null {
    const m = toValue(map);
    return m?.toJSON?.() ?? null;
  }

  /** 从 JSON 重建地图：移除当前实例后在同一容器上用静态 Map.fromJSON 重建 */
  async function fromJSON(json: unknown): Promise<void> {
    const m = toValue(map);
    if (!m || !json) return;
    try {
      const mt = await import('maptalks-gl');
      const container = m.getContainer();
      if (!container) return;
      m.remove();
      (mt as unknown as MaptalksGLNamespace).Map.fromJSON(container, json as Record<string, unknown>);
    } catch (e) {
      // 静态 fromJSON 失败不抛给调用方（如 JSON 结构不兼容），记录日志保持可诊断
      logger.error('Map.fromJSON 重建失败', e);
    }
  }

  return { toJSON, fromJSON };
}
