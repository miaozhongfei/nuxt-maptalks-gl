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

  it('控件窄类型 extends MaptalksControl，含 buildOn 私有方法与 Attribution setContent', () => {
    expectTypeOf<MaptalksZoomControl>().toExtend<MaptalksControl>();
    expectTypeOf<MaptalksZoomControl['buildOn']>().toBeFunction();
    expectTypeOf<MaptalksAttributionControl>().toExtend<MaptalksControl>();
    expectTypeOf<MaptalksAttributionControl['buildOn']>().toBeFunction();
    expectTypeOf<MaptalksAttributionControl['setContent']>().toBeFunction();
    expectTypeOf<MaptalksAttributionControl['getContent']>().toBeFunction();
  });
});
