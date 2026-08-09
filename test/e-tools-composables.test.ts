import { describe, expect, it, vi } from 'vitest';
import { effectScope, shallowRef } from 'vue';

import { useMaptalksAreaTool } from '../src/runtime/composables/maptool/useMaptalksAreaTool';
import { useMaptalksDistanceTool } from '../src/runtime/composables/maptool/useMaptalksDistanceTool';
import type { MaptalksMap } from '../src/runtime/types';

function createFakeTool() {
  return {
    addTo: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    enable: vi.fn(),
    disable: vi.fn(),
    remove: vi.fn(),
  };
}

const { mt } = vi.hoisted(() => ({
  mt: {
    DistanceTool: vi.fn(function FakeDistanceTool() {
      return createFakeTool();
    }),
    AreaTool: vi.fn(function FakeAreaTool() {
      return createFakeTool();
    }),
  },
}));

vi.mock('../src/runtime/core/loader', () => ({
  loadMaptalks: vi.fn(() => Promise.resolve(mt)),
  isWebGLAvailable: () => true,
}));

function flush(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

describe('useMaptalksDistanceTool', () => {
  it('创建 DistanceTool 并 addTo(map)', async () => {
    const map = shallowRef<MaptalksMap | null>({} as unknown as MaptalksMap);
    const scope = effectScope();
    scope.run(() => useMaptalksDistanceTool(map, { options: { language: 'zh' } }));
    await flush();
    expect(mt.DistanceTool).toHaveBeenCalledWith({ language: 'zh' });
    const t = mt.DistanceTool.mock.results[0]?.value;
    expect(t?.addTo).toHaveBeenCalledWith(map.value);
    scope.stop();
  });

  it('绑定 events', async () => {
    const map = shallowRef<MaptalksMap | null>({} as unknown as MaptalksMap);
    const onMeasure = vi.fn();
    const scope = effectScope();
    scope.run(() => useMaptalksDistanceTool(map, { events: { measure: onMeasure } }));
    await flush();
    const t = mt.DistanceTool.mock.results[1]?.value;
    expect(t?.on).toHaveBeenCalledWith('measure', onMeasure);
    scope.stop();
  });

  it('options 变化时重建工具', async () => {
    const opts = shallowRef<Record<string, unknown> | undefined>({ language: 'zh' });
    const map = shallowRef<MaptalksMap | null>({} as unknown as MaptalksMap);
    const scope = effectScope();
    scope.run(() => useMaptalksDistanceTool(map, { options: opts }));
    await flush();
    const t1 = mt.DistanceTool.mock.results[2]?.value;
    expect(mt.DistanceTool).toHaveBeenCalledWith({ language: 'zh' });
    opts.value = { language: 'en' };
    await flush();
    expect(t1?.remove).toHaveBeenCalled();
    expect(mt.DistanceTool).toHaveBeenCalledWith({ language: 'en' });
    scope.stop();
  });
});

describe('useMaptalksAreaTool', () => {
  it('创建 AreaTool 并 addTo(map)', async () => {
    const map = shallowRef<MaptalksMap | null>({} as unknown as MaptalksMap);
    const scope = effectScope();
    scope.run(() => useMaptalksAreaTool(map, { options: { units: 'metric' } }));
    await flush();
    expect(mt.AreaTool).toHaveBeenCalledWith({ units: 'metric' });
    const t = mt.AreaTool.mock.results[0]?.value;
    expect(t?.addTo).toHaveBeenCalledWith(map.value);
    scope.stop();
  });
});
