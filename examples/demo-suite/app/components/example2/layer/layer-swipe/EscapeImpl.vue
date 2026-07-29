<template>
  <div>
    <div class="grid grid-cols-2 gap-2">
      <div ref="elA" class="relative rounded border border-default overflow-hidden" style="height: 400px" />
      <div ref="elB" class="relative rounded border border-default overflow-hidden" style="height: 400px" />
    </div>
  </div>
</template>

<script setup lang="ts">
const elA = ref<HTMLElement | null>(null)
const elB = ref<HTMLElement | null>(null)

// 逃生舱：完全原生创建 Map + TileLayer 并手动同步，不使用任何 useMaptalks* composable
watch(
  () => [elA.value, elB.value],
  async ([ea, eb]) => {
    if (!ea || !eb) return
    const mt = await import('maptalks-gl')
    const center = [121.5057, 31.2453] as [number, number]
    const mapA = new mt.Map(ea, { center, zoom: 13, baseLayer: new mt.TileLayer('base1', { urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c', 'd'] }) })
    const mapB = new mt.Map(eb, { center, zoom: 13, baseLayer: new mt.TileLayer('base2', { urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', subdomains: ['b', 'c', 'd'] }) })
    const syncView = (src: any, dst: any) => { if (!dst.isZooming?.() && !dst.isMoving?.()) dst.setView(src.getView()) }
    mapA.on('zooming moving pitch', () => syncView(mapA, mapB))
    mapB.on('zooming moving pitch', () => syncView(mapB, mapA))
  },
  { once: true },
)
</script>
