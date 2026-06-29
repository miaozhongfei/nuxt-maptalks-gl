// @vitest-environment jsdom

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { shallowRef } from 'vue';

import MaptalksAttributionControl from '../src/runtime/components/MaptalksAttributionControl.vue';
import MaptalksCompassControl from '../src/runtime/components/MaptalksCompassControl.vue';
import MaptalksScaleControl from '../src/runtime/components/MaptalksScaleControl.vue';
import MaptalksZoomControl from '../src/runtime/components/MaptalksZoomControl.vue';
import { MAP_KEY } from '../src/runtime/core/map-context';
import type { MaptalksMap } from '../src/runtime/types';

const { zoom, scale, attr, compass } = vi.hoisted(() => ({
  zoom: vi.fn(),
  scale: vi.fn(),
  attr: vi.fn(),
  compass: vi.fn(),
}));

vi.mock('../src/runtime/composables/useMaptalksZoom', () => ({ useMaptalksZoom: zoom }));
vi.mock('../src/runtime/composables/useMaptalksScale', () => ({ useMaptalksScale: scale }));
vi.mock('../src/runtime/composables/useMaptalksAttribution', () => ({
  useMaptalksAttribution: attr,
}));
vi.mock('../src/runtime/composables/useMaptalksCompass', () => ({ useMaptalksCompass: compass }));

const provideMap = { [MAP_KEY]: shallowRef<MaptalksMap | null>({} as MaptalksMap) };

describe('control components', () => {
  it('Zoom', () => {
    const w = mount(MaptalksZoomControl, { global: { provide: provideMap } });
    expect(zoom).toHaveBeenCalledTimes(1);
    w.unmount();
  });

  it('Scale', () => {
    const w = mount(MaptalksScaleControl, { global: { provide: provideMap } });
    expect(scale).toHaveBeenCalledTimes(1);
    w.unmount();
  });

  it('Attribution', () => {
    const w = mount(MaptalksAttributionControl, { global: { provide: provideMap } });
    expect(attr).toHaveBeenCalledTimes(1);
    w.unmount();
  });

  it('Compass', () => {
    const w = mount(MaptalksCompassControl, { global: { provide: provideMap } });
    expect(compass).toHaveBeenCalledTimes(1);
    w.unmount();
  });
});
