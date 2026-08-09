<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <div
        ref="el1"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">
        旧 API + 简单 DOM：setMenu({ custom: true, items: el })——放大/缩小按钮。
      </p>
    </div>
    <div>
      <div
        ref="el2"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">
        新封装 + 简单 DOM：new mt.ui.Menu({ custom: true })——放大/缩小按钮。
      </p>
    </div>
    <div>
      <div
        ref="el3"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">
        旧 API + 复杂表单：setMenu({ custom: true })——输入坐标 + 搜索按钮。
      </p>
    </div>
    <div>
      <div
        ref="el4"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">
        新封装 + 复杂表单：new mt.ui.Menu({ custom: true })——输入坐标 + 搜索按钮。
      </p>
    </div>
    <p class="text-xs text-muted col-span-2">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
function simpleEl(zoomIn: () => void, zoomOut: () => void): HTMLElement | null {
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

function formEl(search: (v: string) => void): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const d = document.createElement('div')
  d.style.cssText = 'padding:4px;min-width:180px'
  const lbl = document.createElement('div')
  lbl.textContent = '输入坐标（如 121.5,31.2）：'
  lbl.style.cssText = 'font-size:12px;margin-bottom:4px;color:#666'
  const inp = document.createElement('input')
  inp.style.cssText =
    'width:100%;padding:3px 6px;border:1px solid #ccc;border-radius:3px;font-size:13px;margin-bottom:4px;box-sizing:border-box'
  const btn = document.createElement('button')
  btn.textContent = '搜索'
  btn.style.cssText =
    'width:100%;padding:3px 0;border:1px solid #2563eb;background:#2563eb;color:#fff;border-radius:3px;font-size:13px;cursor:pointer'
  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    search(inp.value)
  })
  d.append(lbl, inp, btn)
  return d
}

function parseCoordAndFly(m: MaptalksMap | null | undefined, s: string) {
  const parts = s.split(',').map(Number)
  if (parts.length === 2 && !isNaN(parts[0] as number) && !isNaN(parts[1] as number)) {
    m?.flyTo({ center: parts as [number, number], zoom: 16 })
  }
}

// —— 旧 API + 简单 DOM ——
const el1 = ref<HTMLElement | null>(null)
const { map: map1, isReady } = useMaptalks(el1, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map1, { source: 'osm' })
watch(
  () => toValue(map1),
  (m) => {
    if (m)
      // custom 模式 items 为 HTMLElement（建模 items 为条目数组）——逃生舱断言
      m.setMenu({
        custom: true,
        items: simpleEl(
          () => m.zoomIn(),
          () => m.zoomOut(),
        ),
      } as any)
  },
)

// —— 新封装 + 简单 DOM ——
const el2 = ref<HTMLElement | null>(null)
const { map: map2 } = useMaptalks(el2, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map2, { source: 'osm' })
watch(
  () => toValue(map2),
  async (m) => {
    if (!m) return
    const mt = await import('maptalks-gl')
    if (!mt.ui?.Menu) return
    // 原生 ui.Menu 构造/ addTo / show 类型与窄签名不兼容——逃生舱断言
    const mu = new mt.ui.Menu({
      custom: true,
      items: simpleEl(
        () => m.zoomIn(),
        () => m.zoomOut(),
      ),
    } as any)
    mu.addTo(m as never)
    m.on('contextmenu', (e: unknown) => mu.show((e as { coordinate: unknown }).coordinate as never))
  },
)

// —— 旧 API + 复杂表单 ——
const el3 = ref<HTMLElement | null>(null)
const { map: map3 } = useMaptalks(el3, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map3, { source: 'osm' })
watch(
  () => toValue(map3),
  (m) => {
    if (m) m.setMenu({ custom: true, items: formEl((v) => parseCoordAndFly(m, v)) as any })
  },
)

// —— 新封装 + 复杂表单 ——
const el4 = ref<HTMLElement | null>(null)
const { map: map4 } = useMaptalks(el4, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map4, { source: 'osm' })
watch(
  () => toValue(map4),
  async (m) => {
    if (!m) return
    const mt = await import('maptalks-gl')
    if (!mt.ui?.Menu) return
    // 原生 ui.Menu 构造/ addTo / show 类型与窄签名不兼容——逃生舱断言
    const mu = new mt.ui.Menu({
      custom: true,
      items: formEl((v) => parseCoordAndFly(m, v)),
    } as any)
    mu.addTo(m as never)
    m.on('contextmenu', (e: unknown) => mu.show((e as { coordinate: unknown }).coordinate as never))
  },
)

const status = computed(() => (isReady.value ? '地图已创建（自定义右键菜单可用）' : '加载中…'))
</script>
