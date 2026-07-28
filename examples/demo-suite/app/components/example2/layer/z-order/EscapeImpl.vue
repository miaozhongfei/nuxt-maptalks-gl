<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" @click="() => sort321()">排序 3,2,1（3 在顶层）</UButton>
      <UButton size="xs" @click="() => sort123()">排序 1,2,3（1 在顶层）</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

let m: any = null

function sort321() { m?.sortLayers?.(['1', '2', '3']) }
function sort123() { m?.sortLayers?.(['3', '2', '1']) }

watch(
  () => toValue(map),
  async (mv) => {
    if (!mv) return
    m = mv
    const mt = await import('maptalks-gl')
    const rect3 = new mt.Rectangle(
      [121.4807, 31.2418], 1600, 1000,
      {
        symbol: [
          { lineColor: '#34495e', lineWidth: 3, polygonFill: '#1bbc9b', polygonOpacity: 1 },
          { textName: 'Layer 3', textWeight: 'bold', textSize: 30, textFill: '#fff' },
        ],
      },
    )
    const rect2 = rect3.copy().translate([0.006, 0.006]).updateSymbol([
      { polygonFill: 'rgb(216,115,149)' },
      { textName: 'Layer 2' },
    ])
    const rect1 = rect2.copy().translate([0.006, 0.006]).updateSymbol([
      { polygonFill: 'rgb(135,196,240)' },
      { textName: 'Layer 1' },
    ])
    m.addLayer([
      new mt.VectorLayer('3', [rect3]),
      new mt.VectorLayer('2', [rect2]),
      new mt.VectorLayer('1', [rect1]),
    ])
  },
)

onBeforeUnmount(() => { m = null })
</script>
