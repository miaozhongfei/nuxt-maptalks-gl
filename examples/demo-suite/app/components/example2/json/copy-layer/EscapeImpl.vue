<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <div ref="elA" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <div ref="elB" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
    </div>
    <UButton size="sm" class="mt-3" @click="copyLayer">复制图层 v0 - B</UButton>
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：Layer.fromJSON(v0.toJSON()).addTo(B)——v1（Rectangle）留在 A（对应官网 11.6）。</p>
  </div>
</template>

<script setup lang="ts">
const elA = ref<HTMLElement | null>(null)
const elB = ref<HTMLElement | null>(null)
const { map: mapA } = useMaptalks(elA, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })
const { map: mapB } = useMaptalks(elB, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

let srcLayer: any = null

watch(
  () => toValue(mapA),
  async (m) => {
    if (!m) return
    const mt = await import('maptalks-gl');
    // v0：Marker（官网 11.6 待复制图层）
    const v0 = new mt.VectorLayer('v0');
    new mt.Marker([121.5057, 31.2453], {
      symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 },
    }).addTo(v0);
    v0.addTo(m as never);
    // v1：Rectangle（留在 A 图，不参与复制）
    const v1 = new mt.VectorLayer('v1');
    new mt.Rectangle([121.5057, 31.2453], 1000, 800, { symbol: { polygonFill: '#1bbc9b' } }).addTo(v1);
    v1.addTo(m as never);
    srcLayer = v0;
  },
  { immediate: true },
)

async function copyLayer(): Promise<void> {
  const mb = toValue(mapB);
  if (!mb || !srcLayer) return;
  const mt = await import('maptalks-gl');
  // 幂等：重复复制时先移除 B 上同 id 副本（maptalks 同 id addLayer 会抛 Duplicate）
  mb.getLayer('v0')?.remove();
  // 静态 fromJSON 类型返回 Layer | null（可空），先取副本再挂载
  const copy = mt.Layer.fromJSON(srcLayer.toJSON());
  copy?.addTo(mb as never);
}
</script>
