<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <div
        ref="el1"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">旧 API：geo.setMenu({ items })——标准模式。</p>
    </div>
    <div>
      <div
        ref="el2"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">新封装：useMaptalksGeometryMenu——标准模式。</p>
    </div>
    <div>
      <div
        ref="el3"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">旧 API：geo.setMenu({ custom: true })——自定义 HTML。</p>
    </div>
    <div>
      <div
        ref="el4"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">新封装：useMaptalksGeometryMenu——自定义 HTML。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const MARKERS: [number, number][] = [
  [121.5057, 31.2453],
  [121.508, 31.2453],
  [121.502, 31.2453],
];
const MKR_SYM = {
  markerType: 'ellipse' as const,
  markerFill: '#f59e0b',
  markerWidth: 14,
  markerHeight: 14,
};

function customEl(zoomIn: () => void, zoomOut: () => void): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  const d = document.createElement('div');
  d.style.cssText = 'padding:2px;min-width:120px';
  const b1 = document.createElement('button');
  b1.textContent = '放大';
  b1.style.cssText =
    'display:block;width:100%;padding:4px 12px;border:none;background:none;cursor:pointer;text-align:left;font-size:14px';
  b1.addEventListener('click', zoomIn);
  const b2 = document.createElement('button');
  b2.textContent = '缩小';
  b2.style.cssText =
    'display:block;width:100%;padding:4px 12px;border:none;background:none;cursor:pointer;text-align:left;font-size:14px';
  b2.addEventListener('click', zoomOut);
  d.append(b1, b2);
  return d;
}

function setupMarkers(lyr: any, markers: any[], mode: string, m: any) {
  for (const mk of markers) {
    if (mode === 'old-s') {
      mk.setMenu?.({
        width: 160,
        items: [
          { item: '放大', click: () => m.zoomIn() },
          { item: '缩小', click: () => m.zoomOut() },
        ],
      });
    } else if (mode === 'old-c') {
      mk.setMenu?.({
        custom: true,
        items: customEl(
          () => m.zoomIn(),
          () => m.zoomOut(),
        ),
      });
    }
  }
}

// —— 旧 API 标准 —— (markers managed via composable, setMenu via watch)
const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map1, { source: 'osm' });
const { layer: layer1 } = useMaptalksVectorLayer(map1);
const marker1a = useMaptalksMarker(layer1, {
  coordinates: MARKERS[0] as [number, number],
  options: { symbol: MKR_SYM },
});
const marker1b = useMaptalksMarker(layer1, {
  coordinates: MARKERS[1] as [number, number],
  options: { symbol: MKR_SYM },
});
const marker1c = useMaptalksMarker(layer1, {
  coordinates: MARKERS[2] as [number, number],
  options: { symbol: MKR_SYM },
});
watch([() => toValue(map1), () => toValue(marker1a.geometry)], () => {
  const g = toValue(marker1a.geometry);
  const m = toValue(map1);
  if (g && m)
    g.setMenu?.({
      width: 160,
      items: [
        { item: '放大', click: () => m.zoomIn() },
        { item: '缩小', click: () => m.zoomOut() },
      ],
    });
});
watch([() => toValue(map1), () => toValue(marker1b.geometry)], () => {
  const g = toValue(marker1b.geometry);
  const m = toValue(map1);
  if (g && m)
    g.setMenu?.({
      width: 160,
      items: [
        { item: '放大', click: () => m.zoomIn() },
        { item: '缩小', click: () => m.zoomOut() },
      ],
    });
});
watch([() => toValue(map1), () => toValue(marker1c.geometry)], () => {
  const g = toValue(marker1c.geometry);
  const m = toValue(map1);
  if (g && m)
    g.setMenu?.({
      width: 160,
      items: [
        { item: '放大', click: () => m.zoomIn() },
        { item: '缩小', click: () => m.zoomOut() },
      ],
    });
});

