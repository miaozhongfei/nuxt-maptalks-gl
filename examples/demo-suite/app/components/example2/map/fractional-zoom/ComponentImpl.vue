<template>
  <div>
    <!-- 组件单独：初始 zoom 直接给小数（fractional zoom） -->
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="14.5"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">初始 zoom = 14.5（非整数级别）</p>
  </div>
</template>
