import { describe, expectTypeOf, it } from 'vitest';
import type { MaptalksControl, UseMaptalksControlReturn } from '../src/runtime/types';

describe('控件类型', () => {
  it('MaptalksControl 有 addTo/remove', () => {
    expectTypeOf<MaptalksControl['addTo']>().toBeFunction();
    expectTypeOf<MaptalksControl['remove']>().toBeFunction();
  });

  it('UseMaptalksControlReturn 有 control/show/hide/remove', () => {
    expectTypeOf<UseMaptalksControlReturn['remove']>().toBeFunction();
    expectTypeOf<UseMaptalksControlReturn['show']>().toBeFunction();
    expectTypeOf<UseMaptalksControlReturn['hide']>().toBeFunction();
  });
});
