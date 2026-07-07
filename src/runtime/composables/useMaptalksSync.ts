import { nextTick, onScopeDispose, ref, toValue, watch } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import { MaptalksError } from '../core/errors';
import { mapRegistry } from '../core/registry';
import type {
  MaptalksMap,
  MaptalksSyncField,
  UseMaptalksSyncOptions,
  UseMaptalksSyncReturn,
} from '../types';

/** 默认监听的视图变更事件 */
const DEFAULT_SYNC_EVENTS = 'moveend zoomend pitch rotate';
/** 默认参与同步的维度 */
const DEFAULT_FIELDS: MaptalksSyncField[] = ['center', 'zoom', 'pitch', 'bearing'];

/** 取地图实例的 getter */
type MapGetter = () => MaptalksMap | null;

/** 共享门闩：syncing 为 true 时跳过同步写回，避免回环 */
interface SyncState {
  syncing: boolean;
}

/**
 * 把入参条目（实例引用或注册表名）规整为取地图实例的 getter。
 *
 * @description 字符串经 `mapRegistry` 解析为响应式引用；其它按 `MaybeRefOrGetter` 取值。
 * @param {MaybeRefOrGetter<MaptalksMap | null> | string} entry - 地图实例引用或注册表名
 * @returns {MapGetter} 返回地图实例或 null 的 getter
 *
 * @example
 * const get = toGetter('main');
 * const map = get();
 */
function toGetter(entry: MaybeRefOrGetter<MaptalksMap | null> | string): MapGetter {
  if (typeof entry === 'string') return () => mapRegistry.get(entry)?.value ?? null;
  return () => toValue(entry);
}

/**
 * 把源地图的指定维度应用到目标地图。
 *
 * @description 按 fields 逐项把 source 的视图值写入 target。
 * @param {MaptalksMap} target - 目标地图
 * @param {MaptalksMap} source - 源地图
 * @param {MaptalksSyncField[]} fields - 参与同步的维度
 * @returns {void}
 *
 * @example
 * applyFields(slave, master, ['center', 'zoom']);
 */
function applyFields(target: MaptalksMap, source: MaptalksMap, fields: MaptalksSyncField[]): void {
  for (const f of fields) {
    if (f === 'center') target.setCenter(source.getCenter());
    else if (f === 'zoom') target.setZoom(source.getZoom());
    else if (f === 'pitch') target.setPitch(source.getPitch());
    else if (f === 'bearing') target.setBearing(source.getBearing());
  }
}

/**
 * 解析主从模式的主图 getter。
 *
 * @description 仅 master-slave 模式需要；缺少 master 抛 MaptalksError；其它模式返回 null。
 * @param {'mutual' | 'master-slave'} mode - 同步模型
 * @param {MaptalksMap | string | undefined} master - 主图实例或注册表名
 * @returns {MapGetter | null} 主图 getter，或非主从模式时为 null
 *
 * @example
 * const masterGetter = resolveMasterGetter('master-slave', 'left');
 */
function resolveMasterGetter(
  mode: 'mutual' | 'master-slave',
  master: MaptalksMap | string | undefined,
): MapGetter | null {
  if (mode !== 'master-slave') return null;
  if (master === undefined) {
    throw new MaptalksError('init-failed', 'useMaptalksSync 的 master-slave 模式必须指定 master');
  }
  return toGetter(master);
}

/**
 * 创建「从源地图同步到其余地图」的执行器（带门闩防回环）。
 *
 * @description 门闩开启时直接返回；master-slave 模式下仅当源为主图才同步；同步后在 nextTick 解闩。
 * @param {MapGetter[]} getters - 全部参与地图的 getter
 * @param {'mutual' | 'master-slave'} mode - 同步模型
 * @param {MapGetter | null} masterGetter - 主图 getter（master-slave 时有效）
 * @param {MaptalksSyncField[]} fields - 参与同步的维度
 * @param {SyncState} state - 共享门闩状态
 * @returns {(sourceMap: MaptalksMap) => void} 接受源地图、把其视图同步到其余地图的函数
 *
 * @example
 * const run = createSyncRunner(getters, 'mutual', null, ['zoom'], { syncing: false });
 * run(sourceMap);
 */
function createSyncRunner(
  getters: MapGetter[],
  mode: 'mutual' | 'master-slave',
  masterGetter: MapGetter | null,
  fields: MaptalksSyncField[],
  state: SyncState,
): (sourceMap: MaptalksMap) => void {
  return (sourceMap: MaptalksMap) => {
    if (state.syncing) return;
    if (mode === 'master-slave' && masterGetter && sourceMap !== masterGetter()) return;
    state.syncing = true;
    for (const g of getters) {
      const t = g();
      if (t && t !== sourceMap) applyFields(t, sourceMap, fields);
    }
    void nextTick(() => {
      state.syncing = false;
    });
  };
}

