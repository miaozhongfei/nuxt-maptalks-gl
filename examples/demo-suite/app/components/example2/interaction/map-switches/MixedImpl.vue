<template>
  <div>
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-4 mt-3 flex-wrap">
      <div class="flex items-center gap-2">
        <USwitch id="m-drag" v-model="draggable" @update:model-value="onDragChange" />
        <label for="m-drag" class="text-sm">拖拽</label>
      </div>
      <div class="flex items-center gap-2">
        <USwitch id="m-zoom" v-model="zoomable" @update:model-value="onZoomChange" />
        <label for="m-zoom" class="text-sm">缩放</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);

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
