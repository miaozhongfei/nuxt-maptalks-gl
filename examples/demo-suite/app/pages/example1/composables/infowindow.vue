<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Composable 单独示例 · 信息框</h1>
    <p class="text-muted mb-6">
      演示 <code>useMaptalksInfoWindow</code>（地图级）与 <code>useMaptalksGeometryInfoWindow</code>（标记级）。
    </p>

    <!-- 卡片 1：地图级：点击地图弹出 + 实时内容 + 事件 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksInfoWindow · 地图级 · 点击地图弹框</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.4</UBadge>
        </div>
      </template>
      <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <template #footer>
        <span class="text-sm text-muted">操作：点击地图弹出信息框，内容实时显示坐标+时刻。已点击 {{ clickCount1 }} 次。</span>
        <span class="text-xs text-muted ml-2">{{ status1 }}</span>
      </template>
    </UCard>

    <!-- 卡片 2：地图级：Marker 点击 → 切换共享信息框内容 + show/hide -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksInfoWindow · 地图级 · Marker 联动</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.5</UBadge>
        </div>
      </template>
      <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <template #footer>
        <span class="text-sm text-muted">操作：点蓝/红 Marker 切换信息框内容，点灰 Marker 关闭。当前：{{ mk2Label }}</span>
        <span class="text-xs text-muted ml-2">{{ status2 }}</span>
      </template>
    </UCard>

    <!-- 卡片 3：标记级：useMaptalksGeometryInfoWindow —— 原生 marker.setInfoWindow()，每个 Marker 独立信息框 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksGeometryInfoWindow · 标记级 · 每个 Marker 独立信息框</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.5 / 原生 marker.setInfoWindow()</UBadge>
        </div>
      </template>
      <p class="text-sm text-muted mb-2">
        <code>useMaptalksGeometryInfoWindow(geometry, { title, content, custom })</code> 封装了
        maptalks 原生 <code>marker.setInfoWindow()</code>——<strong>每个 Marker 有自己独立的信息框</strong>，
        点 Marker 弹出、点别处自动关闭。支持 <code>custom:true</code> 完全自绘 UI。
      </p>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <template #footer>
        <div class="flex gap-2 items-center flex-wrap">
          <UButton size="sm" :color="autoClose ? 'success' : 'neutral'" variant="soft" @click="() => { autoClose = !autoClose }">
            点别处自动关闭：{{ autoClose ? '开' : '关' }}
          </UButton>
          <UButton size="sm" color="warning" variant="soft" @click="randomOpen">随机打开一个</UButton>
          <UButton size="sm" color="error" variant="soft" @click="randomClose">随机关闭一个</UButton>
          <span class="text-sm text-muted">当前开启：{{ iw3Label || '—' }}</span>
          <span class="text-xs text-muted ml-2">{{ status3 }}</span>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304]

// ====== 卡片 1：地图级 · 点击地图弹框 ======
const el1 = ref<HTMLElement | null>(null)
const { map: map1, isReady: ready1 } = useMaptalks(el1, { center, zoom: 12 })
useMaptalksTileLayer(map1, { source: 'osm' })

const clickCount1 = ref(0)
const iw1Content = ref('点击地图试试')
const { show: show1 } = useMaptalksInfoWindow(map1, { options: { content: () => iw1Content.value } })

useMaptalksEvents(map1, {
  click: (e: unknown) => {
    const ev = e as { coordinate: { x: number; y: number } }
    const t = new Date().toLocaleTimeString()
    iw1Content.value =
      `<div style="padding:6px 10px;min-width:180px">
        <strong style="color:#2563eb">地图点击信息框</strong>
        <p style="margin:2px 0;font-size:13px">经度：${ev.coordinate.x.toFixed(6)}</p>
        <p style="margin:2px 0;font-size:13px">纬度：${ev.coordinate.y.toFixed(6)}</p>
        <p style="color:#6b7280;font-size:12px;margin:2px 0">时刻：${t}</p>
      </div>`
    clickCount1.value += 1
    // 不调 show1()——maptalks 默认 click 行为自动 show 并带动画
  },
})

