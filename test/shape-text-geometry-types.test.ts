import { describe, expectTypeOf, it } from 'vitest';

import type {
  UseMaptalksCircleOptions,
  UseMaptalksLabelOptions,
  UseMaptalksSectorOptions,
} from '../src/runtime/types';

describe('形状与文本几何类型', () => {
  it('坐标为单点', () => {
    expectTypeOf<[number, number]>().toMatchTypeOf<[number, number] | { x: number; y: number }>();
  });

  it('额外属性字段类型正确', () => {
    expectTypeOf<UseMaptalksCircleOptions['radius']>().not.toBeUndefined();
    expectTypeOf<UseMaptalksSectorOptions['startAngle']>().not.toBeUndefined();
    expectTypeOf<UseMaptalksLabelOptions['content']>().not.toBeUndefined();
  });
});
