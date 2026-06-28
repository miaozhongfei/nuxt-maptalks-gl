// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { shallowRef } from 'vue';
import { mount } from '@vue/test-utils';

import MaptalksTileLayer from '../src/runtime/components/MaptalksTileLayer.vue';
import MaptalksVectorTileLayer from '../src/runtime/components/MaptalksVectorTileLayer.vue';
import MaptalksGroupGLLayer from '../src/runtime/components/MaptalksGroupGLLayer.vue';
import MaptalksGLTFLayer from '../src/runtime/components/MaptalksGLTFLayer.vue';
import { MAP_KEY } from '../src/runtime/core/map-context';
import type { MaptalksMap } from '../src/runtime/types';

// mock 四个预设 composable 为 spy
const { gtlm, vtlm, grpm, gltf } = vi.hoisted(() => ({
  gtlm: vi.fn(),
  vtlm: vi.fn(),
  grpm: vi.fn(),
  gltf: vi.fn(),
}));

vi.mock(
  '../src/runtime/composables/presets/useMaptalksTileLayer',
  () => ({ useMaptalksTileLayer: gtlm }),
);
vi.mock(
  '../src/runtime/composables/presets/useMaptalksVectorTileLayer',
  () => ({ useMaptalksVectorTileLayer: vtlm }),
);
vi.mock(
  '../src/runtime/composables/presets/useMaptalksGroupGLLayer',
  () => ({ useMaptalksGroupGLLayer: grpm }),
);
vi.mock(
  '../src/runtime/composables/presets/useMaptalksGLTFLayer',
  () => ({ useMaptalksGLTFLayer: gltf }),
);

/** 提供假 map 给组件 inject 链 */
function provideMap(map: MaptalksMap): Record<string | symbol, unknown> {
  return { [MAP_KEY]: shallowRef<MaptalksMap | null>(map) } as Record<string | symbol, unknown>;
}

describe('MaptalksTileLayer', () => {
  it('injects the map and calls useMaptalksTileLayer with props', () => {
    const map = {} as MaptalksMap;
    const wrapper = mount(MaptalksTileLayer, {
      props: { source: 'pub', id: 't', options: { o: 1 }, autoDispose: false },
      global: { provide: provideMap(map) },
    });
    expect(gtlm).toHaveBeenCalledTimes(1);
    const [, opts] = gtlm.mock.calls[0]!;
    expect(opts).toMatchObject({ source: 'pub', id: 't', options: { o: 1 }, autoDispose: false });
    wrapper.unmount();
  });
});

describe('MaptalksVectorTileLayer', () => {
  it('injects the map and calls useMaptalksVectorTileLayer with props', () => {
    const map = {} as MaptalksMap;
    const wrapper = mount(MaptalksVectorTileLayer, {
      props: { source: 'vt', id: 'v', autoDispose: true },
      global: { provide: provideMap(map) },
    });
    expect(vtlm).toHaveBeenCalledTimes(1);
    const [, opts] = vtlm.mock.calls[0]!;
    expect(opts).toMatchObject({ source: 'vt', id: 'v', autoDispose: true });
    wrapper.unmount();
  });
});

describe('MaptalksGLTFLayer', () => {
  it('injects the map and calls useMaptalksGLTFLayer with props', () => {
    const map = {} as MaptalksMap;
    const wrapper = mount(MaptalksGLTFLayer, {
      props: { id: 'g', autoDispose: false },
      global: { provide: provideMap(map) },
    });
    expect(gltf).toHaveBeenCalledTimes(1);
    const [, opts] = gltf.mock.calls[0]!;
    expect(opts).toMatchObject({ id: 'g', autoDispose: false });
    wrapper.unmount();
  });
});

describe('MaptalksGroupGLLayer', () => {
  it('injects the map and calls useMaptalksGroupGLLayer with props', () => {
    const map = {} as MaptalksMap;
    const wrapper = mount(MaptalksGroupGLLayer, {
      props: { id: 'grp', options: { sceneConfig: { x: 1 } }, autoDispose: true },
      global: { provide: provideMap(map) },
    });
    expect(grpm).toHaveBeenCalledTimes(1);
    const [, opts] = grpm.mock.calls[0]!;
    expect(opts).toMatchObject({ id: 'grp', options: { sceneConfig: { x: 1 } }, autoDispose: true });
    wrapper.unmount();
  });
});
