<template>
  <div>
    <MaptalksMap :center="[121.5057, 31.2453]" :zoom="13" :pitch="45" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
      <MaptalksOverviewControl ref="ovRef" :options="ovOpts" />
    </MaptalksMap>
    <div class="mt-2 flex items-center gap-2">
      <UButton size="sm" variant="outline" @click="doMaxmize">展开鹰眼</UButton>
      <UButton size="sm" variant="outline" @click="doMinimize">收起鹰眼</UButton>
    </div>
    <p class="text-sm text-muted mt-2">MaptalksMap + MaptalksOverviewControl——鹰眼小地图 + maxmize/minimize 按钮（对应官网 10.13）。</p>
  </div>
</template>

<script setup lang="ts">
// 鹰眼配置：右下角 + 小地图尺寸 + 默认展开
const ovOpts: MaptalksOverviewOptions = { position: 'bottom-right', size: [150, 110], maximize: true }

const ovRef = ref<MaptalksControlExposed | null>(null)

// maxmize/minimize 为 Overview 窄类型特有方法（MaptalksControlExposed 的 control 是基类，需窄化）
function doMaxmize() {
  (ovRef.value?.control as MaptalksOverviewControl | null)?.maxmize?.()
}
function doMinimize() {
  (ovRef.value?.control as MaptalksOverviewControl | null)?.minimize?.()
}
</script>
