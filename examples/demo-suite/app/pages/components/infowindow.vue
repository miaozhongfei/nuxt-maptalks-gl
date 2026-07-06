<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">组件单独示例 · 信息框</h1>
    <p class="text-muted mb-6">
      演示 <code>MaptalksInfoWindow</code>。它支持通过默认插槽渲染自定义 Vue 内容，
      并可通过 <code>coordinates</code> / <code>visible</code> 响应式控制弹出位置与显隐。
    </p>

    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksInfoWindow（slot 自定义内容）</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.4 / 10.6 / 10.10</UBadge>
        </div>
      </template>
      <MaptalksMap :center="center" :zoom="12" class="relative rounded border border-default overflow-hidden" style="height: 384px" @ready="onReady">
        <MaptalksTileLayer source="osm" />
        <!-- 信息框：点击地图后更新坐标并显示；插槽内是自定义 Vue 内容 -->
        <MaptalksInfoWindow :coordinates="iwCoord" :visible="iwVisible">
          <div style="padding: 8px 12px; min-width: 160px">
            <strong style="color: #2563eb">自定义信息框</strong>
            <p style="margin: 6px 0 0; font-size: 13px">
              经度：{{ iwCoord[0].toFixed(5) }}<br >
              纬度：{{ iwCoord[1].toFixed(5) }}
            </p>
          </div>
        </MaptalksInfoWindow>
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">操作：点击地图任意位置，信息框会在落点弹出并显示坐标。</span>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { MaptalksMap as MtMap } from '@lacqjs/nuxt-maptalks-gl';

const center: [number, number] = [121.4737, 31.2304];
const iwCoord = ref<[number, number]>([121.4737, 31.2304]);
const iwVisible = ref(false);

// 地图就绪后绑定点击事件：点击位置作为信息框坐标并打开
function onReady(map: MtMap) {
  map.on('click', (e: { coordinate: { x: number; y: number } }) => {
    iwCoord.value = [e.coordinate.x, e.coordinate.y];
    iwVisible.value = true;
  });
}
</script>
