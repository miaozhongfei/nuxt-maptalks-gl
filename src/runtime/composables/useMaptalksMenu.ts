import { onScopeDispose, shallowRef, toValue, watch } from 'vue'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { MaptalksError, toMaptalksError } from '../core/errors'
import { loadMaptalks } from '../core/loader'
import type { MaptalksEventHandler, MaptalksMap, MaptalksMenu, MaptalksMenuOptions, MaptalksMenuItem } from '../types'
import { createLogger } from '../utils/logger'

const logger = createLogger('nuxt-maptalks-gl')

export interface UseMaptalksMenuOpts {
  options?: MaybeRefOrGetter<MaptalksMenuOptions | undefined>
  events?: Record<string, MaptalksEventHandler>
  autoDispose?: boolean
}

export interface UseMaptalksMenuReturn {
  menu: ShallowRef<MaptalksMenu | null>
  show: (coordinate?: { x: number; y: number }) => void
  hide: () => void
  remove: () => void
}

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

function removeMenu(
  menuRef: ShallowRef<MaptalksMenu | null>,
  s1: () => void,
  s2: () => void,
  s3: (() => void) | null,
  events: Record<string, MaptalksEventHandler>,
  contextmenuCleanup: (() => void) | null,
): void {
  s1(); s2()
  if (s3) s3()
  const menu = menuRef.value
  if (!menu) return
  unbindEvents(menu, events)
  if (contextmenuCleanup) contextmenuCleanup()
  try { menu.remove() } catch {
    /* 忽略因地图销毁导致的清理报错 */
  }
  menuRef.value = null
}

export function useMaptalksMenu(
  target: MaybeRefOrGetter<MaptalksMap | null>,
  opts: UseMaptalksMenuOpts = {},
): UseMaptalksMenuReturn {
  const menu = shallowRef<MaptalksMenu | null>(null)
  let creating = false
  let contextmenuCleanup: (() => void) | null = null
  const events = opts.events ?? {}

  async function reload() {
    const m = toValue(target)
    if (!m || creating) return
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
      mnu.addTo(m)
      const cmHandler = (e: unknown) => {
        const coord = (e as { coordinate?: { x: number; y: number } }).coordinate
        mnu.show(coord as { x: number; y: number } | undefined)
      }
      m.on('contextmenu', cmHandler)
      contextmenuCleanup = () => m.off('contextmenu', cmHandler)
      bindEvents(mnu, events)
      menu.value = mnu
    } catch (cause) {
      logger.error('Menu 创建失败', toMaptalksError(cause, 'control-failed', 'Menu 创建失败'))
    } finally {
      creating = false
    }
  }

  const stop1 = watch([() => toValue(target), () => toValue(opts.options)], reload, { immediate: true })

  const stop2 = watch(
    () => { const r = toValue(opts.options); return r ? toValue(r.items as MaybeRefOrGetter<(MaptalksMenuItem | '-')[] | undefined> | undefined) : undefined },
    (items) => { if (menu.value && items) menu.value.setItems(items) },
  )

  function show(coordinate?: { x: number; y: number }): void { requestAnimationFrame(() => menu.value?.show(coordinate)) }
  function hide(): void { menu.value?.hide() }

  if (opts.autoDispose !== false) onScopeDispose(() => removeMenu(menu, stop1, stop2, null, events, contextmenuCleanup))
  return { menu, show, hide, remove: () => removeMenu(menu, stop1, stop2, null, events, contextmenuCleanup) }
}
