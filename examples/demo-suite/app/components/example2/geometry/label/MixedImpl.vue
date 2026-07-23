<template>
  <MaptalksMap
    ref="mapCmp"
    base-layer="osm"
    :center="[121.5057, 31.2453]"
    :zoom="13"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);
// 文字标签 Label
const { geometry } = useMaptalksLabel(layer, {
  content: '文字标签 Label',
  coordinates: [121.5057, 31.2453],
  symbol: { textFill: '#dc2626', textSize: 16 },
});
watch(() => toValue(geometry), (g) => {
  (g as unknown as { config?: (o: Record<string, unknown>) => void } | null)?.config?.({ draggable: true });
}, { immediate: true });
</script>
