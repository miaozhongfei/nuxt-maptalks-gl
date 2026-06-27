import { computed } from 'vue';

import { mapRegistry } from '../core/registry';
import type { MaptalksInstanceRef } from '../types';

/**
 * 按名获取一张已登记地图的响应式引用（不拥有其生命周期）。
 *
 * @description 与 `useMaptalks`（创建并拥有）配套：本函数仅「获取」由其它组件用同名 `useMaptalks` 创建的地图。
 * 返回的 computed 在地图尚未创建 / SSR 时为 null，待对应 `useMaptalks` 就绪后自动变为实例。
 * @param {string} name - 目标地图名（与创建方 `useMaptalks(target, { name })` 一致）
 * @returns {MaptalksInstanceRef} 响应式只读引用，`ComputedRef<MaptalksMap | null>`
 *
 * @example
 * // A.vue 创建：useMaptalks(el, { name: 'main' })
 * // B.vue 获取：
 * const main = useMaptalksInstance('main');
 * watchEffect(() => main.value?.setZoom(12));
 */
export function useMaptalksInstance(name: string): MaptalksInstanceRef {
  return computed(() => mapRegistry.get(name)?.value ?? null);
}
