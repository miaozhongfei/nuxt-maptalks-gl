<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <div
        ref="el1"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">简单 HTML 字符串：new mt.InfoWindow({ content })。</p>
      <UButton size="xs" variant="outline" class="mt-1" @click="toggle1">{{
        show1 ? '隐藏' : '显示'
      }}</UButton>
    </div>
    <div>
      <div
        ref="el2"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">富 HTML：多区块 + 色块 + 列表。</p>
      <UButton size="xs" variant="outline" class="mt-1" @click="toggle2">{{
        show2 ? '隐藏' : '显示'
      }}</UButton>
    </div>
    <div>
      <div
        ref="el3"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">手建 DOM 交互：计数器按钮。</p>
    </div>
    <div>
      <div
        ref="el4"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">
        响应式内容：UInput → getInfoWindow().setContent 实时替换。
      </p>
      <div class="mt-1 flex gap-1">
        <UInput v-model="newContent4" size="xs" class="flex-1" placeholder="新的 InfoWindow 内容" />
        <UButton size="xs" @click="doUpdate4">更新内容</UButton>
      </div>
    </div>
    <p class="text-xs text-muted col-span-2">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// 窄类型：show 参数 unknown（运行时坐标）、setContent 接受 string | HTMLElement
type IWHandle = {
  show: (c: unknown) => void
  hide: () => void
  setContent: (c: string | HTMLElement) => void
}

const RICH_HTML = [
  '<div style="padding:8px;min-width:180px;font-size:13px">',
  '<div style="height:8px;background:linear-gradient(90deg,#2563eb,#10b981);border-radius:4px;margin-bottom:8px"></div>',
  '<div style="font-weight:600;margin-bottom:6px">信息面板</div>',
  '<ul style="margin:0 0 8px 16px;padding:0;color:#374151">',
  '<li>经度：121.5057</li><li>纬度：31.2453</li>',
  '</ul></div>',
].join('')

async function createIW(
  m: MaptalksMap,
  title: string,
  content?: string | HTMLElement,
): Promise<IWHandle | null> {
  const mt = await import('maptalks-gl')
  // 原生构造器在 mt.ui.InfoWindow（非顶层 mt.InfoWindow）——逃生舱断言
  if (!mt.ui?.InfoWindow) return null
  const iw =
    content === undefined
      ? new mt.ui.InfoWindow({ title, custom: true } as any)
      : new mt.ui.InfoWindow({ title, content } as any)
  iw.addTo(m as never)
  return iw as unknown as IWHandle
}

// —— 左上：简单 HTML ——
const el1 = ref<HTMLElement | null>(null)
const { map: map1, isReady } = useMaptalks(el1, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map1, { source: 'osm' })
const show1 = ref(true)
let iw1: IWHandle | null = null
watch(
  () => toValue(map1),
  async (m) => {
    if (!m) return
    iw1 = await createIW(
      m,
      '简单 HTML',
      '<div style="padding:8px;color:#2563eb;font-weight:600">自定义 HTML 字符串内容</div>',
    )
    iw1?.show([121.5057, 31.2453])
  },
  { immediate: true },
)
function toggle1() {
  show1.value = !show1.value
  if (show1.value) iw1?.show([121.5057, 31.2453])
  else iw1?.hide()
}

// —— 右上：富 HTML ——
const el2 = ref<HTMLElement | null>(null)
const { map: map2 } = useMaptalks(el2, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map2, { source: 'osm' })
const show2 = ref(true)
let iw2: IWHandle | null = null
watch(
  () => toValue(map2),
  async (m) => {
    if (!m) return
    iw2 = await createIW(m, '富 HTML', RICH_HTML)
    iw2?.show([121.5057, 31.2453])
  },
  { immediate: true },
)
function toggle2() {
  show2.value = !show2.value
  if (show2.value) iw2?.show([121.5057, 31.2453])
  else iw2?.hide()
}

// —— 左下：手建 DOM 计数器 ——
const el3 = ref<HTMLElement | null>(null)
const { map: map3 } = useMaptalks(el3, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map3, { source: 'osm' })
let count3 = 0
function counterEl(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const d = document.createElement('div')
  d.style.cssText = 'padding:8px;min-width:140px'
  const lbl = document.createElement('div')
  lbl.textContent = '计数器：0'
  lbl.style.cssText = 'font-size:14px;margin-bottom:6px'
  const btn = document.createElement('button')
  btn.textContent = '点击 +1'
  btn.style.cssText = 'padding:2px 10px;border:1px solid #2563eb;background:#2563eb;color:#fff;border-radius:3px;font-size:13px;cursor:pointer'
  btn.addEventListener('click', () => {
    count3++
    lbl.textContent = `计数器：${count3}`
  })
  d.append(lbl, btn)
  return d
}
watch(
  () => toValue(map3),
  async (m) => {
    if (!m) return
    // 手建 DOM content 需 custom:true 构造 + setContent 注入（与 10.4 逃生舱模式一致）
    const mt = await import('maptalks-gl')
    if (!mt.ui?.InfoWindow) return
    const iw = new mt.ui.InfoWindow({ title: '交互 DOM', custom: true } as any)
    iw.addTo(m as never)
    iw.setContent(counterEl() ?? '')
    // 原生 show 参数为 Coordinate——逃生舱断言
    iw.show([121.5057, 31.2453] as never)
  },
  { immediate: true },
)

// —— 右下：响应式内容更新 ——
const el4 = ref<HTMLElement | null>(null)
const { map: map4 } = useMaptalks(el4, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map4, { source: 'osm' })
let iw4: IWHandle | null = null
watch(
  () => toValue(map4),
  async (m) => {
    if (!m) return
    iw4 = await createIW(m, '响应式内容', '<div style="padding:8px">初始内容</div>')
    iw4?.show([121.5057, 31.2453])
  },
  { immediate: true },
)
const newContent4 = ref('')
function doUpdate4() {
  if (!newContent4.value) return
  // 直接调用原生 InfoWindow.setContent 实时替换，弹框保持打开
  iw4?.setContent?.(`<div style="padding:8px">${newContent4.value}</div>`)
}

const status = computed(() => (isReady.value ? '地图已创建（自定义信息窗可用）' : '加载中…'))
</script>
