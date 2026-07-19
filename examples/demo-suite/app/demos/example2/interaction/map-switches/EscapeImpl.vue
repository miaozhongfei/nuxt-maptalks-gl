<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-4 mt-3 flex-wrap">
      <div class="flex items-center gap-2">
        <USwitch id="e-drag" v-model="draggable" @update:model-value="onDragChange" />
        <label for="e-drag" class="text-sm">拖拽</label>
      </div>
      <div class="flex items-center gap-2">
        <USwitch id="e-zoom" v-model="zoomable" @update:model-value="onZoomChange" />
        <label for="e-zoom" class="text-sm">缩放</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksLayer(map, (mt) =>
  new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
  }),
);

const draggable = ref(true);
const zoomable = ref(true);

function onDragChange(v: boolean) {
  const m = toValue(map);
  if (!m) return;
  (m as unknown as { config: (o: Record<string, unknown>) => void }).config({ draggable: v });
}

function onZoomChange(v: boolean) {
  const m = toValue(map);
  if (!m) return;
  (m as unknown as { config: (o: Record<string, unknown>) => void }).config({ zoomable: v });
}
</script>
