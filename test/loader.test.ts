import { afterEach, describe, expect, it, vi } from 'vitest';

import { isWebGLAvailable, loadMaptalks } from '../src/runtime/core/loader';

// 用 hoisted 定义假构造器（函数即可，loader 以 typeof Map === 'function' 判定命名空间形态）
const { mockMap } = vi.hoisted(() => ({ mockMap: vi.fn() }));
vi.mock('maptalks-gl', () => ({ Map: mockMap, TileLayer: vi.fn() }));

describe('loadMaptalks', () => {
  it('resolves the maptalks-gl namespace exposing the Map constructor', async () => {
    const mt = await loadMaptalks();
    expect(mt.Map).toBe(mockMap);
    expect(typeof mt.TileLayer).toBe('function');
  });

  it('caches the import: repeated calls return the same promise', () => {
    expect(loadMaptalks()).toBe(loadMaptalks());
  });
});

describe('isWebGLAvailable', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false when there is no document (SSR)', () => {
    // node 环境下 document 未定义
    expect(isWebGLAvailable()).toBe(false);
  });

  it('returns true when a WebGL context can be created', () => {
    vi.stubGlobal('document', {
      createElement: () => ({ getContext: () => ({}) }),
    });
    expect(isWebGLAvailable()).toBe(true);
  });

  it('returns false when no WebGL context is available', () => {
    vi.stubGlobal('document', {
      createElement: () => ({ getContext: () => null }),
    });
    expect(isWebGLAvailable()).toBe(false);
  });
});
