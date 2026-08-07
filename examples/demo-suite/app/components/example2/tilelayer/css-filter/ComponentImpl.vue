<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksTileLayer :options="tileOptions" />
    </MaptalksMap>
    <div class="flex items-center gap-3 mt-3">
      <UButton size="sm" @click="applyFilter('sepia(90%) invert(90%)')">暗色反转</UButton>
      <UButton size="sm" @click="applyFilter('grayscale(100%)')">灰度</UButton>
      <UButton size="sm" @click="applyFilter('none')">无滤镜</UButton>
    </div>
    <p class="text-sm mt-2 text-muted">
      当前滤镜：{{ current }}
    </p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
// cssFilter 响应式：按钮切换时经组件 options 联动图层 config 热更新
const tileOptions = ref({
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  cssFilter: 'sepia(90%) invert(90%)',
})
const current = ref('暗色反转')

function applyFilter(v: string) {
  tileOptions.value.cssFilter = v
  current.value = v === 'none' ? '无' : v
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（cssFilter 滤镜）' : '加载中…'))
</script>
