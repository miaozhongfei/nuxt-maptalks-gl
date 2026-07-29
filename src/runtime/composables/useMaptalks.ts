import { onBeforeUnmount, onMounted, onScopeDispose, ref, shallowRef, toValue } from 'vue';
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue';

import { useRuntimeConfig } from '#imports';

import { MaptalksError, toMaptalksError } from '../core/errors';
import { isWebGLAvailable, loadMaptalks } from '../core/loader';
import { mapRegistry } from '../core/registry';
import { resolveSource } from '../core/resolve-source';
import type { MaptalksMap, MaptalksSource, UseMaptalksOpts, UseMaptalksReturn } from '../types';
import { createLogger } from '../utils/logger';

/** 日志实例（单例） */
const logger = createLogger('nuxt-maptalks-gl');

/**
 * 从 useMaptalks 选项中剥离本模块识别的键，得到可透传给 maptalks Map 的选项。
 *
 * @description `name` 与 `onError` 由本模块消费，不应传入 maptalks 构造器。
 * @param {UseMaptalksOpts} options - 原始选项
 * @returns {Record<string, unknown>} 透传给 maptalks Map 的选项
 *
 * @example
 * const mapOptions = buildMapOptions({ name: 'main', center: [0, 0], zoom: 2 });
 */
/** 模块消费的键——name/onError 由本模块处理，不应传入 maptalks 构造器 */
const MODULE_KEYS = new Set(['name', 'onError']);

function buildMapOptions(options: UseMaptalksOpts): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(options)) {
    if (MODULE_KEYS.has(key)) continue;
    // baseLayer 是字符串/配置对象时由 createMap 另行处理，不透传原生构造器
    if (key === 'baseLayer' && (typeof value === 'string' || (value && typeof value === 'object' && !('addTo' in value)))) continue;
    result[key] = value;
  }
  return result;
}

/**
 * 客户端创建 maptalks 地图实例（含 WebGL 检测与动态加载）。
 *
 * @description 先检测 WebGL，再动态加载 maptalks-gl，最后用剥离后的选项构造 Map。WebGL 不支持时抛 MaptalksError。
 * @param {HTMLElement} el - 地图容器元素
 * @param {UseMaptalksOpts} options - useMaptalks 选项
 * @returns {Promise<MaptalksMap>} 创建好的地图实例
 *
 * @example
 * const map = await createMap(el, { center: [113.27, 23.13], zoom: 10 });
 */
async function createMap(
  el: HTMLElement,
  options: UseMaptalksOpts,
  blConfig?: { source: MaptalksSource; id: string | number; extra: Record<string, unknown> },
): Promise<MaptalksMap> {
  if (!isWebGLAvailable()) {
    throw new MaptalksError('webgl-unsupported', '当前环境不支持 WebGL');
  }
  const prevHeight = el.offsetHeight;
  const mt = await loadMaptalks();
  const map = new mt.Map(el, buildMapOptions(options));
  // 自动创建底图瓦片层
  if (blConfig) {
    const { source, id, extra } = blConfig;
    const resolved = await resolveSource(source);
    const tileOpts = { ...resolved?.options, ...extra };
    if (resolved?.urlTemplate) tileOpts.urlTemplate = resolved.urlTemplate;
    if (resolved?.url) tileOpts.url = resolved.url;
    const tileLayer = new mt.TileLayer(id, tileOpts as Record<string, unknown>);
    map.addLayer(tileLayer as unknown as Parameters<typeof map.addLayer>[0]);
  }
  if (el.offsetHeight === 0 && prevHeight > 0) {
    el.style.height = prevHeight + 'px';
  }
  return map;
}

/**
 * 在客户端执行地图初始化并把结果/错误写入响应式状态。
 *
 * @description 抽出 onMounted 的初始化流程：解析容器、创建地图、回写 map/isReady；失败时写入 error 并触发 onError。
 * @param {MaybeRefOrGetter<HTMLElement | null>} target - 地图容器
 * @param {UseMaptalksOpts} options - useMaptalks 选项
 * @param {ShallowRef<MaptalksMap | null>} map - 地图引用
 * @param {Ref<boolean>} isReady - 就绪标记
 * @param {Ref<MaptalksError | null>} error - 错误引用
 * @returns {Promise<void>}
 *
 * @example
 * onMounted(() => runInit(target, options, map, isReady, error));
 */
