import { describe, expectTypeOf, it } from 'vitest';

import type {
  GeoJSONData,
  UseMaptalksGeoJSONReturn,
} from '../src/runtime/types';

describe('Multi 几何与 GeoJSON 类型', () => {
  it('Multi 坐标形状正确', () => {
    expectTypeOf<Array<[number, number]>>().toMatchTypeOf<
      Array<[number, number] | { x: number; y: number }>
    >();
    expectTypeOf<Array<Array<[number, number]>>>().toMatchTypeOf<
      Array<Array<[number, number] | { x: number; y: number }>>
    >();
    expectTypeOf<Array<Array<Array<[number, number]>>>>().toMatchTypeOf<
      Array<Array<Array<[number, number] | { x: number; y: number }>>>
    >();
  });

  it('GeoJSON 类型可用', () => {
    expectTypeOf<GeoJSONData>().toMatchTypeOf<Record<string, unknown>>();
    expectTypeOf<UseMaptalksGeoJSONReturn['remove']>().toBeFunction();
  });
});
