import { onScopeDispose, ref, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';

import type {
  MaptalksLayer,
  UseMaptalksLayerControlOpts,
  UseMaptalksLayerControlReturn,
} from '../../types';

/**
 * 创建一组直接作用于图层的命令式控制方法。
 *
 * @description 每个方法都通过可选链调用图层原生方法，图层为 null 或方法缺失时静默 no-op；
 * show/hide 同步内部 `visibleState`，`toggle` 据其翻转。
 * @param {() => MaptalksLayer | null} getLayer - 取当前图层实例
 * @param {Ref<boolean>} visibleState - 内部可见状态（供 toggle 翻转）
 * @returns {UseMaptalksLayerControlReturn} 命令式控制方法集合
 *
 * @example
 * const ctl = createLayerControls(() => layer.value, ref(true));
 * ctl.bringToFront();
 */
function createLayerControls(
  getLayer: () => MaptalksLayer | null,
  visibleState: Ref<boolean>,
): UseMaptalksLayerControlReturn {
  const show = (): void => {
    getLayer()?.show?.();
    visibleState.value = true;
  };
  const hide = (): void => {
    getLayer()?.hide?.();
    visibleState.value = false;
  };
  // 据内部状态翻转，避免依赖图层 isVisible 的实现差异
  const toggle = (): void => {
    if (visibleState.value) hide();
    else show();
  };
  const setOpacity = (opacity: number): void => {
    getLayer()?.setOpacity?.(opacity);
  };
  const bringToFront = (): void => {
    getLayer()?.bringToFront?.();
  };
  const bringToBack = (): void => {
    getLayer()?.bringToBack?.();
  };
  return { show, hide, toggle, setOpacity, bringToFront, bringToBack };
}

/**
 * 建立 visible / opacity 的响应式联动，返回停止函数。
 *
 * @description 两条 `immediate` watcher：visible 变化驱动 show/hide，opacity 变化驱动 setOpacity；
 * 图层未就绪或对应选项未传时跳过。
 * @param {() => MaptalksLayer | null} getLayer - 取当前图层实例
 * @param {UseMaptalksLayerControlOpts} options - 响应式联动配置
 * @param {UseMaptalksLayerControlReturn} controls - 命令式控制方法集合
 * @returns {() => void} 停止全部 watcher 的函数
 *
 * @example
 * const stop = bindReactiveControl(getLayer, { visible }, controls);
 * stop();
 */
function bindReactiveControl(
  getLayer: () => MaptalksLayer | null,
  options: UseMaptalksLayerControlOpts,
  controls: UseMaptalksLayerControlReturn,
): () => void {
  const stopVisible = watch(
    [getLayer, () => toValue(options.visible)] as const,
    ([l, v]) => {
      if (!l || v === undefined) return;
      if (v) controls.show();
      else controls.hide();
    },
    { immediate: true },
  );
  const stopOpacity = watch(
    [getLayer, () => toValue(options.opacity)] as const,
    ([l, o]) => {
      if (!l || o === undefined) return;
      controls.setOpacity(o);
    },
    { immediate: true },
  );
  return () => {
    stopVisible();
    stopOpacity();
  };
}

/**
 * 图层控制原语：响应式显隐 / 透明度联动 + 命令式层级与显隐方法。
 *
 * @description 在图层就绪后建立两条联动：响应式 `visible`（true→show、false→hide）与响应式
 * `opacity`（变化时调用 `setOpacity`）；两者均 `immediate`，未传则不自动联动。命令式方法
 * 直接调用图层原生方法（`show`/`hide`/`setOpacity`/`bringToFront`/`bringToBack`），图层为 null
 * 或方法缺失时静默 no-op。`toggle` 维护内部可见状态（默认初始可见）并在 show/hide 间翻转。
 * 作用域销毁时自动停止全部 watcher。
 * @param {MaybeRefOrGetter<MaptalksLayer | null>} layer - 图层引用（通常来自 useMaptalksLayer / 预设的 layer）
 * @param {UseMaptalksLayerControlOpts} [options] - 响应式 visible / opacity 联动配置
 * @returns {UseMaptalksLayerControlReturn} `{ show, hide, toggle, setOpacity, bringToFront, bringToBack }`
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { layer } = useMaptalksTileLayer(map, { source: 'osm' });
 * const visible = ref(true);
 * const opacity = ref(1);
 * // 响应式联动：visible/opacity 变化自动应用到图层
 * const ctl = useMaptalksLayerControl(layer, { visible, opacity });
 * // 命令式：置顶 / 切换显隐
 * ctl.bringToFront();
 * ctl.toggle();
 */
export function useMaptalksLayerControl(
  layer: MaybeRefOrGetter<MaptalksLayer | null>,
  options: UseMaptalksLayerControlOpts = {},
): UseMaptalksLayerControlReturn {
  const getLayer = () => toValue(layer);
  // 内部可见状态：seed 自 visible 选项（未传按可见），供 toggle 翻转参考
  const visibleState: Ref<boolean> = ref(toValue(options.visible) ?? true);

  const controls = createLayerControls(getLayer, visibleState);
  const stop = bindReactiveControl(getLayer, options, controls);

  onScopeDispose(stop);
  return controls;
}
