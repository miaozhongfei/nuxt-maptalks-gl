import { computed } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { useRuntimeConfig } from '#imports';

import { MaptalksError } from '../../core/errors';
import type {
  MaptalksDefaults,
  MaptalksLayer,
  MaptalksMap,
  MaptalksNativeGroupGLLayerOptions,
  ResolvedModuleOptions,
  UseMaptalksLayerReturn,
} from '../../types';
import { useMaptalksLayer } from '../useMaptalksLayer';

/** useMaptalksGroupGLLayer 的可选项 */
export interface UseMaptalksGroupGLLayerOptions {
  /** 图层 id，缺省自动生成 */
  id?: string;
  /** 承载的子 GL 图层（已创建实例） */
  layers?: MaptalksLayer[];
  /** 透传给 GroupGLLayer 构造器的额外选项（优先级高于默认 sceneConfig） */
  options?: Record<string, unknown>;
  /** 作用域销毁时是否自动移除图层，默认 `true` */
  autoDispose?: boolean;
}

/** 自动生成 id 的计数器 */
let groupSeq = 0;

/**
 * 由模块默认项构建 GroupGLLayer 的 sceneConfig（光照 / 后处理）。
 *
 * @description 把 `runtimeConfig.public.maptalksGl.defaults` 的 lighting / postProcess 注入 sceneConfig。
 * 注意：sceneConfig 的确切字段随 maptalks-gl 版本而定（见 spec §14），这里提供可用脚手架默认。
 * @param {MaptalksDefaults} defaults - 模块默认项
 * @returns {Record<string, unknown>} sceneConfig 对象（可能为空）
 *
 * @example
 * const sceneConfig = buildSceneConfig({ postProcess: { enable: true } });
 */
function buildSceneConfig(defaults: MaptalksDefaults): Record<string, unknown> {
  const sceneConfig: Record<string, unknown> = {};
  if (defaults.lighting) sceneConfig.light = defaults.lighting;
  if (defaults.postProcess) sceneConfig.postProcess = defaults.postProcess;
  return sceneConfig;
}

/**
 * 预设：GroupGLLayer（承载 GL 图层并应用光照 / 后处理默认），= useMaptalksLayer + 配置注入。
 *
 * @description 从模块默认项读取 lighting / postProcess 组装 sceneConfig，与用户 `options` 合并后创建
 * GroupGLLayer。子图层经 `options.layers` 传入。不依赖数据源，地图就绪即创建。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {UseMaptalksGroupGLLayerOptions} [opts] - 子图层 / id / 额外选项 / 自动销毁
 * @returns {UseMaptalksLayerReturn} 图层句柄
 *
 * @example
 * const { map } = useMaptalks(el);
 * const vt = useMaptalksVectorTileLayer(map, { source: 'baseVT' });
 * const group = useMaptalksGroupGLLayer(map, { layers: vt.layer.value ? [vt.layer.value] : [] });
 */
export function useMaptalksGroupGLLayer(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksGroupGLLayerOptions & { options?: Partial<MaptalksNativeGroupGLLayerOptions> } = {},
): UseMaptalksLayerReturn {
  const publicConfig = useRuntimeConfig().public as unknown as {
    maptalksGl?: ResolvedModuleOptions;
  };
  const defaults = publicConfig.maptalksGl?.defaults ?? {};
  groupSeq += 1;
  const id = opts.id ?? `maptalks-group-${groupSeq}`;
  const childLayers = opts.layers ?? [];

  const groupOptions = computed<Record<string, unknown>>(() => {
    const sceneConfig = buildSceneConfig(defaults);
    const base: Record<string, unknown> = {};
    if (Object.keys(sceneConfig).length > 0) base.sceneConfig = sceneConfig;
    return { ...base, ...opts.options };
  });

  const handle = useMaptalksLayer(
    map,
    (mt) => {
      const Ctor = mt.GroupGLLayer;
      if (typeof Ctor !== 'function') {
        throw new MaptalksError('layer-failed', '当前 maptalks-gl 未导出 GroupGLLayer');
      }
      return new Ctor(id, childLayers, groupOptions.value);
    },
    { options: groupOptions, enabled: true, autoDispose: opts.autoDispose },
  );
  return {
    ...handle,
    show: () => handle.layer.value?.show?.(),
    hide: () => handle.layer.value?.hide?.(),
  };
}
