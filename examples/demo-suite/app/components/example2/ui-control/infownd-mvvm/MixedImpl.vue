<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 400px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksInfoWindow——手建 DOM 手动绑定 MVVM（对应官网 10.10）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// MVVM 模型（手动绑定）：ref 变化 → 手动更新弹框内 DOM
const name = ref('Hello Maptalks')
const count = ref(1)
const btns = ref([1, 2, 3, 4, 5])

const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

function buildMvvmEl(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const d = document.createElement('div')
  d.style.cssText = 'padding:10px;min-width:180px;font-size:14px'
  const h2 = document.createElement('h2')
  h2.textContent = name.value
  h2.style.cssText = 'margin:0 0 6px;font-size:16px'
  const inp = document.createElement('input')
  inp.value = name.value
  inp.style.cssText = 'width:100%;padding:3px 6px;border:1px solid #ccc;border-radius:3px;font-size:13px;margin-bottom:8px;box-sizing:border-box'
  inp.addEventListener('input', () => {
    name.value = inp.value
    h2.textContent = name.value
  })
  const cnt = document.createElement('div')
  cnt.style.cssText = 'margin-bottom:6px'
  const cntText = document.createElement('span')
  cntText.textContent = `count：${count.value}`
  const btn = document.createElement('button')
  btn.textContent = 'count++'
  btn.style.cssText = 'padding:2px 10px;border:1px solid #2563eb;background:#2563eb;color:#fff;border-radius:3px;font-size:13px;cursor:pointer;margin-left:6px'
  btn.addEventListener('click', () => {
    count.value++
    cntText.textContent = `count：${count.value}`
  })
  cnt.append(cntText, btn)
  const row = document.createElement('div')
  row.style.cssText = 'display:flex;gap:4px'
  btns.value.forEach((b) => {
    const bEl = document.createElement('button')
    bEl.textContent = String(b)
    bEl.style.cssText = 'padding:1px 6px;border:1px solid #2563eb;border-radius:3px;font-size:12px;background:#fff;cursor:pointer'
    row.append(bEl)
  })
  d.append(h2, inp, cnt, row)
  return d
}

const { show } = useMaptalksInfoWindow(map, {
  options: { title: 'MVVM 绑定', custom: true, content: buildMvvmEl() ?? undefined },
})
onMounted(() => { show([121.5057, 31.2453]) })

const status = computed(() => (map.value ? '地图已创建（MVVM 绑定可用）' : '加载中…'))
</script>
