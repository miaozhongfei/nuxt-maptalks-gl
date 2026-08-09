<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <MaptalksMap
        ref="mcA"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 380px"
      >
        <MaptalksVectorLayer ref="v0Ref" id="v0">
          <MaptalksMarker :coordinates="[121.5057, 31.2453]" :options="mkOpts" />
        </MaptalksVectorLayer>
        <MaptalksVectorLayer id="v1">
          <MaptalksRectangle :coordinates="[121.5057, 31.2453]" :width="1000" :height="800" :options="rectOpts" />
        </MaptalksVectorLayer>
      </MaptalksMap>
      <MaptalksMap
        ref="mcB"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 380px"
      />
    </div>
    <UButton size="sm" class="mt-3" @click="copyLayer">复制图层 v0 - B</UButton>
    <p class="text-sm text-muted mt-2">A 图 v0（Marker）经 Layer.fromJSON 复制到 B 图——v1（Rectangle）留在 A（对应官网 11.6）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// 官网 11.6：A 图 v0(Marker) + v1(Rectangle)，v0 的 JSON 复制到仅底图的 B 图
const mkOpts: MaptalksMarkerOptions = {
  symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 },
}
const rectOpts: MaptalksRectangleOptions = {
  symbol: { polygonFill: '#1bbc9b' },
}

// MaptalksMap ref 桥接 + 声明式 VectorLayer ref 取 v0 图层
const mcA = ref<MaptalksMapExposed | null>(null)
const mcB = ref<MaptalksMapExposed | null>(null)
const v0Ref = ref<MaptalksVectorLayerExposed | null>(null)
const mapB = computed(() => toValue(mcB.value?.map) ?? null)
const v0Layer = computed(() => toValue(v0Ref.value?.layer) ?? null)
const { toJSON, fromJSON } = useMaptalksLayerSerialize(v0Layer)
async function copyLayer() {
  const mb = toValue(mapB)
  if (!mb) return
  const copy = await fromJSON(toJSON())
  if (!copy) return
  // 幂等：重复复制时先移除 B 上同 id 副本（maptalks 同 id addLayer 会抛 Duplicate）
  mb.getLayer('v0')?.remove()
  copy.addTo(mb)
}

const status = computed(() => (mapB.value && v0Layer.value ? 'A/B 地图已创建（可复制图层）' : '加载中…'))
</script>
