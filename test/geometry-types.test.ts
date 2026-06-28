import { describe, expectTypeOf, it } from 'vitest';

import type {
  LineStringCoordinates,
  MarkerCoordinates,
  PolygonCoordinates,
  UseMaptalksGeometryReturn,
  UseMaptalksMarkerOptions,
} from '../src/runtime/types';

describe('几何类型建模', () => {
  it('坐标别名形状正确', () => {
    expectTypeOf<MarkerCoordinates>().toMatchTypeOf<[number, number] | { x: number; y: number }>();
    expectTypeOf<LineStringCoordinates>().toMatchTypeOf<Array<[number, number] | { x: number; y: number }>>();
    expectTypeOf<PolygonCoordinates>().toMatchTypeOf<Array<Array<[number, number] | { x: number; y: number }>>>();
  });

  it('几何预设选项与返回类型可用', () => {
    expectTypeOf<UseMaptalksMarkerOptions['coordinates']>().not.toBeUndefined();
    expectTypeOf<UseMaptalksGeometryReturn['remove']>().toBeFunction();
  });
});