// ====== 卡片 2：地图级 · Marker 联动 ======
const el2 = ref<HTMLElement | null>(null)
const { map: map2, isReady: ready2 } = useMaptalks(el2, { center, zoom: 13 })
useMaptalksTileLayer(map2, { source: 'osm' })
const { layer: vec2 } = useMaptalksVectorLayer(map2)
const mk2Label = ref('—')
const mkLike2 = ref(0)
const { infoWindow: iw2, hide: hide2 } = useMaptalksInfoWindow(map2, { options: {} })

// 构建带原生事件监听器的 InfoWindow DOM
function buildIWDom(label: string, color: string, coord: [number, number]): HTMLElement {
  const el = document.createElement('div')
  el.style.minWidth = '160px'
  el.style.borderRadius = '4px'
  el.style.overflow = 'hidden'
  el.style.boxShadow = '0 1px 6px rgba(0,0,0,0.12)'
  el.innerHTML =
    `<div style="background:${color};color:#fff;padding:4px 10px;font-size:13px;font-weight:600">Marker「${label}」</div>
    <div style="background:#fff;padding:5px 10px;font-size:12px;color:#374151">[${coord[0].toFixed(5)}, ${coord[1].toFixed(5)}]</div>
    <div style="padding:4px 8px;display:flex;gap:4px;background:#fff">
      <button class="iw-like-btn" style="background:#e5e7eb;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:13px">👍 ${mkLike2.value}</button>
      <button class="iw-close-btn" style="background:#e5e7eb;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:13px">关闭</button>
    </div>`
  el.querySelector('.iw-like-btn')?.addEventListener('click', () => {
    mkLike2.value++
    const btn = el.querySelector('.iw-like-btn')
    if (btn) btn.textContent = `👍 ${mkLike2.value}`
  })
  el.querySelector('.iw-close-btn')?.addEventListener('click', () => hide2())
  return el
}

function openMK(label: string, coord: [number, number], color: string) {
  mk2Label.value = label
  mkLike2.value = 0
  iw2.value?.setContent(buildIWDom(label, color, coord))
  // 不调 show2()——maptalks 默认 map click 行为自动 show 带动画
}

useMaptalksMarker(vec2, {
  coordinates: [121.47, 31.23],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 22, markerHeight: 22 } },
  events: { click: () => openMK('甲', [121.47, 31.23], '#2563eb') },
})
useMaptalksMarker(vec2, {
  coordinates: [121.5, 31.24],
  options: { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 22, markerHeight: 22 } },
  events: { click: () => openMK('乙', [121.5, 31.24], '#dc2626') },
})
useMaptalksMarker(vec2, {
  coordinates: [121.51, 31.22],
  options: { symbol: { markerType: 'ellipse', markerFill: '#6b7280', markerWidth: 22, markerHeight: 22 } },
  events: { click: () => { mk2Label.value = '—'; hide2() } },
})

// ====== 卡片 3：标记级 · useMaptalksGeometryInfoWindow（原生 marker.setInfoWindow） ======
const el3 = ref<HTMLElement | null>(null)
const { map: map3, isReady: ready3 } = useMaptalks(el3, { center, zoom: 13 })
useMaptalksTileLayer(map3, { source: 'osm' })
const { layer: vec3 } = useMaptalksVectorLayer(map3)
const iw3Label = ref('')

// Marker 点击后 250ms 内无视 map click（防止 open→close 同帧冲突）
let mkOpenTime = 0
let curOpen: typeof miwA | null = null

