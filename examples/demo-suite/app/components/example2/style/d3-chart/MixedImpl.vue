<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
  </div>
</template>

<script setup lang="ts">
const mc = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mc.value?.map ?? null);

const svgPie = '<svg width="60" height="60">'
  + '<circle r="25" cx="30" cy="30" fill="#2563eb"/>'
  + '<path d="M30,30 L30,5 A25,25 0 0,1 50,18 Z" fill="#dc2626"/>'
  + '</svg>';

useMaptalksUIMarker(map, {
  options: {
    coordinates: [121.5057, 31.2453],
    content: `<div style="text-align:center">${svgPie}<div style="font-size:11px;color:#374151;margin-top:2px">D3 风格饼图</div></div>`,
  },
});
</script>
