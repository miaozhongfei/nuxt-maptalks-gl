// @vitest-environment nuxt

import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, shallowRef } from 'vue';

import { useMaptalksCircle } from '../src/runtime/composables/geometry/useMaptalksCircle';
import { useMaptalksEllipse } from '../src/runtime/composables/geometry/useMaptalksEllipse';
import { useMaptalksRectangle } from '../src/runtime/composables/geometry/useMaptalksRectangle';
import { useMaptalksSector } from '../src/runtime/composables/geometry/useMaptalksSector';
import type { MaptalksVectorLayer } from '../src/runtime/types';

const { mt } = vi.hoisted(() => ({
  mt: {
    Circle: vi.fn((...args: unknown[]) => ({ args, remove: vi.fn(), on: vi.fn(), off: vi.fn() })),
    Rectangle: vi.fn((...args: unknown[]) => ({
      args,
      remove: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    })),
    Ellipse: vi.fn((...args: unknown[]) => ({ args, remove: vi.fn(), on: vi.fn(), off: vi.fn() })),
    Sector: vi.fn((...args: unknown[]) => ({ args, remove: vi.fn(), on: vi.fn(), off: vi.fn() })),
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
  return {
    layer: shallowRef<MaptalksVectorLayer | null>({
      addGeometry,
    } as unknown as MaptalksVectorLayer),
    addGeometry,
  };
}

describe('shape presets', () => {
  it('Circle: center + radius 传构造器', async () => {
    const { layer } = fakeLayerRef();
    await run(() => useMaptalksCircle(layer, { coordinates: [0, 0], radius: 100 }));
    await vi.waitFor(() => expect(mt.Circle).toHaveBeenCalled());
    expect(mt.Circle.mock.calls[0]?.[0]).toEqual([0, 0]);
    expect(mt.Circle.mock.calls[0]?.[1]).toBe(100);
  });

  it('Rectangle: coord + width + height', async () => {
    const { layer } = fakeLayerRef();
    await run(() => useMaptalksRectangle(layer, { coordinates: [0, 0], width: 10, height: 20 }));
    await vi.waitFor(() => expect(mt.Rectangle).toHaveBeenCalled());
    expect(mt.Rectangle.mock.calls[0]?.slice(0, 3)).toEqual([[0, 0], 10, 20]);
  });

  it('Ellipse: center + width + height', async () => {
    const { layer } = fakeLayerRef();
    await run(() => useMaptalksEllipse(layer, { coordinates: [0, 0], width: 10, height: 20 }));
    await vi.waitFor(() => expect(mt.Ellipse).toHaveBeenCalled());
    expect(mt.Ellipse.mock.calls[0]?.slice(0, 3)).toEqual([[0, 0], 10, 20]);
  });

  it('Sector: center + radius + angles', async () => {
    const { layer } = fakeLayerRef();
    await run(() =>
      useMaptalksSector(layer, { coordinates: [0, 0], radius: 100, startAngle: 0, endAngle: 90 }),
    );
    await vi.waitFor(() => expect(mt.Sector).toHaveBeenCalled());
    expect(mt.Sector.mock.calls[0]?.slice(0, 4)).toEqual([[0, 0], 100, 0, 90]);
  });
});
