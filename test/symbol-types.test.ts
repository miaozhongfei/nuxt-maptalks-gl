import { describe, expectTypeOf, it } from 'vitest';

import type {
  LineSymbol,
  MarkerSymbol,
  PolygonSymbol,
  Stops,
  TextSymbol,
} from '../src/runtime/types';

describe('symbol 强类型', () => {
  it('MarkerSymbol 暴露常用点字段', () => {
    expectTypeOf<MarkerSymbol['markerType']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<MarkerSymbol['markerWidth']>().toEqualTypeOf<number | undefined>();
  });
  it('LineSymbol 暴露常用线字段', () => {
    expectTypeOf<LineSymbol['lineColor']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<LineSymbol['lineWidth']>().toEqualTypeOf<number | undefined>();
  });
  it('PolygonSymbol 暴露常用面字段', () => {
    expectTypeOf<PolygonSymbol['polygonFill']>().toEqualTypeOf<string | undefined>();
  });
  it('TextSymbol 暴露常用文字字段', () => {
    expectTypeOf<TextSymbol['textName']>().toEqualTypeOf<string | undefined>();
  });
  it('所有 symbol 接口含兜底索引签名（向后兼容）', () => {
    const m: MarkerSymbol = {};
    const customRead: string = m.customField;
    m.customField = 'x';
    void customRead;
  });
  it('Stops 接受 zoom-symbol 对数组', () => {
    const s: Stops<MarkerSymbol> = [
      [10, { markerType: 'pin' }],
      [14, { markerType: 'ellipse', markerWidth: 20 }],
    ];
    expectTypeOf(s).toMatchTypeOf<Array<[number, MarkerSymbol]>>();
  });
});
