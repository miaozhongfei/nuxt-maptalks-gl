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
    animation?: boolean
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
  // 不在 options 里传 content——挂载后一次性 setInfoWindow，避免二次调用丢失动画
  events: {
    open: () => emit('open'),
    close: () => emit('close'),
  },
})

// 挂载后一次性设置 content（wrapper 此时已有 slot 内容），和 composable 页一样只调一次 setInfoWindow
onMounted(async () => {
  await nextTick()
  const m = toValue(geometry) as { setInfoWindow?(opts: Record<string, unknown>): void } | null
  if (m?.setInfoWindow && wrapper.value) {
    m.setInfoWindow({ content: wrapper.value.innerHTML })
  }
})

defineExpose({ open, close })
</script>
