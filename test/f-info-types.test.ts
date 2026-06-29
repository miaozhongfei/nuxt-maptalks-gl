import { describe, expectTypeOf, it } from 'vitest';

import type { MaptalksInfoWindow } from '../src/runtime/types';

describe('InfoWindow 类型', () => {
  it('MaptalksInfoWindow 有 addTo/setContent/setCoordinates/show/hide', () => {
    expectTypeOf<MaptalksInfoWindow['addTo']>().toBeFunction();
    expectTypeOf<MaptalksInfoWindow['setContent']>().toBeFunction();
    expectTypeOf<MaptalksInfoWindow['setCoordinates']>().toBeFunction();
    expectTypeOf<MaptalksInfoWindow['show']>().toBeFunction();
    expectTypeOf<MaptalksInfoWindow['hide']>().toBeFunction();
  });
});
