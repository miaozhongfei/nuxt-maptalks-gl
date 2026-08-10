// @vitest-environment nuxt

import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, shallowRef } from 'vue';

import { useMaptalksMultiLineString } from '../src/runtime/composables/geometry/useMaptalksMultiLineString';
import { useMaptalksMultiPoint } from '../src/runtime/composables/geometry/useMaptalksMultiPoint';
import { useMaptalksMultiPolygon } from '../src/runtime/composables/geometry/useMaptalksMultiPolygon';
import type { MaptalksVectorLayer } from '../src/runtime/types';

const { mt } = vi.hoisted(() => ({
  mt: {
    MultiPoint: vi.fn(function FakeMP(c: unknown, o?: unknown) {
      return { c, o, remove: vi.fn(), on: vi.fn(), off: vi.fn() };
    }),
    MultiLineString: vi.fn(function FakeML(c: unknown, o?: unknown) {
      return { c, o, remove: vi.fn(), on: vi.fn(), off: vi.fn() };
    }),
    MultiPolygon: vi.fn(function FakeMPoly(c: unknown, o?: unknown) {
      return { c, o, remove: vi.fn(), on: vi.fn(), off: vi.fn() };
    }),
  },
}));

vi.mock('../src/runtime/core/loader', () => ({
  loadMaptalks: vi.fn(() => Promise.resolve(mt)),
  isWebGLAvailable: () => true,
}));

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

function fakeLayerRef() {
  const addGeometry = vi.fn();
  const layer = shallowRef<MaptalksVectorLayer | null>({
    addGeometry,
  } as unknown as MaptalksVectorLayer);
  return { layer, addGeometry };
}

describe('multi geometry presets - multi point', () => {
  it('useMaptalksMultiPoint 用 mt.MultiPoint 创建', async () => {
    const { layer, addGeometry } = fakeLayerRef();
    await run(() =>
      useMaptalksMultiPoint(layer, {
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      }),
    );
    await vi.waitFor(() => expect(mt.MultiPoint).toHaveBeenCalled());
    expect(mt.MultiPoint.mock.calls[0]?.[0]).toEqual([
      [0, 0],
      [1, 1],
    ]);
    expect(addGeometry).toHaveBeenCalled();
  });
});

describe('multi geometry presets - multi line string', () => {
  it('useMaptalksMultiLineString 用 mt.MultiLineString 创建', async () => {
    const { layer } = fakeLayerRef();
    await run(() =>
      useMaptalksMultiLineString(layer, {
        coordinates: [
          [
            [0, 0],
            [1, 1],
          ],
        ],
      }),
    );
    await vi.waitFor(() => expect(mt.MultiLineString).toHaveBeenCalled());
    expect(mt.MultiLineString.mock.calls[0]?.[0]).toEqual([
      [
        [0, 0],
        [1, 1],
      ],
    ]);
  });
});

describe('multi geometry presets - multi polygon', () => {
  it('useMaptalksMultiPolygon 用 mt.MultiPolygon 创建', async () => {
    const { layer } = fakeLayerRef();
    await run(() =>
      useMaptalksMultiPolygon(layer, {
        coordinates: [
          [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 0],
            ],
          ],
        ],
      }),
    );
    await vi.waitFor(() => expect(mt.MultiPolygon).toHaveBeenCalled());
    expect(mt.MultiPolygon.mock.calls[0]?.[0]).toEqual([
      [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 0],
        ],
      ],
    ]);
  });
});
