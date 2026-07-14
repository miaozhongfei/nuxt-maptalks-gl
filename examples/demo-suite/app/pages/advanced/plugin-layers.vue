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
      <UCard v-for="(p, index) in plugins" :key="p.name">
        <template #header><div class="flex items-center gap-2"><h2 class="font-semibold">{{ p.name }}</h2><UBadge :color="p.status==='ok'?'success':p.status==='loading'?'neutral':'error'" variant="subtle">{{ p.status === 'ok' ? '已加载' : p.status === 'loading' ? '加载中' : '不可用' }}</UBadge></div></template>
        <div :ref="(el: unknown) => pluginEls[index].value = el as HTMLElement | null" class="relative rounded border border-default overflow-hidden" style="height:320px" />
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
useMaptalksTileLayer(map1, { source: 'osm' });
useMaptalksGroupGLLayer(map1, {});
const { layer: vec1 } = useMaptalksVectorLayer(map1);
useMaptalksPolygon(vec1, {
  coordinates: [[121.472, 31.231], [121.476, 31.231], [121.476, 31.234], [121.472, 31.234]],
  symbol: { polygonFill: '#8b5cf6', polygonOpacity: 0.7, lineWidth: 2, lineColor: '#6d28d9' },
});

// 插件卡片数据
const plugins = ref([
  { name: 'maptalks.heatmap', status: 'loading' as string, note: '热力图图层。' },
  { name: 'maptalks.markercluster', status: 'loading' as string, note: '点聚合图层。' },
  { name: 'maptalks.three', status: 'loading' as string, note: 'Three.js 3D 图层。' },
  { name: 'maptalks.e3', status: 'loading' as string, note: 'ECharts 3D 图层。' },
  { name: 'maptalks.mapboxgl', status: 'loading' as string, note: 'Mapbox GL JS 图层。' },
]);

// 每张插件卡片预先创建 el ref → useMaptalks → template :ref 回调绑定
const pluginEls = plugins.value.map(() => ref<HTMLElement | null>(null));
const pluginMaps = pluginEls.map(el => {
  const { map } = useMaptalks(el, { center, zoom: 13 });
  useMaptalksTileLayer(map, { source: 'osm' });
  return { map, el };
});

onMounted(async () => {
  const importSpecifiers: Record<string, string> = {
    'maptalks.heatmap': 'maptalks.heatmap',
    'maptalks.markercluster': 'maptalks.markercluster',
    'maptalks.three': 'maptalks.three',
    'maptalks.e3': 'maptalks.e3',
    'maptalks.mapboxgl': 'maptalks.mapboxgl',
  };
  const exportNames: Record<string, string> = {
    'maptalks.heatmap': 'HeatLayer',
    'maptalks.markercluster': 'ClusterLayer',
    'maptalks.three': 'ThreeLayer',
    'maptalks.e3': 'E3Layer',
    'maptalks.mapboxgl': 'MapboxglLayer',
  };
  for (const [i, p] of plugins.value.entries()) {
    try {
      const mod = await import(importSpecifiers[p.name]);
      const Ctor = (mod as Record<string, unknown>)[exportNames[p.name]];
      const { map } = pluginMaps[i];
      const m = toValue(map);
      if (m && typeof Ctor === 'function') {
        const instance = new (Ctor as new (id: string, opts: Record<string, unknown>) => { addTo: (m: unknown) => void })(p.name, {});
        instance.addTo(m);
        p.status = 'ok';
      } else {
        p.status = 'error';
        p.note = `"${p.name}" 未找到导出 ${exportNames[p.name]}。`;
      }
    } catch {
      p.status = 'error';
      p.note = `"${p.name}" 当前不可用。`;
    }
  }
});
</script>
