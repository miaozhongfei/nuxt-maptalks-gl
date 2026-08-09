import { describe, expect, it, vi } from 'vitest';

import { useMaptalksCoordinate } from '../src/runtime/composables/basic-types/useMaptalksCoordinate';
import type { MaptalksCoordinate, MaptalksMap } from '../src/runtime/types';

describe('useMaptalksCoordinate', () => {
  it('returns the coord unchanged when from === to', () => {
    const { convert } = useMaptalksCoordinate();
    const c: MaptalksCoordinate = { x: 1, y: 2 };
    expect(convert(c, 'EPSG:4326', 'EPSG:4326')).toBe(c);
  });

  it('throws when converting across CRS without a transform', () => {
    const { convert } = useMaptalksCoordinate();
    expect(() => convert({ x: 1, y: 2 }, 'EPSG:3857', 'EPSG:4326')).toThrow();
  });

  it('uses the injected transform across CRS', () => {
    const transform = vi.fn((c: MaptalksCoordinate) => ({ x: c.x + 1, y: c.y + 1 }));
    const { convert } = useMaptalksCoordinate({ transform });
    expect(convert({ x: 1, y: 2 }, 'A', 'B')).toEqual({ x: 2, y: 3 });
    expect(transform).toHaveBeenCalledWith({ x: 1, y: 2 }, 'A', 'B');
  });

  it('toContainerPoint delegates to the map method', () => {
    const { toContainerPoint } = useMaptalksCoordinate();
    const point = { x: 10, y: 20 };
    const map = { coordinateToContainerPoint: vi.fn(() => point) } as unknown as MaptalksMap;
    expect(toContainerPoint(map, { x: 1, y: 2 })).toBe(point);
  });

  it('toCoordinate returns null when the map lacks the method', () => {
    const { toCoordinate } = useMaptalksCoordinate();
    expect(toCoordinate({} as unknown as MaptalksMap, { x: 1, y: 2 })).toBeNull();
  });
});
