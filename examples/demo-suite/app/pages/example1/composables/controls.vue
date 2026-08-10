<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Composable 单独示例 · 控件</h1>
    <p class="text-muted mb-6">
      演示 4 个控件 composable。它们都接收 <code>map</code> 与响应式 <code>options</code>，向地图添加对应控件并自动纳管生命周期。
    </p>

    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksZoom + useMaptalksScale + useMaptalksCompass + useMaptalksAttribution</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.14~10.17</UBadge>
        </div>
      </template>
      <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 384px" />
      <template #footer>
        <span class="text-sm text-muted">同一张地图上加了 4 个控件：缩放（左上）/ 比例尺（左下）/ 指北针（右上）/ 版权（右下）。地图设了 pitch=30。</span>
        <span class="text-xs text-muted ml-2">{{ status }}</span>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 11, pitch: 30 })
useMaptalksTileLayer(map, { source: 'osm' })

// 4 个控件 composable，各自指定位置
useMaptalksZoom(map, { options: { position: 'top-left' } })
useMaptalksScale(map, { options: { position: 'bottom-left' } })
useMaptalksCompass(map, { options: { position: 'top-right' } })
useMaptalksAttribution(map, { options: { position: 'bottom-right' } })

const status = computed(() => (isReady.value ? '地图已创建（4 控件可用）' : '加载中…'))
</script>
