// @vitest-environment nuxt

import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, shallowRef } from 'vue';

import { useMaptalksLineString } from '../src/runtime/composables/geometry/useMaptalksLineString';
import { useMaptalksMarker } from '../src/runtime/composables/geometry/useMaptalksMarker';
import { useMaptalksPolygon } from '../src/runtime/composables/geometry/useMaptalksPolygon';
import { useMaptalksVectorLayer } from '../src/runtime/composables/layer/useMaptalksVectorLayer';
import type { MaptalksMap, MaptalksVectorLayer } from '../src/runtime/types';

const { mt } = vi.hoisted(() => ({
  mt: {
    VectorLayer: vi.fn(function FakeVL(id: string, o?: unknown) {
      return { id, o, remove: vi.fn(), config: vi.fn(), addGeometry: vi.fn() };
    }),
    Marker: vi.fn(function FakeMarker(c: unknown, o?: unknown) {
      return { c, o, remove: vi.fn(), on: vi.fn(), off: vi.fn() };
    }),
    LineString: vi.fn(function FakeLine(c: unknown, o?: unknown) {
      return { c, o, remove: vi.fn(), on: vi.fn(), off: vi.fn() };
    }),
    Polygon: vi.fn(function FakePoly(c: unknown, o?: unknown) {
      return { c, o, remove: vi.fn(), on: vi.fn(), off: vi.fn() };
    }),
  },
}));

vi.mock('../src/runtime/core/loader', () => ({
  loadMaptalks: vi.fn(() => Promise.resolve(mt)),
  isWebGLAvailable: () => true,
}));

/** 在组件 setup 里跑回调（提供 Nuxt 运行时上下文） */
async function run(cb: () => void): Promise<void> {
  await mountSuspended(
    defineComponent({
      setup() {
        cb();
        return () => h('div');
      },
    }),
  );
}

/** 提供假 VectorLayer ref（addGeometry spy） */
function fakeLayerRef() {
  const addGeometry = vi.fn();
  const layer = shallowRef<MaptalksVectorLayer | null>({
    addGeometry,
  } as unknown as MaptalksVectorLayer);
  return { layer, addGeometry };
}

describe('useMaptalksVectorLayer', () => {
  it('创建 VectorLayer 并 addLayer', async () => {
    const addLayer = vi.fn();
    const map = shallowRef<MaptalksMap | null>({
      addLayer,
      removeLayer: vi.fn(),
    } as unknown as MaptalksMap);
    await run(() => useMaptalksVectorLayer(map, { id: 'geo' }));
    await vi.waitFor(() => expect(mt.VectorLayer).toHaveBeenCalled());
    expect(mt.VectorLayer.mock.calls[0]?.[0]).toBe('geo');
    expect(addLayer).toHaveBeenCalled();
  });
});

describe('geometry presets', () => {
  it('useMaptalksMarker 用 mt.Marker 创建并 addGeometry', async () => {
    const { layer, addGeometry } = fakeLayerRef();
    await run(() => useMaptalksMarker(layer, { coordinates: [113.27, 23.13] }));
    await vi.waitFor(() => expect(mt.Marker).toHaveBeenCalled());
    expect(mt.Marker.mock.calls[0]?.[0]).toEqual([113.27, 23.13]);
    expect(addGeometry).toHaveBeenCalled();
  });

  it('useMaptalksLineString 用 mt.LineString 创建', async () => {
    const { layer } = fakeLayerRef();
    await run(() =>
      useMaptalksLineString(layer, {
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      }),
    );
    await vi.waitFor(() => expect(mt.LineString).toHaveBeenCalled());
    expect(mt.LineString.mock.calls[0]?.[0]).toEqual([
      [0, 0],
      [1, 1],
    ]);
  });
});

describe('geometry presets（多边形）', () => {
  it('useMaptalksPolygon 用 mt.Polygon 创建', async () => {
    const { layer } = fakeLayerRef();
    await run(() =>
      useMaptalksPolygon(layer, {
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 0],
          ],
        ],
      }),
    );
    await vi.waitFor(() => expect(mt.Polygon).toHaveBeenCalled());
    expect(mt.Polygon.mock.calls[0]?.[0]).toEqual([
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 0],
      ],
    ]);
  });
});
