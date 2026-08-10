import { mapRegistry } from '../../core/registry';
import type { UseMaptalksRegistryReturn } from '../../types';

/**
 * 枚举与协同全部命名地图（多地图场景）。
 *
 * @description 暴露响应式的「name → 地图引用」表与便捷查询方法，用于跨图协同（如相机同步）、
 * 批量操作（如登出时销毁全部地图）或调试枚举。注册表为 client-only，SSR 端为空。
 * @returns {UseMaptalksRegistryReturn} `{ instances, get, has }`
 *
 * @example
 * const { instances, get } = useMaptalksRegistry();
 * // 把所有地图同步到同一缩放级别
 * for (const [, ref] of instances) ref.value?.setZoom(12);
 * // 或按名取用
 * get('main')?.flyTo({ center: [113.27, 23.13], zoom: 14 });
 */
export function useMaptalksRegistry(): UseMaptalksRegistryReturn {
  return {
    instances: mapRegistry.instances,
    get: (name: string) => mapRegistry.get(name)?.value ?? null,
    has: (name: string) => mapRegistry.has(name),
  };
}
