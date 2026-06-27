import { afterEach, describe, expect, it, vi } from 'vitest';

import { MaptalksError } from '../src/runtime/core/errors';
import { resolveSource } from '../src/runtime/core/resolve-source';
import type { MaptalksSource } from '../src/runtime/types';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** 成功响应的 fetch mock（ok + json 返回给定 body） */
function okFetch(body: unknown) {
  return vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(body) }));
}

/** 始终失败的 fetch mock（ok=false） */
function failFetch() {
  return vi.fn(() => Promise.resolve({ ok: false, status: 500 }));
}

/** 失败两次后成功的 fetch mock */
function retryFetch() {
  return vi
    .fn()
    .mockResolvedValueOnce({ ok: false, status: 500 })
    .mockResolvedValueOnce({ ok: false, status: 502 })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ urlTemplate: 'https://ok/{z}/{x}/{y}.png' }),
    });
}

describe('resolveSource · public', () => {
  it('passes through url/options without any network call', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const source: MaptalksSource = {
      kind: 'public',
      type: 'tile',
      urlTemplate: 'https://x/{z}/{x}/{y}.png',
      options: { opacity: 0.5 },
    };
    const resolved = await resolveSource(source);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(resolved).toEqual({
      type: 'tile',
      urlTemplate: 'https://x/{z}/{x}/{y}.png',
      url: undefined,
      options: { opacity: 0.5 },
    });
  });
});

describe('resolveSource · signed', () => {
  it('fetches the endpoint once and merges source options with the signed result', async () => {
    const fetchMock = okFetch({ urlTemplate: 'https://signed/{z}/{x}/{y}.png', options: { b: 2 } });
    vi.stubGlobal('fetch', fetchMock);

    const source: MaptalksSource = {
      kind: 'signed',
      type: 'tile',
      endpoint: '/api/sign',
      options: { a: 1 },
    };
    const resolved = await resolveSource(source);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/sign', { headers: { accept: 'application/json' } });
    expect(resolved.urlTemplate).toBe('https://signed/{z}/{x}/{y}.png');
    expect(resolved.options).toEqual({ a: 1, b: 2 });
  });

  it('retries on failure and succeeds on a later attempt', async () => {
    const fetchMock = retryFetch();
    vi.stubGlobal('fetch', fetchMock);

    const source: MaptalksSource = { kind: 'signed', type: 'tile', endpoint: '/api/sign' };
    const resolved = await resolveSource(source);

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(resolved.urlTemplate).toBe('https://ok/{z}/{x}/{y}.png');
  });

  it('throws a source-resolve-failed MaptalksError after exhausting all attempts', async () => {
    const fetchMock = failFetch();
    vi.stubGlobal('fetch', fetchMock);

    const source: MaptalksSource = { kind: 'signed', type: 'tile', endpoint: '/api/sign' };

    const error = await resolveSource(source).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(MaptalksError);
    expect((error as MaptalksError).code).toBe('source-resolve-failed');
    // 首次 + 2 次重试 = MAX_SIGN_ATTEMPTS
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
