<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="cam.setMaxExtent(EXT)">设置限制</UButton>
      <UButton size="sm" color="neutral" @click="cam.setMaxExtent(null)">解除限制</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// 限制范围（JSON 形式，maptalks 内部会转 Extent）
const EXT = { xmin: 121.47, ymin: 31.22, xmax: 121.55, ymax: 31.27 };

const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });
// setMaxExtent 由 camera composable 提供，传 null 解除
const cam = useMaptalksCamera(map);
</script>
