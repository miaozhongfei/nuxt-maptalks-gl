import { describe, expect, it, vi } from 'vitest';
import { effectScope, shallowRef } from 'vue';

import { useMaptalksGeometry } from '../src/runtime/composables/useMaptalksGeometry';
import type { MaptalksGeometry, MaptalksVectorLayer } from '../src/runtime/types';

vi.mock('../src/runtime/core/loader', () => ({
  loadMaptalks: vi.fn(() => Promise.resolve({})),
  isWebGLAvailable: () => true,
}));

/** 假几何：所有读写/事件方法为 spy */
function fakeGeometry() {
  const spies = {
    setCoordinates: vi.fn(),
    setSymbol: vi.fn(),
    setProperties: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    remove: vi.fn(),
  };
  return { geo: spies as unknown as MaptalksGeometry, ...spies };
}

/** 假矢量图层：addGeometry 为 spy */
function fakeLayer() {
  const addGeometry = vi.fn();
  return { layer: { addGeometry } as unknown as MaptalksVectorLayer, addGeometry };
}

/** 等待指定毫秒（让 loadMaptalks 的 await 链与定时器排空） */
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe('useMaptalksGeometry · 创建与更新', () => {
  it('layer 就绪后用 factory 创建并 addGeometry', async () => {
    const g = fakeGeometry();
    const l = fakeLayer();
    const scope = effectScope();
    scope.run(() =>
      useMaptalksGeometry(shallowRef<MaptalksVectorLayer | null>(l.layer), () => g.geo),
    );
    await vi.waitFor(() => expect(l.addGeometry).toHaveBeenCalledWith(g.geo));
    scope.stop();
  });
  it('coordinates 替换后 setCoordinates；events 绑定', async () => {
    const g = fakeGeometry();
    const l = fakeLayer();
    const coords = shallowRef<[number, number]>([0, 0]);
    const click = vi.fn();
    const scope = effectScope();
    scope.run(() =>
      useMaptalksGeometry(shallowRef<MaptalksVectorLayer | null>(l.layer), () => g.geo, {
        coordinates: coords,
        events: { click },
      }),
    );
    await vi.waitFor(() => expect(l.addGeometry).toHaveBeenCalled());
    expect(g.on).toHaveBeenCalledWith('click', click);
    coords.value = [1, 1];
    await vi.waitFor(() => expect(g.setCoordinates).toHaveBeenCalledWith([1, 1]));
    scope.stop();
  });
});

describe('useMaptalksGeometry · 生命周期', () => {
  it('layer 为 null 时不创建', async () => {
    const g = fakeGeometry();
    const scope = effectScope();
    scope.run(() => useMaptalksGeometry(shallowRef<MaptalksVectorLayer | null>(null), () => g.geo));
    await wait(10);
    expect(g.remove).not.toHaveBeenCalled();
    scope.stop();
  });
  it('scope dispose 时 remove 几何并解绑事件', async () => {
    const g = fakeGeometry();
    const l = fakeLayer();
    const click = vi.fn();
    const scope = effectScope();
    scope.run(() =>
      useMaptalksGeometry(shallowRef<MaptalksVectorLayer | null>(l.layer), () => g.geo, {
        events: { click },
      }),
    );
    await vi.waitFor(() => expect(l.addGeometry).toHaveBeenCalled());
    scope.stop();
    expect(g.off).toHaveBeenCalledWith('click', click);
    expect(g.remove).toHaveBeenCalled();
  });
});

describe('useMaptalksGeometry · 样式与属性更新', () => {
  it('symbol / properties 替换后写回几何', async () => {
    const g = fakeGeometry();
    const l = fakeLayer();
    const symbol = shallowRef<Record<string, unknown>>({ markerType: 'ellipse' });
    const properties = shallowRef<Record<string, unknown>>({ a: 1 });
    const scope = effectScope();
    scope.run(() =>
      useMaptalksGeometry(shallowRef<MaptalksVectorLayer | null>(l.layer), () => g.geo, {
        symbol,
        properties,
      }),
    );
    await vi.waitFor(() => expect(l.addGeometry).toHaveBeenCalled());
    symbol.value = { markerType: 'square' };
    await vi.waitFor(() => expect(g.setSymbol).toHaveBeenCalledWith({ markerType: 'square' }));
    properties.value = { a: 2 };
    await vi.waitFor(() => expect(g.setProperties).toHaveBeenCalledWith({ a: 2 }));
    scope.stop();
  });
});

describe('useMaptalksGeometry · extraProps', () => {
  it('额外属性替换后调 apply', async () => {
    const g = fakeGeometry();
    const l = fakeLayer();
    const radius = shallowRef<number>(100);
    const apply = vi.fn();
    const scope = effectScope();
    scope.run(() =>
      useMaptalksGeometry(shallowRef<MaptalksVectorLayer | null>(l.layer), () => g.geo, {
        extraProps: [{ value: radius, apply }],
      }),
    );
    await vi.waitFor(() => expect(l.addGeometry).toHaveBeenCalled());
    radius.value = 200;
    await vi.waitFor(() => expect(apply).toHaveBeenCalledWith(g.geo, 200));
    scope.stop();
  });
});
