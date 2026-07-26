<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer name="v">
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#8b5cf6', markerWidth: 20, markerHeight: 20 } }"
        >
          <MaptalksMarkerInfoWindow
            :options="{ title: '组件 InfoWindow', custom: true }"
            :events="{ showstart: () => log('showstart'), showend: () => log('showend'), hide: () => log('hide') }"
          >
            <div class="p-2 min-w-[140px]">
              <p class="mb-1">来自组件 slot</p>
              <UButton size="xs" color="neutral" variant="soft" class="mt-1" @click="closeSelf">关闭</UButton>
            </div>
          </MaptalksMarkerInfoWindow>
        </MaptalksMarker>
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="mt-3 flex items-center gap-2">
      <UButton size="sm" color="primary" variant="soft" @click="miwRef?.show()">手动显示</UButton>
      <UButton size="sm" color="neutral" variant="soft" @click="miwRef?.hide()">手动隐藏</UButton>
    </div>
    <p class="mt-1 text-xs text-muted">或直接点击地图上的 Marker 弹出/关闭</p>
    <div class="mt-2 text-sm text-muted space-y-0.5">
      <div v-for="(e, i) in events" :key="i">{{ e }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const events = ref<string[]>([]);
function log(msg: string) { events.value.unshift(`${msg} ${new Date().toLocaleTimeString()}`); }

const miwRef = ref<{ show: () => void; hide: () => void } | null>(null);
function closeSelf() { miwRef.value?.hide(); }
</script>
