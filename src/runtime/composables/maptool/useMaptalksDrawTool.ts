import { onScopeDispose, ref, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue';

import { MaptalksError } from '../../core/errors';
import { loadMaptalks } from '../../core/loader';
import type { MaptalksDrawTool, MaptalksMap, UseMaptalksDrawToolOpts, UseMaptalksDrawToolReturn } from '../../types';

/** bindDrawTool 维护的响应式状态集合 */
interface DrawToolState {
  tool: ShallowRef<MaptalksDrawTool | null>;
  enabled: Ref<boolean>;
  mode: Ref<string>;
  result: ShallowRef<unknown>;
}

/**
 * 创建 DrawTool、绑定到地图并接入 drawend 结果回调。
 *
 * @description 抽出创建核心：动态加载命名空间、检测 DrawTool 可用性、addTo(map) 并绑定事件收拢 drawend。
 * 当前 maptalks-gl 未导出 DrawTool 时抛出 MaptalksError。
 * @param {MaptalksMap} m - 已就绪的地图实例
 * @param {string} mode - 初始绘制模式
 * @param {Record<string, unknown> | undefined} options - 透传给 DrawTool 的额外选项
 * @param {Record<string, (event: unknown) => void>} events - 事件名 → 处理器映射
 * @param {(geometry: unknown) => void} onResult - drawend 结果回调
 * @returns {Promise<MaptalksDrawTool>} DrawTool 实例
 *
 * @example
 * const tool = await createDrawTool(map, 'Polygon', undefined, (geo) => (result.value = geo));
 */
async function createDrawTool(
  m: MaptalksMap,
  mode: string,
  options: Record<string, unknown> | undefined,
  events: Record<string, (event: unknown) => void>,
  onResult: (geometry: unknown) => void,
): Promise<MaptalksDrawTool> {
  const mt = await loadMaptalks();
  const Ctor = mt.DrawTool;
  if (typeof Ctor !== 'function') {
    throw new MaptalksError('control-failed', '当前 maptalks-gl 未导出 DrawTool');
  }
  const tool = new Ctor({ mode, ...options });
  tool.addTo(m);
  for (const [event, handler] of Object.entries(events)) {
    tool.on(event, handler);
  }
  tool.on('drawend', (event) => {
    onResult((event as { geometry?: unknown }).geometry ?? event);
  });
  return tool;
}

/**
 * 地图就绪后创建 DrawTool 并建立状态联动，返回 teardown。
 *
 * @description 监听地图就绪以创建工具；`mode`/`enabled` 变化时同步到工具；销毁时停止 watcher 并 remove 工具。
 * @param {() => MaptalksMap | null} getMap - 取当前地图实例
 * @param {DrawToolState} state - tool/enabled/mode/result 状态
 * @param {() => Record<string, unknown> | undefined} options - DrawTool 构造选项 getter
 * @returns {() => void} 解除联动并销毁工具
 *
 * @example
 * const teardown = bindDrawTool(() => map.value, state, undefined);
 */
function bindDrawTool(
  getMap: () => MaptalksMap | null,
  state: DrawToolState,
  options: () => Record<string, unknown> | undefined,
  events: Record<string, (event: unknown) => void>,
): () => void {
  const setup = async (m: MaptalksMap) => {
    if (state.tool.value) return;
    const dt = await createDrawTool(m, state.mode.value, options(), events, (geo) => {
      state.result.value = geo;
    });
    if (state.enabled.value) dt.enable();
    else dt.disable();
    state.tool.value = dt;
  };
  const stops = [
    watch(
      getMap,
      (m) => {
        if (m) void setup(m);
      },
      { immediate: true },
    ),
    watch(state.mode, (next) => state.tool.value?.setMode(next)),
    watch(state.enabled, (on) => {
      if (!state.tool.value) return;
      if (on) state.tool.value.enable();
      else state.tool.value.disable();
    }),
  ];
  return () => {
    for (const stop of stops) stop();
    const t = state.tool.value;
    if (t) {
      t.disable();
      t.remove();
      state.tool.value = null;
    }
  };
}

/**
 * DrawTool 生命周期管理：创建 / 启停 / 模式切换，绘制结果以响应式 ref 暴露，自动 dispose。
 *
 * @description 地图就绪后创建 DrawTool 并 addTo(map)；`enabled`/`mode` 为双向 ref，写入即生效；
 * 监听 `drawend` 把结果写入 `result`；作用域销毁时 disable + remove。初始默认启用绘制（`enabled: false` 可关闭）。
 * 若当前 maptalks-gl 未导出 DrawTool，则抛出 MaptalksError。
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用（通常来自 useMaptalks 的 map）
 * @param {UseMaptalksDrawToolOpts} [options] - 初始模式与 DrawTool 选项
 * @returns {UseMaptalksDrawToolReturn} `{ tool, enabled, mode, result, enable, disable, setMode }`
 *
 * @example
 * const { map } = useMaptalks(el);
 * const { enabled, mode, result, enable, setMode } = useMaptalksDrawTool(map, { mode: 'Polygon' });
 * function startDraw() { setMode('Polygon'); enable(); }
 */
export function useMaptalksDrawTool(
  map: MaybeRefOrGetter<MaptalksMap | null>,
  options: UseMaptalksDrawToolOpts = {},
): UseMaptalksDrawToolReturn {
  const tool = shallowRef<MaptalksDrawTool | null>(null);
  // 默认启用（对齐原生 MapTool.addTo 内部自动 enable 的语义，dist 源码实证）
  const enabled = ref(options.enabled ?? true);
  const mode = ref(options.mode ?? 'Point');
  const result = shallowRef<unknown>(null);

  const drawOpts = () => toValue(options.options);
  const events = options.events ?? {};
  const teardown = bindDrawTool(
    () => toValue(map),
    { tool, enabled, mode, result },
    drawOpts,
    events,
  );
  if (options.autoDispose !== false) onScopeDispose(teardown);

  return {
    tool,
    enabled,
    mode,
    result,
    enable: () => {
      enabled.value = true;
    },
    disable: () => {
      enabled.value = false;
    },
    setMode: (next: string) => {
      mode.value = next;
    },
    remove: teardown,
  };
}
