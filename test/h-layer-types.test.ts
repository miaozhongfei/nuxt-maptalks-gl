import { describe, expectTypeOf, it } from 'vitest';

import type { MaptalksGLNamespace, MaptalksLayer } from '../src/runtime/types';

describe('MaptalksGLNamespace WMSLayer 构造器签名', () => {
  it('WMSLayer 为可选构造器，签名与 TileLayer 同构（id + options → MaptalksLayer）', () => {
    expectTypeOf<MaptalksGLNamespace['WMSLayer']>().toEqualTypeOf<
      (new (id: string, options: Record<string, unknown>) => MaptalksLayer) | undefined
    >();
  });

  it('WMSLayer 与 TileLayer 构造签名结构一致（去掉可选包装后可赋值）', () => {
    expectTypeOf<NonNullable<MaptalksGLNamespace['WMSLayer']>>().toEqualTypeOf<
      MaptalksGLNamespace['TileLayer']
    >();
  });
});
