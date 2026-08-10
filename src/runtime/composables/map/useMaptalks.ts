import { onBeforeUnmount, onMounted, onScopeDispose, ref, shallowRef, toValue } from 'vue';
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue';

import { useRuntimeConfig } from '#imports';

import { MaptalksError, toMaptalksError } from '../../core/errors';
import { isWebGLAvailable, loadMaptalks } from '../../core/loader';
import { mapRegistry } from '../../core/registry';
import { resolveSource } from '../../core/resolve-source';
import type { MaptalksGLNamespace, MaptalksLayer, MaptalksMap, MaptalksSource, UseMaptalksOpts, UseMaptalksReturn } from '../../types';
import { createLogger } from '../../utils/logger';

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
    // baseLayer 是字符串/配置对象/候选数组时由 createMap 另行处理，不透传原生构造器
    if (key === 'baseLayer' && (typeof value === 'string' || Array.isArray(value) || (value && typeof value === 'object' && !('addTo' in value)))) continue;
    result[key] = value;
  }
  return result;
}

/**
 * 客户端创建 maptalks 地图实例（含 WebGL 检测与动态加载）。
 *
 * @description 先检测 WebGL，再动态加载 maptalks-gl，最后用剥离后的选项构造 Map。WebGL 不支持时抛 MaptalksError。
 * baseLayer 单底图 → 单个 TileLayer + setBaseLayer；多底图候选数组 → GroupTileLayer 打包 + setBaseLayer
 * （第一项可见、其余隐藏，供 LayerSwitcher 切换）。
 * @param {HTMLElement} el - 地图容器元素
 * @param {UseMaptalksOpts} options - useMaptalks 选项
 * @param {Array<{ source: MaptalksSource | null; id: string; extra: Record<string, unknown> }>} [blConfig] - 解析后的底图项列表
 * @returns {Promise<MaptalksMap>} 创建好的地图实例
 *
 * @example
 * const map = await createMap(el, { center: [113.27, 23.13], zoom: 10 });
 */
async function createMap(
  el: HTMLElement,
  options: UseMaptalksOpts,
  blConfig?: Array<{ source: MaptalksSource | null; id: string; extra: Record<string, unknown> }>,
): Promise<MaptalksMap> {
  if (!isWebGLAvailable()) {
    throw new MaptalksError('webgl-unsupported', '当前环境不支持 WebGL');
  }
  const prevHeight = el.offsetHeight;
  const mt = await loadMaptalks();
  const map = new mt.Map(el, buildMapOptions(options));
  // 自动创建底图瓦片层
  if (blConfig) await buildBaseLayers(map, mt, blConfig);
  if (el.offsetHeight === 0 && prevHeight > 0) {
    el.style.height = prevHeight + 'px';
  }
  return map;
}

/**
 * 按 blConfig 构建底图并 setBaseLayer（单底图 → TileLayer；多候选 → GroupTileLayer）。
 *
 * @description 单底图路径：单个 TileLayer 设为底图（getBaseLayer()/Overview 鹰眼/LayerSwitcher 可识别）；
 * 多底图候选路径：逐元素建 TileLayer（未显式 visible 时第一项可见、其余隐藏）打包 GroupTileLayer。
 * @param {MaptalksMap} map - 目标地图
 * @param {MaptalksGLNamespace} mt - 已加载的 maptalks-gl 命名空间
 * @param {Array<{ source: MaptalksSource | null; id: string; extra: Record<string, unknown> }>} blConfig - 底图项列表
 * @returns {Promise<void>}
 *
 * @example
 * await buildBaseLayers(map, mt, blConfig);
 */
