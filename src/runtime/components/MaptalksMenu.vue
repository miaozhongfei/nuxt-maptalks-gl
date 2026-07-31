<template>
  <div style="display: none">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { createApp, h, inject, onBeforeUnmount, onUpdated, ref, watch } from 'vue'
import type { App } from 'vue'
import { dequal } from 'dequal'

import { useMaptalksMenu } from '../composables/useMaptalksMenu'
import type { UseMaptalksMenuOpts } from '../composables/useMaptalksMenu'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksMenuOptions } from '../types'

const props = withDefaults(
  defineProps<{
    options?: MaptalksMenuOptions
    events?: Record<string, MaptalksEventHandler>
    autoDispose?: boolean
  }>(),
  { options: undefined, events: undefined, autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksMenu 必须在 MaptalksMap 内使用')

const slots = defineSlots()
let skipNextUpdate = false
let slotApp: App | null = null

const stableOpts = ref<Record<string, unknown> | undefined>(undefined)

watch(
  () => props.options,
  (o) => {
    if (dequal(o, stableOpts.value)) return
    if (!o) { stableOpts.value = undefined; return }
    const filtered: Record<string, unknown> = { ...o }
    for (const k of Object.keys(filtered)) {
      if (filtered[k] === undefined) delete filtered[k]
    }
    stableOpts.value = Object.keys(filtered).length > 0 ? filtered : undefined
  },
  { immediate: true },
)

const menuOpts: UseMaptalksMenuOpts = {
  options: () => stableOpts.value as MaptalksMenuOptions | undefined,
  events: props.events,
  autoDispose: props.autoDispose,
}

const { menu, show, hide } = useMaptalksMenu(map, menuOpts)

function mountSlotContent() {
  if (!menu.value || !slots.default) return
  if (slotApp) { slotApp.unmount(); slotApp = null }
  const mountEl = document.createElement('div')
  slotApp = createApp({ render: () => h('div', null, slots.default?.()) })
  slotApp.mount(mountEl)
  delete mountEl.dataset.vApp
  menu.value.setItems(mountEl)
}

watch(() => menu.value, (v) => {
  if (!v) return
  if (props.options?.custom && slots.default) mountSlotContent()
}, { immediate: true })

onUpdated(() => {
  if (!props.options?.custom) return
  if (skipNextUpdate) { skipNextUpdate = false; return }
  mountSlotContent()
})

onBeforeUnmount(() => { if (slotApp) { slotApp.unmount(); slotApp = null } })

defineExpose({ menu, show, hide })
</script>
