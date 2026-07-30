<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <label class="flex items-center gap-1.5 text-sm">
        <USwitch v-model="draggable" @update:model-value="v => t('draggable', v)" /> 拖拽
      </label>
      <label class="flex items-center gap-1.5 text-sm">
        <USwitch v-model="zoomable" @update:model-value="v => t('zoomable', v)" /> 缩放
      </label>
      <label class="flex items-center gap-1.5 text-sm">
        <USwitch v-model="scrollWheel" @update:model-value="v => t('scrollWheelZoom', v)" /> 滚轮
      </label>
      <label class="flex items-center gap-1.5 text-sm">
        <USwitch v-model="touchZoom" @update:model-value="v => t('touchZoom', v)" /> 触屏
      </label>
      <label class="flex items-center gap-1.5 text-sm">
        <USwitch v-model="dblClick" @update:model-value="v => t('doubleClickZoom', v)" /> 双击
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

const draggable = ref(true)
const zoomable = ref(true)
const scrollWheel = ref(true)
const touchZoom = ref(true)
const dblClick = ref(true)

function t(key: string, v: boolean) {
  toValue(map)?.config({ [key]: v })
}
</script>
