<template>
  <div style="display: none">
    <div ref="wrapper"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, useSlots } from 'vue'

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
  { autoDispose: true },
)

const emit = defineEmits<{
  open: []
  close: []
}>()

const slots = useSlots()
const wrapper = ref<HTMLElement | null>(null)

const geometry = inject(MARKER_GEOMETRY_KEY)
if (!geometry) throw new Error('[nuxt-maptalks-gl] MaptalksMarkerInfoWindow 必须在 MaptalksMarker 内使用')

// content 传 getter：setup 阶段 wrapper 为 null（返 ''），但 geometry 是异步创建，
// mount 后 wrapper 已有值，geometry watch 触发时 innerHTML 正确，只调一次 setInfoWindow
const { open, close } = useMaptalksMarkerInfoWindow(geometry, {
  title: props.title,
  width: props.width,
  height: props.height,
  custom: props.custom,
  autoPan: props.autoPan,
  single: props.single,
  animation: props.animation,
  autoDispose: props.autoDispose,
  autoOpenOn: props.autoOpenOn,
  content: () => wrapper.value?.innerHTML ?? '',
  events: {
    open: () => emit('open'),
    close: () => emit('close'),
  },
})

defineExpose({ open, close })
</script>
