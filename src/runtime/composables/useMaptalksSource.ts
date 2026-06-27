import { onMounted, ref, shallowRef } from 'vue';

import { useRuntimeConfig } from '#imports';

import { MaptalksError, toMaptalksError } from '../core/errors';
import { resolveSource } from '../core/resolve-source';
import type { ResolvedModuleOptions, ResolvedSource, UseMaptalksSourceReturn } from '../types';

/**
 * 按名解析 `runtimeConfig.public.maptalksGl.sources` 中的命名数据源。
 *
 * @description 从模块配置读取名为 `name` 的源，按 `kind`（public/signed）解析为可注入图层的
 * ResolvedSource。客户端挂载时自动解析一次；也可命令式 `resolve()` 重解析。解析失败写入 `error`。
 * @param {string} name - 数据源名（对应 `maptalksGl.sources` 的 key）
 * @returns {UseMaptalksSourceReturn} `{ source, pending, error, resolve }`
 *
 * @example
 * // nuxt.config: maptalksGl.sources.secure = { kind: 'signed', type: 'tile', endpoint: '/api/maptalks/sign' }
 * const { source, pending, error } = useMaptalksSource('secure');
 * watchEffect(() => { if (source.value) console.warn('resolved url', source.value.urlTemplate); });
 */
export function useMaptalksSource(name: string): UseMaptalksSourceReturn {
  const source = shallowRef<ResolvedSource | null>(null);
  const pending = ref(false);
  const error = ref<MaptalksError | null>(null);

  // 读取模块运行时配置（以最小断言访问，避免依赖类型增强模板）
  const publicConfig = useRuntimeConfig().public as unknown as {
    maptalksGl?: ResolvedModuleOptions;
  };
  const config = publicConfig.maptalksGl;

  /**
   * 触发（重新）解析数据源。
   *
   * @returns {Promise<void>}
   *
   * @example
   * await resolve();
   */
  async function resolve(): Promise<void> {
    const raw = config?.sources?.[name];
    if (!raw) {
      error.value = new MaptalksError('source-resolve-failed', `未找到名为 '${name}' 的数据源配置`);
      return;
    }
    pending.value = true;
    error.value = null;
    try {
      source.value = await resolveSource(raw);
    } catch (cause) {
      error.value = toMaptalksError(cause, 'source-resolve-failed', `数据源 '${name}' 解析失败`);
    } finally {
      pending.value = false;
    }
  }

  // 客户端挂载后自动解析（签名源涉及网络，服务端不触发）
  if (import.meta.client) {
    onMounted(() => {
      void resolve();
    });
  }

  return { source, pending, error, resolve };
}
