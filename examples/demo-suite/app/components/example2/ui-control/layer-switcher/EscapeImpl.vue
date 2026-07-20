<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" :variant="showA ? 'solid' : 'outline'" @click="switchLayer('a')">OSM 图层</UButton>
      <UButton size="sm" :variant="showB ? 'solid' : 'outline'" @click="switchLayer('b')">天地图图层</UButton>
    </div>
    <p class="text-sm text-muted mt-2">按钮切换图层显隐实现图层选择器效果（对应官网 10.19）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
const showA = ref(true)
const showB = ref(true)
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  const lA = new mt.TileLayer('base', { urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c'] }).addTo(m)
  const lB = new mt.TileLayer('tdt', { urlTemplate: 'https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=56b06c0a8c92743da8aa9fb6f0e8db39', subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }).addTo(m)
  layerA = lA; layerB = lB
  switchLayerNow()
})
let layerA: any = null
let layerB: any = null
function switchLayer(target: string) {
  if (target === 'a') showA.value = !showA.value
  else showB.value = !showB.value
  switchLayerNow()
}
function switchLayerNow() {
  if (layerA) { if (showA.value) layerA.show(); else layerA.hide() }
  if (layerB) { if (showB.value) layerB.show(); else layerB.hide() }
}
</script>
