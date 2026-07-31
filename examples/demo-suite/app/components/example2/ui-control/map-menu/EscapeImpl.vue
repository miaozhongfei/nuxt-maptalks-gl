<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <div
        ref="el1"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">旧 API：map.setMenu({ items })——标准模式。</p>
    </div>
    <div>
      <div
        ref="el2"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">新封装：new mt.ui.Menu + contextmenu——标准模式。</p>
    </div>
    <div>
      <div
        ref="el3"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">
        旧 API：map.setMenu({ custom: true, items: el })——自定义 HTML。
      </p>
    </div>
    <div>
      <div
        ref="el4"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">
        新封装：new mt.ui.Menu({ custom: true }) + contextmenu——自定义 HTML。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// —— 旧 API：map.setMenu({ items }) ——
const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map1, { source: 'osm' });
watch(
  () => toValue(map1),
  (m) => {
    if (!m) return;
    m.setMenu({
      width: 160,
      items: [
        { item: '放大', click: () => m.zoomIn() },
        { item: '缩小', click: () => m.zoomOut() },
      ],
    });
  },
);

// —— 新封装：new mt.ui.Menu → addTo → contextmenu 绑定 ——
const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map2, { source: 'osm' });
watch(
  () => toValue(map2),
  async (m) => {
    if (!m) return;
    const mt = await import('maptalks-gl');
    if (!mt.ui?.Menu) return;
    const menu = new mt.ui.Menu({
      width: 160,
      items: [
        { item: '放大', click: () => m.zoomIn() },
        { item: '缩小', click: () => m.zoomOut() },
      ],
    } as any);
    menu.addTo(m as any);
    const h = (e: any) => menu.show(e.coordinate);
    m.on('contextmenu', h);
  },
);

function customEl(zoomIn: () => void, zoomOut: () => void): HTMLElement {
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

// —— 旧 API：map.setMenu({ custom: true, items: el }) ——
const el3 = ref<HTMLElement | null>(null);
const { map: map3 } = useMaptalks(el3, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map3, { source: 'osm' });
watch(
  () => toValue(map3),
  (m) => {
    if (!m) return;
    m.setMenu({
      custom: true,
      items: customEl(
        () => m.zoomIn(),
        () => m.zoomOut(),
      ),
    });
  },
);

// —— 新封装：new mt.ui.Menu({ custom: true }) + contextmenu ——
const el4 = ref<HTMLElement | null>(null);
const { map: map4 } = useMaptalks(el4, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map4, { source: 'osm' });
watch(
  () => toValue(map4),
  async (m) => {
    if (!m) return;
    const mt = await import('maptalks-gl');
    if (!mt.ui?.Menu) return;
    const menu = new mt.ui.Menu({
      custom: true,
      items: customEl(
        () => m.zoomIn(),
        () => m.zoomOut(),
      ),
    } as any);
    menu.addTo(m as any);
    const h = (e: any) => menu.show(e.coordinate);
    m.on('contextmenu', h);
  },
);
</script>
