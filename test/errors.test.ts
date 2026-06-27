import { describe, expect, it } from 'vitest';

import { MaptalksError, toMaptalksError } from '../src/runtime/core/errors';

describe('MaptalksError', () => {
  it('carries the code, message and name, and is an Error', () => {
    const err = new MaptalksError('init-failed', '地图初始化失败');
    expect(err).toBeInstanceOf(MaptalksError);
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe('init-failed');
    expect(err.message).toBe('地图初始化失败');
    expect(err.name).toBe('MaptalksError');
  });

  it('preserves the underlying cause when provided', () => {
    const cause = new Error('boom');
    const err = new MaptalksError('worker-failed', 'worker 失败', { cause });
    expect(err.cause).toBe(cause);
  });

  it('leaves cause undefined when not provided', () => {
    const err = new MaptalksError('layer-failed', '图层失败');
    expect(err.cause).toBeUndefined();
  });
});

describe('toMaptalksError', () => {
  it('returns the same instance when the error is already a MaptalksError', () => {
    const original = new MaptalksError('webgl-unsupported', '不支持 WebGL');
    const result = toMaptalksError(original, 'init-failed', '其它消息');
    expect(result).toBe(original);
    expect(result.code).toBe('webgl-unsupported');
    expect(result.message).toBe('不支持 WebGL');
  });

  it('wraps a non-MaptalksError with the given code and keeps the original as cause', () => {
    const raw = new TypeError('bad');
    const result = toMaptalksError(raw, 'init-failed', '初始化失败');
    expect(result).toBeInstanceOf(MaptalksError);
    expect(result.code).toBe('init-failed');
    expect(result.message).toBe('初始化失败');
    expect(result.cause).toBe(raw);
  });
});
