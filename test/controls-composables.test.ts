import { describe, expect, it, vi } from 'vitest';
import { effectScope, shallowRef } from 'vue';
import { useMaptalksZoom } from '../src/runtime/composables/useMaptalksZoom';
import { useMaptalksScale } from '../src/runtime/composables/useMaptalksScale';
import { useMaptalksAttribution } from '../src/runtime/composables/useMaptalksAttribution';
import { useMaptalksCompass } from '../src/runtime/composables/useMaptalksCompass';
import type { MaptalksMap } from '../src/runtime/types';

const { controls } = vi.hoisted(() => ({
  controls: {
    Zoom: vi.fn(function (this: any, opts?: unknown) { this.opts = opts; this.addTo = vi.fn(); this.remove = vi.fn(); return this; }),
    Scale: vi.fn(function (this: any, opts?: unknown) { this.opts = opts; this.addTo = vi.fn(); this.remove = vi.fn(); return this; }),
    Attribution: vi.fn(function (this: any, opts?: unknown) { this.opts = opts; this.addTo = vi.fn(); this.remove = vi.fn(); return this; }),
    Compass: vi.fn(function (this: any, opts?: unknown) { this.opts = opts; this.addTo = vi.fn(); this.remove = vi.fn(); return this; }),
  },
}));
vi.mock('../src/runtime/core/loader', () => ({
  loadMaptalks: vi.fn(() => Promise.resolve({ control: controls })),
  isWebGLAvailable: () => true,
}));

function fakeMap() { return { addControl: vi.fn() } as unknown as MaptalksMap; }

describe('control composables', () => {
  it('Zoom 创建并 addTo', async () => {
    const m = fakeMap();
    const s = effectScope();
    s.run(() => useMaptalksZoom(shallowRef(m), { position: 'tl' }));
    await vi.waitFor(() => expect(controls.Zoom).toHaveBeenCalled());
    const ctrl = controls.Zoom.mock.results[0]?.value;
    expect(ctrl?.addTo).toHaveBeenCalledWith(m);
    s.stop();
  });

  it('Scale 创建', async () => {
    const m = fakeMap();
    const s = effectScope();
    s.run(() => useMaptalksScale(shallowRef(m)));
    await vi.waitFor(() => expect(controls.Scale).toHaveBeenCalled());
    s.stop();
  });

  it('Attribution 创建', async () => {
    const m = fakeMap();
    const s = effectScope();
    s.run(() => useMaptalksAttribution(shallowRef(m)));
    await vi.waitFor(() => expect(controls.Attribution).toHaveBeenCalled());
    s.stop();
  });

  it('Compass 创建', async () => {
    const m = fakeMap();
    const s = effectScope();
    s.run(() => useMaptalksCompass(shallowRef(m)));
    await vi.waitFor(() => expect(controls.Compass).toHaveBeenCalled());
    s.stop();
  });
});
