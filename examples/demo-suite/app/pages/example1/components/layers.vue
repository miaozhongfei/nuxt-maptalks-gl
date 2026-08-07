<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">组件单独示例 · 地图 · 瓦片图层</h1>
    <p class="text-muted mb-6">
      演示地图根组件 <code>MaptalksMap</code> 与各类图层组件。所有图层组件都必须作为
      <code>MaptalksMap</code> 的子组件（通过 provide/inject 获取地图上下文）。
    </p>

    <!-- MaptalksMap + MaptalksTileLayer：最基础的一张地图 + 栅格瓦片底图 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksMap + MaptalksTileLayer</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 1.1 / 2.1</UBadge>
        </div>
      </template>
      <MaptalksMap
        :center="center"
        :zoom="11"
        class="relative rounded border border-default overflow-hidden"
        style="height: 320px"
        @ready="ready = true"
        @error="onError" baseLayer="osm"
      >
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">状态：{{ ready ? '地图已就绪' : '加载中…' }}{{ errMsg }}</span>
      </template>
    </UCard>

    <!-- MaptalksVectorTileLayer：真实矢量瓦片（MapLibre 免费公开切片，渲染世界各国边界） -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksVectorTileLayer</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 2.6</UBadge>
        </div>
      </template>
      <!-- 矢量瓦片是世界范围国界数据，用较小 zoom 才能看到 -->
      <MaptalksMap :center="[110, 30]" :zoom="2" class="relative rounded border border-default overflow-hidden" style="height: 320px" baseLayer="osm">
        <!-- MapLibre 官方公开 demo 矢量切片（无需 key），按几何类型给样式渲染国界/线 -->
        <MaptalksVectorTileLayer :options="vectorTileOptions" />
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">数据源：MapLibre 公开 demo 矢量切片，蓝色填充为各国国界面。</span>
      </template>
    </UCard>

    <!-- MaptalksVectorLayer：矢量图形容器（承载 Marker/几何等） -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksVectorLayer</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 6.8</UBadge>
        </div>
      </template>
      <MaptalksMap :center="center" :zoom="12" class="relative rounded border border-default overflow-hidden" style="height: 320px" baseLayer="osm">
        <!-- VectorLayer 是几何图形的容器，几何组件必须放在它内部；这里放一个 Marker 证明容器生效 -->
        <MaptalksVectorLayer>
          <MaptalksMarker
            :coordinates="center"
            :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 } }"
          />
        </MaptalksVectorLayer>
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">VectorLayer 内含一个蓝色 Marker，证明容器已生效。</span>
      </template>
    </UCard>

    <!-- MaptalksGLTFLayer：3D 模型图层，承载真实 GLTF 模型 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksGLTFLayer（真实 3D 模型）</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
        </div>
      </template>
      <MaptalksMap :center="center" :zoom="17" :pitch="60" class="relative rounded border border-default overflow-hidden" style="height: 360px" @ready="onGltfReady" baseLayer="osm">
        <!-- 组件创建空的 GLTFLayer，指定 id 便于就绪后取到它并加入真实 3D 模型 -->
        <MaptalksGLTFLayer id="gltf-solo" />
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">{{ gltfNote || '正在加载 3D 模型…（倾斜视角观察）' }}</span>
      </template>
    </UCard>

    <!-- MaptalksGroupGLLayer：GL 图层容器，承载一个含 3D 模型的 GLTFLayer -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksGroupGLLayer（承载 GL 图层）</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 2.3</UBadge>
        </div>
      </template>
      <MaptalksMap :center="center" :zoom="17" :pitch="60" class="relative rounded border border-default overflow-hidden" style="height: 360px" @ready="onGroupReady" baseLayer="osm">
        <!-- GroupGLLayer 是 GL 图层的分组容器（含默认光照/后处理）；就绪后往里加一个含 3D 模型的 GLTFLayer -->
        <MaptalksGroupGLLayer id="group-demo" />
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">{{ groupNote || '正在向 GroupGLLayer 加入含 3D 模型的 GL 图层…' }}</span>
      </template>
    </UCard>

    <!-- baseLayer 格式对比 -->
    <UCard class="mb-6">
      <template #header><h2 class="font-semibold">baseLayer 配置格式 · 字符串</h2></template>
      <MaptalksMap :center="center" :zoom="12" baseLayer="osm" class="relative rounded border border-default overflow-hidden" style="height:280px" />
      <template #footer><span class="text-sm text-muted"><code>baseLayer="osm"</code> — 字符串格式，模块自动创建 TileLayer。</span></template>
    </UCard>

    <UCard class="mb-6">
      <template #header><h2 class="font-semibold">baseLayer 配置格式 · 对象</h2></template>
      <MaptalksMap :center="center" :zoom="12" :baseLayer="{ source: 'osm' }" class="relative rounded border border-default overflow-hidden" style="height:280px" />
      <template #footer><span class="text-sm text-muted"><code>:baseLayer="{ source: 'osm' }"</code> — 对象格式，可扩展 options。</span></template>
    </UCard>

    <UCard class="mb-6">
      <template #header><h2 class="font-semibold">baseLayer 配置格式 · 原生 Layer 对象</h2></template>
      <MaptalksMap ref="nativeLayerMap" :center="center" :zoom="12" class="relative rounded border border-default overflow-hidden" style="height:280px" />
      <template #footer><span class="text-sm text-muted">native new TileLayer() → map.addLayer()，等效 :baseLayer 传原生对象。</span></template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { MaptalksMap as MtMap } from '@lacqjs/nuxt-maptalks-gl'

