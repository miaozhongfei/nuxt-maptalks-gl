import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, ShallowRef, WatchStopHandle } from 'vue';

import { MaptalksError, toMaptalksError } from '../core/errors';
import { loadMaptalks } from '../core/loader';
import type {
  MaptalksEventHandler,
  MaptalksMap,
  MaptalksMapTool,
  UseMaptalksToolOpts,
  UseMaptalksToolReturn,
} from '../types';
import { createLogger } from '../utils/logger';

const logger = createLogger('nuxt-maptalks-gl');

/** 批量绑定事件 */
function bindEvents(t: MaptalksMapTool, events: Record<string, MaptalksEventHandler>) {
  for (const [event, handler] of Object.entries(events)) {
    t.on(event, handler);
  }
}

/** 批量解绑事件 */
function unbindEvents(t: MaptalksMapTool, events: Record<string, MaptalksEventHandler>) {
  for (const [event, handler] of Object.entries(events)) {
    t.off(event, handler);
  }
}

/** 创建 remove 闭包：停止 watcher + 解绑事件 + 销毁工具 */
function makeRemove(
  stop: WatchStopHandle,
  tool: ShallowRef<MaptalksMapTool | null>,
  events: Record<string, MaptalksEventHandler>,
): () => void {
  return () => {
    stop();
    if (tool.value) {
      unbindEvents(tool.value, events);
      tool.value.remove();
      tool.value = null;
    }
  };
}

/**
 * 创建地图测量工具（DistanceTool / AreaTool）的公共工厂。
 *
 * @description 封装 map 就绪检测、构造器加载、addTo、事件 on/off、options shahllow watch 重建、
 * 作用域 dispose 清理。供 useMaptalksDistanceTool / useMaptalksAreaTool 调用。
 * @param {string} toolName - 构造器名（`DistanceTool` / `AreaTool`）
 * @param {MaybeRefOrGetter<MaptalksMap | null>} map - 地图引用
 * @param {UseMaptalksToolOpts} toolOptions - 工具选项、事件绑定与自动销毁控制
 * @returns {UseMaptalksToolReturn} `{ tool, remove }`
 *
 * @example
 * createToolResult('DistanceTool', map, { options: { language: 'zh' } });
 */
export function createToolResult<TNative = Record<string, unknown>>(
  toolName: 'DistanceTool' | 'AreaTool',
  map: MaybeRefOrGetter<MaptalksMap | null>,
  toolOptions: UseMaptalksToolOpts<TNative>,
): UseMaptalksToolReturn {
  const tool = shallowRef<MaptalksMapTool | null>(null);
  let creating = false;
  const events = toolOptions.events ?? {};

  async function reload() {
    const m = toValue(map);
    const opts = toValue(toolOptions.options);
    if (!m || creating) return;
    creating = true;
    if (tool.value) {
      unbindEvents(tool.value, events);
      tool.value.remove();
      tool.value = null;
    }
    try {
      const mt = await loadMaptalks();
      const Ctor = mt[toolName];
      if (typeof Ctor !== 'function')
        throw new MaptalksError('control-failed', `当前 maptalks-gl 未导出 ${toolName}`);
      const t = new Ctor(opts) as MaptalksMapTool;
      t.addTo(m);
      bindEvents(t, events);
      tool.value = t;
    } catch (cause) {
      logger.error(
        `${toolName} 创建失败`,
        toMaptalksError(cause, 'control-failed', `${toolName} 创建失败`),
      );
    } finally {
      creating = false;
    }
  }

  const stop = watch([() => toValue(map), () => toValue(toolOptions.options)], reload, {
    immediate: true,
  });

  const remove = makeRemove(stop, tool, events);
  if (toolOptions.autoDispose !== false) onScopeDispose(remove);
  return { tool, remove };
}
