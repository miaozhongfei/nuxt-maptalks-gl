import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import type { MaptalksMap } from '../types';

/**
 * 地图 JSON 序列化与反序列化。
 *
 * @description 封装 maptalks `map.toJSON()` 与 `map.fromJSON()`，提供地图状态的导出与导入。
 * map 为 null（SSR/未就绪）时 `toJSON` 返回 null、`fromJSON` no-op。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用
 * @returns {{ toJSON: () => unknown | null; fromJSON: (json: unknown) => void }}
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { toJSON, fromJSON } = useMaptalksSerialize(map);
 * const state = toJSON();
 * fromJSON(state); // 恢复地图
 */
export function useMaptalksSerialize(map: MaybeRefOrGetter<MaptalksMap | null>) {
  /** 导出地图为 JSON（map 为 null 返回 null） */
  function toJSON(): unknown | null {
    const m = toValue(map);
    return m?.toJSON?.() ?? null;
  }

  /** 从 JSON 恢复地图 */
  function fromJSON(json: unknown): void {
    const m = toValue(map);
    m?.fromJSON?.(json);
  }

  return { toJSON, fromJSON };
}
