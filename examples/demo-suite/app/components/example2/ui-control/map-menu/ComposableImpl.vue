<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <div
        ref="el1"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">旧 API：watch → map.setMenu({ items })——标准模式。</p>
    </div>
    <div>
      <div
        ref="el2"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">新封装：useMaptalksMenu composable——标准模式。</p>
    </div>
    <div>
      <div
        ref="el3"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">
        旧 API：watch → map.setMenu({ custom: true })——自定义 HTML。
      </p>
    </div>
    <div>
      <div
        ref="el4"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">新封装：useMaptalksMenu composable——自定义 HTML。</p>
    </div>
    <p class="text-xs text-muted col-span-2">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
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

// —— 旧 API 标准 ——
const el1 = ref<HTMLElement | null>(null)
const { map: map1, isReady } = useMaptalks(el1, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map1, { source: 'osm' })
watch(
  () => toValue(map1),
  (m) => {
    if (!m) return
    m.setMenu({
      width: 160,
      items: [
        { item: '放大', click: () => m.zoomIn() },
        { item: '缩小', click: () => m.zoomOut() },
      ],
    })
  },
)

// —— 新封装 标准 ——
const el2 = ref<HTMLElement | null>(null)
const { map: map2 } = useMaptalks(el2, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map2, { source: 'osm' })
useMaptalksMenu(map2, {
  options: {
    width: 160,
    items: [
      { item: '放大', click: () => toValue(map2)?.zoomIn() },
      { item: '缩小', click: () => toValue(map2)?.zoomOut() },
    ],
  },
})

// —— 旧 API 自定义 HTML ——
const el3 = ref<HTMLElement | null>(null)
const { map: map3 } = useMaptalks(el3, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map3, { source: 'osm' })
watch(
  () => toValue(map3),
  (m) => {
    if (!m) return
    // custom 模式 items 为 HTMLElement（建模 items 为条目数组）——逃生舱断言
    m.setMenu({
      custom: true,
      items: customEl(
        () => m.zoomIn(),
        () => m.zoomOut(),
      ) as any,
    })
  },
)

// —— 新封装 自定义 HTML ——
const el4 = ref<HTMLElement | null>(null)
const { map: map4 } = useMaptalks(el4, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map4, { source: 'osm' })
useMaptalksMenu(map4, {
  options: {
    custom: true,
    items: customEl(
      () => toValue(map4)?.zoomIn(),
      () => toValue(map4)?.zoomOut(),
    ) as any,
  },
})

const status = computed(() => (isReady.value ? '地图已创建（右键菜单可用）' : '加载中…'))
</script>
