import { computed } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';

import { MaptalksError } from '../../core/errors';
import { resolvePresetSource } from '../../core/preset-source';
import type {
  MaptalksError as MaptalksErrorType,
  MaptalksMap,
  MaptalksNativeGLTFLayerOptions,
  ResolvedSource,
  UseMaptalksLayerReturn,
  UseMaptalksPresetOptions,
} from '../../types';
import { useMaptalksLayer } from '../useMaptalksLayer';

/** 自动生成 id 的计数器 */
let gltfSeq = 0;

/**
 * 把解析后的源与用户选项合并为 GLTFLayer 构造选项。
 *
 * @description GLTFLayer 本身是 GLTF 模型标记的容器，具体模型经返回图层的原生 API 添加（逃生舱口）。
 * 这里仅合并源 url 与额外选项。
 * @param {ResolvedSource | null} resolved - 解析后的数据源
 * @param {Record<string, unknown> | undefined} extra - 用户额外选项（优先级最高）
 * @returns {Record<string, unknown>} GLTFLayer 构造选项
 *
 * @example
 * buildGltfOptions(resolved, { zIndex: 10 });
 */
function buildGltfOptions(
  resolved: ResolvedSource | null,
  extra: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const base: Record<string, unknown> = {};
  if (resolved?.url) base.url = resolved.url;
  return { ...base, ...resolved?.options, ...extra };
}

/**
 * 预设：GLTFLayer（GLTF 三维模型图层），= useMaptalksLayer + 配置注入。
 *
 * @description 创建 GLTFLayer 容器图层；可选地经命名/内联源注入 url 与选项。具体 GLTF 模型标记
 * 通过返回的 `layer.value` 原生 API 添加。传入 `source` 时等待源解析完成再创建。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {UseMaptalksPresetOptions} [opts] - 数据源 / id / 额外选项 / 自动销毁
 * @returns {UseMaptalksLayerReturn & { error: Ref<MaptalksErrorType | null> }} 图层句柄与源解析错误
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { layer } = useMaptalksGLTFLayer(map, { id: 'models' });
 * // 之后用原生 API 添加模型：layer.value?.addGeometry?.(new mt.GLTFMarker(...));
 */
export function useMaptalksGLTFLayer(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksPresetOptions & { options?: Partial<MaptalksNativeGLTFLayerOptions> } = {},
): UseMaptalksLayerReturn & { error: Ref<MaptalksErrorType | null> } {
  const { resolved, error } = resolvePresetSource(opts.source);
  gltfSeq += 1;
  const id = opts.id ?? `maptalks-gltf-${gltfSeq}`;
  const enabled = opts.source ? computed(() => resolved.value !== null) : true;
  const layerOptions = computed(() => buildGltfOptions(resolved.value, opts.options));

  const handle = useMaptalksLayer(
    map,
    (mt) => {
      const Ctor = mt.GLTFLayer;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('layer-failed', '当前 maptalks-gl 未导出 GLTFLayer');
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
