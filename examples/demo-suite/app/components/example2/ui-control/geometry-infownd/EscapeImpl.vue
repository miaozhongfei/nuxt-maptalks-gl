<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">字符串内容：marker.setInfoWindow({ content })。</p>
      <div class="mt-1 flex gap-1">
        <UButton size="xs" variant="outline" @click="m1?.openInfoWindow()">显示</UButton>
        <UButton size="xs" variant="outline" @click="m1?.closeInfoWindow()">隐藏</UButton>
      </div>
    </div>
    <div>
      <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">自定义内容：setInfoWindow({ custom:true }) + 手建 DOM 计数器。</p>
      <div class="mt-1 flex gap-1">
        <UButton size="xs" variant="outline" @click="m2?.openInfoWindow()">显示</UButton>
        <UButton size="xs" variant="outline" @click="m2?.closeInfoWindow()">隐藏</UButton>
      </div>
    </div>
    <div>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">字符串内容 + 事件日志（show/hide）。</p>
      <div class="mt-1 text-[11px] text-muted space-y-0.5 max-h-12 overflow-y-auto">
        <div v-for="(e, i) in events3" :key="i">{{ e }}</div>
      </div>
    </div>
    <div>
      <div ref="el4" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">响应式内容：输入框 → getInfoWindow().setContent 实时替换。</p>
      <div class="mt-1 flex gap-1">
        <UInput v-model="newContent4" size="xs" class="flex-1" placeholder="新的 InfoWindow 内容" />
        <UButton size="xs" @click="doUpdate4">更新内容</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type MarkerWithIW = {
  openInfoWindow: () => void
  closeInfoWindow: () => void
  getInfoWindow?: () => { setContent?: (c: string) => void } | null
}

async function makeMarker(m: MaptalksMap, color: string, title: string, content?: unknown): Promise<MarkerWithIW> {
  const mt = await import('maptalks-gl')
  const layer = new mt.VectorLayer('v').addTo(m as any)
  const marker = new mt.Marker([121.5057, 31.2453], { symbol: { markerType: 'ellipse', markerFill: color, markerWidth: 20, markerHeight: 20 } })
  marker.setInfoWindow(content === undefined ? { title } : { title, custom: true })
  marker.addTo(layer)
  if (content !== undefined) (marker as any).getInfoWindow().setContent(content)
  return marker as unknown as MarkerWithIW
}

// —— 左上：字符串内容 ——
const el1 = ref<HTMLElement | null>(null)
const { map: map1 } = useMaptalks(el1, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map1, { source: 'osm' })
let m1: MarkerWithIW | null = null
watch(() => toValue(map1), async (m) => {
  if (!m) return
  m1 = await makeMarker(m, '#8b5cf6', '字符串内容', '<div style="padding:8px">几何体信息框</div>')
}, { immediate: true })

// —— 右上：手建 DOM 计数器 ——
const el2 = ref<HTMLElement | null>(null)
const { map: map2 } = useMaptalks(el2, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map2, { source: 'osm' })
let m2: MarkerWithIW | null = null
let count2 = 0
function counterEl(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const d = document.createElement('div'); d.style.cssText = 'padding:8px;min-width:140px'
  const lbl = document.createElement('div'); lbl.textContent = '计数器：0'; lbl.style.cssText = 'font-size:14px;margin-bottom:6px'
  const btn = document.createElement('button'); btn.textContent = '点击 +1'
  btn.style.cssText = 'padding:2px 10px;border:1px solid #2563eb;background:#2563eb;color:#fff;border-radius:3px;font-size:13px;cursor:pointer'
  btn.addEventListener('click', () => { count2++; lbl.textContent = `计数器：${count2}` })
  d.append(lbl, btn)
  return d
}
watch(() => toValue(map2), async (m) => {
  if (!m) return
  m2 = await makeMarker(m, '#f59e0b', '自定义内容', counterEl() ?? undefined)
}, { immediate: true })

// —— 左下：字符串 + 事件日志 ——
const el3 = ref<HTMLElement | null>(null)
const { map: map3 } = useMaptalks(el3, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map3, { source: 'osm' })
const events3 = ref<string[]>([])
watch(() => toValue(map3), async (m) => {
  if (!m) return
  const mk = await makeMarker(m, '#ef4444', '事件日志', '<div style="padding:8px">查看下方事件日志</div>')
  const iw = (mk as any).getInfoWindow()
  iw.on('showstart', () => events3.value.unshift(`showstart ${new Date().toLocaleTimeString()}`))
  iw.on('showend', () => events3.value.unshift(`showend ${new Date().toLocaleTimeString()}`))
  iw.on('hide', () => events3.value.unshift(`hide ${new Date().toLocaleTimeString()}`))
}, { immediate: true })

// —— 右下：响应式内容更新 ——
const el4 = ref<HTMLElement | null>(null)
const { map: map4 } = useMaptalks(el4, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map4, { source: 'osm' })
let m4: MarkerWithIW | null = null
watch(() => toValue(map4), async (m) => {
  if (!m) return
  m4 = await makeMarker(m, '#10b981', '更新内容', '<div style="padding:8px">初始内容</div>')
}, { immediate: true })
const newContent4 = ref('')
function doUpdate4() {
  if (!newContent4.value) return
  // 直接调用原生 getInfoWindow().setContent 实时替换内容
  m4?.getInfoWindow?.()?.setContent?.(`<div style="padding:8px">${newContent4.value}</div>`)
}
</script>
