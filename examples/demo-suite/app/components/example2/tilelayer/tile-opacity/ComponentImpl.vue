<template>
  <div>
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 w-72">
      <span class="text-sm w-28 shrink-0">透明度 {{ op.toFixed(2) }}</span>
      <USlider v-model="op" :min="0" :max="1" :step="0.05" />
    </div>
    <p class="text-sm text-muted mt-2">深色页面背景可衬出半透明效果</p>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksTileLayer(map, { source: 'osm' });
const op = ref(1);
watch(op, (v) => {
  (toValue(layer) as unknown as { setOpacity?: (n: number) => void } | null)?.setOpacity?.(v);
});
</script>
