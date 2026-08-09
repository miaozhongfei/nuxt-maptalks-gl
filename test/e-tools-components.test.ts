// @vitest-environment jsdom

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { shallowRef } from 'vue';

import MaptalksAreaTool from '../src/runtime/components/maptool/MaptalksAreaTool.vue';
import MaptalksDistanceTool from '../src/runtime/components/maptool/MaptalksDistanceTool.vue';
import { MAP_KEY } from '../src/runtime/core/map-context';
import type { MaptalksMap } from '../src/runtime/types';

const { distanceTool, areaTool } = vi.hoisted(() => ({
  distanceTool: vi.fn(),
  areaTool: vi.fn(),
}));

vi.mock('../src/runtime/composables/maptool/useMaptalksDistanceTool', () => ({
  useMaptalksDistanceTool: distanceTool,
}));
vi.mock('../src/runtime/composables/maptool/useMaptalksAreaTool', () => ({
  useMaptalksAreaTool: areaTool,
}));

const provideMap = { [MAP_KEY]: shallowRef<MaptalksMap | null>({} as MaptalksMap) };

describe('tool components', () => {
  it('DistanceTool', () => {
    const w = mount(MaptalksDistanceTool, { global: { provide: provideMap } });
    expect(distanceTool).toHaveBeenCalledTimes(1);
    w.unmount();
  });

  it('AreaTool', () => {
    const w = mount(MaptalksAreaTool, { global: { provide: provideMap } });
    expect(areaTool).toHaveBeenCalledTimes(1);
    w.unmount();
  });
});
