import { describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, shallowRef } from 'vue';

import { useMaptalksCamera } from '../src/runtime/composables/map/useMaptalksCamera';
import type { MaptalksCoordinate, MaptalksMap } from '../src/runtime/types';

interface CameraState {
  center: MaptalksCoordinate;
  zoom: number;
  pitch: number;
  bearing: number;
}

/** 假地图：getter 返回给定初值，setter/事件/过渡为 spy */
function fakeMap(state: CameraState) {
  const spies = {
    setCenter: vi.fn(),
    setZoom: vi.fn(),
    setPitch: vi.fn(),
    setBearing: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    flyTo: vi.fn(),
    animateTo: vi.fn(),
    fitExtent: vi.fn(),
    panTo: vi.fn(),
    panBy: vi.fn(),
    setMaxExtent: vi.fn(),
    setMinZoom: vi.fn(),
    setMaxZoom: vi.fn(),
  };
  const map = {
    getCenter: () => state.center,
    getZoom: () => state.zoom,
    getPitch: () => state.pitch,
    getBearing: () => state.bearing,
    getExtent: () => 'EXTENT',
    getResolution: (zoom?: number) => (zoom ?? 0) + 100,
    getScale: (zoom?: number) => (zoom ?? 0) + 200,
    ...spies,
  } as unknown as MaptalksMap;
  return { map, ...spies };
}

const initial: CameraState = { center: { x: 1, y: 2 }, zoom: 10, pitch: 30, bearing: 45 };

describe('useMaptalksCamera', () => {
  it('pulls the camera state from the map into refs on ready', async () => {
    const m = fakeMap(initial);
    const scope = effectScope();
    const handle = scope.run(() => useMaptalksCamera(shallowRef<MaptalksMap | null>(m.map)));
    if (!handle) throw new Error('effectScope did not run');
    await nextTick();
    expect(handle.center.value).toEqual({ x: 1, y: 2 });
    expect(handle.zoom.value).toBe(10);
    expect(handle.pitch.value).toBe(30);
    expect(handle.bearing.value).toBe(45);
    scope.stop();
  });

  it('writes a ref change back to the map (zoom)', async () => {
    const m = fakeMap(initial);
    const scope = effectScope();
    const handle = scope.run(() => useMaptalksCamera(shallowRef<MaptalksMap | null>(m.map)));
    if (!handle) throw new Error('effectScope did not run');
    await nextTick();
    handle.zoom.value = 14;
    await nextTick();
    expect(m.setZoom).toHaveBeenCalledWith(14);
    scope.stop();
  });

  it('flyTo delegates to the map', () => {
    const m = fakeMap(initial);
    const scope = effectScope();
    const handle = scope.run(() => useMaptalksCamera(shallowRef<MaptalksMap | null>(m.map)));
    if (!handle) throw new Error('effectScope did not run');
    handle.flyTo({ center: [3, 4], zoom: 6 });
    expect(m.flyTo).toHaveBeenCalledWith({ center: [3, 4], zoom: 6 }, undefined);
    scope.stop();
  });

  it('unbinds view events on scope dispose', () => {
    const m = fakeMap(initial);
    const scope = effectScope();
    const handle = scope.run(() => useMaptalksCamera(shallowRef<MaptalksMap | null>(m.map)));
    if (!handle) throw new Error('effectScope did not run');
    expect(m.on).toHaveBeenCalled();
    scope.stop();
    expect(m.off).toHaveBeenCalled();
  });
});

describe('useMaptalksCamera 扩展（平移 / 只读状态 / 约束 setter）', () => {
  it('panTo / panBy / setMaxExtent / setZoomRange 委托给地图', () => {
    const m = fakeMap(initial);
    const scope = effectScope();
    const handle = scope.run(() => useMaptalksCamera(shallowRef<MaptalksMap | null>(m.map)));
    if (!handle) throw new Error('effectScope did not run');
    handle.panTo([3, 4]);
    expect(m.panTo).toHaveBeenCalledWith([3, 4], undefined);
    handle.panBy([10, 20]);
    expect(m.panBy).toHaveBeenCalledWith([10, 20], undefined);
    handle.setMaxExtent('E');
    expect(m.setMaxExtent).toHaveBeenCalledWith('E');
    handle.setZoomRange(2, 18);
    expect(m.setMinZoom).toHaveBeenCalledWith(2);
    expect(m.setMaxZoom).toHaveBeenCalledWith(18);
    scope.stop();
  });

  it('void 方法在 map 为 null 时静默 no-op', () => {
    const scope = effectScope();
    const handle = scope.run(() => useMaptalksCamera(shallowRef<MaptalksMap | null>(null)));
    if (!handle) throw new Error('effectScope did not run');
    expect(() => {
      handle.panTo([1, 2]);
      handle.panBy([3, 4]);
      handle.setMaxExtent('E');
      handle.setZoomRange(2, 18);
    }).not.toThrow();
    scope.stop();
  });

  it('只读状态读取地图；map 为 null 返回 null', () => {
    const m = fakeMap(initial);
    const scope = effectScope();
    const handle = scope.run(() => useMaptalksCamera(shallowRef<MaptalksMap | null>(m.map)));
    if (!handle) throw new Error('effectScope did not run');
    expect(handle.getExtent()).toBe('EXTENT');
    expect(handle.getResolution(5)).toBe(105);
    expect(handle.getScale(5)).toBe(205);
    scope.stop();

    const nullScope = effectScope();
    const nullHandle = nullScope.run(() => useMaptalksCamera(shallowRef<MaptalksMap | null>(null)));
    if (!nullHandle) throw new Error('effectScope did not run');
    expect(nullHandle.getExtent()).toBeNull();
    expect(nullHandle.getResolution()).toBeNull();
    expect(nullHandle.getScale()).toBeNull();
    nullScope.stop();
  });
});
