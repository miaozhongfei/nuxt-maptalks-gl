// @vitest-environment jsdom
// oxlint-disable import/max-dependencies

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { shallowRef } from 'vue';

import MaptalksCircle from '../src/runtime/components/geometry/MaptalksCircle.vue';
import MaptalksEllipse from '../src/runtime/components/geometry/MaptalksEllipse.vue';
import MaptalksLabel from '../src/runtime/components/geometry/MaptalksLabel.vue';
import MaptalksRectangle from '../src/runtime/components/geometry/MaptalksRectangle.vue';
import MaptalksSector from '../src/runtime/components/geometry/MaptalksSector.vue';
import MaptalksTextBox from '../src/runtime/components/geometry/MaptalksTextBox.vue';
import { GEOMETRY_LAYER_KEY } from '../src/runtime/core/map-context';
import type { MaptalksVectorLayer as MVL } from '../src/runtime/types';

const { circle, rect, ellipse, sector, label, textbox } = vi.hoisted(() => ({
  circle: vi.fn(),
  rect: vi.fn(),
  ellipse: vi.fn(),
  sector: vi.fn(),
  label: vi.fn(),
  textbox: vi.fn(),
}));

vi.mock('../src/runtime/composables/geometry/useMaptalksCircle', () => ({
  useMaptalksCircle: circle,
}));
vi.mock('../src/runtime/composables/geometry/useMaptalksRectangle', () => ({
  useMaptalksRectangle: rect,
}));
vi.mock('../src/runtime/composables/geometry/useMaptalksEllipse', () => ({
  useMaptalksEllipse: ellipse,
}));
vi.mock('../src/runtime/composables/geometry/useMaptalksSector', () => ({
  useMaptalksSector: sector,
}));
vi.mock('../src/runtime/composables/geometry/useMaptalksLabel', () => ({ useMaptalksLabel: label }));
vi.mock('../src/runtime/composables/geometry/useMaptalksTextBox', () => ({
  useMaptalksTextBox: textbox,
}));

const layerProvide = { [GEOMETRY_LAYER_KEY]: shallowRef<MVL | null>({} as MVL) };

describe('MaptalksCircle', () => {
  it('调用预设', () => {
    const w = mount(MaptalksCircle, {
      props: { coordinates: [0, 0], radius: 100 },
      global: { provide: layerProvide },
    });
    expect(circle).toHaveBeenCalledTimes(1);
    w.unmount();
  });
});

describe('MaptalksRectangle', () => {
  it('调用预设', () => {
    const w = mount(MaptalksRectangle, {
      props: { coordinates: [0, 0], width: 10, height: 20 },
      global: { provide: layerProvide },
    });
    expect(rect).toHaveBeenCalledTimes(1);
    w.unmount();
  });
});

describe('MaptalksEllipse', () => {
  it('调用预设', () => {
    const w = mount(MaptalksEllipse, {
      props: { coordinates: [0, 0], width: 10, height: 20 },
      global: { provide: layerProvide },
    });
    expect(ellipse).toHaveBeenCalledTimes(1);
    w.unmount();
  });
});

describe('MaptalksSector', () => {
  it('调用预设', () => {
    const w = mount(MaptalksSector, {
      props: { coordinates: [0, 0], radius: 100, startAngle: 0, endAngle: 90 },
      global: { provide: layerProvide },
    });
    expect(sector).toHaveBeenCalledTimes(1);
    w.unmount();
  });
});

describe('MaptalksLabel', () => {
  it('调用预设', () => {
    const w = mount(MaptalksLabel, {
      props: { content: 'hi', coordinates: [0, 0] },
      global: { provide: layerProvide },
    });
    expect(label).toHaveBeenCalledTimes(1);
    w.unmount();
  });
});

describe('MaptalksTextBox', () => {
  it('调用预设', () => {
    const w = mount(MaptalksTextBox, {
      props: { content: 'hi', coordinates: [0, 0], width: 10, height: 20 },
      global: { provide: layerProvide },
    });
    expect(textbox).toHaveBeenCalledTimes(1);
    w.unmount();
  });
});
