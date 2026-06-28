import { describe, expectTypeOf, it } from 'vitest';

import type {
  MaptalksMapOptions,
  UseMaptalksExportReturn,
  UseMaptalksSyncOptions,
  UseMaptalksOptions,
} from '../src/runtime/types';

describe('地图构造选项类型化', () => {
  it('暴露强类型的高频构造字段', () => {
    expectTypeOf<MaptalksMapOptions['minZoom']>().toEqualTypeOf<number | undefined>();
    expectTypeOf<MaptalksMapOptions['maxZoom']>().toEqualTypeOf<number | undefined>();
    expectTypeOf<MaptalksMapOptions['dragPitch']>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<MaptalksMapOptions['dragRotate']>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<MaptalksMapOptions['seamlessZoom']>().toEqualTypeOf<boolean | undefined>();
  });

  it('UseMaptalksOptions 继承构造选项并加上 name/onError', () => {
    expectTypeOf<UseMaptalksOptions['name']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<UseMaptalksOptions['minZoom']>().toEqualTypeOf<number | undefined>();
  });

  it('导出与同步选项类型可用', () => {
    expectTypeOf<UseMaptalksSyncOptions['mode']>().toEqualTypeOf<'mutual' | 'master-slave' | undefined>();
    expectTypeOf<UseMaptalksExportReturn['toDataURL']>().toBeFunction();
  });
});
