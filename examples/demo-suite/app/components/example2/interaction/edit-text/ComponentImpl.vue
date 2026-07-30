<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <MaptalksLabel
          ref="lRef"
          content="label with box"
          :coordinates="[121.5057, 31.2453]"
          :options="{
            textSymbol: { textFaceName: 'sans-serif', textFill: '#fff', textSize: 18 },
            boxStyle: { padding: [12, 8], symbol: { markerType: 'square', markerFill: '#34495e', markerFillOpacity: 0.9, markerLineColor: '#34495e', markerLineWidth: 1 } },
          }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="startEdit">开始编辑</UButton>
      <UButton size="sm" variant="outline" @click="endEdit">结束编辑</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const lRef = ref<MaptalksLabelExposed | null>(null)

function startEdit() { (lRef.value?.geometry as any)?.startEditText?.() }
function endEdit() { (lRef.value?.geometry as any)?.endEditText?.() }
</script>
