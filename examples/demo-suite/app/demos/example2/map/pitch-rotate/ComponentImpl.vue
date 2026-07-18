<template>
  <div>
    <!-- 组件单独：pitch / bearing props 设定初始视角（这两个 prop 不做运行期重设） -->
    <MaptalksMap
      :center="[-0.113049, 51.498568]"
      :zoom="14"
      :pitch="45"
      :bearing="-30"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">初始 pitch 45°、bearing -30°；按住右键（或 Ctrl+左键）拖拽可继续调整</p>
  </div>
</template>
