<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 插件图层</h1>
    <p class="text-muted mb-6">演示 GroupGLLayer 分组和 4 种第三方插件图层逃生舱。</p>

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
import * as THREE from 'three';

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
]);

// 每张插件卡片预先创建 el ref → useMaptalks → template :ref 回调绑定
const pluginEls = plugins.value.map(() => ref<HTMLElement | null>(null));
const pluginMaps = pluginEls.map(el => {
  const { map } = useMaptalks(el, { center, zoom: 13 });
  useMaptalksTileLayer(map, { source: 'osm' });
  return { map, el };
});

onMounted(async () => {
  const pts = Array.from({ length: 50 }, () => [121.47 + (Math.random() - 0.5) * 0.03, 31.23 + (Math.random() - 0.5) * 0.03] as [number, number]);

  // heatmap
  try {
    const { HeatLayer } = await import('maptalks.heatmap');
    const m = toValue(pluginMaps[0].map);
    if (m && typeof HeatLayer === 'function') {
      const layer = new (HeatLayer as new (id: string, data?: unknown) => { addTo: (m: unknown) => void } & Record<string, unknown>)('heat', pts.map(p => [p[0], p[1], Math.random()]));
      layer.addTo(m);
      plugins.value[0].status = 'ok';
    }
  } catch { plugins.value[0].status = 'error'; plugins.value[0].note = 'maptalks.heatmap 不可用。'; }

  // markercluster
  try {
    const { ClusterLayer } = await import('maptalks.markercluster');
    const m = toValue(pluginMaps[1].map);
    if (m && typeof ClusterLayer === 'function') {
      const layer = new (ClusterLayer as new (id: string, opts?: Record<string, unknown>) => { addTo: (m: unknown) => void; addGeometry: (g: unknown[]) => void } & Record<string, unknown>)('cluster');
      const mt = await import('maptalks-gl');
      layer.addTo(m);
      layer.addGeometry(pts.map(p => new mt.Marker(p)));
      plugins.value[1].status = 'ok';
    }
  } catch { plugins.value[1].status = 'error'; plugins.value[1].note = 'maptalks.markercluster 不可用。'; }

  // three
  try {
    const { ThreeLayer } = await import('maptalks.three');
    const m = toValue(pluginMaps[2].map);
    if (m && typeof ThreeLayer === 'function') {
      const layer = new (ThreeLayer as new (id: string, opts?: Record<string, unknown>) => { addTo: (m: unknown) => void; prepareToDraw?: (gl: unknown, scene: unknown, camera: unknown) => void; addMesh?: (o: unknown) => void } & Record<string, unknown>)('three');
      layer.prepareToDraw = function (_gl, scene, _camera) {
        const s = scene as { add: (o: unknown) => void };
        const cam = _camera as { position: { x: number; y: number; z: number } };
        s.add(new THREE.AmbientLight(0x666666));
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        s.add(light);
        const geo = new THREE.BoxGeometry(500, 500, 500);
        const mat = new THREE.MeshPhongMaterial({ color: 0x2563eb });
        const box = new THREE.Mesh(geo, mat);
        box.position.set(cam.position.x, cam.position.y, 0);
        s.add(box);
      };
      layer.addTo(m);
      plugins.value[2].status = 'ok';
    }
  } catch { plugins.value[2].status = 'error'; plugins.value[2].note = 'maptalks.three 不可用。'; }

  // e3
  try {
    const { E3Layer } = await import('maptalks.e3');
    const m = toValue(pluginMaps[3].map);
    if (m && typeof E3Layer === 'function') {
      const layer = new (E3Layer as new (id: string, opts?: Record<string, unknown>) => { addTo: (m: unknown) => void } & Record<string, unknown>)('e3', { series: [{ type: 'scatter', coordinateSystem: 'maptalks', data: pts.map(p => [p[0], p[1], Math.random() * 100]) }] });
      layer.addTo(m);
      plugins.value[3].status = 'ok';
    }
  } catch { plugins.value[3].status = 'error'; plugins.value[3].note = 'maptalks.e3 不可用。'; }
});
</script>
