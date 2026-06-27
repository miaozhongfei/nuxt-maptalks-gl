<template>
  <div>
    <h1>useMaptalksLayer · 通用图层原语</h1>
    <p style="color: #666">
      用 factory 直接构造任意 maptalks 图层（这里手动 new TileLayer，演示逃生舱口与零改动纳管）。
    </p>
    <p v-if="error" style="color: #f56c6c">错误：{{ error.code }} — {{ error.message }}</p>
    <p v-else style="color: #67c23a">图层状态：{{ layer ? '已添加 ✓' : '等待地图就绪…' }}</p>
    <div ref="el" data-testid="map" class="map" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
  const { map, error } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 11 });
// 通用原语：factory 接收已加载的 maptalks-gl 命名空间，返回任意图层实例
const { layer } = useMaptalksLayer(map, (mt) => {
  return new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    attribution: '© OpenStreetMap contributors, © CARTO',
  });
});
</script>

<style scoped>
.map {
  height: 480px;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
