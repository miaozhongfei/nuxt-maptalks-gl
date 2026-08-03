<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="mt-2 flex items-center gap-2">
      <UButton size="sm" variant="outline" @click="exportGeoJSON">导出为 GeoJSON</UButton>
    </div>
    <pre v-if="result" class="text-xs mt-2 p-3 rounded border border-default overflow-auto max-h-48">{{ result }}</pre>
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：Marker 带 properties，toGeoJSON() 导出（对应官网 11.2）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

const result = ref('')
let markerGeo: any = null

watch(
  () => toValue(map),
  (m) => { if (m) void init(m); },
  { immediate: true },
)

/** 地图就绪后：VectorLayer + 带 properties 的 Marker */
async function init(m: unknown): Promise<void> {
  const mt = await import('maptalks-gl');
  const layer = new mt.VectorLayer('v').addTo(m as never);
  markerGeo = new mt.Marker([121.5057, 31.2453], {
    properties: { name: 'point marker' },
    symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 },
  });
  markerGeo.addTo(layer);
}

function exportGeoJSON(): void {
  if (!markerGeo) return;
  result.value = JSON.stringify(markerGeo.toGeoJSON(), null, 2);
}
</script>
