import { onMounted, ref, shallowRef } from 'vue';
import type { Ref, ShallowRef } from 'vue';

import { useRuntimeConfig } from '#imports';

import type { MaptalksSource, ResolvedModuleOptions, ResolvedSource } from '../types';
import { MaptalksError, toMaptalksError } from './errors';
import { resolveSource } from './resolve-source';

/** resolvePresetSource 返回的解析状态 */
export interface PresetSourceState {
  /** 解析后的数据源（无源或未解析时为 null） */
  resolved: ShallowRef<ResolvedSource | null>;
  /** 解析错误，正常时为 null */
  error: Ref<MaptalksError | null>;
}

/**
 * 解析预设的数据源输入（命名源 / 内联源 / 无源）为响应式状态。
 *
 * @description 供各 use*Layer 预设复用：`source` 为字符串时按 `runtimeConfig.public.maptalksGl.sources`
 * 查表，为对象时直接使用，为 undefined 时不解析（用于不依赖数据源的图层）。客户端挂载时自动解析一次。
 * @param {string | MaptalksSource | undefined} source - 源名 / 内联源 / 无源
 * @returns {PresetSourceState} `{ resolved, error }`
 *
 * @example
 * const { resolved, error } = resolvePresetSource('base');
 */
export function resolvePresetSource(
  source: string | MaptalksSource | undefined,
): PresetSourceState {
  const resolved = shallowRef<ResolvedSource | null>(null);
  const error = ref<MaptalksError | null>(null);

  const publicConfig = useRuntimeConfig().public as unknown as {
    maptalksGl?: ResolvedModuleOptions;
  };

  /** 执行解析（按 source 形态选择来源） */
  async function run(): Promise<void> {
    if (!source) return;
    const raw = typeof source === 'string' ? publicConfig.maptalksGl?.sources?.[source] : source;
    if (!raw) {
      error.value = new MaptalksError(
        'source-resolve-failed',
        `未找到名为 '${String(source)}' 的数据源配置`,
      );
      return;
    }
    try {
      resolved.value = await resolveSource(raw);
    } catch (cause) {
      error.value = toMaptalksError(cause, 'source-resolve-failed', '数据源解析失败');
    }
  }

  if (import.meta.client) {
    onMounted(() => {
      void run();
    });
  }

  return { resolved, error };
}
