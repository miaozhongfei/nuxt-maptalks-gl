<template>
  <div style="display: none">
    <div ref="wrapper"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, onMounted, ref, toValue, useSlots } from 'vue'

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

// 不传 content——setup 阶段 wrapper 为 null，composable geometry watch 先设完所有 option（animation 等由 maptalks 默认）
// mount 后用 setContent 局部更新内容（不动任何 option）
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
  events: {
    open: () => emit('open'),
    close: () => emit('close'),
  },
})

// mount 后用 getInfoWindow().setContent() 局部更新内容
onMounted(async () => {
  await nextTick()
  const m = toValue(geometry) as { getInfoWindow?: () => { setContent?: (c: string) => void } | null } | null
  console.log('MaptalksMarkerInfoWindow mounted, wrapper.innerHTML', wrapper.value?.innerHTML)
  m?.getInfoWindow?.()?.setContent?.(wrapper.value?.innerHTML ?? '')
})

defineExpose({ open, close })
</script>
