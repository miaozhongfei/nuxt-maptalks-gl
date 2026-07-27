import { computed } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';

import { MaptalksError } from '../../core/errors';
import { resolvePresetSource } from '../../core/preset-source';
import type {
  MaptalksError as MaptalksErrorType,
  MaptalksMap,
  MaptalksNativeTileLayerOptions,
  ResolvedSource,
  UseMaptalksLayerReturn,
  UseMaptalksPresetOptions,
} from '../../types';
import { useMaptalksLayer } from '../useMaptalksLayer';

/** 自动生成 id 的计数器 */
let tileSeq = 0;

/**
 * 把解析后的源与用户选项合并为 TileLayer 构造选项。
 *
 * @param {ResolvedSource | null} resolved - 解析后的数据源
 * @param {Record<string, unknown> | undefined} extra - 用户额外选项（优先级最高）
 * @returns {Record<string, unknown>} TileLayer 构造选项
 *
 * @example
 * buildTileOptions(resolved, { opacity: 0.8 });
 */
function buildTileOptions(
  resolved: ResolvedSource | null,
  extra: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const base: Record<string, unknown> = {};
  if (resolved?.urlTemplate) base.urlTemplate = resolved.urlTemplate;
  if (resolved?.url) base.url = resolved.url;
  return { ...base, ...resolved?.options, ...extra };
}

/**
 * 预设：栅格瓦片图层（TileLayer），= useMaptalksLayer + 数据源解析 + 配置注入。
 *
 * @description 接受命名源（按配置解析）或内联源 / 直接选项（逃生舱口）。当传入 `source` 时，
 * 图层创建会等待源解析完成；否则按 `options` 直接创建。其余生命周期复用 useMaptalksLayer。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {UseMaptalksPresetOptions} [opts] - 数据源 / id / 额外选项 / 自动销毁
 * @returns {UseMaptalksLayerReturn & { error: Ref<MaptalksErrorType | null> }} 图层句柄与源解析错误
 *
 * @example
 * const { map } = useMaptalks(el);
 * // 命名源（来自 nuxt.config 的 maptalksGl.sources.base）
 * const { layer } = useMaptalksTileLayer(map, { source: 'base' });
 * // 或直接给 urlTemplate（逃生舱口）
 * useMaptalksTileLayer(map, { options: { urlTemplate: 'https://.../{z}/{x}/{y}.png' } });
 */
export function useMaptalksTileLayer(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksPresetOptions & { options?: Partial<MaptalksNativeTileLayerOptions> } = {},
): UseMaptalksLayerReturn & { error: Ref<MaptalksErrorType | null> } {
  const { resolved, error } = resolvePresetSource(opts.source);
  tileSeq += 1;
  const id = opts.id ?? `maptalks-tile-${tileSeq}`;
  // 传入命名/内联源时，等待解析完成再创建；否则立即按选项创建
  const enabled = opts.source ? computed(() => resolved.value !== null) : true;
  const layerOptions = computed(() => buildTileOptions(resolved.value, opts.options));

  const handle = useMaptalksLayer(
    map,
    (mt) => {
      const Ctor = mt.TileLayer;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('layer-failed', '当前 maptalks-gl 未导出 TileLayer');
      }
      return new Ctor(id, layerOptions.value);
    },
    { options: layerOptions, enabled, autoDispose: opts.autoDispose },
  );

  return {
    ...handle,
    error,
    show: () => handle.layer.value?.show?.(),
    hide: () => handle.layer.value?.hide?.(),
  };
}
