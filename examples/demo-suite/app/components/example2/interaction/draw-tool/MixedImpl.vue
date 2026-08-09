<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton
        v-for="m in modes" :key="m" size="xs"
        :variant="mode === m ? 'solid' : 'outline'"
        @click="switchMode(m)"
      >{{ m }}</UButton>
      <UDivider orientation="vertical" />
      <UButton size="xs" variant="outline" @click="disable">禁用</UButton>
      <UButton size="xs" variant="outline" @click="enable">启用</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 组合：组件创建地图，computed 桥接 map 供 composable 使用
const modes = ['Point', 'LineString', 'Polygon', 'Circle', 'Rectangle'] as const
const { mode, enable, disable, setMode } = useMaptalksDrawTool(map, { mode: 'Point' })

function switchMode(m: string) {
  setMode(m)
  enable()
}

const status = computed(() => (map.value ? '地图已创建（选择模式绘制图形）' : '加载中…'))
</script>
