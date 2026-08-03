import { describe, expectTypeOf, it } from 'vitest';
import type {
  MaptalksAttributionControl,
  MaptalksControl,
  MaptalksZoomControl,
  UseMaptalksControlReturn,
} from '../src/runtime/types';

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

  it('控件窄类型 extends MaptalksControl，Attribution 有 setContent', () => {
    expectTypeOf<MaptalksZoomControl>().toExtend<MaptalksControl>();
    expectTypeOf<MaptalksAttributionControl>().toExtend<MaptalksControl>();
    expectTypeOf<MaptalksAttributionControl['setContent']>().toBeFunction();
    expectTypeOf<MaptalksAttributionControl['getContent']>().toBeFunction();
  });
});
