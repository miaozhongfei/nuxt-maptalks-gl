<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      :draggable="draggable"
      :zoomable="zoomable"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <label class="flex items-center gap-1.5 text-sm">
        <USwitch v-model="draggable" /> 拖拽
      </label>
      <label class="flex items-center gap-1.5 text-sm">
        <USwitch v-model="zoomable" /> 缩放
      </label>
      <label class="flex items-center gap-1.5 text-sm">
        <USwitch v-model="scrollWheel" @update:model-value="v => toggle('scrollWheelZoom', v)" /> 滚轮
      </label>
      <label class="flex items-center gap-1.5 text-sm">
        <USwitch v-model="touchZoom" @update:model-value="v => toggle('touchZoom', v)" /> 触屏
      </label>
      <label class="flex items-center gap-1.5 text-sm">
        <USwitch v-model="dblClick" @update:model-value="v => toggle('doubleClickZoom', v)" /> 双击
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
// Vue template ref 会自动 unwrap defineExpose 的 shallowRef，所以 map 直接是 MaptalksMap 实例
const mc = ref<{ map: MaptalksMap | null; isReady: boolean; error: MaptalksError | null } | null>(null)
// draggable / zoomable 走组件 prop（声明式响应）
const draggable = ref(true)
const zoomable = ref(true)
// 组件未单独声明 prop 的 3 项走 map.config() 直调
const scrollWheel = ref(true)
const touchZoom = ref(true)
const dblClick = ref(true)

function toggle(key: 'scrollWheelZoom' | 'touchZoom' | 'doubleClickZoom', v: boolean) {
  mc.value?.map?.config({ [key]: v })
}
</script>
