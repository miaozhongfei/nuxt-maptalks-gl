import { describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, shallowRef } from 'vue';
import type { Ref } from 'vue';

import { useMaptalksLayerControl } from '../src/runtime/composables/layer/useMaptalksLayerControl';
import type { MaptalksLayer } from '../src/runtime/types';

/** 构造带 spy 方法的假图层，用于断言命令式调用与 watch 联动 */
function fakeLayer() {
  const show = vi.fn();
  const hide = vi.fn();
  const setOpacity = vi.fn();
  const bringToFront = vi.fn();
  const bringToBack = vi.fn();
  const layer = {
    show,
    hide,
    setOpacity,
    bringToFront,
    bringToBack,
  } as unknown as MaptalksLayer;
  return { layer, show, hide, setOpacity, bringToFront, bringToBack };
}

describe('useMaptalksLayerControl 响应式联动', () => {
  it('visible 变化驱动 show / hide', async () => {
    const scope = effectScope();
    const f = fakeLayer();
    const visible: Ref<boolean> = shallowRef(true);
    scope.run(() =>
      useMaptalksLayerControl(shallowRef<MaptalksLayer | null>(f.layer), { visible }),
    );
    // immediate: true，初始 visible=true → show
    expect(f.show).toHaveBeenCalledTimes(1);
    visible.value = false;
    await nextTick();
    expect(f.hide).toHaveBeenCalledTimes(1);
    scope.stop();
  });

  it('opacity 变化驱动 setOpacity', async () => {
    const scope = effectScope();
    const f = fakeLayer();
    const opacity: Ref<number> = shallowRef(0.5);
    scope.run(() =>
      useMaptalksLayerControl(shallowRef<MaptalksLayer | null>(f.layer), { opacity }),
    );
    expect(f.setOpacity).toHaveBeenCalledWith(0.5);
    opacity.value = 0.2;
    await nextTick();
    expect(f.setOpacity).toHaveBeenLastCalledWith(0.2);
    scope.stop();
  });
});

describe('useMaptalksLayerControl 命令式方法', () => {
  it('bringToFront / bringToBack / setOpacity 直接调图层原生方法', () => {
    const scope = effectScope();
    const f = fakeLayer();
    const handle = scope.run(() =>
      useMaptalksLayerControl(shallowRef<MaptalksLayer | null>(f.layer)),
    );
    if (!handle) throw new Error('scope 未运行');
    handle.bringToFront();
    handle.bringToBack();
    handle.setOpacity(0.8);
    expect(f.bringToFront).toHaveBeenCalledTimes(1);
    expect(f.bringToBack).toHaveBeenCalledTimes(1);
    expect(f.setOpacity).toHaveBeenCalledWith(0.8);
    scope.stop();
  });

  it('toggle 在 show / hide 之间翻转（默认初始可见）', () => {
    const scope = effectScope();
    const f = fakeLayer();
    const handle = scope.run(() =>
      useMaptalksLayerControl(shallowRef<MaptalksLayer | null>(f.layer)),
    );
    if (!handle) throw new Error('scope 未运行');
    // 默认初始可见 → 第一次 toggle 隐藏
    handle.toggle();
    expect(f.hide).toHaveBeenCalledTimes(1);
    // 再次 toggle 显示
    handle.toggle();
    expect(f.show).toHaveBeenCalledTimes(1);
    scope.stop();
  });
});
