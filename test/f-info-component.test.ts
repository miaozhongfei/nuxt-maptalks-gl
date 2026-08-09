// @vitest-environment jsdom

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { shallowRef } from 'vue';

import MaptalksInfoWindow from '../src/runtime/components/ui/MaptalksInfoWindow.vue';
import { MAP_KEY } from '../src/runtime/core/map-context';
import type { MaptalksMap } from '../src/runtime/types';

const fakeIW = {
  addTo: vi.fn().mockReturnThis(),
  remove: vi.fn(),
  show: vi.fn().mockReturnThis(),
  hide: vi.fn().mockReturnThis(),
  isVisible: vi.fn().mockReturnValue(false),
  setContent: vi.fn().mockReturnThis(),
  setCoordinates: vi.fn().mockReturnThis(),
};

const mockUseIW = {
  infoWindow: shallowRef(fakeIW),
  show: vi.fn(),
  hide: vi.fn(() => fakeIW.hide()),
  remove: vi.fn(),
};

vi.mock('../src/runtime/composables/ui/useMaptalksInfoWindow', () => ({
  useMaptalksInfoWindow: vi.fn(() => mockUseIW),
}));

const provideMap = { [MAP_KEY]: shallowRef<MaptalksMap | null>({} as MaptalksMap) };

describe('MaptalksInfoWindow 组件', () => {
  it('注入 map 并调用 useMaptalksInfoWindow', () => {
    const w = mount(MaptalksInfoWindow, { global: { provide: provideMap } });
    expect(w.exists()).toBe(true);
    w.unmount();
  });

  it('渲染 slot 内容并调用 setContent', async () => {
    fakeIW.setContent.mockClear();
    const wrapper = mount(MaptalksInfoWindow, {
      slots: { default: '<div id="slot-child">Hello</div>' },
      global: { provide: provideMap },
    });
    await wrapper.vm.$nextTick();
    expect(fakeIW.setContent).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('visible=false 时调用 hide', () => {
    fakeIW.hide.mockClear();
    const wrapper = mount(MaptalksInfoWindow, {
      props: { visible: false },
      global: { provide: provideMap },
    });
    expect(fakeIW.hide).toHaveBeenCalled();
    wrapper.unmount();
  });
});
