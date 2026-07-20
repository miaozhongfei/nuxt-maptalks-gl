<template>
  <div>
    <!-- 组件单独：minZoom / maxZoom 是运行期响应式 prop -->
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="14"
      :min-zoom="minZoom"
      :max-zoom="maxZoom"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-6 mt-3 flex-wrap">
      <div class="flex items-center gap-2 w-72">
        <span class="text-sm w-24 shrink-0">minZoom {{ minZoom }}</span>
        <USlider v-model="minZoom" :min="1" :max="15" :step="1" />
      </div>
      <div class="flex items-center gap-2 w-72">
        <span class="text-sm w-24 shrink-0">maxZoom {{ maxZoom }}</span>
        <USlider v-model="maxZoom" :min="15" :max="19" :step="1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 两个滑杆实时热更新缩放上下限
const minZoom = ref(12);
const maxZoom = ref(16);
</script>
