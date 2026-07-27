import { describe, expectTypeOf, it } from 'vitest';

import type {
  UseMaptalksGeometryReturn,
  UseMaptalksMarkerOpts,
} from '../src/runtime/types';

describe('几何类型建模', () => {
  it('坐标形状正确', () => {
    expectTypeOf<[number, number]>().toMatchTypeOf<[number, number] | { x: number; y: number }>();
    expectTypeOf<Array<[number, number]>>().toMatchTypeOf<
      Array<[number, number] | { x: number; y: number }>
    >();
    expectTypeOf<Array<Array<[number, number]>>>().toMatchTypeOf<
      Array<Array<[number, number] | { x: number; y: number }>>
    >();
  });

  it('几何预设选项与返回类型可用', () => {
    expectTypeOf<UseMaptalksMarkerOpts['coordinates']>().not.toBeUndefined();
    expectTypeOf<UseMaptalksGeometryReturn['remove']>().toBeFunction();
  });
});
