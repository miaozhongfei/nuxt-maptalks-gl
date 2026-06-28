import { describe, expect, it, vi } from 'vitest';

import { applyMapConfigProps } from '../src/runtime/core/map-props';
import type { MaptalksMap } from '../src/runtime/types';

function fakeMap() {
  const spies = { setMinZoom: vi.fn(), setMaxZoom: vi.fn(), config: vi.fn() };
  return { map: spies as unknown as MaptalksMap, ...spies };
}

describe('applyMapConfigProps', () => {
  it('应用缩放区间与交互开关', () => {
    const m = fakeMap();
    applyMapConfigProps(m.map, { minZoom: 2, maxZoom: 18, dragPitch: true, zoomable: false });
    expect(m.setMinZoom).toHaveBeenCalledWith(2);
    expect(m.setMaxZoom).toHaveBeenCalledWith(18);
    expect(m.config).toHaveBeenCalledWith({ dragPitch: true, zoomable: false });
  });

  it('未提供的字段不触发调用', () => {
    const m = fakeMap();
    applyMapConfigProps(m.map, { minZoom: 5 });
    expect(m.setMinZoom).toHaveBeenCalledWith(5);
    expect(m.setMaxZoom).not.toHaveBeenCalled();
    expect(m.config).not.toHaveBeenCalled();
  });

  it('map 为 null 时 no-op', () => {
    const m = fakeMap();
    applyMapConfigProps(null, { minZoom: 2, dragPitch: true });
    expect(m.setMinZoom).not.toHaveBeenCalled();
    expect(m.config).not.toHaveBeenCalled();
  });
});
