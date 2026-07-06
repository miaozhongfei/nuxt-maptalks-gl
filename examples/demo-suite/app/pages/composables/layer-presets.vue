<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Composable 单独示例 · 图层预设</h1>
    <p class="text-muted mb-6">
      演示 6 个图层预设 composable：栅格瓦片、矢量瓦片、矢量图层、WMS、GLTF 3D、GroupGL 容器。
    </p>

    <!-- TileLayer -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksTileLayer</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 2.1</UBadge>
        </div>
      </template>
      <div ref="elTile" class="relative h-72 rounded border border-default overflow-hidden" />
      <template #footer><span class="text-sm text-muted">命名源 'osm' 栅格底图。</span></template>
    </UCard>

    <!-- VectorTileLayer（真实 MVT） -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksVectorTileLayer</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 2.6</UBadge>
        </div>
      </template>
      <div ref="elVT" class="relative h-72 rounded border border-default overflow-hidden" />
      <template #footer><span class="text-sm text-muted">MapLibre 公开 demo 矢量切片，蓝色国界面。</span></template>
    </UCard>

    <!-- VectorLayer + Marker -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksVectorLayer</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 6.8</UBadge>
        </div>
      </template>
      <div ref="elVec" class="relative h-72 rounded border border-default overflow-hidden" />
      <template #footer><span class="text-sm text-muted">矢量图层容器 + 一个 Marker。</span></template>
    </UCard>

    <!-- WMSLayer（真实 GeoServer） -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksWMSLayer</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 2.4</UBadge>
        </div>
      </template>
      <div ref="elWMS" class="relative h-72 rounded border border-default overflow-hidden" />
      <template #footer><span class="text-sm text-muted">ahocevar GeoServer 的 topp:states（美国各州），已定位到美国。</span></template>
    </UCard>

    <!-- GLTFLayer（真实 3D 模型） -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksGLTFLayer</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
        </div>
      </template>
      <div ref="elGLTF" class="relative h-80 rounded border border-default overflow-hidden" />
      <template #footer><span class="text-sm text-muted">GLTFLayer + 真实 3D 模型（Duck.glb），倾斜视角观察。</span></template>
    </UCard>

    <!-- GroupGLLayer（承载含模型的 GLTFLayer） -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksGroupGLLayer</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 2.3</UBadge>
        </div>
      </template>
      <div ref="elGroup" class="relative h-80 rounded border border-default overflow-hidden" />
      <template #footer><span class="text-sm text-muted">GroupGLLayer 容器中加入含 3D 模型的 GLTFLayer。</span></template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import type { MaptalksLayer } from '@lacqjs/nuxt-maptalks-gl';

const center: [number, number] = [121.4737, 31.2304];
const MODEL_URL =
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Duck/glTF-Binary/Duck.glb';

// —— 最小接口断言，避免 any ——
interface GltfMarkerCtor {
  new (coord: [number, number], opts: { symbol: Record<string, unknown> }): unknown;
}
interface GltfLayerInstance {
  addGeometry(geo: unknown): void;
}
interface MaptalksNs {
  GLTFMarker: GltfMarkerCtor;
  GLTFLayer: new (id: string) => GltfLayerInstance;
}

/** 监听图层就绪，往 GLTFLayer 加入真实 3D 模型 */
function addModelToGltf(layerRef: Ref<MaptalksLayer | null>): void {
  watch(
    layerRef,
    async (l) => {
      if (!l) return;
      const mt = (await import('maptalks-gl')) as unknown as MaptalksNs;
      const marker = new mt.GLTFMarker(center, { symbol: { url: MODEL_URL, scaleX: 200, scaleY: 200, scaleZ: 200 } });
      (l as unknown as GltfLayerInstance).addGeometry(marker);
    },
    { immediate: true },
  );
}

/** 监听 GroupGLLayer 就绪，往里加一个含模型的 GLTFLayer */
function addGltfToGroup(layerRef: Ref<MaptalksLayer | null>): void {
  watch(
    layerRef,
    async (l) => {
      if (!l) return;
      const mt = (await import('maptalks-gl')) as unknown as MaptalksNs;
      const gltf = new mt.GLTFLayer('lp-gltf-in-group');
      gltf.addGeometry(new mt.GLTFMarker(center, { symbol: { url: MODEL_URL, scaleX: 200, scaleY: 200, scaleZ: 200 } }));
      (l as unknown as { addLayer(x: unknown): void }).addLayer(gltf);
    },
    { immediate: true },
  );
}

// TileLayer
const elTile = ref<HTMLElement | null>(null);
const { map: tileMap } = useMaptalks(elTile, { center, zoom: 11 });
useMaptalksTileLayer(tileMap, { source: 'osm' });

// VectorTileLayer（真实 MVT）
const elVT = ref<HTMLElement | null>(null);
const { map: vtMap } = useMaptalks(elVT, { center: [110, 30], zoom: 2 });
useMaptalksVectorTileLayer(vtMap, {
  options: {
    urlTemplate: 'https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf',
    style: [
      { filter: ['==', '$type', 'Polygon'], renderPlugin: { type: 'fill', dataConfig: { type: 'fill' } }, symbol: { polygonFill: '#60a5fa', polygonOpacity: 0.6 } },
      { filter: ['==', '$type', 'LineString'], renderPlugin: { type: 'line', dataConfig: { type: 'line' } }, symbol: { lineColor: '#1e3a8a', lineWidth: 1 } },
    ],
  },
});

// VectorLayer + Marker
const elVec = ref<HTMLElement | null>(null);
const { map: vecMap } = useMaptalks(elVec, { center, zoom: 12 });
useMaptalksTileLayer(vecMap, { source: 'osm' });
const { layer: vecLayer } = useMaptalksVectorLayer(vecMap);
useMaptalksMarker(vecLayer, {
  coordinates: center,
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 },
});

// WMSLayer（定位到美国以显示 topp:states）
const elWMS = ref<HTMLElement | null>(null);
const { map: wmsMap } = useMaptalks(elWMS, { center: [-98, 39], zoom: 3 });
useMaptalksTileLayer(wmsMap, { source: 'osm' });
useMaptalksWMSLayer(wmsMap, {
  options: {
    urlTemplate: 'https://ahocevar.com/geoserver/wms',
    layers: 'topp:states',
    format: 'image/png',
    transparent: true,
  },
});

// GLTFLayer + 模型
const elGLTF = ref<HTMLElement | null>(null);
const { map: gltfMap } = useMaptalks(elGLTF, { center, zoom: 17, pitch: 60 });
useMaptalksTileLayer(gltfMap, { source: 'osm' });
const { layer: gltfLayer } = useMaptalksGLTFLayer(gltfMap, { id: 'lp-gltf' });
addModelToGltf(gltfLayer);

// GroupGLLayer + 含模型的 GLTFLayer
const elGroup = ref<HTMLElement | null>(null);
const { map: groupMap } = useMaptalks(elGroup, { center, zoom: 17, pitch: 60 });
useMaptalksTileLayer(groupMap, { source: 'osm' });
const { layer: groupLayer } = useMaptalksGroupGLLayer(groupMap, { id: 'lp-group' });
addGltfToGroup(groupLayer);
</script>
