<template>
  <div>
    <h1>useMaptalksCamera · 相机双向同步</h1>
    <p style="color: #666">
      拖动 / 缩放地图，下方数值自动更新（地图 → ref）；修改 zoom 输入会驱动地图缩放（ref → 地图）。
    </p>
    <div style="margin-bottom: 12px; color: #444">
      <span>center: {{ center?.x.toFixed(4) ?? '—' }}, {{ center?.y.toFixed(4) ?? '—' }}</span>
      &nbsp;|&nbsp; zoom:
      <input v-model.number="zoom" type="number" style="width: 64px" />
      &nbsp;|&nbsp; pitch: {{ pitch?.toFixed(1) ?? '—' }} &nbsp;|&nbsp; bearing:
      {{ bearing?.toFixed(1) ?? '—' }}
      &nbsp;|&nbsp;
      <button @click="goLujiazui">animateTo 平滑过渡到陆家嘴</button>
      <button @click="jumpLujiazui">flyTo 瞬间跳到陆家嘴</button>
    </div>
    <div ref="el" data-testid="map" class="map" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 11 });
useMaptalksTileLayer(map, { source: 'osm' });

// 相机双向同步 + 命令式过渡
const { center, zoom, pitch, bearing, animateTo, flyTo } = useMaptalksCamera(map);

  /** 平滑过渡到陆家嘴（有动画） */
function goLujiazui(): void {
  animateTo({ center: [121.4997, 31.2397], zoom: 14 }, { duration: 2000 });
}
  /** 瞬间跳到陆家嘴（无动画） */
function jumpLujiazui(): void {
  flyTo({ center: [121.4997, 31.2397], zoom: 14 });
}
</script>

<style scoped>
.map {
  height: 440px;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
