/**
 * MaptalksError 的错误码联合类型。
 *
 * @description 覆盖模块内统一上报的错误场景：WebGL 不支持、初始化失败、数据源解析失败、
 * worker 失败、图层创建失败。
 *
 * @example
 * if (error.value?.code === 'webgl-unsupported') showFallback();
 */
export type MaptalksErrorCode =
  | 'webgl-unsupported'
  | 'init-failed'
  | 'source-resolve-failed'
  | 'worker-failed'
  | 'layer-failed';

/**
 * 模块统一错误类型。
 *
 * @description 携带稳定的 `code` 以便调用方分支处理，并保留底层 `cause` 便于排查。
 * `useMaptalks` / `useMaptalksLayer` / `resolveSource` 等均以本类型上报错误。
 *
 * @example
 * try {
 *   // ...
 * } catch (cause) {
 *   throw new MaptalksError('init-failed', '地图初始化失败', { cause });
 * }
 */
export class MaptalksError extends Error {
  /** 稳定的错误码，用于调用方分支处理 */
  readonly code: MaptalksErrorCode;

  /**
   * 构造一个 MaptalksError。
   *
   * @description 设置错误码、消息与可选的底层原因，并修正原型链与 name 以便 instanceof 判定。
   * @param {MaptalksErrorCode} code - 稳定错误码
   * @param {string} message - 人类可读的错误信息
   * @param {{ cause?: unknown }} [options] - 可选项，cause 为底层错误
   * @returns {MaptalksError} 错误实例
   *
   * @example
   * throw new MaptalksError('source-resolve-failed', '签名源解析失败', { cause });
   */
  constructor(code: MaptalksErrorCode, message: string, options?: { cause?: unknown }) {
    super(message);
    this.code = code;
    this.name = 'MaptalksError';
    // 保留底层原因（部分运行时未在 super 中透传 cause，这里显式赋值）
    if (options?.cause !== undefined) this.cause = options.cause;
    // 修正原型链，确保 instanceof 在编译降级后仍成立
    Object.setPrototypeOf(this, MaptalksError.prototype);
  }
}

/**
 * 将任意捕获到的异常规整为 MaptalksError。
 *
 * @description 已是 MaptalksError 则原样返回；否则以给定 code 包装，保留原始错误为 cause。
 * @param {unknown} error - 捕获到的原始异常
 * @param {MaptalksErrorCode} code - 包装时使用的错误码
 * @param {string} message - 包装时使用的错误信息
 * @returns {MaptalksError} 规整后的错误实例
 *
 * @example
 * catch (cause) { error.value = toMaptalksError(cause, 'init-failed', '初始化失败'); }
 */
export function toMaptalksError(
  error: unknown,
  code: MaptalksErrorCode,
  message: string,
): MaptalksError {
  if (error instanceof MaptalksError) return error;
  return new MaptalksError(code, message, { cause: error });
}