async function runInit(
  target: MaybeRefOrGetter<HTMLElement | null>,
  options: UseMaptalksOpts,
  blConfig: { source: MaptalksSource; id: string | number; extra: Record<string, unknown> } | undefined,
  map: ShallowRef<MaptalksMap | null>,
  isReady: Ref<boolean>,
  error: Ref<MaptalksError | null>,
): Promise<void> {
  const fail = (e: MaptalksError) => {
    error.value = e;
    options.onError?.(e);
  };
  const el = toValue(target);
  if (!el) {
    fail(new MaptalksError('init-failed', 'useMaptalks 的 target 容器为空'));
    return;
  }
  try {
    map.value = await createMap(el, options, blConfig);
    isReady.value = true;
  } catch (cause) {
    logger.error('地图初始化失败', cause);
    fail(toMaptalksError(cause, 'init-failed', '地图初始化失败'));
  }
}

/**
 * 创建并响应式纳管一张 maptalks 地图（核心 composable）。
 *
 * @description 兜底 SSR / 动态加载 / 生命周期：服务端返回惰性的空引用且不 import maptalks-gl；
 * 客户端在 onMounted 内检测 WebGL、动态加载 maptalks-gl、创建地图；作用域销毁时自动 `map.remove()`。
 * 传入 `name` 后会登记进 MapRegistry，可经 `useMaptalksInstance` / `useMaptalksRegistry` 跨组件访问。
 * @param {MaybeRefOrGetter<HTMLElement | null>} target - 地图容器元素（Ref 或 getter）
 * @param {UseMaptalksOpts} [options] - 命名与 maptalks Map 选项（center/zoom/baseLayer 等）
 * @returns {UseMaptalksReturn} `{ map, isReady, error }` 响应式三元组
 *
 * @example
 * <template><div ref="el" style="height:400px" /></template>
 * <script setup lang="ts">
 * const el = ref<HTMLElement | null>(null);
 * const { map, isReady, error } = useMaptalks(el, { name: 'main', center: [113.27, 23.13], zoom: 10 });
 * </script>
 */
export function useMaptalks(
  target: MaybeRefOrGetter<HTMLElement | null>,
  options: UseMaptalksOpts = {},
): UseMaptalksReturn {
  const map = shallowRef<MaptalksMap | null>(null);
  const isReady = ref(false);
  const error = ref<MaptalksError | null>(null);
  const name = options.name;

  const config = useRuntimeConfig();
  const sources = ((config.public as Record<string, unknown>)?.maptalksGl as Record<string, unknown>)?.sources as Record<string, MaptalksSource> | undefined;
  const blConfig = resolveBaseLayerConfig(options.baseLayer, sources);

  if (name && import.meta.client) mapRegistry.register(name, map);

  function destroy(): void {
    if (map.value) { map.value.remove(); map.value = null; }
    isReady.value = false;
    if (name && import.meta.client) mapRegistry.unregister(name, map);
  }

  if (import.meta.client) {
    onMounted(() => runInit(target, options, blConfig, map, isReady, error));
    onBeforeUnmount(destroy);
    onScopeDispose(destroy);
  }

  return { map, isReady, error };
}

/**
 * 解析 baseLayer 选项为 blConfig（供 createMap 自动创建底图瓦片层）。
 *
 * @param {UseMaptalksOpts['baseLayer'] | undefined} baseLayer - 字符串/对象/原生Layer
 * @param {Record<string, MaptalksSource> | undefined} sources - runtimeConfig 中的命名数据源表
 * @returns {{ source: MaptalksSource; id: string | number; extra: Record<string, unknown> } | undefined} 解析结果
 *
 * @example
 * const blConfig = resolveBaseLayer('osm', sources);
 */
function resolveBaseLayerConfig(
  baseLayer: UseMaptalksOpts['baseLayer'],
  sources: Record<string, MaptalksSource> | undefined,
): { source: MaptalksSource; id: string | number; extra: Record<string, unknown> } | undefined {
  if (!baseLayer) return undefined;
  const bl = baseLayer;
  if (typeof bl !== 'string' && (!bl || typeof bl !== 'object' || 'addTo' in bl)) return undefined;
  const srcName: string = typeof bl === 'string' ? bl : ((bl as { source?: string }).source ?? 'osm');
  const blObj = typeof bl === 'string' ? {} : bl as { urlTemplate?: string; subdomains?: string[]; attribution?: string; options?: Record<string, unknown> };
  const extra: Record<string, unknown> = {};
  if (blObj.urlTemplate) extra.urlTemplate = blObj.urlTemplate;
  if (blObj.subdomains) extra.subdomains = blObj.subdomains;
  if (blObj.attribution) extra.attribution = blObj.attribution;
  if (blObj.options) Object.assign(extra, blObj.options);
  const blSource = sources?.[srcName];
  if (!blSource) return undefined;
  return { source: blSource, id: `base-${srcName}`, extra };
}
