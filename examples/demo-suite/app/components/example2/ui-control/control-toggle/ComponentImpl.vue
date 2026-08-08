<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
      <MaptalksZoomControl v-if="zoomMounted" ref="zoomRef" :options="zOpts" />
      <MaptalksToolbarControl :options="tbOpts" />
    </MaptalksMap>
    <p class="text-sm text-muted mt-2">MaptalksMap + MaptalksZoomControl/MaptalksToolbarControl——Show/Hide/Remove 三操作（Remove 后 Show 经 v-if 重建复活）（对应官网 10.18）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

// Zoom 控件：左上 + 级别文字
const zOpts: MaptalksZoomOptions = { position: 'top-left', zoomLevel: true }

// 挂载状态：Remove 后置 false，Show 重建复活（对齐官网 show 的 addControl 语义）
const zoomMounted = ref(true)
const zoomRef = ref<MaptalksZoomControlExposed | null>(null)

function doShow() {
  // 已挂载 → show() 恢复；已 Remove → 重新挂载复活
  if (zoomMounted.value) zoomRef.value?.show?.()
  else zoomMounted.value = true
}
function doHide() {
  zoomRef.value?.hide?.()
}
function doRemove() {
  zoomRef.value?.remove?.()
  zoomMounted.value = false
}

// Toolbar 三按钮（Show/Hide/Remove）操作 Zoom 控件
const tbOpts: MaptalksToolbarOptions = {
  position: 'top-right',
  items: [
    { item: 'Show', click: () => { doShow() } },
    { item: 'Hide', click: () => { doHide() } },
    { item: 'Remove', click: () => { doRemove() } },
  ],
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（控件切换可用）' : '加载中…'))
</script>
