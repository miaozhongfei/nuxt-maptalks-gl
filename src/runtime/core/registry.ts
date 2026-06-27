import { shallowReactive } from 'vue';
import type { ShallowRef } from 'vue';

import type { MaptalksLayer, MaptalksMap } from '../types';
import { createLogger } from '../utils/logger';

/** 日志实例（单例） */
const logger = createLogger('nuxt-maptalks-gl');

/**
 * 命名地图响应式表（client-only）。
 *
 * @description 以 name 为键存放各 `useMaptalks` 创建的地图引用。使用 shallowReactive 包裹，
 * 增删条目会触发依赖（如 useMaptalksInstance 的 computed）重算。SSR 端不被填充。
 */
const maps = shallowReactive(new Map<string, ShallowRef<MaptalksMap | null>>());

/**
 * 地图注册表（模块级单例）。
 *
 * @description 维护「name → 地图引用」映射，支撑多地图按名获取（useMaptalksInstance）与
 * 枚举/跨图协同（useMaptalksRegistry）。仅在客户端被写入；各 useMaptalks 在 scope dispose 时注销自身条目。
 *
 * @example
 * mapRegistry.register('main', map);
 * const ref = mapRegistry.get('main');
 */
export const mapRegistry = {
  /**
   * 登记一个命名地图引用。
   *
   * @description 同名重复登记会覆盖并告警（多个同名地图通常是误用）。
   * @param {string} name - 地图名
   * @param {ShallowRef<MaptalksMap | null>} ref - useMaptalks 的 map 引用
   * @returns {void}
   *
   * @example
   * mapRegistry.register('main', map);
   */
  register(name: string, ref: ShallowRef<MaptalksMap | null>): void {
    if (maps.has(name)) {
      logger.warn(`地图名 '${name}' 已存在，后注册的实例将覆盖先前的引用`);
    }
    maps.set(name, ref);
  },

  /**
   * 注销一个命名地图引用。
   *
   * @description 传入 ref 时仅当当前条目为同一引用才删除，避免误删被新实例覆盖后的条目。
   * @param {string} name - 地图名
   * @param {ShallowRef<MaptalksMap | null>} [ref] - 期望匹配的引用；省略则无条件删除
   * @returns {void}
   *
   * @example
   * mapRegistry.unregister('main', map);
   */
  unregister(name: string, ref?: ShallowRef<MaptalksMap | null>): void {
    if (ref && maps.get(name) !== ref) return;
    maps.delete(name);
  },

  /**
   * 按名获取地图引用。
   *
   * @description 返回 useMaptalks 的 map 引用（ShallowRef），未登记返回 undefined。在响应式上下文中读取会建立依赖。
   * @param {string} name - 地图名
   * @returns {ShallowRef<MaptalksMap | null> | undefined} 地图引用或 undefined
   *
   * @example
   * const ref = mapRegistry.get('main');
   */
  get(name: string): ShallowRef<MaptalksMap | null> | undefined {
    return maps.get(name);
  },

  /**
   * 判断是否存在指定名的已登记地图。
   *
   * @param {string} name - 地图名
   * @returns {boolean} 是否存在
   *
   * @example
   * if (mapRegistry.has('main')) { /* ... *\/ }
   */
  has(name: string): boolean {
    return maps.has(name);
  },

  /**
   * 只读访问全部命名地图引用（响应式）。
   *
   * @returns {ReadonlyMap<string, ShallowRef<MaptalksMap | null>>} 响应式只读表
   *
   * @example
   * for (const [name, ref] of mapRegistry.instances) console.warn(name, ref.value);
   */
  get instances(): ReadonlyMap<string, ShallowRef<MaptalksMap | null>> {
    return maps;
  },
};

/** 图层自增 id 计数器 */
let layerSeq = 0;

/**
 * 活跃图层响应式表（client-only）。
 *
 * @description 以自增 id 为键存放各 `useMaptalksLayer` 创建的图层，用于诊断、枚举与批量释放。
 */
const layers = shallowReactive(new Map<number, MaptalksLayer>());

/**
 * 图层注册表（模块级单例）。
 *
 * @description 维护活跃图层集合，`useMaptalksLayer` 在创建时登记、在 scope dispose 时注销。
 *
 * @example
 * const id = layerRegistry.register(layer);
 * layerRegistry.unregister(id);
 */
export const layerRegistry = {
  /**
   * 登记一个活跃图层。
   *
   * @param {MaptalksLayer} layer - 已创建的图层实例
   * @returns {number} 用于后续注销的自增 id
   *
   * @example
   * const id = layerRegistry.register(layer);
   */
  register(layer: MaptalksLayer): number {
    layerSeq += 1;
    layers.set(layerSeq, layer);
    return layerSeq;
  },

  /**
   * 注销一个活跃图层。
   *
   * @param {number} id - register 返回的 id
   * @returns {void}
   *
   * @example
   * layerRegistry.unregister(id);
   */
  unregister(id: number): void {
    layers.delete(id);
  },

  /**
   * 当前活跃图层数量。
   *
   * @returns {number} 活跃图层数量
   *
   * @example
   * console.warn('active layers:', layerRegistry.size);
   */
  get size(): number {
    return layers.size;
  },
};
