<template>
  <div>
    <div class="relative rounded border border-default overflow-hidden" style="height: 480px">
      <div style="width: 200%; height: 200%; transform: scale(0.5); transform-origin: 0 0">
        <MaptalksMap
          :center="[121.5057, 31.2453]"
          :zoom="14"
          base-layer="osm"
          style="height: 100%; width: 100%"
        />
      </div>
    </div>
    <p class="text-sm text-muted mt-2">
      容器用 200% 尺寸渲染 + transform: scale(0.5)——高 DPR 屏幕上可显著降低渲染压力（官网 1.18 同款技巧）。
      当前 devicePixelRatio：{{ dpr }}
    </p>
  </div>
</template>

<script setup lang="ts">
const dpr = ref(1);
onMounted(() => { dpr.value = window.devicePixelRatio; });
</script>
