import type { ResolvedModuleOptions } from './types';

/**
 * 模块默认配置。
 *
 * @description module.ts（安装期）与 runtime 端共享同一份默认值，避免重复定义与漂移。
 * 安装期会与用户在 `nuxt.config` 的 `maptalksGl` 配置深合并后注入 `runtimeConfig.public.maptalksGl`。
 *
 * @example
 * import { defaultOptions } from './options';
 * const merged = defu(userOptions, defaultOptions);
 */
export const defaultOptions: ResolvedModuleOptions = {
  enable: true,
  logLevel: 3,
  sources: {},
  defaults: {},
  spatialReference: {},
};
