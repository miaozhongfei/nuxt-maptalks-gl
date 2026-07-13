<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 插件图层</h1>
    <p class="text-muted mb-6">演示 GLTFLayer / GroupGLLayer 及第三方插件逃生舱。</p>

    <div class="grid grid-cols-1 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">GroupGLLayer · 分组 GL 图层</h2></template>
        <MaptalksMap ref="map1" :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height:380px">
          <MaptalksTileLayer source="osm" />
          <MaptalksGroupGLLayer />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">GroupGLLayer 作为 GL 渲染容器。</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 原生 GLTFLayer 加载 3D 模型</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:400px" />
        <template #footer><span class="text-sm text-muted">原生 new GLTFLayer + 模型 URL（需联网）。</span></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center, zoom: 15, pitch: 50 });
useMaptalksTileLayer(map2, { source: 'osm' });

onMounted(async () => {
  const m = toValue(map2);
  if (!m) return;
  const mt = await import('maptalks-gl');
  const gltfLayer = new mt.GLTFLayer('gltf').addTo(m);
  const position = m.getCenter();
  const gltfMarker = new mt.GLTFMarker(position as number[], {
    symbol: { url: 'https://cdn.jsdelivr.net/npm/@maptalks/gltf-layer@latest/assets/duck/duck.glb', scaleX: 100, scaleY: 100, scaleZ: 100 },
  }).addTo(gltfLayer);
});
</script>
