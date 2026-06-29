// @vitest-environment nuxt

import { mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, shallowRef } from 'vue';
import type { ShallowRef } from 'vue';

import { useMaptalksWMSLayer } from '../src/runtime/composables/presets/useMaptalksWMSLayer';
import type { MaptalksMap, MaptalksSource } from '../src/runtime/types';

// 假的 maptalks-gl 命名空间：WMSLayer 构造器返回带 remove/config 的对象并记录构造参数
const { mt } = vi.hoisted(() => ({
  mt: {
    WMSLayer: vi.fn(function FakeWMS(id: string, a?: unknown, b?: unknown) {
      return { id, a, b, remove: vi.fn(), config: vi.fn() };
    }),
  },
}));

vi.mock('../src/runtime/core/loader', () => ({
  loadMaptalks: vi.fn(() => Promise.resolve(mt)),
  isWebGLAvailable: () => true,
}));

/** 在组件里调用 WMS 预设，返回假地图的 addLayer spy */
async function mountWMS(
  use: (map: ShallowRef<MaptalksMap | null>) => unknown,
): Promise<{ addLayer: ReturnType<typeof vi.fn> }> {
  const addLayer = vi.fn();
  const removeLayer = vi.fn();
  const map = shallowRef<MaptalksMap | null>({ addLayer, removeLayer } as unknown as MaptalksMap);
  await mountSuspended(
    defineComponent({
      setup() {
        use(map);
        return () => h('div');
      },
    }),
  );
  return { addLayer };
}

describe('useMaptalksWMSLayer 预设', () => {
  // 两个用例共用同一 WMSLayer 构造器 spy，逐例清空以保证 calls[0] 指向当前用例
  beforeEach(() => {
    mt.WMSLayer.mockClear();
  });

  it('用命名源解析出的 urlTemplate 构造 WMSLayer 并 addLayer', async () => {
    const { addLayer } = await mountWMS((map) => useMaptalksWMSLayer(map, { source: 'pubTile' }));
    await vi.waitFor(() => expect(mt.WMSLayer).toHaveBeenCalled(), { timeout: 2000 });
    expect(mt.WMSLayer.mock.calls[0]?.[1]).toMatchObject({
      urlTemplate: 'https://example.com/{z}/{x}/{y}.png',
    });
    expect(addLayer).toHaveBeenCalled();
  });

  it('内联源的 url 映射为 WMS 的 urlTemplate（WMS 服务基址）', async () => {
    const inline: MaptalksSource = {
      kind: 'public',
      type: 'wms',
      url: 'https://geo.example.com/geoserver/wms',
      options: { layers: 'topp:states', format: 'image/png', transparent: true },
    };
    await mountWMS((map) => useMaptalksWMSLayer(map, { source: inline }));
    await vi.waitFor(() => expect(mt.WMSLayer).toHaveBeenCalled(), { timeout: 2000 });
    expect(mt.WMSLayer.mock.calls[0]?.[1]).toMatchObject({
      urlTemplate: 'https://geo.example.com/geoserver/wms',
      layers: 'topp:states',
    });
  });
});
