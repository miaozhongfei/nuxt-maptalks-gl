<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton size="sm" @click="panTo([121.4906, 31.2397])">原生 panTo 外滩</UButton>
      <UButton size="sm" color="neutral" variant="outline" @click="setCenter([121.52, 31.235])">原生 setCenter（瞬移）</UButton>
      <UButton size="sm" color="neutral" @click="panTo([121.5057, 31.2453])">回到原点</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

// 逃生舱：原生 panTo / setCenter（坐标数组会被 maptalks 自动转为 Coordinate）
function panTo(c: [number, number]) {
  const m = map.value as unknown as { panTo: (c: [number, number]) => void } | null;
  m?.panTo(c);
}
function setCenter(c: [number, number]) {
  const m = map.value as unknown as { setCenter: (c: [number, number]) => void } | null;
  m?.setCenter(c);
}
</script>
