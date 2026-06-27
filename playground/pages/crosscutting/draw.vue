<template>
  <div>
    <h1>useMaptalksDrawTool · 绘制工具</h1>
    <p style="color: #666">
      DrawTool 生命周期：切换模式 / 启停绘制，结果以响应式 ref 暴露，自动 dispose。
    </p>
    <div style="margin-bottom: 12px">
      <button :disabled="mode === 'Point'" @click="setMode('Point')">点</button>
      <button :disabled="mode === 'LineString'" @click="setMode('LineString')">线</button>
      <button :disabled="mode === 'Polygon'" @click="setMode('Polygon')">面</button>
      &nbsp;
      <button @click="toggle">{{ enabled ? '停止绘制' : '开始绘制' }}</button>
      &nbsp;
      <span style="color: #444">
        模式：{{ mode }} ·
        <span data-testid="draw-result">{{ result ? '已绘制一个图形 ✓' : '（未绘制）' }}</span>
      </span>
    </div>
    <div ref="el" data-testid="map" class="map" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
  const { map } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 11 });
useMaptalksTileLayer(map, { source: 'osm' });

const { mode, enabled, result, enable, disable, setMode } = useMaptalksDrawTool(map, {
  mode: 'Polygon',
});

/** 切换绘制启停 */
function toggle(): void {
  if (enabled.value) disable();
  else enable();
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