function mkContent(title: string, color: string, coord: [number, number]): string {
  return `<div style="min-width:160px;border-radius:4px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.12)">
    <div style="background:${color};color:#fff;padding:4px 10px;font-size:13px;font-weight:600;display:flex;justify-content:space-between;align-items:center">
      <span>${title}</span>
      <span class="mt-mk-iw-close" style="cursor:pointer;font-size:16px;line-height:1">×</span>
    </div>
    <div style="background:#fff;padding:5px 10px;font-size:12px;color:#374151">[${coord[0].toFixed(5)}, ${coord[1].toFixed(5)}]</div>
  </div>`
}

function bindCloseBtn(miw: typeof miwA) {
  setTimeout(() => {
    const btn = document.querySelector('.mt-mk-iw-close') as HTMLElement | null
    if (btn) btn.addEventListener('click', () => { miw.hide(); iw3Label.value = ''; curOpen = null }, { once: true })
  }, 50)
}

// 开关：点击地图空白处自动关闭信息框
const autoClose = ref(true)

// 点地图空白处关闭当前信息框（Marker 点击后 250ms 内屏蔽，防同帧冲突）
useMaptalksEvents(map3, {
  click: () => {
    if (!autoClose.value || Date.now() - mkOpenTime < 250) return
    curOpen?.hide()
    iw3Label.value = ''
    curOpen = null
  },
})

const gA = useMaptalksMarker(vec3, {
  coordinates: [121.47, 31.23],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 24, markerHeight: 24 } },
}).geometry
const miwA = useMaptalksGeometryInfoWindow(gA, { options: { title: '', custom: true, content: mkContent('东门店 A', '#2563eb', [121.47, 31.23]) } })
useMaptalksEvents(gA as unknown as Parameters<typeof useMaptalksEvents>[0], {
  click: () => { curOpen = miwA; mkOpenTime = Date.now(); iw3Label.value = '东门店 A'; bindCloseBtn(miwA) },
})

const gB = useMaptalksMarker(vec3, {
  coordinates: [121.5, 31.24],
  options: { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 24, markerHeight: 24 } },
}).geometry
const miwB = useMaptalksGeometryInfoWindow(gB, { options: { title: '', custom: true, content: mkContent('西门店 B', '#dc2626', [121.5, 31.24]) } })
useMaptalksEvents(gB as unknown as Parameters<typeof useMaptalksEvents>[0], {
  click: () => { curOpen = miwB; mkOpenTime = Date.now(); iw3Label.value = '西门店 B'; bindCloseBtn(miwB) },
})

const gC = useMaptalksMarker(vec3, {
  coordinates: [121.52, 31.22],
  options: { symbol: { markerType: 'ellipse', markerFill: '#16a34a', markerWidth: 24, markerHeight: 24 } },
}).geometry
const miwC = useMaptalksGeometryInfoWindow(gC, { options: { title: '', custom: true, content: mkContent('南门店 C', '#16a34a', [121.52, 31.22]) } })
useMaptalksEvents(gC as unknown as Parameters<typeof useMaptalksEvents>[0], {
  click: () => { curOpen = miwC; mkOpenTime = Date.now(); iw3Label.value = '南门店 C'; bindCloseBtn(miwC) },
})
// 记录随机打开的那个，供关闭按钮关闭同一个
let curOpenIW: typeof miwA | undefined | null = null

function randomOpen() {
  mkOpenTime = Date.now()
  const all = [miwA, miwB, miwC]
  const pick = all[Math.floor(Math.random() * 3)]
  curOpenIW = pick
  pick?.show()
  if (pick === miwA) iw3Label.value = '东门店 A'
  else if (pick === miwB) iw3Label.value = '西门店 B'
  else iw3Label.value = '南门店 C'
}
function randomClose() {
  curOpenIW?.hide()
  iw3Label.value = ''
}

const status1 = computed(() => (ready1.value ? '地图已创建（点击弹框）' : '加载中…'))
const status2 = computed(() => (ready2.value ? '地图已创建（Marker 联动）' : '加载中…'))
const status3 = computed(() => (ready3.value ? '地图已创建（独立信息框）' : '加载中…'))
</script>
