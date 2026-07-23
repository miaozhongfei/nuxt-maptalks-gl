<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
// 文字标签 Label
const { geometry } = useMaptalksLabel(layer, {
  content: '文字标签 Label',
  coordinates: [121.5057, 31.2453],
  symbol: { textFill: '#dc2626', textSize: 16 },
});
// 预设不支持 draggable 作为顶层 options——几何创建后通过 config 补设
watch(() => toValue(geometry), (g) => {
  (g as unknown as { config?: (o: Record<string, unknown>) => void } | null)?.config?.({ draggable: true });
}, { immediate: true });
</script>