// —— 新封装 标准 ——
const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map2, { source: 'osm' });
const { layer: layer2 } = useMaptalksVectorLayer(map2);
const marker2a = useMaptalksMarker(layer2, {
  coordinates: MARKERS[0] as [number, number],
  options: { symbol: MKR_SYM },
});
const marker2b = useMaptalksMarker(layer2, {
  coordinates: MARKERS[1] as [number, number],
  options: { symbol: MKR_SYM },
});
const marker2c = useMaptalksMarker(layer2, {
  coordinates: MARKERS[2] as [number, number],
  options: { symbol: MKR_SYM },
});
useMaptalksGeometryMenu(marker2a.geometry, {
  options: {
    width: 160,
    items: [
      { item: '放大', click: () => toValue(map2)?.zoomIn() },
      { item: '缩小', click: () => toValue(map2)?.zoomOut() },
    ],
  },
});
useMaptalksGeometryMenu(marker2b.geometry, {
  options: {
    width: 160,
    items: [
      { item: '放大', click: () => toValue(map2)?.zoomIn() },
      { item: '缩小', click: () => toValue(map2)?.zoomOut() },
    ],
  },
});
useMaptalksGeometryMenu(marker2c.geometry, {
  options: {
    width: 160,
    items: [
      { item: '放大', click: () => toValue(map2)?.zoomIn() },
      { item: '缩小', click: () => toValue(map2)?.zoomOut() },
    ],
  },
});

// —— 旧 API 自定义 HTML ——
const el3 = ref<HTMLElement | null>(null);
const { map: map3 } = useMaptalks(el3, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map3, { source: 'osm' });
const { layer: layer3 } = useMaptalksVectorLayer(map3);
const marker3a = useMaptalksMarker(layer3, {
  coordinates: MARKERS[0] as [number, number],
  options: { symbol: MKR_SYM },
});
const marker3b = useMaptalksMarker(layer3, {
  coordinates: MARKERS[1] as [number, number],
  options: { symbol: MKR_SYM },
});
const marker3c = useMaptalksMarker(layer3, {
  coordinates: MARKERS[2] as [number, number],
  options: { symbol: MKR_SYM },
});
function setupOldCustom(g: any, m: any) {
  if (g && m)
    g.setMenu?.({
      custom: true,
      items: customEl(
        () => m.zoomIn(),
        () => m.zoomOut(),
      ),
    });
}
watch([() => toValue(map3), () => toValue(marker3a.geometry)], () =>
  setupOldCustom(toValue(marker3a.geometry), toValue(map3)),
);
watch([() => toValue(map3), () => toValue(marker3b.geometry)], () =>
  setupOldCustom(toValue(marker3b.geometry), toValue(map3)),
);
watch([() => toValue(map3), () => toValue(marker3c.geometry)], () =>
  setupOldCustom(toValue(marker3c.geometry), toValue(map3)),
);

// —— 新封装 自定义 HTML ——
const el4 = ref<HTMLElement | null>(null);
const { map: map4 } = useMaptalks(el4, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map4, { source: 'osm' });
const { layer: layer4 } = useMaptalksVectorLayer(map4);
const marker4a = useMaptalksMarker(layer4, {
  coordinates: MARKERS[0] as [number, number],
  options: { symbol: MKR_SYM },
});
const marker4b = useMaptalksMarker(layer4, {
  coordinates: MARKERS[1] as [number, number],
  options: { symbol: MKR_SYM },
});
const marker4c = useMaptalksMarker(layer4, {
  coordinates: MARKERS[2] as [number, number],
  options: { symbol: MKR_SYM },
});
useMaptalksGeometryMenu(marker4a.geometry, {
  options: {
    custom: true,
    items: customEl(
      () => toValue(map4)?.zoomIn(),
      () => toValue(map4)?.zoomOut(),
    ) as any,
  },
});
useMaptalksGeometryMenu(marker4b.geometry, {
  options: {
    custom: true,
    items: customEl(
      () => toValue(map4)?.zoomIn(),
      () => toValue(map4)?.zoomOut(),
    ) as any,
  },
});
useMaptalksGeometryMenu(marker4c.geometry, {
  options: {
    custom: true,
    items: customEl(
      () => toValue(map4)?.zoomIn(),
      () => toValue(map4)?.zoomOut(),
    ) as any,
  },
});
</script>
