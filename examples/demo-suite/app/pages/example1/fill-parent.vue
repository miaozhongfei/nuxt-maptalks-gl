<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">自适应父容器（height:100% + 响应式）</h1>
    <p class="text-muted mb-6">
      演示地图<strong>不写固定高度</strong>、用 <code>height:100%</code> 填满一个有确定高度的父容器。
      父容器大小变化时（拖动右下角，或用下面的滑块/按钮），地图会自动适应——maptalks 内置 ResizeObserver 会自动
      <code>checkSize</code>。
    </p>

    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksMap 填满父容器</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 1.18</UBadge>
        </div>
      </template>

      <div class="flex gap-2 flex-wrap items-center mb-3">
        <span class="text-sm text-muted">父容器高度：</span>
        <UButton size="sm" color="neutral" @click="() => { boxHeight = 300 }">300px</UButton>
        <UButton size="sm" color="neutral" @click="() => { boxHeight = 460 }">460px</UButton>
        <UButton size="sm" color="neutral" @click="() => { boxHeight = 620 }">620px</UButton>
        <span class="text-sm text-muted">当前 {{ boxHeight }}px（也可拖动容器右下角手动缩放）</span>
      </div>

      <!-- 父容器：有确定高度 + 可手动拖拽调整大小（resize: both）。地图填满它。 -->
      <div
        class="rounded border border-default overflow-hidden"
        :style="{ height: boxHeight + 'px', width: '100%', resize: 'both', minHeight: '200px', minWidth: '260px' }"
      >
        <!-- 地图不写固定高度：MaptalksMap 根节点自带 height:100%/width:100%，填满上面的父容器 -->
        <MaptalksMap ref="mc" :center="center" :zoom="11" class="relative w-full h-full" baseLayer="osm">
          <MaptalksZoomControl :options="{ position: 'top-left' }" />
          <MaptalksScaleControl :options="{ position: 'bottom-left' }" />
        </MaptalksMap>
      </div>

      <template #footer>
        <span class="text-sm text-muted">
          关键：<strong>父容器</strong>有确定高度即可，地图用 100% 填充；父容器缩放时地图自动跟随，无需手动处理。
        </span>
        <span class="text-xs text-muted ml-2">{{ status }}</span>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const center: [number, number] = [121.4737, 31.2304]
// 父容器高度（可切换/可拖拽），地图用 height:100% 跟随
const boxHeight = ref(460)

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（跟随父容器缩放）' : '加载中…'))
</script>
