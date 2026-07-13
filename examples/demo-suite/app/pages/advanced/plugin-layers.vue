<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 插件图层</h1>
    <p class="text-muted mb-6">演示 GroupGLLayer 3D 建筑拉伸与 GLTFLayer 逃生舱。</p>

    <div class="grid grid-cols-1 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">GroupGLLayer · 3D 建筑多边形</h2></template>
        <MaptalksMap ref="mapCmp1" :center="center" :zoom="15" :pitch="50" class="relative rounded border border-default overflow-hidden" style="height:400px">
          <MaptalksTileLayer source="osm" />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">GroupGLLayer + Polygon 高度拉伸，拖拽俯仰角查看 3D 效果。</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 原生 GLTFLayer + GLTFMarker</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:400px" />
        <template #footer><span class="text-sm text-muted">native new GLTFLayer() + GLTFMarker 加载鸭子模型（需联网）。</span></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

const mapCmp1 = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map1 = computed(() => mapCmp1.value?.map ?? null);

// 卡片 1：GroupGLLayer + 3D 建筑多边形（用 composable 直调获取 layer 引用）
const { layer: glLayer } = useMaptalksGroupGLLayer(map1, {});
watch(() => toValue(glLayer), (layer) => {
  if (!layer) return;
  import('maptalks-gl').then(mt => {
    const polygon = new mt.Polygon(
      [[121.472, 31.231], [121.476, 31.231], [121.476, 31.234], [121.472, 31.234]],
      { symbol: { polygonFill: '#2563eb', polygonOpacity: 0.7, lineWidth: 0 }, properties: { height: 300 } },
    );
    polygon.addTo(layer as Parameters<typeof polygon.addTo>[0]);
    const p2 = new mt.Polygon(
      [[121.474, 31.229], [121.477, 31.229], [121.477, 31.2305], [121.474, 31.2305]],
      { symbol: { polygonFill: '#dc2626', polygonOpacity: 0.7, lineWidth: 0 }, properties: { height: 500 } },
    );
    p2.addTo(layer as Parameters<typeof polygon.addTo>[0]);
  });
});

// 卡片 2：原生 GLTFLayer
const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center, zoom: 15, pitch: 50 });
useMaptalksTileLayer(map2, { source: 'osm' });
watch(() => toValue(map2), (m) => {
  if (!m) return;
  import('maptalks-gl').then(mt => {
    const gltfLayer = new mt.GLTFLayer('gltf');
    gltfLayer.addTo(m);
    const c = m.getCenter();
    const gltfMarker = new mt.GLTFMarker([c.x, c.y] as number[], {
      symbol: {
        url: 'https://cdn.jsdelivr.net/npm/@maptalks/gltf-layer@latest/assets/duck/duck.glb',
        scaleX: 150, scaleY: 150, scaleZ: 150,
      },
    });
    gltfMarker.addTo(gltfLayer);
  });
});
</script>
