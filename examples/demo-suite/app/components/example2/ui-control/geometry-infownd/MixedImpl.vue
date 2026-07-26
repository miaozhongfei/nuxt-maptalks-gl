<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="mt-3 flex items-center gap-2">
      <UButton size="sm" color="primary" variant="soft" @click="showIW">手动显示</UButton>
      <UButton size="sm" color="neutral" variant="soft" @click="hideIW">手动隐藏</UButton>
    </div>
    <p class="mt-1 text-xs text-muted">或直接点击地图上的 Marker 弹出/关闭</p>
    <div class="mt-2 text-sm text-muted space-y-0.5">
      <div v-for="(e, i) in events" :key="i">{{ e }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const mc = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mc.value?.map ?? null);

const events = ref<string[]>([]);
function log(msg: string) { events.value.unshift(`${msg} ${new Date().toLocaleTimeString()}`); }

const vLayer = useMaptalksVectorLayer(map);
const { geometry } = useMaptalksMarker(vLayer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#ef4444', markerWidth: 20, markerHeight: 20 } },
});
const { show, hide } = useMaptalksMarkerInfoWindow(geometry, {
  options: { title: '桥接 InfoWindow', custom: true, content: '<div class=p-2>来自桥接模式</div>' },
  events: { showstart: () => log('showstart'), showend: () => log('showend'), hide: () => log('hide') },
});

function showIW() { show(); }
function hideIW() { hide(); }
</script>
