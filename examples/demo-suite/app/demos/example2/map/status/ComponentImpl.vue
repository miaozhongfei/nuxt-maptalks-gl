<template>
  <div>
    <!-- 组件单独：@ready 载荷即地图实例，读取一次初始状态（组件事件面） -->
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
      @ready="onReady"
    />
    <p class="text-sm text-muted mt-2">就绪时中心：{{ info.center }} · 缩放：{{ info.zoom }}</p>
  </div>
</template>

<script setup lang="ts">
import type { MaptalksMap as MtMap } from '@lacqjs/nuxt-maptalks-gl';

// ready 事件回调里读取一次地图初始状态
const info = ref<{ center: string; zoom: string | number }>({ center: '-', zoom: '-' });
function onReady(m: MtMap) {
  const c = m.getCenter();
  info.value = { center: `${c.x.toFixed(4)}, ${c.y.toFixed(4)}`, zoom: m.getZoom() };
}
</script>
