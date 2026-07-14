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
  // 生成 50 个上海周边的随机点，供 heatmap/cluster 使用
  const randomPoints = Array.from({ length: 50 }, () => [121.47 + (Math.random() - 0.5) * 0.03, 31.23 + (Math.random() - 0.5) * 0.03] as [number, number]);

  for (const [i, p] of plugins.value.entries()) {
    try {
      let Ctor: unknown;
      if (p.name === 'maptalks.heatmap') Ctor = (await import('maptalks.heatmap')).HeatLayer;
      else if (p.name === 'maptalks.markercluster') Ctor = (await import('maptalks.markercluster')).ClusterLayer;
      else if (p.name === 'maptalks.three') Ctor = (await import('maptalks.three')).ThreeLayer;
      else if (p.name === 'maptalks.e3') Ctor = (await import('maptalks.e3')).E3Layer;
      else if (p.name === 'maptalks.mapboxgl') Ctor = (await import('maptalks.mapboxgl')).MapboxglLayer;
      else continue;
      const { map } = pluginMaps[i];
      const m = toValue(map);
      if (!m || typeof Ctor !== 'function') { p.status = 'error'; p.note = `"${p.name}" 导出类型不是构造函数。`; continue; }

      const instance = new (Ctor as new (id: string, opts: Record<string, unknown>) => { addTo: (m: unknown) => void; setData?: (d: unknown) => void; addGeometry?: (g: unknown) => void } & Record<string, unknown>)(p.name, {});
      instance.addTo(m);

      // 为 heatmap 添加热力数据
      if (p.name === 'maptalks.heatmap' && typeof instance.setData === 'function') {
        instance.setData(randomPoints.map(pt => ({ coordinates: pt, count: Math.random() * 100 })));
      }
      // 为 cluster 添加标记点
      if (p.name === 'maptalks.markercluster' && typeof instance.addGeometry === 'function') {
        const mt = await import('maptalks-gl');
        randomPoints.forEach(pt => instance.addGeometry!([new mt.Marker(pt)]));
      }
      // three / e3 / mapboxgl 需要复杂配置，仅展示逃生舱模式
      p.status = 'ok';
    } catch (e: unknown) {
      p.status = 'error';
      p.note = `"${p.name}" ${String(e).slice(0, 60)}`;
    }
  }
});
</script>
