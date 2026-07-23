import { toValue } from 'vue';

/**
 * 模块内部字段：这些键由 preset 内部处理（coordinates / events 等），不应被透传给原生构造器。
 *
 * @description 白名单逻辑：不在本集合中的字段全部透传——maptalks 后续新增字段无需修改模块代码即可使用。
 * 与 `useMaptalks.ts` 的 `buildMapOptions` 同构：剥离模块键 → 其余字段调 toValue 解包并过滤 undefined。
 */
const MODULE_GEOMETRY_KEYS = new Set([
  'coordinates',
  'content',
  'radius',
  'width',
  'height',
  'startAngle',
  'endAngle',
  'events',
  'autoDispose',
  'extraProps',
]);

/**
 * 根据 preset 选项对象构造可传入 maptalks 原生构造器的 options 对象。
 *
 * @description 遍历 opts 的每个键：
 * 1. 跳过模块内部字段（`MODULE_GEOMETRY_KEYS` 中的键）
 * 2. 调用 `toValue()` 解包响应式引用 / getter（普通值原样返回）
 * 3. 过滤掉值为 `undefined` 的键——maptalks 对显式 `undefined` 的值处理方式与缺少键不同
 * @param {Record<string, unknown>} opts - preset 的完整选项对象
 * @returns {Record<string, unknown>} 可安全传入 `new mt.Marker(coord, result)` 等原生构造器的 options 对象
 *
 * @example
 * const opts = { coordinates: [121.5, 31.2], draggable: true, visible: undefined };
 * buildGeometryOptions(opts);
 * // → { draggable: true }（coordinates 在内部键中，visible 为 undefined 被过滤）
 */
export function buildGeometryOptions(
  opts: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(opts)) {
    if (MODULE_GEOMETRY_KEYS.has(key)) continue;
    const v = toValue(value);
    if (v !== undefined) result[key] = v;
  }
  return result;
}
