<template>
  <div>
    <h1>预设 · TileLayer（公开源）</h1>
    <p style="color: #666">useMaptalksTileLayer 加载配置中的命名公开源 'osm'（栅格瓦片）。</p>
    <p v-if="error" style="color: #f56c6c">源错误：{{ error.code }} — {{ error.message }}</p>
    <p v-else style="color: #67c23a">图层：{{ layer ? '已添加 ✓' : '加载中…' }}</p>
    <div ref="el" data-testid="map" class="map" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
  const { map } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 11 });
// 命名公开源（来自 nuxt.config 的 maptalksGl.sources.osm）
const { layer, error } = useMaptalksTileLayer(map, { source: 'osm' });
</script>

<style scoped>
.map {
  height: 480px;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
