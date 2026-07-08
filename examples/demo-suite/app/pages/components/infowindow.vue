<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">组件单独示例 · 信息框</h1>
    <p class="text-muted mb-6">
      演示 <code>MaptalksInfoWindow</code> 的多种用法：地图点击弹框、Marker 点击弹框、实时更新内容、自定义 UI、事件回调。
    </p>

    <!-- 卡片 1：地图点击弹出信息框 + 坐标实时更新 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">地图点击弹框 + 坐标实时更新</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.4</UBadge>
        </div>
      </template>
      <MaptalksMap ref="mapCmp1" :center="center" :zoom="12" class="relative rounded border border-default overflow-hidden" style="height: 380px">
        <MaptalksTileLayer source="osm" />
        <MaptalksInfoWindow :coordinates="iwCoord" :visible="showIW">
          <div class="iw-content">
            <strong>地图点击信息框</strong>
            <p>经度：{{ iwCoord[0].toFixed(6) }}</p>
            <p>纬度：{{ iwCoord[1].toFixed(6) }}</p>
            <p class="iw-time">点击时刻：{{ iwTime }}</p>
          </div>
        </MaptalksInfoWindow>
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">操作：点击地图任意位置，信息框弹出并显示坐标+点击时刻（实时更新）。</span>
      </template>
    </UCard>

    <!-- 卡片 2：Marker 上的信息框 + 自定义 UI + 事件 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">Marker 上的信息框 · 自定义 UI · 点击事件</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.5 / 10.6 / 10.10</UBadge>
        </div>
      </template>
      <MaptalksMap ref="mapCmp2" :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height: 380px">
        <MaptalksTileLayer source="osm" />
        <MaptalksVectorLayer>
          <MaptalksMarker
            :coordinates="[121.47, 31.23]"
            :symbol="{ markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 22, markerHeight: 22 }"
            @click="onMarkerClick('A', [121.47, 31.23])"
          />
          <MaptalksMarker
            :coordinates="[121.5, 31.24]"
            :symbol="{ markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 22, markerHeight: 22 }"
            @click="onMarkerClick('B', [121.5, 31.24])"
          />
        </MaptalksVectorLayer>
        <MaptalksInfoWindow :coordinates="mkCoord" :visible="showMK">
          <div class="iw-content" style="min-width: 180px">
            <strong>Marker {{ mkLabel }} 信息框</strong>
            <p>位置：[{{ mkCoord[0].toFixed(5) }}, {{ mkCoord[1].toFixed(5) }}]</p>
            <p class="iw-time">点击时间：{{ mkTime }}</p>
            <div style="margin-top: 4px; display: flex; gap: 4px">
              <button class="iw-btn" @click="mkCount += 1">👍 {{ mkCount }}</button>
              <button class="iw-btn" @click="closeMK">关闭</button>
            </div>
          </div>
        </MaptalksInfoWindow>
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">操作：点击蓝色/红色 Marker 打开不同的信息框，内含可交互按钮（👍 计数 + 关闭）。</span>
      </template>
    </UCard>

    <!-- MaptalksMarkerInfoWindow 标记级组件的完整功能演示见 composable 页 -->
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

// 卡片 1：地图点击弹框 + 实时坐标
const iwCoord = ref<[number, number]>([121.4737, 31.2304]);
const showIW = ref(false);
const iwTime = ref('');

const mapCmp1 = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map1 = computed(() => mapCmp1.value?.map ?? null);
useMaptalksEvents(map1, {
  click: (e: unknown) => {
    const ev = e as { coordinate: { x: number; y: number } };
    iwCoord.value = [ev.coordinate.x, ev.coordinate.y];
    iwTime.value = new Date().toLocaleTimeString();
    showIW.value = true;
  },
});

// 卡片 2：Marker 点击弹框 + 自定义 UI + 交互按钮
const mkCoord = ref<[number, number]>([121.47, 31.23]);
const mkLabel = ref('A');
const mkTime = ref('');
const mkCount = ref(0);
const showMK = ref(false);

function onMarkerClick(label: string, coord: [number, number]) {
  mkLabel.value = label;
  mkCoord.value = coord;
  mkTime.value = new Date().toLocaleTimeString();
  mkCount.value = 0;
  showMK.value = true;
}

function closeMK() {
  showMK.value = false;
}
</script>

<style scoped>
.iw-content { padding: 6px 10px; font-size: 13px; }
.iw-content strong { color: #2563eb; }
.iw-content p { margin: 2px 0; }
.iw-time { color: #6b7280; font-size: 12px; }
.iw-btn { padding: 2px 8px; border: 1px solid #d1d5db; border-radius: 4px; background: #fff; cursor: pointer; font-size: 12px; }
.iw-btn:hover { background: #f3f4f6; }
</style>
