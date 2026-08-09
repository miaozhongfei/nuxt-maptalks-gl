import { describe, expectTypeOf, it } from 'vitest';

import type {
  UseMaptalksCircleOpts,
  UseMaptalksLabelOpts,
  UseMaptalksSectorOpts,
} from '../src/runtime/types';

describe('形状与文本几何类型', () => {
  it('坐标为单点', () => {
    expectTypeOf<[number, number]>().toMatchTypeOf<[number, number] | { x: number; y: number }>();
  });

  it('额外属性字段类型正确', () => {
    expectTypeOf<UseMaptalksCircleOpts['radius']>().not.toBeUndefined();
    expectTypeOf<UseMaptalksSectorOpts['startAngle']>().not.toBeUndefined();
    expectTypeOf<UseMaptalksLabelOpts['content']>().not.toBeUndefined();
  });
});
