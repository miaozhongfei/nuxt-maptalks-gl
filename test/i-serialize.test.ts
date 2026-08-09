import { describe, expect, it, vi } from 'vitest';
import { shallowRef } from 'vue';

import { useMaptalksSerialize } from '../src/runtime/composables/map/useMaptalksSerialize';
import type { MaptalksMap } from '../src/runtime/types';

describe('useMaptalksSerialize', () => {
  it('toJSON 委托 map.toJSON', () => {
    const map = { toJSON: vi.fn(() => ({ k: 'v' })) } as unknown as MaptalksMap;
    const { toJSON } = useMaptalksSerialize(shallowRef<MaptalksMap | null>(map));
    expect(toJSON()).toEqual({ k: 'v' });
    expect(map.toJSON).toHaveBeenCalled();
  });

  it('fromJSON 委托 map.fromJSON', () => {
    const map = { fromJSON: vi.fn() } as unknown as MaptalksMap;
    const { fromJSON } = useMaptalksSerialize(shallowRef<MaptalksMap | null>(map));
    fromJSON({ k: 'v' });
    expect(map.fromJSON).toHaveBeenCalledWith({ k: 'v' });
  });

  it('map 为 null 时 toJSON 返回 null', () => {
    const { toJSON } = useMaptalksSerialize(shallowRef<MaptalksMap | null>(null));
    expect(toJSON()).toBeNull();
  });
});
