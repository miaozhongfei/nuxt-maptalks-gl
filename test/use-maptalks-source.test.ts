// @vitest-environment nuxt
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import { mountSuspended } from '@nuxt/test-utils/runtime';

import { useMaptalksSource } from '../src/runtime/composables/layer/useMaptalksSource';
import { MaptalksError } from '../src/runtime/core/errors';
import type { UseMaptalksSourceReturn } from '../src/runtime/types';

/** 等待微任务排空 */
function flush(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

/** 把 useMaptalksSource 放进一个组件里跑（触发 onMounted 自动解析），返回其句柄 */
async function runSource(name: string): Promise<UseMaptalksSourceReturn> {
  let result: UseMaptalksSourceReturn | undefined;
  await mountSuspended(
    defineComponent({
      setup() {
        result = useMaptalksSource(name);
        return () => h('div');
      },
    }),
  );
  await flush();
  if (!result) throw new Error('component setup did not run');
  return result;
}

describe('useMaptalksSource', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves a public source to its url template on mount', async () => {
    const r = await runSource('pubTile');
    expect(r.error.value).toBeNull();
    expect(r.source.value?.urlTemplate).toBe('https://example.com/{z}/{x}/{y}.png');
  });

  it('resolves a signed source via fetch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ urlTemplate: 'https://signed/{z}/{x}/{y}.png' }),
        }),
      ),
    );
    const r = await runSource('signedTile');
    expect(r.source.value?.urlTemplate).toBe('https://signed/{z}/{x}/{y}.png');
  });

  it('sets a source-resolve-failed error for an unknown name', async () => {
    const r = await runSource('does-not-exist');
    expect(r.source.value).toBeNull();
    expect(r.error.value).toBeInstanceOf(MaptalksError);
    expect(r.error.value?.code).toBe('source-resolve-failed');
  });
});
