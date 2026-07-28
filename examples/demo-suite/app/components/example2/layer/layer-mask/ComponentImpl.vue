<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer ref="vlRef" id="vector">
        <MaptalksMarker
          v-for="(p, i) in randomPts"
          :key="i"
          :coordinates="p"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 12, markerHeight: 12 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const vlRef = ref<any>(null)
let maskMarker: any = null

const randomPts = Array.from({ length: 100 }, () => [
  121.4757 + Math.random() * 0.06,
  31.2153 + Math.random() * 0.06,
] as [number, number])

onMounted(async () => {
  watch(
    () => mc.value?.map,
    (mv) => {
      if (!mv) return
      const m = mv as any
      if (m._maskBound) return
      m._maskBound = true
      m.on('mousemove', async (e: any) => {
        if (!maskMarker) {
          const mt = await import('maptalks-gl')
          maskMarker = new mt.Marker(e.coordinate, {
            symbol: { markerType: 'ellipse', markerWidth: 200, markerHeight: 200 },
          })
          ;(vlRef.value?.layer as any)?.setMask?.(maskMarker)
        } else {
          maskMarker.setCoordinates(e.coordinate)
        }
      })
    },
    { immediate: true },
  )
})

onBeforeUnmount(() => { maskMarker = null })
</script>
