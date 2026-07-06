<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Composable 单独示例 · 绘制 · 测量</h1>
    <p class="text-muted mb-6">
      演示测量工具 composable：测距与测面。它们接收 <code>map</code> 与 <code>events</code>，创建工具并自动纳管，
      <code>events</code> 里的回调会在测量事件时触发。
    </p>

    <!-- 测距 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksDistanceTool</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 8.3</UBadge>
        </div>
      </template>
      <div ref="elDist" class="relative h-80 rounded border border-default overflow-hidden" />
      <template #footer>
        <span class="text-sm text-muted">操作：地图上依次单击画线、双击结束。{{ distMsg }}</span>
      </template>
    </UCard>

    <!-- 测面 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksAreaTool</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 8.4</UBadge>
        </div>
      </template>
      <div ref="elArea" class="relative h-80 rounded border border-default overflow-hidden" />
      <template #footer>
        <span class="text-sm text-muted">操作：地图上依次单击画多边形、双击结束。{{ areaMsg }}</span>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

const elDist = ref<HTMLElement | null>(null);
const { map: distMap } = useMaptalks(elDist, { center, zoom: 13 });
useMaptalksTileLayer(distMap, { source: 'osm' });
const distMsg = ref('');
useMaptalksDistanceTool(distMap, {
  events: { drawend: () => { distMsg.value = '（已完成一次测距）'; } },
});

const elArea = ref<HTMLElement | null>(null);
const { map: areaMap } = useMaptalks(elArea, { center, zoom: 13 });
useMaptalksTileLayer(areaMap, { source: 'osm' });
const areaMsg = ref('');
useMaptalksAreaTool(areaMap, {
  events: { drawend: () => { areaMsg.value = '（已完成一次测面）'; } },
});
</script>
