<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <div
        ref="el1"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">旧 API：watch → geo.setMenu({ items })——标准模式。</p>
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
        旧 API：watch → geo.setMenu({ custom: true })——自定义 HTML。
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
    <p class="text-xs text-muted col-span-2">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const MARKERS: [number, number][] = [
  [121.5057, 31.2453],
  [121.508, 31.2453],
  [121.502, 31.2453],
]

function customEl(zoomIn: () => void, zoomOut: () => void): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const d = document.createElement('div')
  d.style.cssText = 'padding:2px;min-width:120px'
  const b1 = document.createElement('button')
  b1.textContent = '放大'
  b1.style.cssText =
    'display:block;width:100%;padding:4px 12px;border:none;background:none;cursor:pointer;text-align:left;font-size:14px'
  b1.addEventListener('click', zoomIn)
  const b2 = document.createElement('button')
  b2.textContent = '缩小'
  b2.style.cssText =
    'display:block;width:100%;padding:4px 12px;border:none;background:none;cursor:pointer;text-align:left;font-size:14px'
  b2.addEventListener('click', zoomOut)
  d.append(b1, b2)
  return d
}

async function setupMarkers(m: MaptalksMap, mode: 'old-s' | 'new-s' | 'old-c' | 'new-c') {
  const mt = await import('maptalks-gl')
  // 原生 VectorLayer.addTo 参数为原生 Map，与模块建模不兼容——逃生舱断言
  const layer = new mt.VectorLayer('v').addTo(m as never)
  for (const coord of MARKERS) {
    const marker = new mt.Marker(coord, {
      symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 14, markerHeight: 14 },
    })
    marker.addTo(layer)
    if (mode === 'old-s') {
      // 原生 setMenu items 结构与建模不同——逃生舱断言
      marker.setMenu({
        width: 160,
        items: [
          { item: '放大', click: () => m.zoomIn() },
          { item: '缩小', click: () => m.zoomOut() },
        ],
      } as any)
    } else if (mode === 'new-s') {
      const mu = new mt.ui.Menu({
        width: 160,
        items: [
          { item: '放大', click: () => m.zoomIn() },
          { item: '缩小', click: () => m.zoomOut() },
        ],
      } as any)
      mu.addTo(marker as never)
      const h = (e: unknown) => { mu.show((e as { coordinate: unknown }).coordinate) }
      marker.on('contextmenu', h)
    } else if (mode === 'old-c') {
      marker.setMenu({
        custom: true,
        items: customEl(
          () => m.zoomIn(),
          () => m.zoomOut(),
        ),
      } as any)
    } else if (mode === 'new-c') {
      const mu = new mt.ui.Menu({
        custom: true,
        items: customEl(
          () => m.zoomIn(),
          () => m.zoomOut(),
        ),
      } as any)
      mu.addTo(marker as never)
      const h = (e: unknown) => { mu.show((e as { coordinate: unknown }).coordinate) }
      marker.on('contextmenu', h)
    }
  }
}

// —— 旧 API 标准 ——
const el1 = ref<HTMLElement | null>(null)
const { map: map1, isReady } = useMaptalks(el1, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map1, { source: 'osm' })
watch(
  () => toValue(map1),
  (m) => {
    if (m) void setupMarkers(m, 'old-s')
  },
)

// —— 新封装 标准 ——
const el2 = ref<HTMLElement | null>(null)
const { map: map2 } = useMaptalks(el2, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map2, { source: 'osm' })
watch(
  () => toValue(map2),
  (m) => {
    if (m) void setupMarkers(m, 'new-s')
  },
)

// —— 旧 API 自定义 HTML ——
const el3 = ref<HTMLElement | null>(null)
const { map: map3 } = useMaptalks(el3, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map3, { source: 'osm' })
watch(
  () => toValue(map3),
  (m) => {
    if (m) void setupMarkers(m, 'old-c')
  },
)

// —— 新封装 自定义 HTML ——
const el4 = ref<HTMLElement | null>(null)
const { map: map4 } = useMaptalks(el4, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map4, { source: 'osm' })
watch(
  () => toValue(map4),
  (m) => {
    if (m) void setupMarkers(m, 'new-c')
  },
)

const status = computed(() => (isReady.value ? '地图已创建（图形右键菜单可用）' : '加载中…'))
</script>
