<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <MaptalksMap ref="mc1" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">旧 API + 简单 DOM：watch → setMenu({ custom: true, items: el })——放大/缩小。</p>
    </div>
    <div>
      <MaptalksMap ref="mc2" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksMenu :options="menuSimple">
          <div class="p-1">
            <UButton size="xs" variant="ghost" block @click="toValue(mc2?.map)?.zoomIn()">放大</UButton>
            <UButton size="xs" variant="ghost" block @click="toValue(mc2?.map)?.zoomOut()">缩小</UButton>
          </div>
        </MaptalksMenu>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">新封装 + slot：&lt;MaptalksMenu slot&gt;——放大/缩小 Vue 组件。</p>
    </div>
    <div>
      <MaptalksMap ref="mc3" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">旧 API + 复杂表单：setMenu({ custom: true })——输入坐标 + 搜索。</p>
    </div>
    <div>
      <MaptalksMap ref="mc4" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksMenu :options="menuCust">
          <div class="p-2" style="min-width:180px">
            <div class="text-xs text-muted mb-1">输入坐标（如 121.5,31.2）：</div>
            <UInput v-model="searchText" size="xs" class="mb-2" placeholder="121.5,31.2" />
            <UButton size="xs" block @click="doSearch4">搜索</UButton>
          </div>
        </MaptalksMenu>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">新封装 + slot：&lt;MaptalksMenu slot&gt; + UInput/UButton 双向绑定。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
function simpleEl(zoomIn: () => void, zoomOut: () => void): HTMLElement {
  const d = document.createElement('div'); d.style.cssText = 'padding:2px;min-width:120px'
  const b1 = document.createElement('button'); b1.textContent = '放大'
  b1.style.cssText = 'display:block;width:100%;padding:4px 12px;border:none;background:none;cursor:pointer;text-align:left;font-size:14px'
  b1.addEventListener('click', zoomIn)
  const b2 = document.createElement('button'); b2.textContent = '缩小'
  b2.style.cssText = 'display:block;width:100%;padding:4px 12px;border:none;background:none;cursor:pointer;text-align:left;font-size:14px'
  b2.addEventListener('click', zoomOut)
  d.append(b1, b2)
  return d
}

function formEl(search: (v: string) => void): HTMLElement {
  const d = document.createElement('div'); d.style.cssText = 'padding:4px;min-width:180px'
  const lbl = document.createElement('div'); lbl.textContent = '输入坐标（如 121.5,31.2）：'; lbl.style.cssText = 'font-size:12px;margin-bottom:4px;color:#666'
  const inp = document.createElement('input'); inp.style.cssText = 'width:100%;padding:3px 6px;border:1px solid #ccc;border-radius:3px;font-size:13px;margin-bottom:4px;box-sizing:border-box'
  const btn = document.createElement('button'); btn.textContent = '搜索'; btn.style.cssText = 'width:100%;padding:3px 0;border:1px solid #2563eb;background:#2563eb;color:#fff;border-radius:3px;font-size:13px;cursor:pointer'
  btn.addEventListener('click', (e) => { e.stopPropagation(); search(inp.value) })
  d.append(lbl, inp, btn)
  return d
}

function flyToCoord(m: any, s: string) {
  const parts = s.split(',').map(Number)
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) m.flyTo({ center: parts, zoom: 16 })
}

const mc1 = ref<MaptalksMapExposed | null>(null)
const mc2 = ref<MaptalksMapExposed | null>(null)
const mc3 = ref<MaptalksMapExposed | null>(null)
const mc4 = ref<MaptalksMapExposed | null>(null)

const menuSimple: MaptalksMenuOptions = { custom: true }
const menuCust: MaptalksMenuOptions = { custom: true }

// —— 旧 API + 简单 DOM ——
watch(() => mc1.value?.map, (m) => { if (m) m.setMenu({ custom: true, items: simpleEl(() => m.zoomIn(), () => m.zoomOut()) }) })

// —— 旧 API + 复杂表单 ——
watch(() => mc3.value?.map, (m) => { if (m) m.setMenu({ custom: true, items: formEl((v) => flyToCoord(m, v)) }) })

// —— Slot 模式的搜索（用 v-model 的双向绑定）——
const searchText = ref('')
function doSearch4() { flyToCoord(toValue(mc4.value?.map), searchText.value) }
</script>
