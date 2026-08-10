<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">组件单独示例 · 控件</h1>
    <p class="text-muted mb-6">
      演示 4 个地图控件组件。控件组件作为 <code>MaptalksMap</code> 的子组件，通过 <code>options</code> 属性配置位置等参数。
    </p>

    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">Zoom · Scale · Compass · Attribution</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.14~10.17</UBadge>
        </div>
      </template>
      <MaptalksMap ref="mc" :center="center" :zoom="11" :pitch="30" class="relative rounded border border-default overflow-hidden" style="height: 384px" baseLayer="osm">
        <!-- 缩放控件（+/-）：position 可切换 -->
        <MaptalksZoomControl :options="{ position: zoomPosition }" />
        <!-- 比例尺控件 -->
        <MaptalksScaleControl :options="{ position: 'bottom-left' }" />
        <!-- 指北针控件（配合 pitch/bearing 显示方向） -->
        <MaptalksCompassControl :options="{ position: 'top-right' }" />
        <!-- 版权信息控件 -->
        <MaptalksAttributionControl :options="{ position: 'bottom-right' }" />
      </MaptalksMap>
      <template #footer>
        <div class="flex items-center gap-3">
          <UButton size="sm" @click="toggleZoomPosition">
            切换缩放控件位置（当前：{{ zoomPosition }}）
          </UButton>
          <span class="text-sm text-muted">地图设了 pitch=30，可用指北针观察方向。</span>
          <span class="text-xs text-muted">{{ status }}</span>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const center: [number, number] = [121.4737, 31.2304]

// 缩放控件位置，点击按钮在左上/右上间切换（options 响应式变化会重建控件）
const zoomPosition = ref<'top-left' | 'top-right'>('top-left')
function toggleZoomPosition() {
  zoomPosition.value = zoomPosition.value === 'top-left' ? 'top-right' : 'top-left'
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（4 控件可用）' : '加载中…'))
</script>
