<template>
  <div>
    <!-- 外层视口裁剪 -->
    <div class="relative rounded border border-default overflow-hidden" style="height: 480px">
      <!-- 内层容器用 200% 尺寸渲染，再 CSS 缩小一半：等效降低 devicePixelRatio -->
      <div
        ref="el"
        class="absolute"
        style="width: 200%; height: 200%; transform: scale(0.5); transform-origin: 0 0"
      />
    </div>
    <p class="text-sm text-muted mt-2">
      容器用 200% 尺寸渲染 + transform: scale(0.5)——高 DPR 屏幕上可显著降低渲染压力（官网 1.18 同款技巧）。
      当前 devicePixelRatio：{{ dpr }}
    </p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
// 展示当前设备像素比，便于理解该技巧的收益场景
const dpr = ref(1);
onMounted(() => {
  dpr.value = window.devicePixelRatio;
});
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });
</script>
