<template>
  <div>
    <h1>图层 · 控制 + WMS 预设演示</h1>
    <p style="color: #666">
      useMaptalksLayerControl 控制底图的显隐 / 透明度 / 层级；useMaptalksWMSLayer 加载 OGC WMS
      服务。
    </p>
    <div style="margin-bottom: 12px">
      <button data-testid="toggle" @click="visible = !visible">切换显隐</button>
      <button data-testid="opacity-down" style="margin-left: 8px" @click="lower">降低透明度</button>
      <button data-testid="opacity-up" style="margin-left: 8px" @click="raise">提高透明度</button>
      <button data-testid="front" style="margin-left: 8px" @click="ctl.bringToFront()">置顶</button>
      <button data-testid="back" style="margin-left: 8px" @click="ctl.bringToBack()">置底</button>
      <span data-testid="visible-status" style="margin-left: 12px; color: #1bbc9b">{{
        visible ? '可见' : '隐藏'
      }}</span>
      <span data-testid="opacity-status" style="margin-left: 12px; color: #1f8ceb"
        >透明度：{{ opacity.toFixed(1) }}</span
      >
    </div>
    <p data-testid="wms-status" :style="{ color: wmsLayer ? '#67c23a' : '#999' }">
      WMS 图层：{{ wmsLayer ? '已添加 ✓' : '加载中…' }}
    </p>
    <div ref="el" data-testid="map" class="map" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [-98.5, 39.5], zoom: 4 });

// 底图：公开栅格瓦片源（来自 nuxt.config 的 maptalksGl.sources.osm）
const { layer: baseLayer } = useMaptalksTileLayer(map, { source: 'osm' });

// WMS 图层：内联公开源，url 作为 WMS 服务基址，options 给业务参数（图层名 / 格式 / 透明）
const { layer: wmsLayer } = useMaptalksWMSLayer(map, {
  source: {
    kind: 'public',
    type: 'wms',
    url: 'https://ahocevar.com/geoserver/wms',
    options: { layers: 'topp:states', format: 'image/png', transparent: true },
  },
});

// 图层控制：响应式 visible / opacity 联动到底图
const visible = ref(true);
const opacity = ref(1);
const ctl = useMaptalksLayerControl(baseLayer, { visible, opacity });

/** 降低底图透明度（下限 0） */
function lower(): void {
  opacity.value = Math.max(0, Math.round((opacity.value - 0.2) * 10) / 10);
}

/** 提高底图透明度（上限 1） */
function raise(): void {
  opacity.value = Math.min(1, Math.round((opacity.value + 0.2) * 10) / 10);
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
