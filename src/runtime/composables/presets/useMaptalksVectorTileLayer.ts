import { computed, toValue } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';

import { MaptalksError } from '../../core/errors';
import { resolvePresetSource } from '../../core/preset-source';
import type {
  MaptalksError as MaptalksErrorType,
  MaptalksMap,
  ResolvedSource,
  UseMaptalksLayerReturn,
  UseMaptalksVectorTileLayerOpts,
} from '../../types';
import { useMaptalksLayer } from '../useMaptalksLayer';

/** 自动生成 id 的计数器 */
let vtSeq = 0;

/**
 * 把解析后的源与用户选项合并为 VectorTileLayer 构造选项。
 *
 * @param {ResolvedSource | null} resolved - 解析后的数据源
 * @param {Record<string, unknown> | undefined} extra - 用户额外选项（含 style，优先级最高）
 * @returns {Record<string, unknown>} VectorTileLayer 构造选项
 *
 * @example
 * buildVectorOptions(resolved, { style: { /* ... *\/ } });
 */
function buildVectorOptions(
  resolved: ResolvedSource | null,
  extra: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const base: Record<string, unknown> = {};
  if (resolved?.urlTemplate) base.urlTemplate = resolved.urlTemplate;
  if (resolved?.url) base.url = resolved.url;
  return { ...base, ...resolved?.options, ...extra };
}

/**
 * 预设：矢量瓦片图层（VectorTileLayer），= useMaptalksLayer + 数据源解析 + 配置注入。
 *
 * @description 与 TileLayer 预设同构，面向矢量切片服务（pbf/mvt），可通过 `options.style` 传入样式。
 * 传入 `source` 时等待源解析完成再创建；否则按 `options` 直接创建。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {UseMaptalksPresetOpts} [opts] - 数据源 / id / 额外选项（含 style）/ 自动销毁
 * @returns {UseMaptalksLayerReturn & { error: Ref<MaptalksErrorType | null> }} 图层句柄与源解析错误
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { layer } = useMaptalksVectorTileLayer(map, {
 *   source: 'baseVT',
 *   options: { style: { background: { color: '#fff' } } },
 * });
 */
export function useMaptalksVectorTileLayer(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksVectorTileLayerOpts = {},
): UseMaptalksLayerReturn & { error: Ref<MaptalksErrorType | null> } {
  const { resolved, error } = resolvePresetSource(opts.source);
  vtSeq += 1;
  const id = opts.id ?? `maptalks-vt-${vtSeq}`;
  const enabled = opts.source ? computed(() => resolved.value !== null) : true;
  const layerOptions = computed(() => buildVectorOptions(resolved.value, toValue(opts.options)));

  const handle = useMaptalksLayer(
    map,
    (mt) => {
      const Ctor = mt.VectorTileLayer;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('layer-failed', '当前 maptalks-gl 未导出 VectorTileLayer');
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
