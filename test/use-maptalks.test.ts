// @vitest-environment nuxt
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, shallowRef } from 'vue';

import { mountSuspended } from '@nuxt/test-utils/runtime';

import { useMaptalks } from '../src/runtime/composables/useMaptalks';
import { mapRegistry } from '../src/runtime/core/registry';
import type { UseMaptalksOpts, UseMaptalksReturn } from '../src/runtime/types';

// 假命名空间：Map 构造器返回带 remove spy 的实例；WebGL 始终可用
const { mt } = vi.hoisted(() => ({
  mt: {
    Map: vi.fn(function FakeMap(container: unknown, options: unknown) {
      return { container, options, remove: vi.fn() };
    }),
  },
}));

vi.mock('../src/runtime/core/loader', () => ({
  loadMaptalks: vi.fn(() => Promise.resolve(mt)),
  isWebGLAvailable: () => true,
}));

/** 等待微任务排空（onMounted → runInit 的 await 链） */
function flush(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

/** 在组件里装配 useMaptalks（target 用脱离文档的 div），返回句柄与 wrapper */
async function mountMap(options: UseMaptalksOpts = {}) {
  const el = shallowRef<HTMLElement | null>(document.createElement('div'));
  let result: UseMaptalksReturn | undefined;
  const wrapper = await mountSuspended(
    defineComponent({
      setup() {
        result = useMaptalks(el, options);
        return () => h('div');
      },
    }),
  );
  await flush();
  if (!result) throw new Error('component setup did not run');
  return { result, wrapper };
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  for (const name of mapRegistry.instances.keys()) mapRegistry.unregister(name);
});

describe('useMaptalks', () => {
  it('creates the map on the client with the maptalks options (name stripped)', async () => {
    const { result, wrapper } = await mountMap({ name: 'x', center: [1, 2], zoom: 5 });
    expect(result.error.value).toBeNull();
    expect(result.isReady.value).toBe(true);
    expect(result.map.value).not.toBeNull();
    expect(mt.Map.mock.calls[0]?.[1]).toEqual({ center: [1, 2], zoom: 5 });
    wrapper.unmount();
  });

  it('registers a named instance and unregisters it on unmount', async () => {
    const { result, wrapper } = await mountMap({ name: 'main', center: [1, 2], zoom: 5 });
    expect(mapRegistry.get('main')?.value).toBe(result.map.value);
    wrapper.unmount();
    expect(mapRegistry.has('main')).toBe(false);
  });

  it('removes the underlying map on unmount', async () => {
    const { result, wrapper } = await mountMap({ center: [1, 2], zoom: 5 });
    const created = result.map.value as unknown as { remove: ReturnType<typeof vi.fn> };
    wrapper.unmount();
    expect(created.remove).toHaveBeenCalled();
    expect(result.map.value).toBeNull();
  });
});
