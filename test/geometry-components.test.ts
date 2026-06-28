// @vitest-environment jsdom

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { shallowRef } from 'vue';

import MaptalksLineString from '../src/runtime/components/MaptalksLineString.vue';
import MaptalksMarker from '../src/runtime/components/MaptalksMarker.vue';
import MaptalksPolygon from '../src/runtime/components/MaptalksPolygon.vue';
import MaptalksVectorLayer from '../src/runtime/components/MaptalksVectorLayer.vue';
import { GEOMETRY_LAYER_KEY, MAP_KEY } from '../src/runtime/core/map-context';
import type { MaptalksMap, MaptalksVectorLayer as MVL } from '../src/runtime/types';

const { vl, marker, line, poly } = vi.hoisted(() => ({
  vl: vi.fn(),
  marker: vi.fn(),
  line: vi.fn(),
  poly: vi.fn(),
}));

vi.mock('../src/runtime/composables/presets/useMaptalksVectorLayer', () => ({
  useMaptalksVectorLayer: vl,
}));
vi.mock('../src/runtime/composables/presets/useMaptalksMarker', () => ({
  useMaptalksMarker: marker,
}));
vi.mock('../src/runtime/composables/presets/useMaptalksLineString', () => ({
  useMaptalksLineString: line,
}));
vi.mock('../src/runtime/composables/presets/useMaptalksPolygon', () => ({
  useMaptalksPolygon: poly,
}));

describe('MaptalksVectorLayer', () => {
  it('注入 map 并调用 useMaptalksVectorLayer', () => {
    vl.mockReturnValue({ layer: shallowRef(null) });
    const map = {} as MaptalksMap;
    const wrapper = mount(MaptalksVectorLayer, {
      props: { id: 'geo', autoDispose: false },
      global: { provide: { [MAP_KEY]: shallowRef<MaptalksMap | null>(map) } },
    });
    expect(vl).toHaveBeenCalledTimes(1);
    const [, opts] = vl.mock.calls[0]!;
    expect(opts).toMatchObject({ id: 'geo', autoDispose: false });
    wrapper.unmount();
  });
});

describe('geometry components', () => {
  const layerProvide = { [GEOMETRY_LAYER_KEY]: shallowRef<MVL | null>({} as MVL) };

  it('MaptalksMarker 注入 layer 并调用 useMaptalksMarker', () => {
    const wrapper = mount(MaptalksMarker, {
      props: { coordinates: [1, 2] },
      global: { provide: layerProvide },
    });
    expect(marker).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('MaptalksLineString 调用 useMaptalksLineString', () => {
    const wrapper = mount(MaptalksLineString, {
      props: {
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      },
      global: { provide: layerProvide },
    });
    expect(line).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('MaptalksPolygon 调用 useMaptalksPolygon', () => {
    const wrapper = mount(MaptalksPolygon, {
      props: {
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 0],
          ],
        ],
      },
      global: { provide: layerProvide },
    });
    expect(poly).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
});
