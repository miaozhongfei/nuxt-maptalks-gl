<template><slot /></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksMarkerInfoWindow } from '../composables/useMaptalksMarkerInfoWindow'
import { MARKER_GEOMETRY_KEY } from '../core/map-context'

const props = withDefaults(
  defineProps<{
    /** 标题（空字符串 = 不显示内置标题栏） */
    title?: string
    /** 宽度 */
    width?: number
    /** 高度 */
    height?: number
    /** 自定义模板（true = 禁用 maptalks 内置 chrome，完全由插槽内容自己画 UI） */
    custom?: boolean
    /** 自动移动地图使信息框可见 */
    autoPan?: boolean
    /** 是否唯一（同时只显示一个） */
    single?: boolean
    /** 动画 */
    animation?: boolean
    /** 自动弹出事件（null = 禁用内置自动打开，由 @click 控制） */
    autoOpenOn?: string | null
    /** 组件销毁时自动移除，默认 true */
    autoDispose?: boolean
  }>(),
  { autoDispose: true },
)

const emit = defineEmits<{
  open: []
  close: []
}>()

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
  events: {
    open: () => emit('open'),
    close: () => emit('close'),
  },
})

defineExpose({ open, close })
</script>
