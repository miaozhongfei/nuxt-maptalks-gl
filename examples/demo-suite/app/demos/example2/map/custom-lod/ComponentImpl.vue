<template>
  <div>
    <!-- 组件单独：spatialReference 在 options 透传，zoom 范围变为 0~5 -->
    <MaptalksMap
      :center="[-0.113049, 51.498568]"
      :zoom="3"
      base-layer="osm"
      :options="{ spatialReference }"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">自定义 6 级 LOD：zoom 只在 0 ~ 5 之间变化（滚轮试试）。</p>
  </div>
</template>

<script setup lang="ts">
// 自定义 LOD：仅 6 级分辨率（对应 Web 墨卡托 z10~z15，逐级减半）
const resolutions = Array.from(
  { length: 6 },
  (_, i) => (2 * 6378137 * Math.PI) / (256 * 2 ** (i + 10)),
);
const spatialReference = { projection: 'EPSG:3857', resolutions };
</script>
