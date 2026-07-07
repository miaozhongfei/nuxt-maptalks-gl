<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Composable 单独示例 · 状态 · 序列化</h1>
    <p class="text-muted mb-6">
      演示状态类 composable：多地图同步、地图 JSON 序列化、导出为图片、图层显隐/透明度/层级控制。
    </p>

    <!-- Sync：双图同步 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksSync</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 1.13</UBadge>
        </div>
      </template>
      <div class="grid grid-cols-2 gap-3">
        <div ref="elA" class="relative rounded border border-default overflow-hidden" style="height: 288px" />
        <div ref="elB" class="relative rounded border border-default overflow-hidden" style="height: 288px" />
      </div>
      <template #footer>
        <div class="flex gap-2 items-center">
          <UButton size="sm" @click="sync.enable()">启用同步</UButton>
          <UButton size="sm" color="neutral" @click="sync.disable()">停用同步</UButton>
          <span class="text-sm text-muted">拖动/缩放任一张地图，另一张会跟随（mutual 双向）。当前：{{ sync.isEnabled.value ? '已启用' : '已停用' }}</span>
        </div>
      </template>
    </UCard>

    <!-- Serialize + Export + LayerControl：同一张地图上组合演示 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksSerialize + useMaptalksExport + useMaptalksLayerControl</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 11.3 / 1.15 / 6.x</UBadge>
        </div>
      </template>
      <div ref="elC" class="relative rounded border border-default overflow-hidden" style="height: 320px" />
      <template #footer>
        <div class="flex flex-col gap-2">
          <div class="flex gap-2 flex-wrap">
            <UButton size="sm" @click="doExport">导出为 PNG</UButton>
            <UButton size="sm" color="neutral" @click="doSerialize">序列化为 JSON</UButton>
            <span class="text-sm text-muted">{{ jsonMsg }}</span>
          </div>
          <div class="flex gap-2 flex-wrap items-center">
            <span class="text-sm text-muted">矢量图层控制：</span>
            <UButton size="sm" color="neutral" @click="ctrl.toggle()">显隐切换</UButton>
            <UButton size="sm" color="neutral" @click="ctrl.setOpacity(0.4)">透明度 0.4</UButton>
            <UButton size="sm" color="neutral" @click="ctrl.setOpacity(1)">透明度 1</UButton>
            <UButton size="sm" color="neutral" @click="ctrl.bringToFront()">置顶</UButton>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

// —— 卡片 1：双图同步 ——
const elA = ref<HTMLElement | null>(null);
const elB = ref<HTMLElement | null>(null);
const { map: mapA } = useMaptalks(elA, { center, zoom: 11 });
const { map: mapB } = useMaptalks(elB, { center: [121.51, 31.245], zoom: 11 });
useMaptalksTileLayer(mapA, { source: 'osm' });
useMaptalksTileLayer(mapB, { source: 'osm' });
const sync = useMaptalksSync([mapA, mapB], { mode: 'mutual' });
// 注意：useMaptalksSync 在 setup 阶段就会 enable()，但此时 useMaptalks 的两张地图
// 还未异步创建完成（为 null），事件绑定不到真正的地图实例。等两张地图都就绪后，
// disable + enable 重新绑定一次，同步才真正生效。
watch(
  [mapA, mapB],
  ([a, b]) => {
    if (a && b) {
      sync.disable();
      sync.enable();
    }
  },
  { immediate: true },
);

// —— 卡片 2：序列化 + 导出 + 图层控制 ——
const elC = ref<HTMLElement | null>(null);
const { map: mapC } = useMaptalks(elC, { center, zoom: 12 });
useMaptalksTileLayer(mapC, { source: 'osm' });
const { layer: vecLayer } = useMaptalksVectorLayer(mapC);
useMaptalksMarker(vecLayer, {
  coordinates: center,
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 22, markerHeight: 22 },
});

const { toJSON } = useMaptalksSerialize(mapC);
const { download } = useMaptalksExport(mapC);
const ctrl = useMaptalksLayerControl(vecLayer);

const jsonMsg = ref('');
/** 导出当前地图视图为 PNG 并下载 */
function doExport() {
  download('demo-suite-map.png');
}
/** 序列化地图为 JSON，展示大小 */
function doSerialize() {
  const json = toJSON();
  jsonMsg.value = json ? `已序列化，JSON 长度约 ${JSON.stringify(json).length} 字符` : '序列化失败';
}
</script>
