// @vitest-environment nuxt

import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, shallowRef } from 'vue';

import { useMaptalksLabel } from '../src/runtime/composables/presets/useMaptalksLabel';
import { useMaptalksTextBox } from '../src/runtime/composables/presets/useMaptalksTextBox';
import type { MaptalksVectorLayer } from '../src/runtime/types';

const { mt } = vi.hoisted(() => ({
  mt: {
    Label: vi.fn((...args: unknown[]) => ({ args, remove: vi.fn(), on: vi.fn(), off: vi.fn() })),
    TextBox: vi.fn((...args: unknown[]) => ({ args, remove: vi.fn(), on: vi.fn(), off: vi.fn() })),
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

describe('text presets', () => {
  it('Label: content + coord', async () => {
    const { layer } = fakeLayerRef();
    await run(() => useMaptalksLabel(layer, { content: 'hi', coordinates: [0, 0] }));
    await vi.waitFor(() => expect(mt.Label).toHaveBeenCalled());
    expect(mt.Label.mock.calls[0]?.slice(0, 2)).toEqual(['hi', [0, 0]]);
  });

  it('TextBox: content + coord + width + height', async () => {
    const { layer } = fakeLayerRef();
    await run(() =>
      useMaptalksTextBox(layer, { content: 'hi', coordinates: [0, 0], width: 10, height: 20 }),
    );
    await vi.waitFor(() => expect(mt.TextBox).toHaveBeenCalled());
    expect(mt.TextBox.mock.calls[0]?.slice(0, 4)).toEqual(['hi', [0, 0], 10, 20]);
  });
});
