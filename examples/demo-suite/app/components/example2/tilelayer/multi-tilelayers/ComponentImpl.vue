<template>
  <div>
    <!-- 组件单独：同一地图内声明两个瓦片图层组件——底图 + 独立标注层 -->
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksTileLayer :options="baseOptions" />
      <MaptalksTileLayer id="labels" :options="labelOptions" />
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
// 底图：carto 亮色
const baseOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
}

// 叠加标注层：carto 纯地名标注（透明底）
const labelOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（底图 + 标注层）' : '加载中…'))
</script>
