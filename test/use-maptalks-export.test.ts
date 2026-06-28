import { afterEach, describe, expect, it, vi } from 'vitest';
import { shallowRef } from 'vue';

import { useMaptalksExport } from '../src/runtime/composables/useMaptalksExport';
import type { MaptalksMap } from '../src/runtime/types';

function fakeMap(dataUrl = 'data:image/png;base64,AAAA') {
  const toDataURL = vi.fn(() => dataUrl);
  const map = { toDataURL } as unknown as MaptalksMap;
  return { map, toDataURL };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('useMaptalksExport', () => {
  it('toDataURL 委托地图并透传选项', () => {
    const m = fakeMap();
    const { toDataURL } = useMaptalksExport(shallowRef<MaptalksMap | null>(m.map));
    expect(toDataURL({ mimeType: 'image/png' })).toBe('data:image/png;base64,AAAA');
    expect(m.toDataURL).toHaveBeenCalledWith({ mimeType: 'image/png' });
  });

  it('map 为 null 时 toDataURL 返回 null、download no-op', () => {
    const createElement = vi.fn();
    vi.stubGlobal('document', { createElement } as unknown as Document);
    const { toDataURL, download } = useMaptalksExport(shallowRef<MaptalksMap | null>(null));
    expect(toDataURL()).toBeNull();
    download('a.png');
    expect(createElement).not.toHaveBeenCalled();
  });

  it('toBlob 经 fetch 把 dataURL 转 Blob', async () => {
    const m = fakeMap();
    const blob = new Blob(['x']);
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ blob: () => Promise.resolve(blob) } as unknown as Response)));
    const { toBlob } = useMaptalksExport(shallowRef<MaptalksMap | null>(m.map));
    await expect(toBlob()).resolves.toBe(blob);
  });

  it('toBlob 失败时 reject', async () => {
    const m = fakeMap();
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('boom'))));
    const { toBlob } = useMaptalksExport(shallowRef<MaptalksMap | null>(m.map));
    await expect(toBlob()).rejects.toThrow('boom');
  });

  it('download 用锚点触发下载', () => {
    const m = fakeMap();
    const click = vi.fn();
    const anchor = { href: '', download: '', click } as unknown as HTMLAnchorElement;
    vi.stubGlobal('document', { createElement: vi.fn(() => anchor) } as unknown as Document);
    const { download } = useMaptalksExport(shallowRef<MaptalksMap | null>(m.map));
    download('map.png', { mimeType: 'image/png' });
    expect(anchor.download).toBe('map.png');
    expect(anchor.href).toBe('data:image/png;base64,AAAA');
    expect(click).toHaveBeenCalledOnce();
  });
});
