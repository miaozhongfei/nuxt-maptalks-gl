<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="8"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer
        ref="vlRef"
        :options="{
          collision: true,
          collisionDelay: 250,
          forceRenderOnMoving: true,
          forceRenderOnZooming: true,
          forceRenderOnRotating: true,
        }"
      >
        <MaptalksMarker
          v-for="(m, i) in randomMarkers"
          :key="i"
          :coordinates="m"
          :id="String(i)"
          :options="{
            symbol: {
              markerType: 'ellipse',
              markerFill: '#2563eb',
              markerWidth: 28,
              markerHeight: 28,
              textName: String(i),
              textSize: 12,
              textDy: -26,
              textFill: '#2563eb',
            },
          }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <label class="flex items-center gap-2 mt-3 cursor-pointer select-none">
      <input type="checkbox" v-model="collisionOn" class="w-4 h-4" />
      <span class="text-sm">collision</span>
    </label>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const vlRef = ref<MaptalksVectorLayerExposed | null>(null)
const collisionOn = ref(true)

watch(collisionOn, (checked) => {
  // exposed layer 是 Ref——toValue 解包；切换时逐图形 config 并强制重绘
  const l = toValue(vlRef.value?.layer)
  if (!l) return
  l.getGeometries().forEach((m) => {
    m.config({
      collision: checked,
    })
  })
  // getRenderer 已建模返回 unknown——renderer 的 draw 强制重绘逃生舱断言（内部结构未建模）
  ;(l.getRenderer() as { draw(): void }).draw()
})

const randomMarkers = Array.from(
  { length: 100 },
  () => [121.49 + Math.random() * 0.03, 31.22 + Math.random() * 0.05] as [number, number],
)

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（可切换碰撞避让）' : '加载中…'))
</script>