/**
 * 计算需要绑定视图事件的地图集合。
 *
 * @description mutual 绑定全部存在的地图；master-slave 仅绑定主图。
 * @param {MapGetter[]} getters - 全部参与地图的 getter
 * @param {'mutual' | 'master-slave'} mode - 同步模型
 * @param {MapGetter | null} masterGetter - 主图 getter（master-slave 时有效）
 * @returns {MaptalksMap[]} 需要绑定事件的地图实例数组
 *
 * @example
 * const targets = collectBindTargets(getters, 'master-slave', masterGetter);
 */
function collectBindTargets(
  getters: MapGetter[],
  mode: 'mutual' | 'master-slave',
  masterGetter: MapGetter | null,
): MaptalksMap[] {
  if (mode === 'master-slave') {
    const mm = masterGetter?.();
    return mm ? [mm] : [];
  }
  return getters.map((g) => g()).filter((m): m is MaptalksMap => m !== null);
}

/**
 * 在当前作用域内绑定多图同步：创建 enable/disable/rebind 与地图就绪监听，返回同步句柄。
 *
 * @description 抽离自 useMaptalksSync 以控制函数体量。enable/disable 切换 isEnabled 并（解）绑定；
 * 通过 watch 监听地图实例就绪/变化，enabled 时自动（重）绑定；作用域销毁时停止监听并解绑。
 * @param {MapGetter[]} getters - 参与同步地图的 getter 数组
 * @param {'mutual' | 'master-slave'} mode - 同步模型
 * @param {MapGetter | null} masterGetter - 主图 getter（master-slave 时有效）
 * @param {MaptalksSyncField[]} fields - 参与同步的维度
 * @param {string} events - 监听的视图变更事件
 * @returns {UseMaptalksSyncReturn} `{ enable, disable, isEnabled }`
 *
 * @example
 * const handle = bindSync(getters, 'mutual', null, ['zoom'], 'zoomend');
 */
function bindSync(
  getters: MapGetter[],
  mode: 'mutual' | 'master-slave',
  masterGetter: MapGetter | null,
  fields: MaptalksSyncField[],
  events: string,
): UseMaptalksSyncReturn {
  const isEnabled = ref(false);
  const state: SyncState = { syncing: false };
  const bound: Array<{ map: MaptalksMap; handler: () => void }> = [];
  const syncFrom = createSyncRunner(getters, mode, masterGetter, fields, state);
  /** 解绑当前所有已绑定的事件 */
  function unbind(): void {
    for (const { map, handler } of bound) map.off(events, handler);
    bound.length = 0;
  }
  /** 按当前可用地图（重）绑定事件；未启用时仅解绑 */
  function rebind(): void {
    unbind();
    if (!isEnabled.value) return;
    for (const m of collectBindTargets(getters, mode, masterGetter)) {
      const handler = () => syncFrom(m);
      m.on(events, handler);
      bound.push({ map: m, handler });
    }
  }
  const enable = (): void => {
    isEnabled.value = true;
    rebind();
  };
  const disable = (): void => {
    isEnabled.value = false;
    unbind();
  };
  // 监听参与地图实例的就绪/变化：地图异步创建完成后自动（重）绑定
  const stopWatch = watch(
    () => getters.map((g) => g()),
    () => {
      if (isEnabled.value) rebind();
    },
    { immediate: true },
  );
  enable();
  onScopeDispose(() => {
    stopWatch();
    disable();
  });
  return { enable, disable, isEnabled };
}

/**
 * 多图视图同步（双向 mutual 或主从 master-slave）。
 *
 * @description 监听各地图的视图变更事件，把变更同步到其余地图，用门闩防回环。
 * mutual：任一地图变更驱动其余；master-slave：仅主图变更驱动从图。默认即启用，作用域销毁自动解绑。
 * 通过内部 watch 监听地图实例就绪：配合 useMaptalks 的异步创建，地图就绪后会自动（重）绑定。
 * @param {Array<MaybeRefOrGetter<MaptalksMap | null> | string>} maps - 地图实例引用或注册表名数组
 * @param {UseMaptalksSyncOptions} [options] - 同步模型 / 主图 / 维度 / 事件
 * @returns {UseMaptalksSyncReturn} `{ enable, disable, isEnabled }`
 *
 * @example
 * useMaptalksSync(['left', 'right']); // 双向同步
 * useMaptalksSync(['left', 'right'], { mode: 'master-slave', master: 'left' });
 */
export function useMaptalksSync(
  maps: Array<MaybeRefOrGetter<MaptalksMap | null> | string>,
  options: UseMaptalksSyncOptions = {},
): UseMaptalksSyncReturn {
  const mode = options.mode ?? 'mutual';
  const fields = options.fields ?? DEFAULT_FIELDS;
  const events = options.events ?? DEFAULT_SYNC_EVENTS;
  const getters = maps.map((entry) => toGetter(entry));
  const masterGetter = resolveMasterGetter(mode, options.master);
  return bindSync(getters, mode, masterGetter, fields, events);
}
