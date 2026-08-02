import { onScopeDispose, shallowRef, toValue, watch } from 'vue'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import { dequal } from 'dequal'

import { MaptalksError, toMaptalksError } from '../core/errors'
import { loadMaptalks } from '../core/loader'
import type { MaptalksEventHandler, MaptalksGeometry, MaptalksMenu, MaptalksMenuOptions, MaptalksMenuItem } from '../types'
import { createLogger } from '../utils/logger'

const logger = createLogger('nuxt-maptalks-gl')

export interface UseMaptalksGeometryMenuOpts {
  /** 透传给 `ui.Menu` 构造器的选项（含中文字段注释，详见 MaptalksMenuOptions） */
  options?: MaybeRefOrGetter<MaptalksMenuOptions | undefined>
  /** 事件名 → 处理器（自动 on/off，如 showstart / hide） */
  events?: Record<string, MaptalksEventHandler>
  /** 作用域销毁时是否自动 `removeMenu`，默认 true */
  autoDispose?: boolean
}

export interface UseMaptalksGeometryMenuReturn {
  /** Menu 实例（创建前为 null） */
  menu: ShallowRef<MaptalksMenu | null>
  /** 在指定坐标显示菜单 */
  show: (coordinate?: { x: number; y: number }) => void
  /** 隐藏菜单 */
  hide: () => void
  /** 命令式移除并销毁菜单 */
  remove: () => void
}

/** 批量绑定事单到 Menu 实例 */
function bindEvents(menu: MaptalksMenu, events: Record<string, MaptalksEventHandler>) {
  if (menu.on) {
    for (const [event, handler] of Object.entries(events)) {
      menu.on(event, handler)
    }
  }
}

function unbindEvents(menu: MaptalksMenu, events: Record<string, MaptalksEventHandler>) {
  if (menu.off) {
    for (const [event, handler] of Object.entries(events)) {
      menu.off(event, handler)
    }
  }
}

/** 提取 options 中除 items 外的部分（items 变化走 setItems 增量，不走 reload 重建） */
function buildRest(opts: UseMaptalksGeometryMenuOpts): Record<string, unknown> | undefined {
  const raw = toValue(opts.options)
  if (!raw) return undefined
  const { items: _, ...rest } = raw as Record<string, unknown>
  return rest
}

/** 移除 Menu 实例并清理 watcher/events/contextmenu 绑定，路由切换时几何体可能已销毁，对 remove 用 try-catch 兜底 */
function removeMenu(
  menuRef: ShallowRef<MaptalksMenu | null>,
  stops: (() => void)[],
  events: Record<string, MaptalksEventHandler>,
  contextmenuCleanup: (() => void) | null,
): void {
  for (const s of stops) s()
  const menu = menuRef.value
  if (!menu) return
  unbindEvents(menu, events)
  if (contextmenuCleanup) contextmenuCleanup()
  try { menu.remove() } catch {
    /* 忽略因地图销毁导致的清理报错 */
  }
  menuRef.value = null
}

/**
 * 几何体右键菜单（ui.Menu）。
 *
 * @description 对标 `useMaptalksMenu`：在 geometry 就绪后创建 `mt.ui.Menu` 实例并通过 `addTo(geometry)` 绑定；
 * 手动监听 `contextmenu` 事件 → `menu.show(coord)` 实现右键弹出。options 变化时移除旧实例并重建；
 * items 单独变化时调 `setItems` 增量更新（不重建）。events 自动 on/off；作用域销毁或 `autoDispose` 时自动 cleanup。
 * 构造器缺失抛 `control-failed`。
 *
 * @param {MaybeRefOrGetter<MaptalksGeometry | null>} geometry - 几何体引用（如 useMaptalksMarker 返回的 geometry）
 * @param {UseMaptalksGeometryMenuOpts} [opts] - 菜单选项、事件绑定与自动销毁控制
 * @returns {UseMaptalksGeometryMenuReturn} `{ menu, show, hide, remove }`
 *
 * @example
 * const { geometry } = useMaptalksMarker(layer, { coordinates: [121, 31], ... })
 * const { menu } = useMaptalksGeometryMenu(geometry, {
 *   options: { width: 160, items: [{ item: '放大', click: () => map.value?.zoomIn() }] },
 * })
 */
export function useMaptalksGeometryMenu(
  geometry: MaybeRefOrGetter<MaptalksGeometry | null>,
  opts: UseMaptalksGeometryMenuOpts = {},
): UseMaptalksGeometryMenuReturn {
  const menu = shallowRef<MaptalksMenu | null>(null)
  let creating = false
  // prevRest 在 reload 创建成功后捕获——后续仅 items 变化时 dequal 命中跳过重建，菜单不重建
  let prevRest: Record<string, unknown> | undefined
  let contextmenuCleanup: (() => void) | null = null
  const events = opts.events ?? {}

  async function reload() {
    const geo = toValue(geometry)
    if (!geo || creating) return
    creating = true
    if (menu.value) {
      unbindEvents(menu.value, events)
      if (contextmenuCleanup) { contextmenuCleanup(); contextmenuCleanup = null }
      menu.value.remove()
      menu.value = null
    }
    try {
      const mt = await loadMaptalks()
      const Ctor = mt.ui?.Menu
      if (typeof Ctor !== 'function')
        throw new MaptalksError('control-failed', '当前 maptalks-gl 未导出 ui.Menu')
      const rawOpts = { ...toValue(opts.options) }
      const mnu = new Ctor(rawOpts) as MaptalksMenu
      mnu.addTo(geo as any)
      const cmHandler = (e: unknown) => {
        const coord = (e as { coordinate?: { x: number; y: number } }).coordinate
        mnu.show(coord as { x: number; y: number } | undefined)
      }
      geo.on('contextmenu', cmHandler)
      contextmenuCleanup = () => geo.off('contextmenu', cmHandler)
      bindEvents(mnu, events)
      menu.value = mnu
      // 创建成功后同步捕获 prevRest——items 变化不再触发 reload 重建
      prevRest = buildRest(opts)
    } catch (cause) {
      logger.error('GeometryMenu 创建失败', toMaptalksError(cause, 'control-failed', 'GeometryMenu 创建失败'))
    } finally {
      creating = false
    }
  }

  // geometry 就绪 → 创建/重建
  const stop1Target = watch(() => toValue(geometry), (g) => { if (g) void reload() }, { immediate: true })
  // options（不含 items）真实变化 → 重建；items 由 stop2 增量处理（菜单不重建）
  const stop1Rest = watch(
    () => buildRest(opts),
    (rest) => {
      if (!rest || dequal(rest, prevRest)) return
      prevRest = rest
      void reload()
    },
  )

  const stop2 = watch(
    () => { const r = toValue(opts.options); return r ? toValue(r.items as MaybeRefOrGetter<(MaptalksMenuItem | '-')[] | undefined> | undefined) : undefined },
    (items) => { if (menu.value && items) menu.value.setItems(items) },
  )

  function show(coordinate?: { x: number; y: number }): void { requestAnimationFrame(() => menu.value?.show(coordinate)) }
  function hide(): void { menu.value?.hide() }

  if (opts.autoDispose !== false) onScopeDispose(() => removeMenu(menu, [stop1Target, stop1Rest, stop2], events, contextmenuCleanup))
  return { menu, show, hide, remove: () => removeMenu(menu, [stop1Target, stop1Rest, stop2], events, contextmenuCleanup) }
}
