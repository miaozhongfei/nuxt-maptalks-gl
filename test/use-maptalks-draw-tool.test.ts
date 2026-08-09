import { describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, shallowRef } from 'vue';

import { useMaptalksDrawTool } from '../src/runtime/composables/maptool/useMaptalksDrawTool';
import type { MaptalksMap, UseMaptalksDrawToolOpts } from '../src/runtime/types';

// 假命名空间：DrawTool 构造器返回带各方法 spy 的实例
const { mt } = vi.hoisted(() => ({
  mt: {
    DrawTool: vi.fn(function FakeDrawTool(opts: unknown) {
      return {
        opts,
        addTo: vi.fn(),
        on: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn(),
        setMode: vi.fn(),
        remove: vi.fn(),
      };
    }),
  },
}));

vi.mock('../src/runtime/core/loader', () => ({
  loadMaptalks: vi.fn(() => Promise.resolve(mt)),
  isWebGLAvailable: () => true,
}));

/** 创建出的 DrawTool 实例的 spy 形状 */
interface FakeDt {
  addTo: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  enable: ReturnType<typeof vi.fn>;
  disable: ReturnType<typeof vi.fn>;
  setMode: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
}

/** 等待微任务排空 */
function flush(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

/** 在 effectScope 里装配 useMaptalksDrawTool，等地图就绪创建完成 */
async function mountDrawTool(options: UseMaptalksDrawToolOpts = {}) {
  const map = shallowRef<MaptalksMap | null>({} as unknown as MaptalksMap);
  const scope = effectScope();
  const handle = scope.run(() => useMaptalksDrawTool(map, options));
  if (!handle) throw new Error('effectScope did not run');
  await flush();
  return { handle, scope };
}

describe('useMaptalksDrawTool', () => {
  it('creates a DrawTool with the mode and binds it to the map', async () => {
    const { handle, scope } = await mountDrawTool({ mode: 'Polygon' });
    expect(mt.DrawTool).toHaveBeenCalledWith({ mode: 'Polygon' });
    expect(handle.tool.value).not.toBeNull();
    const dt = handle.tool.value as unknown as FakeDt;
    expect(dt.addTo).toHaveBeenCalled();
    scope.stop();
  });

  it('setMode forwards to the tool', async () => {
    const { handle, scope } = await mountDrawTool({ mode: 'Point' });
    const dt = handle.tool.value as unknown as FakeDt;
    handle.setMode('Polygon');
    await nextTick();
    expect(handle.mode.value).toBe('Polygon');
    expect(dt.setMode).toHaveBeenCalledWith('Polygon');
    scope.stop();
  });

  it('enable() turns the tool on', async () => {
    const { handle, scope } = await mountDrawTool();
    const dt = handle.tool.value as unknown as FakeDt;
    handle.enable();
    await nextTick();
    expect(handle.enabled.value).toBe(true);
    expect(dt.enable).toHaveBeenCalled();
    scope.stop();
  });

  it('records the drawn geometry on drawend', async () => {
    const { handle, scope } = await mountDrawTool();
    const dt = handle.tool.value as unknown as FakeDt;
    const drawend = dt.on.mock.calls.find((c) => c[0] === 'drawend');
    expect(drawend).toBeDefined();
    const handler = drawend?.[1] as (e: unknown) => void;
    const geometry = { kind: 'polygon' };
    handler({ geometry });
    expect(handle.result.value).toBe(geometry);
    scope.stop();
  });
});

describe('useMaptalksDrawTool dispose', () => {
  it('disposes the tool on scope stop', async () => {
    const { handle, scope } = await mountDrawTool();
    const dt = handle.tool.value as unknown as FakeDt;
    scope.stop();
    expect(dt.disable).toHaveBeenCalled();
    expect(dt.remove).toHaveBeenCalled();
    expect(handle.tool.value).toBeNull();
  });
});
