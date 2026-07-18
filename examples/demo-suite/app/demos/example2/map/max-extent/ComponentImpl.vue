<template>
  <div>
    <!-- 组件单独：maxExtent 走 options 透传（JSON 会被 maptalks 转为 Extent）-->
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      :options="{ maxExtent: { xmin: 121.47, ymin: 31.22, xmax: 121.55, ymax: 31.27 } }"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">试着往外拖动——视野会被限制在设定范围内。</p>
  </div>
</template>
