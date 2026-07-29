<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="8"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <label class="flex items-center gap-2 mt-3 cursor-pointer select-none">
      <input type="checkbox" v-model="collisionOn" class="w-4 h-4" />
      <span class="text-sm">collision</span>
    </label>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => mc.value?.map ?? null)

const collisionOn = ref(true)

const { layer } = useMaptalksVectorLayer(map, {
  options: { collision: true, collisionDelay: 250, forceRenderOnMoving: true, forceRenderOnZooming: true, forceRenderOnRotating: true },
})

const randomMarkers = Array.from({ length: 100 }, () => [
  121.49 + Math.random() * 0.03,
  31.22 + Math.random() * 0.05,
] as [number, number])

randomMarkers.forEach((c, i) => {
  useMaptalksMarker(layer, {
    coordinates: c,
    id: String(i),
    options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 28, markerHeight: 28, textName: String(i), textSize: 12, textDy: -26, textFill: '#fff' } },
  })
})

watch(collisionOn, (checked) => {
  const l = toValue(layer)!
  l.getGeometries().forEach((m) => { (m as unknown as { options: Record<string, boolean> }).options.collision = checked })
  ;(l as unknown as { getRenderer(): { draw(): void } }).getRenderer().draw()
})
</script>
