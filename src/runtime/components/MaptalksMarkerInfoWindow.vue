<template>
  <div />
</template>

<script setup lang="ts">
import { createApp, h, inject, onBeforeUnmount, toValue, useSlots, watch } from 'vue'
import type { App } from 'vue'

import { useMaptalksMarkerInfoWindow } from '../composables/useMaptalksMarkerInfoWindow'
import { MARKER_GEOMETRY_KEY } from '../core/map-context'

const props = withDefaults(
  defineProps<{
    title?: string
    width?: number
    height?: number
    custom?: boolean
    autoPan?: boolean
    single?: boolean
    animation?: string
    autoOpenOn?: string | null
    autoDispose?: boolean
  }>(),
  { autoDispose: true, autoPan: undefined, single: undefined, custom: undefined },
)

const emit = defineEmits<{
  open: []
  close: []
}>()

const slots = useSlots()
let slotApp: App | null = null

const geometry = inject(MARKER_GEOMETRY_KEY)
if (!geometry) throw new Error('[nuxt-maptalks-gl] MaptalksMarkerInfoWindow 必须在 MaptalksMarker 内使用')

const { open, close } = useMaptalksMarkerInfoWindow(geometry, {
  ...(props.title === undefined ? {} : { title: props.title }),
  ...(props.width === undefined ? {} : { width: props.width }),
  ...(props.height === undefined ? {} : { height: props.height }),
  ...(props.autoPan === undefined ? {} : { autoPan: props.autoPan }),
  ...(props.single === undefined ? {} : { single: props.single }),
  ...(props.custom === undefined ? {} : { custom: props.custom }),
  ...(props.animation === undefined ? {} : { animation: props.animation }),
  ...(props.autoOpenOn === undefined ? {} : { autoOpenOn: props.autoOpenOn }),
  autoDispose: props.autoDispose,
  content: '',
  events: {
    open: () => emit('open'),
    close: () => emit('close'),
  },
})

/** 用 createApp().mount() 渲染 slot 到 detached DOM，保留 Vue 事件/生命周期 */
function mountSlotContent() {
  const iw = (toValue(geometry) as { getInfoWindow?: () => { setContent?: (c: HTMLElement) => void } | null })?.getInfoWindow?.();
  if (!iw || !slots.default) return;
  if (slotApp) { slotApp.unmount(); slotApp = null; }
  const mountEl = document.createElement('div');
  slotApp = createApp({ render: () => h('div', null, slots.default?.()) });
  slotApp.mount(mountEl);
  delete mountEl.dataset.vApp;
  iw.setContent(mountEl);
}

// geometry 就绪后挂载 slot 内容到 marker InfoWindow
watch(() => toValue(geometry), (g) => { if (g) mountSlotContent(); }, { immediate: true })

onBeforeUnmount(() => { if (slotApp) { slotApp.unmount(); slotApp = null; } })

defineExpose({ open, close })
</script>
