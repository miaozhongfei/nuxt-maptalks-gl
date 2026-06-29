import { describe, expect, it, vi } from 'vitest';

import { geoJSONToGeometry, geometryToGeoJSON } from '../src/runtime/core/geojson-utils';
import type { MaptalksGeometry } from '../src/runtime/types';

const { mt } = vi.hoisted(() => ({
  mt: {
    GeoJSON: {
      toGeometry: vi.fn((_g: unknown) => [{ id: 'g1' }, { id: 'g2' }]),
    },
  },
}));

vi.mock('../src/runtime/core/loader', () => ({
  loadMaptalks: vi.fn(() => Promise.resolve(mt)),
  isWebGLAvailable: () => true,
}));

describe('geojson-utils', () => {
  it('geoJSONToGeometry 调用 GeoJSON.toGeometry 并统一成数组', async () => {
    const result = await geoJSONToGeometry({ type: 'FeatureCollection', features: [] });
    expect(mt.GeoJSON.toGeometry).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });

  it('geoJSONToGeometry 把单个结果也规整成数组', async () => {
    mt.GeoJSON.toGeometry.mockReturnValueOnce({ id: 'solo' } as never);
    const result = await geoJSONToGeometry({ type: 'Feature' });
    expect(result).toHaveLength(1);
  });

  it('geometryToGeoJSON 委托 geometry.toGeoJSON', () => {
    const geo = { toGeoJSON: vi.fn(() => ({ type: 'Point' })) } as unknown as MaptalksGeometry;
    expect(geometryToGeoJSON(geo)).toEqual({ type: 'Point' });
    expect(geo.toGeoJSON).toHaveBeenCalled();
  });
});
