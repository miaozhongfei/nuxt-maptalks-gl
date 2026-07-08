<template>
  <div style="display: none">
    <div ref="wrapper"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, onMounted, ref, toValue, useSlots, watch } from 'vue'

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
  { autoDispose: true, animation: 'scale' },
)

const emit = defineEmits<{
  open: []
  close: []
}>()

const slots = useSlots()
const wrapper = ref<HTMLElement | null>(null)

const geometry = inject(MARKER_GEOMETRY_KEY)
if (!geometry) throw new Error('[nuxt-maptalks-gl] MaptalksMarkerInfoWindow 必须在 MaptalksMarker 内使用')

// 不传 content——geometry 就绪 + wrapper 有值后，一次性调 setInfoWindow 配完整选项（同 composable 页只调一次）
const { open: rawOpen, close: rawClose } = useMaptalksMarkerInfoWindow(geometry, {
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

// 等 geometry 和 wrapper 都就绪后，用完整选项（含 content）只调一次 setInfoWindow
watch(
  [() => toValue(geometry), wrapper],
  ([g, w]) => {
    if (g && w) {
      const m = g as { setInfoWindow?(opts: Record<string, unknown>): void }
      const opts: Record<string, unknown> = { content: w.innerHTML }
      if (props.title !== undefined) opts.title = props.title
      if (props.width !== undefined) opts.width = props.width
      if (props.height !== undefined) opts.height = props.height
      if (props.custom !== undefined) opts.custom = props.custom
      if (props.autoPan !== undefined) opts.autoPan = props.autoPan
      if (props.single !== undefined) opts.single = props.single
      if (props.animation !== undefined) opts.animation = props.animation
      if (props.autoOpenOn !== undefined) opts.autoOpenOn = props.autoOpenOn
      m?.setInfoWindow?.(opts)
    }
  },
  { immediate: true },
)

// 包裹 open/close 确保每次打开前 content 是最新的（同时不影响 autoOpenOn 的动画路径）
function open() {
  const g = toValue(geometry) as { setInfoWindow?(opts: Record<string, unknown>): void; openInfoWindow?(): void } | null
  if (g && wrapper.value) {
    // 更新 content（仅当实际变了才调 setInfoWindow）
    const html = wrapper.value.innerHTML
    if (html) g.setInfoWindow?.({ content: html, animation: props.animation })
  }
  rawOpen()
}

function close() { rawClose() }

defineExpose({ open, close })
</script>
