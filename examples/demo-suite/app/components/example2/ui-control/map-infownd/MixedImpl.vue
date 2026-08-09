<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <MaptalksMap
        ref="mc1"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">字符串内容：MaptalksMap ref + useMaptalksInfoWindow。</p>
      <UButton size="xs" variant="outline" class="mt-1" @click="toggle1">{{
        show1 ? '隐藏' : '显示'
      }}</UButton>
    </div>
    <div>
      <MaptalksMap
        ref="mc2"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">自定义内容：useMaptalksInfoWindow + 手建 DOM 计数器。</p>
      <UButton size="xs" variant="outline" class="mt-1" @click="toggle2">{{
        show2 ? '隐藏' : '显示'
      }}</UButton>
    </div>
    <div>
      <MaptalksMap
        ref="mc3"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">字符串内容 + 事件日志。</p>
      <div class="mt-1 text-[11px] text-muted space-y-0.5 max-h-12 overflow-y-auto">
        <div v-for="(e, i) in events3" :key="i">{{ e }}</div>
      </div>
    </div>
    <div>
      <MaptalksMap
        ref="mc4"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">自定义内容：手建 DOM 输入框 + 飞行。</p>
      <div class="mt-1 text-[11px] text-muted space-y-0.5 max-h-12 overflow-y-auto">
        <div v-for="(e, i) in events4" :key="i">{{ e }}</div>
      </div>
    </div>
    <p class="text-xs text-muted col-span-2">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const show1 = ref(true)
const show2 = ref(true)

// —— 左上：字符串内容 ——
const mc1 = ref<MaptalksMapExposed | null>(null)
const map1 = computed(() => toValue(mc1.value?.map) ?? null)
const { show: showIW1, hide: hideIW1 } = useMaptalksInfoWindow(map1, {
  options: { title: '字符串内容', content: '<div style="padding:8px">字符串 InfoWindow</div>' },
})
onMounted(() => {
  showIW1([121.5057, 31.2453])
})
function toggle1() {
  show1.value = !show1.value
  if (show1.value) showIW1([121.5057, 31.2453])
  else hideIW1()
}

// —— 右上：手建 DOM 计数器 ——
const mc2 = ref<MaptalksMapExposed | null>(null)
const map2 = computed(() => toValue(mc2.value?.map) ?? null)
let count2 = 0
function counterEl(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const d = document.createElement('div')
  d.style.cssText = 'padding:8px;min-width:140px'
  const lbl = document.createElement('div')
  lbl.textContent = '计数器：0'
  lbl.style.cssText = 'font-size:14px;margin-bottom:6px'
  const btn = document.createElement('button')
  btn.textContent = '点击 +1'
  btn.style.cssText =
    'padding:2px 10px;border:1px solid #2563eb;background:#2563eb;color:#fff;border-radius:3px;font-size:13px;cursor:pointer'
  btn.addEventListener('click', () => {
    count2++
    lbl.textContent = `计数器：${count2}`
  })
  d.append(lbl, btn)
  return d
}
const { show: showIW2, hide: hideIW2 } = useMaptalksInfoWindow(map2, {
  options: { title: '自定义内容', custom: true, content: counterEl() ?? undefined },
})
onMounted(() => {
  showIW2([121.5057, 31.2453])
})
function toggle2() {
  show2.value = !show2.value
  if (show2.value) showIW2([121.5057, 31.2453])
  else hideIW2()
}

// —— 左下：字符串 + 事件日志 ——
const mc3 = ref<MaptalksMapExposed | null>(null)
const map3 = computed(() => toValue(mc3.value?.map) ?? null)
const events3 = ref<string[]>([])
const { show: showIW3 } = useMaptalksInfoWindow(map3, {
  options: { title: '事件日志', content: '<div style="padding:8px">查看下方事件日志</div>' },
  events: {
    showstart: () => events3.value.unshift(`showstart ${new Date().toLocaleTimeString()}`),
    showend: () => events3.value.unshift(`showend ${new Date().toLocaleTimeString()}`),
  },
})
onMounted(() => {
  showIW3([121.5057, 31.2453])
})

// —— 右下：手建 DOM 输入框 + 飞行 ——
const mc4 = ref<MaptalksMapExposed | null>(null)
const map4 = computed(() => toValue(mc4.value?.map) ?? null)
const events4 = ref<string[]>([])
function formEl(getMap: () => MaptalksMap | null): HTMLElement | null {
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
  btn.textContent = '飞行'
  btn.style.cssText =
    'width:100%;padding:3px 0;border:1px solid #2563eb;background:#2563eb;color:#fff;border-radius:3px;font-size:13px;cursor:pointer'
  btn.addEventListener('click', () => {
    const parts = inp.value.split(',').map(Number) as [number, number]
    const m = getMap()
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && m) {
      m.flyTo({ center: parts, zoom: 16 })
      events4.value.unshift(`flyTo ${parts.join(',')} ${new Date().toLocaleTimeString()}`)
    }
  })
  d.append(lbl, inp, btn)
  return d
}
const { show: showIW4 } = useMaptalksInfoWindow(map4, {
  options: { title: '坐标飞行', custom: true, content: formEl(() => toValue(map4)) ?? undefined },
})
onMounted(() => {
  showIW4([121.5057, 31.2453])
})

const status = computed(() => (map1.value ? '地图已创建（信息窗可用）' : '加载中…'))
</script>
