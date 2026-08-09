import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import type { MaptalksMap, UseMaptalksExportOpts, UseMaptalksExportReturn } from '../../types';
import { createLogger } from '../../utils/logger';

/** 日志实例（单例） */
const logger = createLogger('nuxt-maptalks-gl');

/**
 * 导出地图为图片（dataURL / Blob / 触发下载）。
 *
 * @description 封装 maptalks `map.toDataURL`，提供三种导出形态。client-only；
 * map 为 null（SSR / 未就绪）时 `toDataURL` 返回 null、`toBlob` resolve null、`download` no-op。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @returns {UseMaptalksExportReturn} `{ toDataURL, toBlob, download }`
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { download } = useMaptalksExport(map);
 * function save() { download('map.png', { mimeType: 'image/png' }); }
 */
export function useMaptalksExport(
  map: MaybeRefOrGetter<MaptalksMap | null>,
): UseMaptalksExportReturn {
  // 读取 dataURL：map 为 null 返回 null
  function toDataURL(options: UseMaptalksExportOpts = {}): string | null {
    const m = toValue(map);
    return m ? m.toDataURL(options) : null;
  }

  // dataURL → Blob：失败 reject 并记录
  async function toBlob(options: UseMaptalksExportOpts = {}): Promise<Blob | null> {
    const dataUrl = toDataURL(options);
    if (!dataUrl) return null;
    try {
      const res = await fetch(dataUrl);
      return await res.blob();
    } catch (cause) {
      logger.error('导出地图为 Blob 失败', cause);
      throw cause;
    }
  }

  // 用临时锚点触发浏览器下载
  function download(filename: string, options: UseMaptalksExportOpts = {}): void {
    const dataUrl = toDataURL(options);
    if (!dataUrl) return;
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = filename;
    anchor.click();
  }

  return { toDataURL, toBlob, download };
}