async function buildBaseLayers(
  map: MaptalksMap,
  mt: MaptalksGLNamespace,
  blConfig: Array<{ source: MaptalksSource | null; id: string; extra: Record<string, unknown> }>,
): Promise<void> {
  if (blConfig.length === 1) {
    const item = blConfig[0];
    if (item) {
      const tileOpts = await buildTileLayerOptions(item);
      const tileLayer = new mt.TileLayer(item.id, tileOpts as Record<string, unknown>);
      map.setBaseLayer(tileLayer as unknown as Parameters<typeof map.setBaseLayer>[0]);
    }
    return;
  }
  // 多底图候选：打包 GroupTileLayer（第一项可见、其余隐藏，供 LayerSwitcher 切换）
  const GtlCtor = mt.GroupTileLayer;
  if (typeof GtlCtor !== 'function')
    throw new MaptalksError('layer-failed', '当前 maptalks-gl 未导出 GroupTileLayer');
  const layers: MaptalksLayer[] = [];
  for (let i = 0; i < blConfig.length; i++) {
    const item = blConfig[i];
    if (!item) continue;
    const tileOpts = await buildTileLayerOptions(item);
    if (i > 0 && tileOpts.visible === undefined) tileOpts.visible = false;
    layers.push(new mt.TileLayer(item.id, tileOpts) as unknown as MaptalksLayer);
  }
  const gtl = new GtlCtor('base', layers);
  map.setBaseLayer(gtl as unknown as Parameters<typeof map.setBaseLayer>[0]);
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
  blConfig: Array<{ source: MaptalksSource | null; id: string; extra: Record<string, unknown> }> | undefined,
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
 * 解析 baseLayer 选项为 blConfig 列表（供 createMap 自动创建底图瓦片层）。
 *
 * @description 支持字符串（命名源）/ 内联源对象 / 候选数组（自动打包 GroupTileLayer）。
 * 元素含 urlTemplate/url 内联时跳过命名源解析；原生 Layer 实例（'addTo' in bl）不在此路径（直接由构造器处理）。
 * @param {UseMaptalksOpts['baseLayer'] | undefined} baseLayer - 字符串/对象/候选数组/原生Layer
 * @param {Record<string, MaptalksSource> | undefined} sources - runtimeConfig 中的命名数据源表
 * @returns {Array<{ source: MaptalksSource | null; id: string; extra: Record<string, unknown> }> | undefined} 底图项列表
 *
 * @example
 * const blConfigs = resolveBaseLayerConfig('osm', sources);
 * const multi = resolveBaseLayerConfig([{ options: { urlTemplate: '...' } }, { options: { urlTemplate: '...' } }], sources);
 */
function resolveBaseLayerConfig(
  baseLayer: UseMaptalksOpts['baseLayer'],
  sources: Record<string, MaptalksSource> | undefined,
): Array<{ source: MaptalksSource | null; id: string; extra: Record<string, unknown> }> | undefined {
  if (!baseLayer) return undefined;
  const isArray = Array.isArray(baseLayer);
  if (!isArray && typeof baseLayer !== 'string' && (typeof baseLayer !== 'object' || !baseLayer || 'addTo' in baseLayer)) return undefined;
  const list = isArray ? baseLayer : [baseLayer];
  const items = list
    .map((bl, i) => {
      if (typeof bl === 'string') {
        const blSource = sources?.[bl];
        if (!blSource) return null;
        return { source: blSource, id: `base-${bl}${isArray ? `-${i}` : ''}`, extra: {} };
      }
      const blObj = bl as { id?: string | number; source?: string; urlTemplate?: string; subdomains?: string[]; attribution?: string; options?: Record<string, unknown> };
      const extra: Record<string, unknown> = {};
      if (blObj.urlTemplate) extra.urlTemplate = blObj.urlTemplate;
      if (blObj.subdomains) extra.subdomains = blObj.subdomains;
      if (blObj.attribution) extra.attribution = blObj.attribution;
      if (blObj.options) Object.assign(extra, blObj.options);
      // 内联 urlTemplate/url 时跳过命名源解析（不依赖 sources 表存在对应源）
      if (extra.urlTemplate || extra.url) {
        return { source: null, id: blObj.id ?? `base-${i}`, extra };
      }
      const srcName = blObj.source ?? 'osm';
      const blSource = sources?.[srcName];
      if (!blSource) return null;
      return { source: blSource, id: blObj.id ?? `base-${srcName}${isArray ? `-${i}` : ''}`, extra };
    })
    .filter((x): x is { source: MaptalksSource | null; id: string; extra: Record<string, unknown> } => x !== null);
  return items.length > 0 ? items : undefined;
}

/** 合并命名源与内联 extra 为 TileLayer 构造选项（resolveSource 异步解析命名源） */
async function buildTileLayerOptions(
  item: { source: MaptalksSource | null; extra: Record<string, unknown> },
): Promise<Record<string, unknown>> {
  const tileOpts: Record<string, unknown> = { ...item.extra };
  if (item.source) {
    const resolved = await resolveSource(item.source);
    if (resolved?.urlTemplate) tileOpts.urlTemplate = resolved.urlTemplate;
    if (resolved?.url) tileOpts.url = resolved.url;
    if (resolved?.options) Object.assign(tileOpts, resolved.options);
  }
  return tileOpts;
}
