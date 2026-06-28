import { describe, expectTypeOf, it } from 'vitest';

import type {
  GeoJSONData,
  MultiLineStringCoordinates,
  MultiPointCoordinates,
  MultiPolygonCoordinates,
  UseMaptalksGeoJSONReturn,
} from '../src/runtime/types';

describe('Multi 几何与 GeoJSON 类型', () => {
  it('Multi 坐标别名形状正确', () => {
    expectTypeOf<MultiPointCoordinates>().toMatchTypeOf<Array<[number, number] | { x: number; y: number }>>();
    expectTypeOf<MultiLineStringCoordinates>().toMatchTypeOf<Array<Array<[number, number] | { x: number; y: number }>>>();
    expectTypeOf<MultiPolygonCoordinates>().toMatchTypeOf<Array<Array<Array<[number, number] | { x: number; y: number }>>>>();
  });

  it('GeoJSON 类型可用', () => {
    expectTypeOf<GeoJSONData>().toMatchTypeOf<Record<string, unknown>>();
    expectTypeOf<UseMaptalksGeoJSONReturn['remove']>().toBeFunction();
  });
});
