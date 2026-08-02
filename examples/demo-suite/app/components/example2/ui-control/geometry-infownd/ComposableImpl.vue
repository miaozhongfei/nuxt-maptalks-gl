<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">字符串内容：useMaptalksGeometryInfoWindow + content HTML string。</p>
      <div class="mt-1 flex gap-1">
        <UButton size="xs" variant="outline" @click="showIW1">显示</UButton>
        <UButton size="xs" variant="outline" @click="hideIW1">隐藏</UButton>
      </div>
    </div>
    <div>
      <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">自定义内容：手建 DOM 计数器（点击 +1）。</p>
      <div class="mt-1 flex gap-1">
        <UButton size="xs" variant="outline" @click="showIW2">显示</UButton>
        <UButton size="xs" variant="outline" @click="hideIW2">隐藏</UButton>
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
      <p class="text-xs text-muted mt-1">响应式内容：手建 DOM 输入框 → 更新 setContent。</p>
      <div class="mt-1 flex gap-1">
        <UInput v-model="newContent4" size="xs" class="flex-1" placeholder="新的 InfoWindow 内容" />
        <UButton size="xs" @click="doUpdate4">更新内容</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const MKR_SYM_1 = { markerType: 'ellipse' as const, markerFill: '#8b5cf6', markerWidth: 20, markerHeight: 20 }
const MKR_SYM_2 = { markerType: 'ellipse' as const, markerFill: '#f59e0b', markerWidth: 20, markerHeight: 20 }
const MKR_SYM_3 = { markerType: 'ellipse' as const, markerFill: '#ef4444', markerWidth: 20, markerHeight: 20 }
const MKR_SYM_4 = { markerType: 'ellipse' as const, markerFill: '#10b981', markerWidth: 20, markerHeight: 20 }

// —— 左上：字符串内容 ——
const el1 = ref<HTMLElement | null>(null)
const { map: map1 } = useMaptalks(el1, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map1, { source: 'osm' })
const vLayer1 = useMaptalksVectorLayer(map1)
const mk1 = useMaptalksMarker(vLayer1.layer, { coordinates: [121.5057, 31.2453], options: { symbol: MKR_SYM_1 } })
const { show: showIW1, hide: hideIW1 } = useMaptalksGeometryInfoWindow(mk1.geometry, {
  options: { title: '字符串内容', content: '<div style="padding:8px">几何体信息框</div>' },
})

// —— 右上：手建 DOM 计数器 ——
const el2 = ref<HTMLElement | null>(null)
const { map: map2 } = useMaptalks(el2, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map2, { source: 'osm' })
const vLayer2 = useMaptalksVectorLayer(map2)
const mk2 = useMaptalksMarker(vLayer2.layer, { coordinates: [121.5057, 31.2453], options: { symbol: MKR_SYM_2 } })
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
const { show: showIW2, hide: hideIW2 } = useMaptalksGeometryInfoWindow(mk2.geometry, {
  options: { title: '自定义内容', custom: true, content: counterEl() ?? undefined },
})

// —— 左下：字符串 + 事件日志 ——
const el3 = ref<HTMLElement | null>(null)
const { map: map3 } = useMaptalks(el3, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map3, { source: 'osm' })
const vLayer3 = useMaptalksVectorLayer(map3)
const mk3 = useMaptalksMarker(vLayer3.layer, { coordinates: [121.5057, 31.2453], options: { symbol: MKR_SYM_3 } })
const events3 = ref<string[]>([])
const { show: showIW3 } = useMaptalksGeometryInfoWindow(mk3.geometry, {
  options: { title: '事件日志', content: '<div style="padding:8px">查看下方事件日志</div>' },
  events: {
    showstart: () => events3.value.unshift(`showstart ${new Date().toLocaleTimeString()}`),
    showend: () => events3.value.unshift(`showend ${new Date().toLocaleTimeString()}`),
    hide: () => events3.value.unshift(`hide ${new Date().toLocaleTimeString()}`),
  },
})

// —— 右下：响应式内容更新 ——
const el4 = ref<HTMLElement | null>(null)
const { map: map4 } = useMaptalks(el4, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map4, { source: 'osm' })
const vLayer4 = useMaptalksVectorLayer(map4)
const mk4 = useMaptalksMarker(vLayer4.layer, { coordinates: [121.5057, 31.2453], options: { symbol: MKR_SYM_4 } })
const content4 = ref('<div style="padding:8px">初始内容</div>')
const { show: showIW4 } = useMaptalksGeometryInfoWindow(mk4.geometry, {
  options: () => ({ title: '更新内容', custom: true, content: content4.value }),
})
const newContent4 = ref('')
function doUpdate4() {
  if (!newContent4.value) return
  // 更新 content4 → options 响应式变化 → composable 的 content watcher → setContent 增量更新
  content4.value = `<div style="padding:8px">${newContent4.value}</div>`
}
</script>
