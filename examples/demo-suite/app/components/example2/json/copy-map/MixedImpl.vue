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
        <MaptalksVectorLayer id="v">
          <MaptalksMarker :coordinates="[121.5057, 31.2453]" :options="mkOpts" />
        </MaptalksVectorLayer>
      </MaptalksMap>
      <MaptalksMap
        ref="mcB"
        :center="[121.5057, 31.2453]"
        :zoom="10"
        class="relative rounded border border-default overflow-hidden"
        style="height: 380px"
      />
    </div>
    <UButton size="sm" class="mt-3" @click="copyMap">复制地图 A - B</UButton>
    <p class="text-sm text-muted mt-2">A（底图 + Marker）toJSON 后复制到 B——B 为空图，复制后对齐 A（对应官网 11.5）。</p>
  </div>
</template>

<script setup lang="ts">
// 官网 11.5：A 含底图 + VectorLayer('v') + Marker，toJSON 后静态复制到空容器 B
const mkOpts: MaptalksMarkerOptions = {
  symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 },
}

// MaptalksMap ref 桥接：从组件实例取 map，再经 useMaptalksSerialize 复制
const mcA = ref<MaptalksMapExposed | null>(null)
const mcB = ref<MaptalksMapExposed | null>(null)
const mapA = computed(() => toValue(mcA.value?.map) ?? null)
const mapB = computed(() => toValue(mcB.value?.map) ?? null)
const { toJSON: toA } = useMaptalksSerialize(mapA)
const { fromJSON: fromB } = useMaptalksSerialize(mapB)
function copyMap() {
  const json = toA()
  fromB(json)
}
</script>
