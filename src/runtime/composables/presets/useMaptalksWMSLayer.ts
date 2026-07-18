import { computed } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';

import { MaptalksError } from '../../core/errors';
import { resolvePresetSource } from '../../core/preset-source';
import type {
  MaptalksError as MaptalksErrorType,
  MaptalksMap,
  MaptalksNativeWMSTileLayerOptions,
  ResolvedSource,
  UseMaptalksLayerReturn,
  UseMaptalksPresetOptions,
} from '../../types';
import { useMaptalksLayer } from '../useMaptalksLayer';

/** 自动生成 id 的计数器 */
let wmsSeq = 0;

/**
 * 把解析后的源与用户选项合并为 WMSLayer 构造选项。
 *
 * @description WMSLayer 以 `urlTemplate` 承载 WMS 服务基址（如 `https://server/geoserver/wms`），
 * maptalks 自行据其拼接瓦片请求。故 source 的 `urlTemplate` 优先；若仅有 `url`（WMS 服务地址常以
 * 普通 url 给出），映射为 `urlTemplate`。WMS 业务参数（layers/styles/format/transparent/version 等）
 * 经 `resolved.options` 与用户 `extra` 透传，`extra` 优先级最高。
 * @param {ResolvedSource | null} resolved - 解析后的数据源
 * @param {Record<string, unknown> | undefined} extra - 用户额外选项（优先级最高）
 * @returns {Record<string, unknown>} WMSLayer 构造选项
 *
 * @example
 * buildWMSOptions(resolved, { layers: 'topp:states', transparent: true });
 */
function buildWMSOptions(
  resolved: ResolvedSource | null,
  extra: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const base: Record<string, unknown> = {};
  // urlTemplate 优先；否则把普通 url 映射为 WMS 的服务基址 urlTemplate
  if (resolved?.urlTemplate) base.urlTemplate = resolved.urlTemplate;
  else if (resolved?.url) base.urlTemplate = resolved.url;
  return { ...base, ...resolved?.options, ...extra };
}

/**
 * 预设：WMS 图层（WMSLayer），= useMaptalksLayer + 数据源解析 + 配置注入。
 *
 * @description 与 useMaptalksTileLayer 同构：接受命名源（按配置解析）或内联源 / 直接选项（逃生舱口）。
 * 与 TileLayer 的差异是 WMS 以 `urlTemplate` 表示服务基址，故 source 的 `url` 会被映射为 `urlTemplate`；
 * WMS 业务参数（layers/styles/format/transparent/version/crs 等）经 `options` 透传。传入 `source`
 * 时图层创建等待源解析完成；否则按 `options` 直接创建。构造器缺失（WMSTileLayer/WMSLayer 均无）抛 `layer-failed`。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {UseMaptalksPresetOptions} [opts] - 数据源 / id / 额外选项 / 自动销毁
 * @returns {UseMaptalksLayerReturn & { error: Ref<MaptalksErrorType | null> }} 图层句柄与源解析错误
 *
 * @example
 * const { map } = useMaptalks(el);
 * // 内联 WMS 源：url 作为服务基址，options 给 WMS 业务参数
 * const { layer, error } = useMaptalksWMSLayer(map, {
 *   source: {
 *     kind: 'public',
 *     type: 'wms',
 *     url: 'https://geo.example.com/geoserver/wms',
 *     options: { layers: 'topp:states', format: 'image/png', transparent: true },
 *   },
 * });
 */
export function useMaptalksWMSLayer(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksPresetOptions & { options?: Partial<MaptalksNativeWMSTileLayerOptions> } = {},
): UseMaptalksLayerReturn & { error: Ref<MaptalksErrorType | null> } {
  const { resolved, error } = resolvePresetSource(opts.source);
  wmsSeq += 1;
  const id = opts.id ?? `maptalks-wms-${wmsSeq}`;
  // 传入命名/内联源时，等待解析完成再创建；否则立即按选项创建
  const enabled = opts.source ? computed(() => resolved.value !== null) : true;
  const layerOptions = computed(() => buildWMSOptions(resolved.value, opts.options));

  const handle = useMaptalksLayer(
    map,
    (mt) => {
      // maptalks-gl 实际导出名为 WMSTileLayer（继承 TileLayer）；保留 WMSLayer 兼容上游可能的别名导出
      const Ctor = mt.WMSLayer ?? mt.WMSTileLayer;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('layer-failed', '当前 maptalks-gl 未导出 WMSTileLayer/WMSLayer');
      }
      return new Ctor(id, layerOptions.value);
    },
    { options: layerOptions, enabled, autoDispose: opts.autoDispose },
  );

  return { ...handle, error };
}
