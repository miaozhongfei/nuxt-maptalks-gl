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
      <MaptalksVectorLayer ref="vec" :options="layerOpts">
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :options="{
            symbol: {
              markerType: 'ellipse',
              markerFill: '#2563eb',
              markerWidth: 18,
              markerHeight: 18,
            },
          }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-2 mt-3 w-72">
      <span class="text-sm w-28 shrink-0">透明度 {{ op.toFixed(2) }}</span>
      <USlider v-model="op" :min="0" :max="1" :step="0.05" />
    </div>
    <UButton
      size="xs"
      color="primary"
      variant="soft"
      class="mt-2"
      @click="() => { vec?.layer?.setOpacity?.(0.5) }"
      >设置透明度 0.5（defineExpose 直调）</UButton
    >
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const vec = ref<MaptalksVectorLayerExposed | null>(null)
const op = ref(1)
const layerOpts = computed(() => ({ opacity: op.value }))

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（可调透明度）' : '加载中…'))
</script>
