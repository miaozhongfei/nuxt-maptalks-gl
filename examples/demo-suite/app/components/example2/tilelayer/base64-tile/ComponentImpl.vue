<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="3"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksTileLayer :options="tileOptions" />
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
// 运行时生成一张 base64 棋盘瓦片（仅客户端；SSR 阶段不会执行到渲染）
function makeTile(): string {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')
  if (!ctx) return ''
  ctx.fillStyle = '#e2e8f0'
  ctx.fillRect(0, 0, 256, 256)
  ctx.fillStyle = '#94a3b8'
  ctx.fillRect(0, 0, 128, 128)
  ctx.fillRect(128, 128, 128, 128)
  return c.toDataURL('image/png')
}
let tileUrl = ''
// urlTemplate 支持函数：每个瓦片请求都返回同一张 base64 图
const tileOptions = {
  urlTemplate: () => {
    if (!tileUrl) tileUrl = makeTile()
    return tileUrl
  },
  attribution: 'base64 棋盘瓦片',
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（base64 棋盘瓦片）' : '加载中…'))
</script>