// 上海人民广场，作为所有示例地图的中心
const center: [number, number] = [121.4737, 31.2304];
const ready = ref(false);
const errMsg = ref('');
const gltfNote = ref('');
const groupNote = ref('');

// 可靠 CDN 的公开 3D 模型（jsdelivr，支持 CORS）
const MODEL_URL =
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Duck/glTF-Binary/Duck.glb';

// MapLibre 公开 demo 矢量切片 + 按几何类型着色的 maptalks 样式（style 为直接数组）
const vectorTileOptions = {
  urlTemplate: 'https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf',
  style: [
    {
      // 所有面要素（各国国界）填充蓝色
      filter: ['==', '$type', 'Polygon'],
      renderPlugin: { type: 'fill', dataConfig: { type: 'fill' } },
      symbol: { polygonFill: '#60a5fa', polygonOpacity: 0.6 },
    },
    {
      // 所有线要素描边
      filter: ['==', '$type', 'LineString'],
      renderPlugin: { type: 'line', dataConfig: { type: 'line' } },
      symbol: { lineColor: '#1e3a8a', lineWidth: 1 },
    },
  ],
};

// 地图初始化失败时展示错误信息（SSR/WebGL 不可用等）
function onError(err: MaptalksError) {
  errMsg.value = `（错误：${err.message}）`;
}

// —— 下面用最小接口断言访问 maptalks 原生 API，避免 any ——
interface GltfMarkerCtor {
  new (coord: [number, number], opts: { symbol: Record<string, unknown> }): unknown;
}
interface GltfLayerInstance {
  addGeometry(geo: unknown): void;
}
interface GltfLayerCtor {
  new (id: string): GltfLayerInstance;
}
interface GroupLayerInstance {
  addLayer(layer: unknown): void;
}
interface MaptalksNs {
  GLTFMarker: GltfMarkerCtor;
  GLTFLayer: GltfLayerCtor;
}

// GLTFLayer 卡片：取到组件创建的 GLTFLayer(id=gltf-solo)，加入真实 3D 模型
async function onGltfReady(map: MtMap) {
  try {
    const mt = (await import('maptalks-gl')) as unknown as MaptalksNs;
    const layer = (map as unknown as { getLayer(id: string): GltfLayerInstance | null }).getLayer('gltf-solo');
    if (!layer) {
      gltfNote.value = '未找到 GLTF 图层';
      return;
    }
    const marker = new mt.GLTFMarker(center, { symbol: { url: MODEL_URL, scaleX: 200, scaleY: 200, scaleZ: 200 } });
    layer.addGeometry(marker);
    gltfNote.value = '已加载真实 3D 模型（Duck.glb）';
  } catch (e) {
    gltfNote.value = `模型加载失败：${(e as Error)?.message ?? e}`;
  }
}

// GroupGLLayer 卡片：取到组件创建的 GroupGLLayer(id=group-demo)，往里加一个含 3D 模型的 GLTFLayer
async function onGroupReady(map: MtMap) {
  try {
    const mt = (await import('maptalks-gl')) as unknown as MaptalksNs;
    const group = (map as unknown as { getLayer(id: string): GroupLayerInstance | null }).getLayer('group-demo');
    if (!group) {
      groupNote.value = '未找到 GroupGL 图层';
      return;
    }
    const gltf = new mt.GLTFLayer('gltf-in-group');
    const marker = new mt.GLTFMarker(center, { symbol: { url: MODEL_URL, scaleX: 200, scaleY: 200, scaleZ: 200 } });
    gltf.addGeometry(marker);
    group.addLayer(gltf);
    groupNote.value = '已在 GroupGLLayer 中加入含 3D 模型的 GLTFLayer';
  } catch (e) {
    groupNote.value = `加载失败：${(e as Error)?.message ?? e}`;
  }
}

// 原生 TileLayer 演示（等效于 :baseLayer 传入 native Layer 对象）
const nativeLayerMap = ref<{ map: MtMap | null } | null>(null);
watch(() => nativeLayerMap.value?.map, (m) => {
  if (!m) return;
  import('maptalks-gl').then(mt => {
    const tl = new mt.TileLayer('native-tile', {
      urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c', 'd'],
    });
    m.addLayer(tl as unknown as Parameters<typeof m.addLayer>[0]);
  });
});
</script>
