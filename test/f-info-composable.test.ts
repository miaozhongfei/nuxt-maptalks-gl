import { describe, expect, it, vi } from 'vitest';
import { effectScope, shallowRef } from 'vue';

import { useMaptalksInfoWindow } from '../src/runtime/composables/useMaptalksInfoWindow';
import type { MaptalksMap } from '../src/runtime/types';

function createFakeInfoWindow() {
  return {
    addTo: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    show: vi.fn().mockReturnThis(),
    hide: vi.fn().mockReturnThis(),
    isVisible: vi.fn().mockReturnValue(false),
    setContent: vi.fn().mockReturnThis(),
    setCoordinates: vi.fn().mockReturnThis(),
  };
}

const { mt } = vi.hoisted(() => ({
  mt: {
    ui: {
      InfoWindow: vi.fn(function FakeInfoWindow() {
        return createFakeInfoWindow();
      }),
    },
  },
}));

vi.mock('../src/runtime/core/loader', () => ({
  loadMaptalks: vi.fn(() => Promise.resolve(mt)),
  isWebGLAvailable: () => true,
}));

function flush(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

describe('useMaptalksInfoWindow 创建', () => {
  it('map 就绪后创建 InfoWindow 并 addTo(map)', async () => {
    const map = shallowRef<MaptalksMap | null>({} as unknown as MaptalksMap);
    const scope = effectScope();
    scope.run(() => useMaptalksInfoWindow(map));
    await flush();
    expect(mt.ui.InfoWindow).toHaveBeenCalled();
    const iw = mt.ui.InfoWindow.mock.results[0]?.value;
    expect(iw?.addTo).toHaveBeenCalledWith(map.value);
    scope.stop();
  });

  it('options 变化时重建 InfoWindow', async () => {
    const map = shallowRef<MaptalksMap | null>({} as unknown as MaptalksMap);
    const opts = shallowRef<Record<string, unknown> | undefined>({ title: 'A' });
    const scope = effectScope();
    scope.run(() => useMaptalksInfoWindow(map, { options: opts }));
    await flush();
    const iw1 = mt.ui.InfoWindow.mock.results[0]?.value;
    expect(mt.ui.InfoWindow).toHaveBeenCalledWith({ title: 'A' });

    opts.value = { title: 'B' };
    await flush();
    expect(iw1?.remove).toHaveBeenCalled();
    expect(mt.ui.InfoWindow).toHaveBeenCalledWith({ title: 'B' });
    scope.stop();
  });
});

describe('useMaptalksInfoWindow 内容与坐标', () => {
  it('创建后自动调用 setContent', async () => {
    const map = shallowRef<MaptalksMap | null>({} as unknown as MaptalksMap);
    const content = shallowRef<string | undefined>('<div>hello</div>');
    const scope = effectScope();
    scope.run(() => useMaptalksInfoWindow(map, { content }));
    await flush();
    const lastIdx = mt.ui.InfoWindow.mock.results.length - 1;
    const iw = mt.ui.InfoWindow.mock.results[lastIdx]?.value;
    expect(iw?.setContent).toHaveBeenCalledWith('<div>hello</div>');
    scope.stop();
  });
});

describe('useMaptalksInfoWindow dispose', () => {
  it('作用域销毁时调用 remove', async () => {
    const map = shallowRef<MaptalksMap | null>({} as unknown as MaptalksMap);
    const scope = effectScope();
    scope.run(() => useMaptalksInfoWindow(map));
    await flush();
    const lastIdx = mt.ui.InfoWindow.mock.results.length - 1;
    const iw = mt.ui.InfoWindow.mock.results[lastIdx]?.value;
    scope.stop();
    expect(iw?.remove).toHaveBeenCalled();
  });
});
