import type { MaptalksSource, ResolvedSource } from '../types';
import { MaptalksError } from './errors';

/** 签名 server route 返回体的最小结构 */
interface SignResponse {
  /** 签名后的瓦片 URL 模板 */
  urlTemplate?: string;
  /** 签名后的普通 URL */
  url?: string;
  /** 需要附加的请求头 */
  headers?: Record<string, string>;
  /** 透传给图层的额外选项 */
  options?: Record<string, unknown>;
}

/** 签名源解析的最大尝试次数（首次 + 重试） */
const MAX_SIGN_ATTEMPTS = 3;

/**
 * 延迟指定毫秒（用于重试退避）。
 *
 * @param {number} ms - 毫秒数
 * @returns {Promise<void>} 到时 resolve 的 Promise
 *
 * @example
 * await delay(200);
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 调用项目自有的签名 server route 换取签名后的源（带指数退避重试）。
 *
 * @description 以递归实现重试，避免在循环中 await。任一次成功即返回；全部失败抛出 MaptalksError。
 * @param {string} endpoint - 签名 server route 路径
 * @param {string} type - 业务类型（透传到结果）
 * @param {number} attempt - 当前尝试序号（从 1 开始）
 * @returns {Promise<ResolvedSource>} 解析后的数据源
 *
 * @example
 * const resolved = await fetchSigned('/api/maptalks/sign', 'tile', 1);
 */
async function fetchSigned(
  endpoint: string,
  type: string,
  attempt: number,
): Promise<ResolvedSource> {
  try {
    const res = await fetch(endpoint, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`签名接口返回 ${res.status}`);
    const body = (await res.json()) as SignResponse;
    return {
      type,
      urlTemplate: body.urlTemplate,
      url: body.url,
      headers: body.headers,
      options: body.options,
    };
  } catch (cause) {
    // 已达最大尝试次数 → 上报失败
    if (attempt >= MAX_SIGN_ATTEMPTS) {
      throw new MaptalksError('source-resolve-failed', `签名源解析失败：${endpoint}`, { cause });
    }
    // 指数退避后递归重试（避免循环中 await）
    await delay(2 ** (attempt - 1) * 200);
    return fetchSigned(endpoint, type, attempt + 1);
  }
}

/**
 * 解析数据源为可直接注入图层的 ResolvedSource。
 *
 * @description 按 `kind` 选择路径：`public` 直接透传 URL；`signed` 调用项目自有 server route
 * 换取签名 URL/请求头（密钥不进前端）。签名失败带指数退避重试，最终失败抛出 MaptalksError。
 * @param {MaptalksSource} source - 待解析的数据源（public 或 signed）
 * @returns {Promise<ResolvedSource>} 解析后的数据源
 *
 * @example
 * // 公开源
 * const a = await resolveSource({ kind: 'public', type: 'tile', urlTemplate });
 * // 签名源
 * const b = await resolveSource({ kind: 'signed', type: 'tile', endpoint: '/api/maptalks/sign' });
 */
export function resolveSource(source: MaptalksSource): Promise<ResolvedSource> {
  if (source.kind === 'public') {
    return Promise.resolve({
      type: source.type,
      urlTemplate: source.urlTemplate,
      url: source.url,
      options: source.options,
    });
  }
  // signed
  return fetchSigned(source.endpoint, source.type, 1).then((resolved) => ({
    ...resolved,
    options: { ...source.options, ...resolved.options },
  }));
}
