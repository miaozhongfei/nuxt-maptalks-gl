<template>
  <div>
    <h1>useMaptalks · 第一张地图</h1>
    <p style="color: #666">useMaptalks 创建地图 + useMaptalksTileLayer 加载 OpenStreetMap 底图。</p>
    <p v-if="error" style="color: #f56c6c">错误：{{ error.code }} — {{ error.message }}</p>
    <p v-else-if="!isReady" style="color: #999">地图加载中…</p>
    <p v-else style="color: #67c23a">地图已就绪 ✓</p>
    <div ref="el" data-testid="map" class="map" />
  </div>
</template>

<script setup lang="ts">
// 容器引用：必须有明确高度，maptalks 才能正确渲染
const el = ref<HTMLElement | null>(null);
// 创建地图（命名 'basic'，可经 useMaptalksInstance('basic') 跨组件获取）
const { map, isReady, error } = useMaptalks(el, {
  name: 'basic',
  center: [121.4737, 31.2304],
  zoom: 11,
});
// 用 OSM 公开源加载底图（副作用即添加图层，无需捕获返回）
useMaptalksTileLayer(map, { source: 'osm' });
</script>

<style scoped>
.map {
  height: 480px;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
