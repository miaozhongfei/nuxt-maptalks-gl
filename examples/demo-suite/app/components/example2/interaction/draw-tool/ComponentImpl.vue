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
      <MaptalksDrawTool ref="dt" />
    </MaptalksMap>
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton
        v-for="m in modes" :key="m" size="xs"
        :variant="dt?.mode === m ? 'solid' : 'outline'"
        @click="switchMode(m)"
      >{{ m }}</UButton>
      <UDivider orientation="vertical" />
      <UButton size="xs" variant="outline" @click="dt?.disable()">禁用</UButton>
      <UButton size="xs" variant="outline" @click="dt?.enable()">启用</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const dt = ref<MaptalksDrawToolExposed | null>(null)
const modes = ['Point', 'LineString', 'Polygon', 'Circle', 'Rectangle'] as const

function switchMode(m: string) {
  dt.value?.setMode(m)
  dt.value?.enable()
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（选择模式绘制图形）' : '加载中…'))
</script>
