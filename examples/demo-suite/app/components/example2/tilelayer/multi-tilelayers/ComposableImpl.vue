<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const baseOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
}

const labelOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
}

const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
// 第一层：底图
useMaptalksTileLayer(map, { options: baseOptions })
// 第二层：标注层，叠加在底图之上
useMaptalksTileLayer(map, { id: 'labels', options: labelOptions })

const status = computed(() => (isReady.value ? '地图已创建（底图 + 标注层）' : '加载中…'))
</script>
