import { defineEventHandler, getQuery, readBody } from 'h3';
import type { EventHandler, H3Event } from 'h3';

/**
 * 签名处理上下文（传给项目自有 signer）。
 *
 * @description 封装请求的 query / body / 原始 event，供项目实现签名逻辑时读取参数。
 *
 * @example
 * const ctx: MaptalksSignContext = { query: { z: '1' }, body: undefined, event };
 */
export interface MaptalksSignContext {
  /** URL 查询参数 */
  query: Record<string, string>;
  /** 请求体（非 GET 时存在） */
  body: unknown;
  /** 原始 h3 event（逃生舱口，可读取 headers/cookies 等） */
  event: H3Event;
}

/**
 * 签名结果（返回给前端 resolver）。
 *
 * @description 与 ResolvedSource 对齐的子集：最终 URL / 请求头 / 额外选项。密钥不应出现在结果中。
 *
 * @example
 * const r: MaptalksSignResult = { urlTemplate: 'https://.../{z}/{x}/{y}.png?sign=...' };
 */
export interface MaptalksSignResult {
  /** 签名后的瓦片 URL 模板 */
  urlTemplate?: string;
  /** 签名后的普通 URL */
  url?: string;
  /** 需要附加的请求头 */
  headers?: Record<string, string>;
  /** 透传给图层的额外选项 */
  options?: Record<string, unknown>;
}

/** 项目自有的签名实现函数签名 */
export type MaptalksSigner = (
  context: MaptalksSignContext,
) => MaptalksSignResult | Promise<MaptalksSignResult>;

/**
 * 服务端助手：把项目自有的签名实现包装为 h3 事件处理器。
 *
 * @description 简化各项目实现签名 server route——读取 query / body 并交给 `signer`，其返回值作为
 * JSON 响应。签名加密逻辑由项目自有（module 不实现），密钥永不进入前端 bundle。
 * 经 `addServerImportsDir` 自动导入，无需手动 import。
 * @param {MaptalksSigner} signer - 项目自有的签名实现，接收上下文返回签名结果
 * @returns {EventHandler} 可直接 `export default` 的 h3 事件处理器
 *
 * @example
 * // server/api/maptalks/sign.ts
 * export default defineMaptalksSignHandler(async ({ query }) => {
 *   const sign = await mySignService(query.tile as string); // 项目自有签名服务
 *   return { urlTemplate: `https://tiles.example.com/{z}/{x}/{y}.png?sign=${sign}` };
 * });
 */
export function defineMaptalksSignHandler(signer: MaptalksSigner): EventHandler {
  return defineEventHandler(async (event) => {
    const query = getQuery(event) as Record<string, string>;
    // GET 请求无 body，readBody 失败时回退 null
    const body = await readBody(event).catch(() => null);
    return signer({ query, body, event });
  });
}
