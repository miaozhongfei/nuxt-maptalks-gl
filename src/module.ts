import {
  addComponentsDir,
  addImportsDir,
  addServerImportsDir,
  addTypeTemplate,
  addVitePlugin,
  createResolver,
  defineNuxtModule,
  useLogger,
} from '@nuxt/kit';
import type { Nuxt } from '@nuxt/schema';
import { defu } from 'defu';

import pkg from '../package.json';
import { MaptalksError } from './runtime/core/errors';
import { defaultOptions } from './runtime/options';
import type { ModuleOptions, ResolvedModuleOptions } from './runtime/types';
import { createLogger } from './runtime/utils/logger';
import { createValidateNestingPlugin } from './vite-plugins/validate-component-nesting';

export type { ModuleOptions };
export type {
  ResolvedModuleOptions,
  MaptalksSource,
  PublicSource,
  SignedSource,
  ResolvedSource,
  MaptalksMap,
  MaptalksLayer,
  MaptalksGeometry,
  MaptalksGLNamespace,
  MaptalksCoordinate,
  MaptalksViewLike,
  MaptalksDefaults,
  MaptalksErrorCode,
} from './runtime/types';
export { MaptalksError };

/** maptalks-gl 自带样式表的产物路径（确切路径以安装版本 dist 为准，见 spec §14） */
const MAPTALKS_CSS = 'maptalks-gl/dist/maptalks-gl.css';

/**
 * 生成 runtimeConfig 类型增强模板内容。
 *
 * @description 为 `runtimeConfig.public.maptalksGl` 提供 IDE 类型提示，避免每个项目手写增强声明。
 * @returns {string} d.ts 文件内容
 *
 * @example
 * addTypeTemplate({ filename: 'types/nuxt-maptalks-gl.d.ts', getContents: () => runtimeConfigTypes() });
 */
function runtimeConfigTypes(): string {
  return `import type { ResolvedModuleOptions } from '${pkg.name}'

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    maptalksGl: ResolvedModuleOptions
  }
}

export {}
`;
}

/**
 * 把 maptalks-gl 加入 Vite optimizeDeps 预构建列表（幂等）。
 *
 * @description maptalks-gl 体积大且含 CJS/ESM 互操作，预构建可避免解析报错。确切策略以实测为准（见 spec §14）。
 * @param {Nuxt} nuxt - Nuxt 实例
 * @returns {void}
 *
 * @example
 * tuneOptimizeDeps(nuxt);
 */
function tuneOptimizeDeps(nuxt: Nuxt): void {
  nuxt.options.vite.optimizeDeps ??= {};
  nuxt.options.vite.optimizeDeps.include ??= [];
  if (!nuxt.options.vite.optimizeDeps.include.includes('maptalks-gl')) {
    nuxt.options.vite.optimizeDeps.include.push('maptalks-gl');
  }
}

/**
 * Nuxt maptalks-gl 模块入口。
 *
 * @description 兜底 SSR / 动态加载 / CSS / 生命周期，自动导入 useMaptalks* 全套 composable 与预设，
 * 注册可选的服务端签名助手。用户通过 `nuxt.config.ts` 的 `maptalksGl` 配置项定制。
 */
export default defineNuxtModule<ModuleOptions>().with({
  meta: {
    name: pkg.name,
    version: pkg.version,
    configKey: 'maptalksGl',
    compatibility: {
      nuxt: pkg.devDependencies.nuxt || '^4.4.0',
    },
    moduleDependencies: {},
  },
  defaults: defaultOptions,
  setup(_options, _nuxt) {
    const logger = useLogger(pkg.name);
    logger.debug(`初始化模块 ${pkg.name}`);
    if (!_options.enable) {
      logger.debug(`${pkg.name} 模块被禁用，跳过设置。`);
      return;
    }
    const resolver = createResolver(import.meta.url);
    // 合并默认值后注入 runtimeConfig（供 runtime 端读取 sources / defaults / spatialReference）
    const resolved = defu(_options, defaultOptions) as ResolvedModuleOptions;
    _nuxt.options.runtimeConfig.public.maptalksGl = resolved;

    // 注入 maptalks-gl 样式（纯样式，客户端渲染）
    if (!_nuxt.options.css.includes(MAPTALKS_CSS)) {
      _nuxt.options.css.push(MAPTALKS_CSS);
    }

    // 仅转译本模块 runtime（支持现代 ES 语法）。
    // 注意：maptalks-gl 不加入 transpile——它需要由 Vite optimizeDeps 预构建以正确处理 CJS 依赖
    // （如 fast-deep-equal）的 ESM 互操作；若同时 transpile，Nuxt 会将其从 optimizeDeps 排除导致 dev 报错。
    _nuxt.options.build.transpile.push(resolver.resolve('./runtime'));

    // 调优 Vite 预构建 & 校验组件嵌套
    tuneOptimizeDeps(_nuxt);
    addVitePlugin(createValidateNestingPlugin());

    // 自动导入 composables 与预设（addImportsDir 仅扫描顶层目录，故显式传入 presets 子目录）
    addImportsDir([
      resolver.resolve('./runtime/composables'),
      resolver.resolve('./runtime/composables/presets'),
    ]);
    // 自动导入声明式组件（MaptalksMap / MaptalksTileLayer 等）
    addComponentsDir({ path: resolver.resolve('./runtime/components') });

    // 自动导入服务端签名助手（用户在 server route 中无需手动 import）
    addServerImportsDir(resolver.resolve('./runtime/server/utils'));

    // 增强 runtimeConfig 类型
    addTypeTemplate({
      filename: 'types/nuxt-maptalks-gl.d.ts',
      getContents: runtimeConfigTypes,
    });

    // 确保 TypeScript 能解析本模块的类型引用
    _nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: pkg.name });
    });
  },
  /** 模块首次安装到项目时触发 */
  onInstall(_nuxt: Nuxt) {
    const logger = createLogger(pkg.name);
    logger.info(`首次为 ${pkg.name} 进行设置！`);
  },
  /** 模块版本升级时触发（使用 semver 比较，每版本只触发一次） */
  onUpgrade(_nuxt: Nuxt, _options: ModuleOptions, _previousVersion: string) {
    const logger = createLogger(pkg.name);
    logger.info(`升级 ${pkg.name} 从 ${_previousVersion} 到 ${pkg.version}`);
  },
});
