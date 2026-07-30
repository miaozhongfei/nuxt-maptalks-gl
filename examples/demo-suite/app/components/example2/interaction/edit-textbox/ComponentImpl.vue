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
        <MaptalksTextBox
          ref="tRef"
          content="可编辑文本框"
          :coordinates="[121.5057, 31.2453]"
          :width="200"
          :height="60"
          :options="{
            editable: true,
            symbol: {
              textFaceName: 'sans-serif',
              textFill: '#1f2937',
              textSize: 16,
              boxFill: '#fef3c7',
              boxOpacity: 0.8,
            },
          }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton
        size="sm"
        variant="outline"
        @click="
          () => {
            tRef?.geometry?.startEdit?.();
          }
        "
        >开始编辑</UButton
      >
      <UButton
        size="sm"
        variant="outline"
        @click="
          () => {
            tRef?.geometry?.endEdit?.();
          }
        "
        >结束编辑</UButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const tRef = ref<MaptalksTextBoxExposed | null>(null)

watch(
  () => tRef.value?.geometry,
  (g) => { if (g) g.startEdit?.() },
  { once: true },
)
</script>
