<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" :pitch="45" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
      <MaptalksOverviewControl ref="ovRef" :options="ovOpts" />
    </MaptalksMap>
    <div class="mt-2 flex items-center gap-2">
      <UButton size="sm" variant="outline" @click="doMaxmize">展开鹰眼</UButton>
      <UButton size="sm" variant="outline" @click="doMinimize">收起鹰眼</UButton>
    </div>
    <p class="text-sm text-muted mt-2">MaptalksMap + MaptalksOverviewControl——鹰眼小地图 + maxmize/minimize 按钮（对应官网 10.13）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

// 鹰眼配置：右下角 + 小地图尺寸 + 默认展开
const ovOpts: MaptalksOverviewOptions = { position: 'bottom-right', size: [150, 110], maximize: true }

// Overview 窄类型 Exposed：control 为 MaptalksOverviewControl，maxmize/minimize 直接可调
const ovRef = ref<MaptalksOverviewControlExposed | null>(null)

function doMaxmize() {
  ovRef.value?.control?.maxmize?.()
}
function doMinimize() {
  ovRef.value?.control?.minimize?.()
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（鹰眼可用）' : '加载中…'))
</script>
