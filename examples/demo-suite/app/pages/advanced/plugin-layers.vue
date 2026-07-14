<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 插件图层</h1>
    <p class="text-muted mb-6">演示 GroupGLLayer 分组和 5 种第三方插件图层逃生舱。</p>

    <UCard class="mb-4">
      <template #header><h2 class="font-semibold">GroupGLLayer · GL 图层分组</h2></template>
      <MaptalksMap ref="mapCmp1" :center="center" :zoom="15" :pitch="50" class="relative rounded border border-default overflow-hidden" style="height:320px" />
      <template #footer><span class="text-sm text-muted">useMaptalksGroupGLLayer + VectorLayer + Polygon。</span></template>
    </UCard>

    <div class="grid grid-cols-2 gap-4">
      <UCard v-for="p in plugins" :key="p.name">
        <template #header><div class="flex items-center gap-2"><h2 class="font-semibold">{{ p.name }}</h2><UBadge :color="p.status==='ok'?'success':p.status==='loading'?'neutral':'error'" variant="subtle">{{ p.status === 'ok' ? '已加载' : p.status === 'loading' ? '加载中' : '不可用' }}</UBadge></div></template>
        <div :ref="(el: unknown) => p.el = el as HTMLElement | null" class="relative rounded border border-default overflow-hidden" style="height:320px" />
        <template #footer><span class="text-sm text-muted">{{ p.note }}</span></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

// 卡片 1：GroupGLLayer
const mapCmp1 = ref<{ map: MaptalksMap | null } | null>(null);
const map1 = computed(() => mapCmp1.value?.map ?? null);
useMaptalksGroupGLLayer(map1, {});
const { layer: vec1 } = useMaptalksVectorLayer(map1);
useMaptalksTileLayer(map1, { source: 'osm' });
useMaptalksPolygon(vec1, {
  coordinates: [[121.472, 31.231], [121.476, 31.231], [121.476, 31.234], [121.472, 31.234]],
  symbol: { polygonFill: '#8b5cf6', polygonOpacity: 0.7, lineWidth: 2, lineColor: '#6d28d9' },
});

// 插件卡片数据（composable 在 setup 中创建，import 在 onMounted 中执行）
const plugins = ref([
  { name: 'maptalks.heatmap', status: 'loading', note: '热力图图层。', el: null as HTMLElement | null, importFn: () => import(/* @vite-ignore */ 'maptalks.heatmap').then(m => (m as Record<string,unknown>).HeatLayer) },
  { name: 'maptalks.markercluster', status: 'loading', note: '点聚合图层。', el: null as HTMLElement | null, importFn: () => import(/* @vite-ignore */ 'maptalks.markercluster').then(m => (m as Record<string,unknown>).ClusterLayer) },
  { name: '@maptalks/three', status: 'loading', note: 'Three.js 3D 图层。', el: null as HTMLElement | null, importFn: () => import(/* @vite-ignore */ '@maptalks/three').then(m => (m as Record<string,unknown>).ThreeLayer) },
  { name: 'maptalks.e3', status: 'loading', note: 'ECharts 3D 图层。', el: null as HTMLElement | null, importFn: () => import(/* @vite-ignore */ 'maptalks.e3').then(m => (m as Record<string,unknown>).E3Layer) },
  { name: 'mapbox-gl-js-maptalks', status: 'loading', note: 'Mapbox GL JS 图层。', el: null as HTMLElement | null, importFn: () => import(/* @vite-ignore */ 'mapbox-gl-js-maptalks').then(m => (m as Record<string,unknown>).MapboxglLayer) },
]);

// 为每张插件卡片预先创建 map（composable 必须在 setup 中调用）
const pluginMaps = plugins.value.map(() => {
  const el = ref<HTMLElement | null>(null);
  const { map } = useMaptalks(el, { center, zoom: 13 });
  useMaptalksTileLayer(map, { source: 'osm' });
  return { map };
});

onMounted(() => {
  plugins.value.forEach((p, i) => {
    p.importFn().then((Ctor) => {
      const { map } = pluginMaps[i];
      watch(() => toValue(map), (m) => {
        if (m && typeof Ctor === 'function') {
          const instance = (Ctor as unknown as new (id: string, opts: Record<string, unknown>) => { addTo: (m: unknown) => void })(p.name, {});
          instance.addTo(m);
          p.status = 'ok';
        }
      });
    }).catch(() => {
      p.status = 'error';
      p.note = `"${p.name}" 当前不可用。`;
    });
  });
});
</script>
