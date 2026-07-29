<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="8"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer
        ref="vlRef"
        :options="{ collision: true, collisionDelay: 250, forceRenderOnMoving: true, forceRenderOnZooming: true, forceRenderOnRotating: true }"
      >
        <MaptalksMarker
          v-for="(m, i) in randomMarkers"
          :key="i"
          :coordinates="m"
          :id="String(i)"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 28, markerHeight: 28, textName: String(i), textSize: 12, textDy: -26, textFill: '#fff' } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <label class="flex items-center gap-2 mt-3 cursor-pointer select-none">
      <input type="checkbox" v-model="collisionOn" class="w-4 h-4" />
      <span class="text-sm">collision</span>
    </label>
  </div>
</template>

<script setup lang="ts">
const vlRef = ref<MaptalksVectorLayerExposed | null>(null)
const collisionOn = ref(true)

watch(collisionOn, (checked) => {
  const l = vlRef.value?.layer as any
  l?.getGeometries?.()?.forEach((m: any) => { m.options.collision = checked })
  l?.getRenderer?.()?.draw?.()
})

const randomMarkers = Array.from({ length: 100 }, () => [
  121.49 + Math.random() * 0.03,
  31.22 + Math.random() * 0.05,
] as [number, number])
</script>
