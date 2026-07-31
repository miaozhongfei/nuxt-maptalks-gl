<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer id="v">
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#8b5cf6', markerWidth: 20, markerHeight: 20 } }"
        >
          <MaptalksGeometryInfoWindow
            ref="miwRef"
            :options="{ title: '组件 InfoWindow', custom: true }"
          >
            <div class="p-2 min-w-[140px]">
              <p class="mb-1">来自组件 slot</p>
              <UButton size="xs" color="neutral" variant="soft" class="mt-1" @click="miwRef?.hide()">关闭</UButton>
            </div>
          </MaptalksGeometryInfoWindow>
        </MaptalksMarker>
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="mt-3 flex items-center gap-2">
      <UButton size="sm" color="primary" variant="soft" @click="miwRef?.show()">手动显示</UButton>
      <UButton size="sm" color="neutral" variant="soft" @click="miwRef?.hide()">手动隐藏</UButton>
    </div>
    <p class="mt-1 text-xs text-muted">或直接点击地图上的 Marker 弹出/关闭</p>
  </div>
</template>

<script setup lang="ts">
const miwRef = ref<{ show: () => void; hide: () => void } | null>(null);
</script>
