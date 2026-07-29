<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <label class="flex items-center gap-2 mt-3 cursor-pointer select-none">
      <input type="checkbox" v-model="collisionOn" class="w-4 h-4" />
      <span class="text-sm">collision</span>
    </label>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 8 })
useMaptalksTileLayer(map, { source: 'osm' })

const collisionOn = ref(true)

const { layer } = useMaptalksLayer(
  map,
  (mt) => new mt.VectorLayer('collision-layer', { collision: true, collisionDelay: 250, forceRenderOnMoving: true, forceRenderOnZooming: true, forceRenderOnRotating: true }),
)

const randomMarkers = Array.from({ length: 100 }, () => [
  121.49 + Math.random() * 0.03,
  31.22 + Math.random() * 0.05,
] as [number, number])

randomMarkers.forEach((c, i) => {
  useMaptalksGeometry(layer, (mt) => new mt.Marker(
    c,
    { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 28, markerHeight: 28, textName: String(i), textSize: 12, textDy: -26, textFill: '#fff' }, id: String(i) },
  ))
})

watch(collisionOn, (checked) => {
  const l = toValue(layer)!
  l.getGeometries().forEach((m) => { (m as unknown as { options: Record<string, boolean> }).options.collision = checked })
  ;(l as { getRenderer(): { draw(): void } }).getRenderer().draw()
})
</script>
