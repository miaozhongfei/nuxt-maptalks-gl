import { describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, shallowRef } from 'vue';

import { useMaptalksCamera } from '../src/runtime/composables/useMaptalksCamera';
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
  };
  const map = {
    getCenter: () => state.center,
    getZoom: () => state.zoom,
    getPitch: () => state.pitch,
    getBearing: () => state.bearing,
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
