import { describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, shallowRef } from 'vue';

import { useMaptalksSync } from '../src/runtime/composables/useMaptalksSync';
import { mapRegistry } from '../src/runtime/core/registry';
import type { MaptalksMap } from '../src/runtime/types';

interface View {
  center: { x: number; y: number };
  zoom: number;
  pitch: number;
  bearing: number;
}

/** 假地图：可读视图、可被 setter 写入、可捕获事件 handler 以手动触发 */
function fakeMap(v: View) {
  const handlers: Array<() => void> = [];
  const setters = {
    setCenter: vi.fn((c) => {
      v.center = c;
    }),
    setZoom: vi.fn((z) => {
      v.zoom = z;
    }),
    setPitch: vi.fn((p) => {
      v.pitch = p;
    }),
    setBearing: vi.fn((b) => {
      v.bearing = b;
    }),
  };
  const map = {
    getCenter: () => v.center,
    getZoom: () => v.zoom,
    getPitch: () => v.pitch,
    getBearing: () => v.bearing,
    on: vi.fn((_ev: string, h: () => void) => {
      handlers.push(h);
    }),
    off: vi.fn(),
    ...setters,
  } as unknown as MaptalksMap;
  return { map, handlers, ...setters };
}

const view = (): View => ({ center: { x: 0, y: 0 }, zoom: 10, pitch: 0, bearing: 0 });

describe('useMaptalksSync mutual', () => {
  it('mutual：一图变更同步其余', () => {
    const a = fakeMap({ ...view(), zoom: 12 });
    const b = fakeMap(view());
    const scope = effectScope();
    scope.run(() =>
      useMaptalksSync([
        shallowRef<MaptalksMap | null>(a.map),
        shallowRef<MaptalksMap | null>(b.map),
      ]),
    );
    a.handlers[0]!();
    expect(b.setZoom).toHaveBeenCalledWith(12);
    scope.stop();
  });

  it('门闩防回环：同一同步周期内不二次传播', async () => {
    const a = fakeMap({ ...view(), zoom: 12 });
    const b = fakeMap(view());
    const scope = effectScope();
    scope.run(() =>
      useMaptalksSync([
        shallowRef<MaptalksMap | null>(a.map),
        shallowRef<MaptalksMap | null>(b.map),
      ]),
    );
    a.handlers[0]!();
    b.handlers[0]!();
    expect(a.setZoom).not.toHaveBeenCalled();
    await nextTick();
    scope.stop();
  });
});

describe('useMaptalksSync master-slave', () => {
  it('master-slave：仅主图变更驱动从图', () => {
    const m = fakeMap({ ...view(), zoom: 9 });
    const s = fakeMap(view());
    const scope = effectScope();
    scope.run(() =>
      useMaptalksSync(
        [shallowRef<MaptalksMap | null>(m.map), shallowRef<MaptalksMap | null>(s.map)],
        { mode: 'master-slave', master: m.map },
      ),
    );
    m.handlers[0]!();
    expect(s.setZoom).toHaveBeenCalledWith(9);
    scope.stop();
  });

  it('master-slave 缺 master 抛错', () => {
    const a = fakeMap(view());
    const scope = effectScope();
    expect(() =>
      scope.run(() =>
        useMaptalksSync([shallowRef<MaptalksMap | null>(a.map)], { mode: 'master-slave' }),
      ),
    ).toThrow('master');
    scope.stop();
  });
});

describe('useMaptalksSync 解析与生命周期', () => {
  it('按注册表名解析地图', () => {
    const a = fakeMap({ ...view(), zoom: 7 });
    const b = fakeMap(view());
    mapRegistry.register('sync-a', shallowRef<MaptalksMap | null>(a.map));
    mapRegistry.register('sync-b', shallowRef<MaptalksMap | null>(b.map));
    const scope = effectScope();
    scope.run(() => useMaptalksSync(['sync-a', 'sync-b']));
    a.handlers[0]!();
    expect(b.setZoom).toHaveBeenCalledWith(7);
    scope.stop();
    mapRegistry.unregister('sync-a');
    mapRegistry.unregister('sync-b');
  });

  it('scope dispose 解绑事件', () => {
    const a = fakeMap(view());
    const scope = effectScope();
    scope.run(() => useMaptalksSync([shallowRef<MaptalksMap | null>(a.map)]));
    scope.stop();
    expect(a.map.off).toHaveBeenCalled();
  });
});
