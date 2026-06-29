import { describe, expectTypeOf, it } from 'vitest';
import type { MaptalksMapTool, UseMaptalksToolReturn } from '../src/runtime/types';

describe('测量工具类型', () => {
  it('MaptalksMapTool 有 addTo/remove/on/off', () => {
    expectTypeOf<MaptalksMapTool['addTo']>().toBeFunction();
    expectTypeOf<MaptalksMapTool['remove']>().toBeFunction();
    expectTypeOf<MaptalksMapTool['on']>().toBeFunction();
    expectTypeOf<MaptalksMapTool['off']>().toBeFunction();
  });

  it('UseMaptalksToolReturn 有 tool/remove', () => {
    expectTypeOf<UseMaptalksToolReturn['remove']>().toBeFunction();
  });
});
