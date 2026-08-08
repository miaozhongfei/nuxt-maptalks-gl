<template>
  <div>
    <MaptalksMap
      ref="mc"
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
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const lRef = ref<MaptalksLabelExposed | null>(null)

// exposed geometry 是 Ref——toValue 解包后调 startEditText/endEditText（已建模）
function startEdit() { toValue(lRef.value?.geometry)?.startEditText?.() }
function endEdit() { toValue(lRef.value?.geometry)?.endEditText?.() }

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（可内联编辑文字）' : '加载中…'))
</script>
