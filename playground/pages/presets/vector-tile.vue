<template>
  <div>
    <h1>预设 · VectorTileLayer（矢量瓦片）</h1>
    <p style="color: #666">
      useMaptalksVectorTileLayer
      接线演示。下例用内联源（逃生舱口），实际渲染需替换为真实矢量切片服务。
    </p>
    <p v-if="error" style="color: #f56c6c">源错误：{{ error.code }} — {{ error.message }}</p>
    <p v-else style="color: #67c23a">图层：{{ layer ? '已添加 ✓' : '加载中…' }}</p>
    <p style="color: #999; font-size: 13px">
      提示：将 urlTemplate 替换为可用的 .pbf/.mvt 服务，并配 options.style 即可正常渲染。
    </p>
    <div ref="el" data-testid="map" class="map" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
  const { map } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 11 });
// 内联源（逃生舱口）：直接给矢量切片地址；真实使用请替换为可用服务
const { layer, error } = useMaptalksVectorTileLayer(map, {
  source: { kind: 'public', type: 'vt', urlTemplate: 'https://tile.example.com/{z}/{x}/{y}.pbf' },
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
