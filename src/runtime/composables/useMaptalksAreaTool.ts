import type { MaybeRefOrGetter } from 'vue';

import type { MaptalksMap, UseMaptalksToolOptions, UseMaptalksToolReturn } from '../types';
import { createToolResult } from '../core/tool-factory';

/**
 * 地图工具：测面（AreaTool）。
 *
 * @description 在 map 就绪后创建 AreaTool 并 `addTo(map)`；响应式 `options` 变化时移除旧工具并重建；
 * `events` 中的事件自动 on/off；作用域销毁时自动 `remove()`。AreaTool 构造器缺失抛 `control-failed`。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {UseMaptalksToolOptions} [toolOptions] - 工具选项、事件绑定与自动销毁控制
 * @returns {UseMaptalksToolReturn} `{ tool, remove }`——tool 为工具实例，remove 可命令式移除
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { tool } = useMaptalksAreaTool(map, {
 *   options: { language: 'zh' },
 *   events: { measure: (e) => console.warn('测面结果', e) },
 * });
 */
export function useMaptalksAreaTool(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  toolOptions: UseMaptalksToolOptions = {},
): UseMaptalksToolReturn {
  return createToolResult('AreaTool', map, toolOptions);
}
