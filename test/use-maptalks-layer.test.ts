import { describe, expect, it, vi } from 'vitest';
import { effectScope, shallowRef } from 'vue';

import { useMaptalksLayer } from '../src/runtime/composables/useMaptalksLayer';
import { layerRegistry } from '../src/runtime/core/registry';
import type { MaptalksLayer, MaptalksMap } from '../src/runtime/types';

// 模拟 loader：让 loadMaptalks 立即 resolve（factory 由测试自带，不依赖真实命名空间）。
// vitest 会自动把 vi.mock 提升到 import 之上，故拦截生效。
vi.mock('../src/runtime/core/loader', () => ({
  loadMaptalks: vi.fn(() => Promise.resolve({})),
  isWebGLAvailable: () => true,
}));

/** 等待微任务队列排空（loadMaptalks 的 await 链） */
function flush(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

/** 装配一张「就绪」图层并返回句柄与各 spy */
async function mountReady() {
  const addLayer = vi.fn();
  const removeLayer = vi.fn();
  const mapRef = shallowRef<MaptalksMap | null>({ addLayer, removeLayer } as unknown as MaptalksMap);
  const config = vi.fn();
  const remove = vi.fn();
  const layer = { config, remove, getId: () => 'fake' } as unknown as MaptalksLayer;
  const before = layerRegistry.size;
  const scope = effectScope();
  const handle = scope.run(() => useMaptalksLayer(mapRef, () => layer));
  if (!handle) throw new Error('effectScope did not run');
  await flush();
  return { handle, scope, layer, addLayer, removeLayer, config, remove, before };
}

describe('useMaptalksLayer', () => {
  it('adds the layer and registers it when the map is ready', async () => {
    const c = await mountReady();
    expect(c.addLayer).toHaveBeenCalledWith(c.layer);
    expect(c.handle.layer.value).toBe(c.layer);
    expect(layerRegistry.size).toBe(c.before + 1);
    c.scope.stop();
  });

  it('applies options imperatively via update(), preferring config', async () => {
    const c = await mountReady();
    // 创建时未传初始 options，故 config 尚未被调用
    expect(c.config).not.toHaveBeenCalled();
    c.handle.update({ opacity: 0.5 });
    expect(c.config).toHaveBeenCalledWith({ opacity: 0.5 });
    c.scope.stop();
  });

  it('on scope dispose removes map.removeLayer before layer.remove, then unregisters', async () => {
    const c = await mountReady();
    c.scope.stop();
    expect(c.removeLayer).toHaveBeenCalledWith(c.layer);
    expect(c.remove).toHaveBeenCalledTimes(1);
    expect(c.handle.layer.value).toBeNull();
    expect(layerRegistry.size).toBe(c.before);
    expect(c.removeLayer.mock.invocationCallOrder[0]).toBeLessThan(
      c.remove.mock.invocationCallOrder[0],
    );
  });

  it('does not create a layer while the map is null', async () => {
    const mapRef = shallowRef<MaptalksMap | null>(null);
    const factory = vi.fn(() => ({ remove: vi.fn() }) as unknown as MaptalksLayer);
    const scope = effectScope();
    const handle = scope.run(() => useMaptalksLayer(mapRef, factory));
    if (!handle) throw new Error('effectScope did not run');
    await flush();
    expect(factory).not.toHaveBeenCalled();
    expect(handle.layer.value).toBeNull();
    scope.stop();
  });
});
