/**
 * 数据源、默认项、模块配置相关类型。
 */

import type { MaptalksError, MaptalksErrorCode } from '../core/errors';

export type { MaptalksError, MaptalksErrorCode };

/**
 * 数据源类型：公开源。
 *
 * @description 直接携带 URL（可使用带域名白名单的公开 key），无需服务端换取。
 *
 * @example
 * const s: PublicSource = { kind: 'public', type: 'vt', urlTemplate: 'https://.../{z}/{x}/{y}.pbf' };
 */
export interface PublicSource {
  /** 源类别标识 */
  kind: 'public';
  /** 业务类型，如 'tile' / 'vt' / 'gltf' */
  type: string;
  /** 瓦片 URL 模板（含 {z}/{x}/{y}） */
  urlTemplate?: string;
  /** 普通 URL（非瓦片场景） */
  url?: string;
  /** 透传给图层的额外选项 */
  options?: Record<string, unknown>;
}

/**
 * 数据源类型：签名源。
 *
 * @description 由客户端 resolver 调用项目自有 server route 换取签名 URL / 请求头，密钥不进前端。
 *
 * @example
 * const s: SignedSource = { kind: 'signed', type: 'tile', endpoint: '/api/maptalks/sign' };
 */
export interface SignedSource {
  /** 源类别标识 */
  kind: 'signed';
  /** 业务类型，如 'tile' / 'vt' / 'gltf' */
  type: string;
  /** 项目自有的签名 server route 路径 */
  endpoint: string;
  /** 透传给图层的额外选项 */
  options?: Record<string, unknown>;
}

/**
 * 数据源联合类型。
 *
 * @description 公开源与签名源二选一，预设按 `kind` 自动选择解析路径。
 *
 * @example
 * const sources: Record<string, MaptalksSource> = { base: { kind: 'public', type: 'tile', urlTemplate } };
 */
export type MaptalksSource = PublicSource | SignedSource;

/**
 * 解析后的数据源（可直接注入图层）。
 *
 * @description `resolveSource` 的输出，统一携带最终 URL / 请求头 / 额外选项。
 *
 * @example
 * const resolved: ResolvedSource = { type: 'tile', urlTemplate: 'https://.../{z}/{x}/{y}.png' };
 */
export interface ResolvedSource {
  /** 业务类型 */
  type: string;
  /** 解析后的瓦片 URL 模板 */
  urlTemplate?: string;
  /** 解析后的普通 URL */
  url?: string;
  /** 签名场景返回的请求头 */
  headers?: Record<string, string>;
  /** 透传给图层的额外选项 */
  options?: Record<string, unknown>;
}

/**
 * 模块默认项（相机 / 光照 / 后处理）。
 *
 * @description 预设从这里读取默认配置，字段形状由 maptalks 决定，统一以宽松对象建模。
 *
 * @example
 * const d: MaptalksDefaults = { camera: { center: [113.27, 23.13], zoom: 10 } };
 */
export interface MaptalksDefaults {
  /** 默认相机参数 */
  camera?: Record<string, unknown>;
  /** 默认光照参数（GroupGLLayer） */
  lighting?: Record<string, unknown>;
  /** 默认后处理参数（GroupGLLayer） */
  postProcess?: Record<string, unknown>;
}

/**
 * 模块配置项（用户可传，字段均可选）。
 *
 * @description 写入 `nuxt.config` 的 `maptalksGl` 配置块，安装期合并默认值后注入 `runtimeConfig.public.maptalksGl`。
 *
 * @example
 * export default defineNuxtConfig({
 *   modules: ['@lacqjs/nuxt-maptalks-gl'],
 *   maptalksGl: { sources: { base: { kind: 'public', type: 'tile', urlTemplate } } },
 * });
 */
export interface ModuleOptions {
  /** 是否启用模块，默认 `true` */
  enable?: boolean;
  /** 日志级别，0=静默 1=错误 2=警告 3=信息 4=调试 5=详细，默认 `3` */
  logLevel?: number | string;
  /** 命名数据源映射（key 为源名，供预设按名解析） */
  sources?: Record<string, MaptalksSource>;
  /** 默认相机 / 光照 / 后处理 */
  defaults?: MaptalksDefaults;
  /** 空间参考系配置（透传给 maptalks Map） */
  spatialReference?: Record<string, unknown>;
}

/**
 * 模块配置项（内部解析后，字段均必填）。
 *
 * @description 运行时从 `runtimeConfig.public.maptalksGl` 读取的最终配置。
 *
 * @example
 * const cfg = useRuntimeConfig().public.maptalksGl as ResolvedModuleOptions;
 */
export interface ResolvedModuleOptions {
  /** 是否启用模块 */
  enable: boolean;
  /** 日志级别 */
  logLevel: number | string;
  /** 命名数据源映射 */
  sources: Record<string, MaptalksSource>;
  /** 默认相机 / 光照 / 后处理 */
  defaults: MaptalksDefaults;
  /** 空间参考系配置 */
  spatialReference: Record<string, unknown>;
}
