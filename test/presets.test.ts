// @vitest-environment nuxt
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, shallowRef } from 'vue';
import type { ShallowRef } from 'vue';

import { mountSuspended } from '@nuxt/test-utils/runtime';

import { useMaptalksGLTFLayer } from '../src/runtime/composables/presets/useMaptalksGLTFLayer';
import { useMaptalksGroupGLLayer } from '../src/runtime/composables/presets/useMaptalksGroupGLLayer';
import { useMaptalksTileLayer } from '../src/runtime/composables/presets/useMaptalksTileLayer';
import { useMaptalksVectorTileLayer } from '../src/runtime/composables/presets/useMaptalksVectorTileLayer';
import { resolvePresetSource } from '../src/runtime/core/preset-source';
import type { PresetSourceState } from '../src/runtime/core/preset-source';
import type { MaptalksMap, MaptalksSource } from '../src/runtime/types';

// 假的 maptalks-gl 命名空间：四个图层构造器都返回带 remove/config 的对象，并记录构造参数
const { mt } = vi.hoisted(() => ({
  mt: {
    TileLayer: vi.fn(function FakeTile(id: string, a?: unknown, b?: unknown) {
      return { id, a, b, remove: vi.fn(), config: vi.fn() };
    }),
    VectorTileLayer: vi.fn(function FakeVt(id: string, a?: unknown, b?: unknown) {
      return { id, a, b, remove: vi.fn(), config: vi.fn() };
    }),
    GroupGLLayer: vi.fn(function FakeGroup(id: string, a?: unknown, b?: unknown) {
      return { id, a, b, remove: vi.fn(), config: vi.fn() };
    }),
    GLTFLayer: vi.fn(function FakeGltf(id: string, a?: unknown, b?: unknown) {
      return { id, a, b, remove: vi.fn(), config: vi.fn() };
    }),
  },
}));

vi.mock('../src/runtime/core/loader', () => ({
  loadMaptalks: vi.fn(() => Promise.resolve(mt)),
  isWebGLAvailable: () => true,
}));

/** 等待微任务排空 */
function flush(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

/** 在组件里跑 resolvePresetSource（onMounted 触发解析），返回其状态 */
async function runPreset(source?: string | MaptalksSource): Promise<PresetSourceState> {
  let result: PresetSourceState | undefined;
  await mountSuspended(
    defineComponent({
      setup() {
        result = resolvePresetSource(source);
        return () => h('div');
      },
    }),
  );
  await flush();
  if (!result) throw new Error('component setup did not run');
  return result;
}

/** 在组件里调用某个预设，返回假地图的 addLayer/removeLayer spy */
async function mountPreset(
  use: (map: ShallowRef<MaptalksMap | null>) => unknown,
): Promise<{ addLayer: ReturnType<typeof vi.fn>; removeLayer: ReturnType<typeof vi.fn> }> {
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
  return { addLayer, removeLayer };
}

describe('resolvePresetSource', () => {
  it('resolves a named source from config', async () => {
    const r = await runPreset('pubTile');
    expect(r.error.value).toBeNull();
    expect(r.resolved.value?.urlTemplate).toBe('https://example.com/{z}/{x}/{y}.png');
  });

  it('resolves an inline source object directly', async () => {
    const inline: MaptalksSource = {
      kind: 'public',
      type: 'tile',
      urlTemplate: 'https://inline/{z}/{x}/{y}.png',
    };
    const r = await runPreset(inline);
    expect(r.resolved.value?.urlTemplate).toBe('https://inline/{z}/{x}/{y}.png');
  });

  it('stays null without error when no source is given', async () => {
    const r = await runPreset();
    expect(r.resolved.value).toBeNull();
    expect(r.error.value).toBeNull();
  });

  it('errors for an unknown named source', async () => {
    const r = await runPreset('does-not-exist');
    expect(r.resolved.value).toBeNull();
    expect(r.error.value?.code).toBe('source-resolve-failed');
  });
});

describe('layer presets', () => {
  it('useMaptalksTileLayer builds TileLayer with the resolved url and adds it', async () => {
    const { addLayer } = await mountPreset((map) => useMaptalksTileLayer(map, { source: 'pubTile' }));
    await vi.waitFor(() => expect(mt.TileLayer).toHaveBeenCalled(), { timeout: 2000 });
    expect(mt.TileLayer.mock.calls[0]?.[1]).toMatchObject({ urlTemplate: 'https://example.com/{z}/{x}/{y}.png' });
    expect(addLayer).toHaveBeenCalled();
  });

  it('useMaptalksVectorTileLayer builds VectorTileLayer with the resolved url', async () => {
    await mountPreset((map) => useMaptalksVectorTileLayer(map, { source: 'pubTile' }));
    await vi.waitFor(() => expect(mt.VectorTileLayer).toHaveBeenCalled(), { timeout: 2000 });
    expect(mt.VectorTileLayer.mock.calls[0]?.[1]).toMatchObject({ urlTemplate: 'https://example.com/{z}/{x}/{y}.png' });
  });

  it('useMaptalksGLTFLayer creates a GLTFLayer without a source', async () => {
    await mountPreset((map) => useMaptalksGLTFLayer(map, { id: 'g' }));
    await vi.waitFor(() => expect(mt.GLTFLayer).toHaveBeenCalled(), { timeout: 2000 });
  });

  it('useMaptalksGroupGLLayer builds sceneConfig from defaults', async () => {
    await mountPreset((map) => useMaptalksGroupGLLayer(map));
    await vi.waitFor(() => expect(mt.GroupGLLayer).toHaveBeenCalled(), { timeout: 2000 });
    expect(mt.GroupGLLayer.mock.calls[0]?.[2]).toMatchObject({
      sceneConfig: { light: { intensity: 0.6 }, postProcess: { enable: true } },
    });
  });
});
