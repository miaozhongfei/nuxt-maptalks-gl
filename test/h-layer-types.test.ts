import { describe, expectTypeOf, it } from 'vitest';

import type { MaptalksGLNamespace, MaptalksLayer, MaptalksTileLayer, MaptalksWMSLayer } from '../src/runtime/types';

describe('MaptalksGLNamespace WMSLayer 构造器签名', () => {
  it('WMSLayer 为可选构造器，签名与 TileLayer 同构（id + options → 窄化子类）', () => {
    expectTypeOf<MaptalksGLNamespace['WMSLayer']>().toEqualTypeOf<
      (new (id: string | number, options: Record<string, unknown>) => MaptalksWMSLayer) | undefined
    >();
  });

  it('WMSLayer 与 TileLayer 返回类型均兼容 MaptalksLayer', () => {
    expectTypeOf<MaptalksWMSLayer>().toMatchTypeOf<MaptalksLayer>();
    expectTypeOf<MaptalksTileLayer>().toMatchTypeOf<MaptalksLayer>();
  });
});
