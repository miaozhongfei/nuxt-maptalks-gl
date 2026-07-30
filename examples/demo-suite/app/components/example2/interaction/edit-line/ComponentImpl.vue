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
        <MaptalksLineString
          ref="lRef"
          :coordinates="[
            [121.49, 31.23],
            [121.5057, 31.26],
            [121.52, 31.23],
          ]"
          :options="{ editable: true, symbol: { lineColor: '#dc2626', lineWidth: 4 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton
        size="sm"
        variant="outline"
        @click="
          () => {
            lRef?.geometry?.startEdit?.();
          }
        "
        >开始编辑</UButton
      >
      <UButton
        size="sm"
        variant="outline"
        @click="
          () => {
            lRef?.geometry?.endEdit?.();
          }
        "
        >结束编辑</UButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const lRef = ref<MaptalksLineStringExposed | null>(null);
</script>
