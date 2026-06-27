import { afterEach, describe, expect, it } from 'vitest';
import { shallowRef } from 'vue';

import { useMaptalksInstance } from '../src/runtime/composables/useMaptalksInstance';
import { useMaptalksRegistry } from '../src/runtime/composables/useMaptalksRegistry';
import { mapRegistry } from '../src/runtime/core/registry';
import type { MaptalksMap } from '../src/runtime/types';

function fakeMap(): MaptalksMap {
  return {} as unknown as MaptalksMap;
}

afterEach(() => {
  for (const name of mapRegistry.instances.keys()) mapRegistry.unregister(name);
});

describe('useMaptalksInstance', () => {
  it('returns the registered map by name', () => {
    const map = fakeMap();
    mapRegistry.register('main', shallowRef<MaptalksMap | null>(map));
    expect(useMaptalksInstance('main').value).toBe(map);
  });

  it('returns null for an unregistered name', () => {
    expect(useMaptalksInstance('nope').value).toBeNull();
  });

  it('reactively reflects a later registration', () => {
    const instance = useMaptalksInstance('lazy');
    expect(instance.value).toBeNull();
    const map = fakeMap();
    mapRegistry.register('lazy', shallowRef<MaptalksMap | null>(map));
    expect(instance.value).toBe(map);
  });
});

describe('useMaptalksRegistry', () => {
  it('exposes get/has and enumerates registered maps', () => {
    const map = fakeMap();
    mapRegistry.register('a', shallowRef<MaptalksMap | null>(map));
    const reg = useMaptalksRegistry();
    expect(reg.has('a')).toBe(true);
    expect(reg.has('b')).toBe(false);
    expect(reg.get('a')).toBe(map);
    expect(reg.get('b')).toBeNull();
    expect([...reg.instances.keys()]).toContain('a');
  });
});
