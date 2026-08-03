<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="mt-2 flex items-center gap-2">
      <UButton size="sm" variant="outline" @click="exportJson">导出为 JSON</UButton>
    </div>
    <pre v-if="result" class="text-xs mt-2 p-3 rounded border border-default overflow-auto max-h-64">{{ result }}</pre>
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：map.toJSON() 序列化整图（含图层与图形，对应官网 11.3）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

const result = ref('')
let mapIns: any = null

watch(
  () => toValue(map),
  (m) => {
    mapIns = m
    if (m) void init(m)
  },
  { immediate: true },
)

/** 地图就绪后：VectorLayer + Marker（官网原生构造） */
async function init(m: unknown): Promise<void> {
  const mt = await import('maptalks-gl');
  const layer = new mt.VectorLayer('v').addTo(m as never);
  const marker = new mt.Marker([121.5057, 31.2453], {
    symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 },
  });
  marker.addTo(layer);
}

function exportJson(): void {
  if (!mapIns) return;
  result.value = JSON.stringify(mapIns.toJSON(), null, 2);
}
</script>
