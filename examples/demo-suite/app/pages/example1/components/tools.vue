<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">组件单独示例 · 工具</h1>
    <p class="text-muted mb-6">
      演示测量工具组件。工具组件作为 <code>MaptalksMap</code> 的子组件，启用后可在地图上点击测量，
      结果通过 <code>@measure</code> 事件回传。
    </p>

    <!-- 测距工具 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksDistanceTool</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 8.3</UBadge>
        </div>
      </template>
      <MaptalksMap :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height: 320px" baseLayer="osm">
        <!-- 在地图上依次点击测距，双击结束；@measure 返回测量结果 -->
        <MaptalksDistanceTool @measure="onDistance" />
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">操作：地图上依次单击画线、双击结束。{{ distanceMsg }}</span>
      </template>
    </UCard>

    <!-- 测面工具 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksAreaTool</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 8.4</UBadge>
        </div>
      </template>
      <MaptalksMap :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height: 320px" baseLayer="osm">
        <!-- 在地图上依次点击画多边形测面积，双击结束 -->
        <MaptalksAreaTool @measure="onArea" />
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">操作：地图上依次单击画多边形、双击结束。{{ areaMsg }}</span>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];
const distanceMsg = ref('');
const areaMsg = ref('');

// 测距完成回调（结果结构由 maptalks 提供，这里仅提示已测量）
function onDistance() {
  distanceMsg.value = '（已完成一次测距）';
}
// 测面完成回调
function onArea() {
  areaMsg.value = '（已完成一次测面）';
}
</script>
