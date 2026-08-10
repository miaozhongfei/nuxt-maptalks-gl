// @vitest-environment jsdom

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { shallowRef } from 'vue';

import MaptalksGeoJSON from '../src/runtime/components/geo/MaptalksGeoJSON.vue';
import MaptalksMultiLineString from '../src/runtime/components/geometry/MaptalksMultiLineString.vue';
import MaptalksMultiPoint from '../src/runtime/components/geometry/MaptalksMultiPoint.vue';
import MaptalksMultiPolygon from '../src/runtime/components/geometry/MaptalksMultiPolygon.vue';
import { GEOMETRY_LAYER_KEY } from '../src/runtime/core/map-context';
import type { MaptalksVectorLayer as MVL } from '../src/runtime/types';

const { mp, ml, mpoly, gj } = vi.hoisted(() => ({
  mp: vi.fn(),
  ml: vi.fn(),
  mpoly: vi.fn(),
  gj: vi.fn(),
}));

vi.mock('../src/runtime/composables/geometry/useMaptalksMultiPoint', () => ({
  useMaptalksMultiPoint: mp,
}));
vi.mock('../src/runtime/composables/geometry/useMaptalksMultiLineString', () => ({
  useMaptalksMultiLineString: ml,
}));
vi.mock('../src/runtime/composables/geometry/useMaptalksMultiPolygon', () => ({
  useMaptalksMultiPolygon: mpoly,
}));
vi.mock('../src/runtime/composables/geo/useMaptalksGeoJSON', () => ({ useMaptalksGeoJSON: gj }));

const layerProvide = { [GEOMETRY_LAYER_KEY]: shallowRef<MVL | null>({} as MVL) };

describe('multi geometry components', () => {
  it('MaptalksMultiPoint 调用预设', () => {
    const w = mount(MaptalksMultiPoint, {
      props: { coordinates: [[0, 0]] },
      global: { provide: layerProvide },
    });
    expect(mp).toHaveBeenCalledTimes(1);
    w.unmount();
  });

  it('MaptalksMultiLineString 调用预设', () => {
    const w = mount(MaptalksMultiLineString, {
      props: {
        coordinates: [
          [
            [0, 0],
            [1, 1],
          ],
        ],
      },
      global: { provide: layerProvide },
    });
    expect(ml).toHaveBeenCalledTimes(1);
    w.unmount();
  });

  it('MaptalksMultiPolygon 调用预设', () => {
    const w = mount(MaptalksMultiPolygon, {
      props: {
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
      },
      global: { provide: layerProvide },
    });
    expect(mpoly).toHaveBeenCalledTimes(1);
    w.unmount();
  });
});

describe('geojson component', () => {
  it('MaptalksGeoJSON 调用 composable', () => {
    const w = mount(MaptalksGeoJSON, {
      props: { data: { type: 'FeatureCollection', features: [] } },
      global: { provide: layerProvide },
    });
    expect(gj).toHaveBeenCalledTimes(1);
    w.unmount();
  });
});
