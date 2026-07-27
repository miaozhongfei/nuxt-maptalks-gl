<template>
  <div>
    <MaptalksMap
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer ref="vec" :visible="visible">
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
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="error" variant="solid" @click="doHide">隐藏</UButton>
      <UButton size="xs" color="success" variant="solid" @click="doShow">显示</UButton>
      <UButton size="xs" color="primary" variant="solid" @click="toggle">切换</UButton>
      <UBadge color="primary" variant="subtle">{{ visible ? '可见' : '隐藏' }}</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
const vec = ref<{ show: () => void; hide: () => void } | null>(null);
const visible = ref(false);

function toggle() {
  visible.value = !visible.value;
  if (visible.value) vec.value?.show();
  else vec.value?.hide();
}
function doHide() {
  visible.value = false;
  vec.value?.hide();
}
function doShow() {
  visible.value = true;
  vec.value?.show();
}
</script>
