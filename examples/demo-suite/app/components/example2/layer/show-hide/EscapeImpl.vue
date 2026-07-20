<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButtonGroup size="xs">
        <UButton color="red" @click="ctl.hide()">隐藏</UButton>
        <UButton color="green" @click="ctl.show()">显示</UButton>
        <UButton color="primary" @click="ctl.toggle()">切换</UButton>
      </UButtonGroup>
      <UBadge color="primary" variant="subtle">{{ visible ? '可见' : '隐藏' }}</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
});

const visible = ref(true);
const ctl = useMaptalksLayerControl(layer, { visible });
</script>
