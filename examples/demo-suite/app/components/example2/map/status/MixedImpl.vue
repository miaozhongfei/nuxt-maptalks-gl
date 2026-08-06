<template>
  <div>
    <!-- 组合：组件建图 + 相机 ref 实时状态 -->
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <!-- 四状态实时回流：拖动/缩放地图，数字跟着变 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
      <div class="rounded border border-default p-2">中心<br>{{ (cam.center.value?.x ?? 0).toFixed(4) }}, {{ (cam.center.value?.y ?? 0).toFixed(4) }}</div>
      <div class="rounded border border-default p-2">缩放<br>{{ (cam.zoom.value ?? 0).toFixed(2) }}</div>
      <div class="rounded border border-default p-2">俯仰<br>{{ (cam.pitch.value ?? 0).toFixed(1) }}°</div>
      <div class="rounded border border-default p-2">旋转<br>{{ (cam.bearing.value ?? 0).toFixed(1) }}°</div>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const cam = useMaptalksCamera(map)

const status = computed(() => (map.value ? '地图已创建（四状态实时回流）' : '加载中…'))
</script>
