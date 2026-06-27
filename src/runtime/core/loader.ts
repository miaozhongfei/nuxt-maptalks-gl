import type { MaptalksGLNamespace } from '../types';

/** 缓存动态 import 的结果，确保 maptalks-gl 只被加载一次 */
let cached: Promise<MaptalksGLNamespace> | null = null;

/**
 * 动态加载 maptalks-gl 命名空间（带缓存）。
 *
 * @description 仅在客户端调用。首次调用触发 `import('maptalks-gl')` 并缓存其 Promise，
 * 后续调用复用同一份。兼容「命名导出」与「default 导出」两种打包形态。
 * 失败时不缓存失败结果，允许后续重试。
 * @returns {Promise<MaptalksGLNamespace>} 已加载的 maptalks-gl 命名空间
 *
 * @example
 * const mt = await loadMaptalks();
 * const map = new mt.Map(el, { center: [113.27, 23.13], zoom: 10 });
 */
export function loadMaptalks(): Promise<MaptalksGLNamespace> {
  if (cached) return cached;
  cached = import('maptalks-gl')
    .then((mod) => {
      const ns = mod as Record<string, unknown>;
      // 命名空间上若没有 Map（构造器），说明导出挂在 default 上，取 default
      const resolved = typeof ns.Map === 'function' ? ns : (ns.default as Record<string, unknown>);
      return resolved as unknown as MaptalksGLNamespace;
    })
    .catch((cause) => {
      // 加载失败不缓存，允许下次重试
      cached = null;
      throw cause;
    });
  return cached;
}

/**
 * 检测当前环境是否支持 WebGL。
 *
 * @description 通过临时 canvas 尝试获取 webgl / webgl2 / experimental-webgl 上下文。
 * 仅在客户端有意义；服务端无 document 时返回 false。
 * @returns {boolean} 是否支持 WebGL
 *
 * @example
 * if (!isWebGLAvailable()) error.value = new MaptalksError('webgl-unsupported', '当前环境不支持 WebGL');
 */
export function isWebGLAvailable(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const ctx =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    return ctx !== null;
  } catch {
    return false;
  }
}
