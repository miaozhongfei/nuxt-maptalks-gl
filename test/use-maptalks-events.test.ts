import { describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, shallowRef } from 'vue';

import { useMaptalksEvents } from '../src/runtime/composables/map/useMaptalksEvents';
import type { MaptalksMap } from '../src/runtime/types';

/** 假地图，带 on/off spy */
function fakeMap(): { map: MaptalksMap; on: ReturnType<typeof vi.fn>; off: ReturnType<typeof vi.fn> } {
  const on = vi.fn();
  const off = vi.fn();
  return { map: { on, off } as unknown as MaptalksMap, on, off };
}

describe('useMaptalksEvents', () => {
  it('binds handlers when the map is ready', () => {
    const m = fakeMap();
    const click = vi.fn();
    const scope = effectScope();
    scope.run(() => useMaptalksEvents(shallowRef<MaptalksMap | null>(m.map), { click }));
    expect(m.on).toHaveBeenCalledWith('click', click);
    scope.stop();
  });

  it('rebinds when the map reference changes', async () => {
    const m1 = fakeMap();
    const m2 = fakeMap();
    const click = vi.fn();
    const mapRef = shallowRef<MaptalksMap | null>(m1.map);
    const scope = effectScope();
    scope.run(() => useMaptalksEvents(mapRef, { click }));
    mapRef.value = m2.map;
    await nextTick();
    expect(m1.off).toHaveBeenCalledWith('click', click);
    expect(m2.on).toHaveBeenCalledWith('click', click);
    scope.stop();
  });

  it('unbinds on scope dispose', () => {
    const m = fakeMap();
    const click = vi.fn();
    const scope = effectScope();
    scope.run(() => useMaptalksEvents(shallowRef<MaptalksMap | null>(m.map), { click }));
    scope.stop();
    expect(m.off).toHaveBeenCalledWith('click', click);
  });
});
