<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton size="sm" @click="panTo([121.4906, 31.2397])">原生 panTo 外滩</UButton>
      <UButton size="sm" color="neutral" variant="outline" @click="panBy(150, 0)">原生 panBy 右移 150px</UButton>
      <UButton size="sm" color="neutral" variant="outline" @click="panBy(0, 120)">原生 panBy 上移 120px</UButton>
      <UButton size="sm" color="neutral" variant="outline" @click="setCenter([121.52, 31.235])">原生 setCenter（瞬移）</UButton>
      <UButton size="sm" color="neutral" @click="panTo([121.5057, 31.2453])">回到原点</UButton>
      <span class="text-sm text-muted">
        中心：{{ (cam.center.value?.x ?? 0).toFixed(4) }}, {{ (cam.center.value?.y ?? 0).toFixed(4) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });
// 相机 composable 仅用于只读显示——逃生舱的业务逻辑仍走原生 API
const cam = useMaptalksCamera(map);

// 逃生舱：原生 panTo / panBy / setCenter（坐标数组会被 maptalks 自动转为 Coordinate）
function panTo(c: [number, number]) {
  const m = map.value as unknown as { panTo: (c: [number, number]) => void } | null;
  m?.panTo(c);
}
function panBy(dx: number, dy: number) {
  const m = map.value as unknown as { panBy: (p: [number, number], o?: Record<string, unknown>) => void } | null;
  m?.panBy([dx, dy]);
}
function setCenter(c: [number, number]) {
  const m = map.value as unknown as { setCenter: (c: [number, number]) => void } | null;
  m?.setCenter(c);
}
</script>
