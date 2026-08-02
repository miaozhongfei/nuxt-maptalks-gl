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
        <div class="flex flex-col gap-2">
          <div class="flex gap-2 items-center flex-wrap">
            <span class="text-sm text-muted">同步模式：</span>
            <UButton size="sm" :variant="syncMode === 'mutual' ? 'solid' : 'soft'" @click="() => { syncMode = 'mutual' }">
              双向 mutual
            </UButton>
            <UButton size="sm" :variant="syncMode === 'master-slave' ? 'solid' : 'soft'" @click="() => { syncMode = 'master-slave' }">
              主从 master-slave
            </UButton>
          </div>
          <div class="flex gap-2 items-center flex-wrap">
            <UButton size="sm" color="neutral" @click="enableSync">启用同步</UButton>
            <UButton size="sm" color="neutral" @click="disableSync">停用同步</UButton>
            <UButton size="sm" :color="slaveLocked ? 'error' : 'neutral'" variant="soft" @click="toggleSlaveLock">
              {{ slaveLocked ? '解锁从图交互' : '禁用从图交互' }}
            </UButton>
          </div>
          <span class="text-sm text-muted">
            {{ syncMode === 'mutual' ? '双向：拖动/缩放任一张地图，另一张跟随。' : '主从：仅左图（sync-master）驱动右图，右图变化不影响左图。' }}
            实时同步（moving/zooming 每帧 + setView 原子写入）。
            {{ slaveLocked ? '从图交互已禁用。' : '' }}
          </span>
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
// 左图命名 'sync-master'，master-slave 模式用它当主图（用注册表名传 master，异步就绪后自动解析）
const { map: mapA } = useMaptalks(elA, { center, zoom: 11, name: 'sync-master' });
const { map: mapB } = useMaptalks(elB, { center: [121.51, 31.245], zoom: 11 });
useMaptalksTileLayer(mapA, { source: 'osm' });
useMaptalksTileLayer(mapB, { source: 'osm' });

// 同步模式可切换：mutual（双向）/ master-slave（仅左图驱动右图）。
// composable 的 mode 在创建时固定，故用 effectScope 承载，切换模式时销毁旧实例重建。
const syncMode = ref<'mutual' | 'master-slave'>('mutual');
let syncScope: ReturnType<typeof effectScope> | null = null;
const currentSync = shallowRef<ReturnType<typeof useMaptalksSync> | null>(null);
/** 按当前模式（重新）创建同步实例 */
function setupSync() {
  syncScope?.stop();
  syncScope = effectScope();
  syncScope.run(() => {
    currentSync.value = useMaptalksSync([mapA, mapB], { mode: syncMode.value, master: 'sync-master' });
  });
}
watch(syncMode, setupSync);
setupSync();
onScopeDispose(() => syncScope?.stop());
/** 启用同步 */
function enableSync() {
  currentSync.value?.enable();
}
/** 停用同步 */
function disableSync() {
  currentSync.value?.disable();
}

// 模拟官网「主从」交互锁：禁用从图（右图）的用户交互，只让它被动跟随
const slaveLocked = ref(false);
/** 切换从图交互开关（config 修改 draggable/scrollWheelZoom/dblClickZoom） */
function toggleSlaveLock() {
  slaveLocked.value = !slaveLocked.value;
  const m = mapB.value as unknown as { config(opts: Record<string, boolean>): void } | null;
  m?.config({
    draggable: !slaveLocked.value,
    scrollWheelZoom: !slaveLocked.value,
    dblClickZoom: !slaveLocked.value,
  });
}

// —— 卡片 2：序列化 + 导出 + 图层控制 ——
const elC = ref<HTMLElement | null>(null);
const { map: mapC } = useMaptalks(elC, { center, zoom: 12 });
useMaptalksTileLayer(mapC, { source: 'osm' });
const { layer: vecLayer } = useMaptalksVectorLayer(mapC);
useMaptalksMarker(vecLayer, {
  coordinates: center,
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 22, markerHeight: 22 } },
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
