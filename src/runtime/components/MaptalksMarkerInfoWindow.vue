<template>
  <div style="display: none">
    <div ref="wrapper"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, ref, toValue, useSlots, watch } from 'vue'

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
const wrapper = ref<HTMLElement | null>(null)

const geometry = inject(MARKER_GEOMETRY_KEY)
if (!geometry) throw new Error('[nuxt-maptalks-gl] MaptalksMarkerInfoWindow 必须在 MaptalksMarker 内使用')

const { open, close } = useMaptalksMarkerInfoWindow(geometry, {
  title: props.title,
  width: props.width,
  height: props.height,
  ...(props.autoPan !== undefined ? { autoPan: props.autoPan } : {}),
  ...(props.single !== undefined ? { single: props.single } : {}),
  ...(props.custom !== undefined ? { custom: props.custom } : {}),
  ...(props.animation !== undefined ? { animation: props.animation } : {}),
  ...(props.autoOpenOn !== undefined ? { autoOpenOn: props.autoOpenOn } : {}),
  autoDispose: props.autoDispose,
  content:'',
  events: {
    open: () => emit('open'),
    close: () => emit('close'),
  },
})
// const { open, close } = useMaptalksMarkerInfoWindow(geometry, { title: '', custom: true, content: '<div>你好你好NIHAO</div>' })

// geometry 和 wrapper 都就绪后，用 setContent 局部更新内容（不动 animation 等 maptalks 默认 option）
watch(
  [() => toValue(geometry), wrapper],
  async ([g, w]) => {
    if (g && w) {
      await nextTick()
      const m = g as { getInfoWindow?: () => { setContent?: (c: string) => void } | null }
      m?.getInfoWindow?.()?.setContent?.(w.innerHTML)
    }
  },
  { immediate: true },
)

defineExpose({ open, close })
</script>
