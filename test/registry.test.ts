import { afterEach, describe, expect, it } from 'vitest';
import { shallowRef } from 'vue';

import { layerRegistry, mapRegistry } from '../src/runtime/core/registry';
import type { MaptalksLayer, MaptalksMap } from '../src/runtime/types';
import { createLogger } from '../src/runtime/utils/logger';

// 静音注册表共享 logger（重复登记会 warn），保持测试输出干净
createLogger('nuxt-maptalks-gl', { level: 0 });

function fakeMap(): MaptalksMap {
  return {} as unknown as MaptalksMap;
}
function fakeLayer(): MaptalksLayer {
  return {} as unknown as MaptalksLayer;
}

afterEach(() => {
  // 清空地图注册表，隔离用例（删除当前键在 Map 迭代中是安全的）
  for (const name of mapRegistry.instances.keys()) mapRegistry.unregister(name);
});

describe('mapRegistry', () => {
  it('registers and retrieves a map ref by name', () => {
    const ref = shallowRef<MaptalksMap | null>(null);
    mapRegistry.register('m1', ref);
    expect(mapRegistry.has('m1')).toBe(true);
    expect(mapRegistry.get('m1')).toBe(ref);
  });

  it('reflects the underlying ref value through get()', () => {
    const ref = shallowRef<MaptalksMap | null>(null);
    mapRegistry.register('m2', ref);
    const map = fakeMap();
    ref.value = map;
    expect(mapRegistry.get('m2')?.value).toBe(map);
  });

  it('enumerates registered names via instances', () => {
    mapRegistry.register('a', shallowRef<MaptalksMap | null>(null));
    mapRegistry.register('b', shallowRef<MaptalksMap | null>(null));
    expect([...mapRegistry.instances.keys()].toSorted()).toEqual(['a', 'b']);
  });

  it('unregister removes the entry', () => {
    mapRegistry.register('m3', shallowRef<MaptalksMap | null>(null));
    mapRegistry.unregister('m3');
    expect(mapRegistry.has('m3')).toBe(false);
    expect(mapRegistry.get('m3')).toBeUndefined();
  });

  it('unregister with a non-matching ref keeps the current entry (guard)', () => {
    const current = shallowRef<MaptalksMap | null>(null);
    const stale = shallowRef<MaptalksMap | null>(null);
    mapRegistry.register('m4', current);
    // stale !== current → 不删
    mapRegistry.unregister('m4', stale);
    expect(mapRegistry.get('m4')).toBe(current);
    // 匹配 → 删
    mapRegistry.unregister('m4', current);
    expect(mapRegistry.has('m4')).toBe(false);
  });

  it('duplicate register overwrites the previous entry', () => {
    const first = shallowRef<MaptalksMap | null>(null);
    const second = shallowRef<MaptalksMap | null>(null);
    mapRegistry.register('m5', first);
    mapRegistry.register('m5', second);
    expect(mapRegistry.get('m5')).toBe(second);
  });
});

describe('layerRegistry', () => {
  it('register returns increasing ids and tracks size', () => {
    const before = layerRegistry.size;
    const id1 = layerRegistry.register(fakeLayer());
    const id2 = layerRegistry.register(fakeLayer());
    expect(id2).toBe(id1 + 1);
    expect(layerRegistry.size).toBe(before + 2);
    layerRegistry.unregister(id1);
    layerRegistry.unregister(id2);
    expect(layerRegistry.size).toBe(before);
  });

  it('unregister removes only the given id', () => {
    const before = layerRegistry.size;
    const id1 = layerRegistry.register(fakeLayer());
    const id2 = layerRegistry.register(fakeLayer());
    layerRegistry.unregister(id1);
    expect(layerRegistry.size).toBe(before + 1);
    layerRegistry.unregister(id2);
    expect(layerRegistry.size).toBe(before);
  });
});
