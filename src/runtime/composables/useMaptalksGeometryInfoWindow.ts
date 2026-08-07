import { onScopeDispose, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';
import { dequal } from 'dequal';

import { toMaptalksError } from '../core/errors';
import type { MaptalksEventHandler, MaptalksGeometry, MaptalksInfoWindowOptions } from '../types';
import { createLogger } from '../utils/logger';

/** 日志实例 */
const logger = createLogger('nuxt-maptalks-gl');

/**
 * 原生几何体的 setInfoWindow 入参（信息框展示配置）。
 *
 * @description 建模 maptalks `geometry.setInfoWindow()` 的选项对象：标题/内容/尺寸/自定义弹框/动画等。
 * maptalks 中 InfoWindow 是 Geometry 基类能力，Marker / Polygon / Circle 等任意几何体均可使用。
 * 非导出接口，仅内部用于类型约束与透传。
 *
 * @example
 * const opts: GeometryInfoWindowOptions = {
 *   title: '站点详情',
 *   content: '<div>内容</div>',
 *   custom: true,
 *   autoOpenOn: 'click',
 * };
 */
interface GeometryInfoWindowOptions {
  /** 弹框标题（字符串或 DOM） */
  title?: string | HTMLElement;
  /** 弹框内容（字符串或 DOM） */
  content?: string | HTMLElement;
  /** 弹框宽度（px） */
  width?: number;
  /** 弹框高度（px） */
  height?: number;
  /** 是否自定义弹框（true 时使用传入的 content DOM，而非 maptalks 默认样式） */
  custom?: boolean;
  /** 弹出时是否自动平移到可见区域 */
  autoPan?: boolean;
  /** 同时只显示一个弹框 */
  single?: boolean;
  /** 弹出动画（如 'fadeIn'） */
  animation?: string;
  /** 内容水平偏移（px） */
  dx?: number;
  /** 内容垂直偏移（px） */
  dy?: number;
  /** 自动弹出事件（如 'click'，null 禁用自动弹出） */
  autoOpenOn?: string | null;
  /** 自定义选项透传 */
  [key: string]: unknown;
}

/**
 * 带 setInfoWindow/openInfoWindow/closeInfoWindow 的原生几何体接口。
 *
 * @description 建模 maptalks Geometry 基类上信息框相关的最小方法集，供本 composable 内部调用
 * （geometry 的真实类型为 MaptalksGeometry，运行时按此结构窄化）。Marker / Polygon / Circle 等
 * 任意几何体都具备这些方法。非导出接口。
 *
 * @example
 * const g = toValue(geometry) as NativeGeometry | null;
 * g?.setInfoWindow({ title: '站点' });
 */
interface NativeGeometry {
  /** 注册信息框配置 */
  setInfoWindow(opts: GeometryInfoWindowOptions): void;
  /** 获取当前信息框实例（未配置时为 null） */
  getInfoWindow(): NativeInfoWindow | null;
  /** 弹出信息框 */
  openInfoWindow(): void;
  /** 关闭信息框 */
  closeInfoWindow(): void;
  /** 绑定事件 */
  on(event: string, handler: MaptalksEventHandler): void;
  /** 解绑事件 */
  off(event: string, handler: MaptalksEventHandler): void;
}

/**
 * 原生 InfoWindow 实例接口（getInfoWindow() 返回值）。
 *
 * @description 建模 maptalks `geometry.getInfoWindow()` 返回实例的最小方法集：
 * setContent 增量更新、on/off 事件绑定、isVisible 守卫判断。非导出接口。
 *
 * @example
 * const iw = g?.getInfoWindow?.();
 * if (iw?.isVisible?.()) iw.setContent('<div>新内容</div>');
 */
interface NativeInfoWindow {
  /** 替换弹框内容（字符串或 DOM，增量更新不重建实例） */
  setContent(content: string | HTMLElement): void;
  /** 绑定事件 */
  on?(event: string, handler: MaptalksEventHandler): void;
  /** 解绑事件 */
  off?(event: string, handler: MaptalksEventHandler): void;
  /** 是否可见（弹框动画中/已关闭时为 false） */
  isVisible?(): boolean;
}

/**
 * useMaptalksGeometryInfoWindow 的选项。
 *
 * @description 配置几何体级信息框：透传给 geometry.setInfoWindow() 的选项（title / content / custom 等）、
 * 事件绑定（open / close）、自动销毁开关。与 useMaptalksInfoWindow（地图级）不同，此信息框只属于单个几何体。
 *
 * @example
 * const opts: UseMaptalksGeometryInfoWindowOpts = {
 *   options: { title: '站点', custom: true, content: '<div>详情</div>', autoOpenOn: 'click' },
 *   events: { open: () => console.log('opened'), close: () => console.log('closed') },
 * };
 */
export interface UseMaptalksGeometryInfoWindowOpts {
  /** 透传给 geometry.setInfoWindow() 的选项（含中文字段注释，详见 MaptalksInfoWindowOptions） */
  options?: MaybeRefOrGetter<
    MaptalksInfoWindowOptions
    | undefined
  >;
  /** 信息框事件（open/close 等） */
  events?: Record<string, MaptalksEventHandler>;
  /** 组件销毁时自动移除信息框，默认 true */
  autoDispose?: boolean;
}

/**
 * useMaptalksGeometryInfoWindow 的返回值。
 *
 * @description 提供几何体级信息框的控制：`infoWindow`（原生实例 ref）、`show`（弹出）、`hide`（关闭）、
 * `remove`（移除配置并关闭）。
 *
 * @example
 * const { infoWindow, show, hide, remove } = useMaptalksGeometryInfoWindow(geometry, { options: { title: '站点' } });
 * show(); // 弹出该几何体的信息框
 * infoWindow.value?.isVisible?.(); // 判断是否可见
 */
export interface UseMaptalksGeometryInfoWindowReturn {
  /** 原生 InfoWindow 实例（geometry 就绪并 setInfoWindow 后非 null，用 ShallowRef 避免响应式深代理） */
  infoWindow: ShallowRef<NativeInfoWindow | null>;
  /** 显示该几何体的信息框 */
  show: () => void;
  /** 隐藏该几何体的信息框 */
  hide: () => void;
  /** 移除该几何体的信息框配置并隐藏 */
  remove: () => void;
}

/**
 * 从选项构建原生 setInfoWindow 入参。
 *
 * @description 展开 `opts.options`（支持响应式 getter）为普通对象，供 setInfoWindow 调用。
 * @param {UseMaptalksGeometryInfoWindowOpts} opts - composable 选项（取 options 字段）
 * @returns {GeometryInfoWindowOptions} 原生 setInfoWindow 入参
 *
 * @example
 * buildGeometryIWOptions({ options: () => ({ title: '站点' }) }); // → { title: '站点' }
 */
function buildGeometryIWOptions(opts: UseMaptalksGeometryInfoWindowOpts): GeometryInfoWindowOptions {
  return { ...toValue(opts.options) } as GeometryInfoWindowOptions;
}

/**
 * 提取 options 中除 content 外的部分（用于判断是否需重建）。
 *
 * @description content 变化走 setContent 增量、不走重建，因此比较重建依据时剔除 content 字段，
 * 仅当其他选项变化时才触发 setInfoWindow() 全量重建。
 * @param {UseMaptalksGeometryInfoWindowOpts} opts - composable 选项（取 options 字段）
 * @returns {Record<string, unknown> | undefined} 去除 content 后的选项对象；options 为空时返回 undefined
 *
 * @example
 * buildRest({ options: { title: 't', content: '<div>c</div>' } }); // → { title: 't' }
 */
function buildRest(opts: UseMaptalksGeometryInfoWindowOpts): Record<string, unknown> | undefined {
  const raw = toValue(opts.options);
  if (!raw) return undefined;
  const { content: _, ...rest } = raw as Record<string, unknown>;
  return rest;
}

/**
 * 设置几何体信息框的响应式 watch 链路：几何就绪时 setInfoWindow，options 变化重建，content 变化增量，实例同步。
 *
 * @description 共 4 条 watch：#1 几何就绪首次 setInfoWindow 并捕获 prevRest；#2 options（不含 content）
 * 变化 → setInfoWindow() 重建（dequal 防抖）；#3 options.content 变化 → setContent() 增量（弹框保持打开）；
 * #4 原生实例引用变化 → 事件全量透传 + 同步 infoWindow ref。
 * @param {MaybeRefOrGetter<MaptalksGeometry | null>} geometry - 任意几何体（Marker / Polygon / Circle 等）的 geometry
 * @param {UseMaptalksGeometryInfoWindowOpts} opts - 信息框配置（options/events/autoDispose）
 * @param {ShallowRef<boolean>} hasSet - 是否已 setInfoWindow 的标记 ref
 * @param {Record<string, MaptalksEventHandler>} events - 透传到原生实例的事件表
 * @param {ShallowRef<NativeInfoWindow | null>} infoWindow - 原生实例同步的目标 ref
 * @returns {void} 无返回值（副作用由 watch 完成）
 */
// oxlint-disable-next-line max-lines-per-function —— 逻辑行超 50（预存），后续适配时重构
function setupGeometryIW(
  geometry: MaybeRefOrGetter<MaptalksGeometry | null>,
  opts: UseMaptalksGeometryInfoWindowOpts,
  hasSet: ShallowRef<boolean>,
  events: Record<string, MaptalksEventHandler>,
  infoWindow: ShallowRef<NativeInfoWindow | null>,
): void {
  // prevRest 需在 watch #1 之前声明：watch #1 immediate 回调同步执行时会初始化它，避免 TDZ
  let prevRest: Record<string, unknown> | undefined;
  watch(
    () => toValue(geometry) as NativeGeometry | null,
    (g) => {
      if (g && !hasSet.value) {
        try {
          g.setInfoWindow(buildGeometryIWOptions(opts));
          hasSet.value = true;
          // 首次配置后同步捕获 prevRest——后续仅 content 变化时 dequal 命中跳过重建，弹框保持打开
          prevRest = buildRest(opts);
        }
        catch (cause) { logger.error('GeometryInfoWindow 配置失败', toMaptalksError(cause, 'control-failed', 'GeometryInfoWindow 配置失败')); }
      }
    },
    { immediate: true },
  );
  // options（不含 content）变化 → setInfoWindow() 重建；content 由单独 watch 处理
  watch(
    () => buildRest(opts),
    (rest) => {
      if (!rest || dequal(rest, prevRest)) return;
      prevRest = rest;
      const g = toValue(geometry) as NativeGeometry | null;
      if (g && hasSet.value) g.setInfoWindow(buildGeometryIWOptions(opts));
    },
  );
  // options.content 变化 → 直接 setContent()，不重建 InfoWindow，保持弹框打开
  watch(
    () => {
      const raw = toValue(opts.options);
      if (!raw) return;
      return toValue(raw.content as MaybeRefOrGetter<string | HTMLElement | undefined> | undefined);
    },
    (c) => {
      const g = toValue(geometry) as NativeGeometry | null;
      const iw = g?.getInfoWindow?.();
      if (iw && c !== undefined) iw.setContent(c);
    },
  );
  // 原生 InfoWindow 事件全量透传到 events（add / showstart / showend / hide / remove）
  // 点击几何体自动弹出（autoOpenOn:'click'）走原生 openInfoWindow()，不经 show() 包装，
  // 需在此把原生实例上的事件绑定到用户 events，保证日志/联动一致。
  // options 重建（setInfoWindow）会生成新 InfoWindow 实例 → getInfoWindow() 引用变化 → watch 重新触发重新绑定。
  watch(
    () => {
      const g = toValue(geometry) as NativeGeometry | null;
      return g?.getInfoWindow?.() ?? null;
    },
    (iw) => {
      // 同步实例到 infoWindow ref——组件与用户可经其做 isVisible 判断 / setContent 增量更新
      infoWindow.value = iw;
      if (!iw) return;
      for (const [event, handler] of Object.entries(events)) {
        iw.on?.(event, handler);
      }
    },
  );
}

/**
 * 几何体级信息框：在给定几何体上注册 setInfoWindow，响应式纳管 content/title，返回 infoWindow/show/hide/remove。
 *
 * @description 对应 maptalks 原生的 `geometry.setInfoWindow()` + `openInfoWindow()` / `closeInfoWindow()`。
 * 适用于**任意几何体**（Marker / Polygon / Circle / LineString 等）——点击几何体自动弹出、
 * 点击别处自动关闭，不需手动操控坐标；内容/标题支持响应式更新。
 * @param {MaybeRefOrGetter<MaptalksGeometry | null>} geometry - 任意几何体（useMaptalksMarker / useMaptalksPolygon 等）返回的 geometry
 * @param {UseMaptalksGeometryInfoWindowOpts} [opts] - 信息框配置（options/events/autoDispose）
 * @returns {UseMaptalksGeometryInfoWindowReturn} `{ infoWindow, show, hide, remove }`
 *
 * @example
 * const { geometry } = useMaptalksPolygon(layer, { coordinates: [[[113.27, 23.13], [113.28, 23.13], [113.28, 23.14]]] });
 * const { show } = useMaptalksGeometryInfoWindow(geometry, {
 *   options: { title: '区域详情', custom: true, content: '<div>内容</div>' },
 * });
 */
export function useMaptalksGeometryInfoWindow(
  geometry: MaybeRefOrGetter<MaptalksGeometry | null>,
  opts: UseMaptalksGeometryInfoWindowOpts = {},
): UseMaptalksGeometryInfoWindowReturn {
  const events = opts.events ?? {};
  const hasSet = shallowRef(false);
  // 原生 InfoWindow 实例 ref——geometry 就绪并 setInfoWindow 后由事件透传 watch 同步
  const infoWindow = shallowRef<NativeInfoWindow | null>(null);
  setupGeometryIW(geometry, opts, hasSet, events, infoWindow);

  const show = (): void => {
    (toValue(geometry) as NativeGeometry | null)?.openInfoWindow();
    events.show?.({} as never);
  };
  const hide = (): void => {
    (toValue(geometry) as NativeGeometry | null)?.closeInfoWindow();
    events.hide?.({} as never);
  };
  function remove(): void {
    const g = toValue(geometry) as NativeGeometry | null;
    if (g && hasSet.value) { g.closeInfoWindow(); hasSet.value = false; }
  }

  if (opts.autoDispose ?? true) onScopeDispose(remove);
  return { infoWindow, show, hide, remove };
}
