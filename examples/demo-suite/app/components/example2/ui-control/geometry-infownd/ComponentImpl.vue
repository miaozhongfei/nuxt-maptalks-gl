<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <MaptalksMap ref="mc1" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksVectorLayer>
          <MaptalksMarker :coordinates="[121.5057, 31.2453]" :options="{ symbol: MKR_SYM_1 }">
            <MaptalksGeometryInfoWindow ref="miw1" :options="opts1" />
          </MaptalksMarker>
        </MaptalksVectorLayer>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">字符串内容：MaptalksGeometryInfoWindow + content HTML string。</p>
      <div class="mt-1 flex gap-1">
        <UButton size="xs" variant="outline" @click="miw1?.show()">显示</UButton>
        <UButton size="xs" variant="outline" @click="miw1?.hide()">隐藏</UButton>
      </div>
    </div>
    <div>
      <MaptalksMap ref="mc2" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksVectorLayer>
          <MaptalksMarker :coordinates="[121.5057, 31.2453]" :options="{ symbol: MKR_SYM_2 }">
            <MaptalksGeometryInfoWindow ref="miw2" :options="opts2">
              <div class="p-2 min-w-35">
                <div class="text-sm mb-1">计数器：<b>{{ count }}</b></div>
                <UButton size="xs" color="primary" @click="count++">点击 +1</UButton>
              </div>
            </MaptalksGeometryInfoWindow>
          </MaptalksMarker>
        </MaptalksVectorLayer>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">Slot 内容：custom:true + Vue slot——计数器验证响应式穿透。</p>
      <div class="mt-1 flex gap-1">
        <UButton size="xs" variant="outline" @click="miw2?.show()">显示</UButton>
        <UButton size="xs" variant="outline" @click="miw2?.hide()">隐藏</UButton>
      </div>
    </div>
    <div>
      <MaptalksMap ref="mc3" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksVectorLayer>
          <MaptalksMarker :coordinates="[121.5057, 31.2453]" :options="{ symbol: MKR_SYM_3 }">
            <MaptalksGeometryInfoWindow ref="miw3" :options="opts3" :events="events3Map" />
          </MaptalksMarker>
        </MaptalksVectorLayer>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">字符串内容 + 事件日志（show/hide）。</p>
      <div class="mt-1 text-[11px] text-muted space-y-0.5 max-h-12 overflow-y-auto">
        <div v-for="(e, i) in events3" :key="i">{{ e }}</div>
      </div>
    </div>
    <div>
      <MaptalksMap ref="mc4" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksVectorLayer>
          <MaptalksMarker :coordinates="[121.5057, 31.2453]" :options="{ symbol: MKR_SYM_4 }">
            <MaptalksGeometryInfoWindow ref="miw4" :options="opts4" />
          </MaptalksMarker>
        </MaptalksVectorLayer>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">响应式内容：UInput → 更新 opts.content → setContent 实时替换。</p>
      <div class="mt-1 flex gap-1">
        <UInput v-model="newContent" size="xs" class="flex-1" placeholder="新的 InfoWindow 内容" />
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

const opts1: MaptalksInfoWindowOptions = { title: '字符串内容', content: '<div style="padding:8px">几何体信息框</div>' }
const opts2: MaptalksInfoWindowOptions = { title: 'Slot 内容', custom: true }
const opts3: MaptalksInfoWindowOptions = { title: '事件日志', content: '<div style="padding:8px">查看下方事件日志</div>' }
const opts4 = ref<MaptalksInfoWindowOptions>({ title: '更新内容', custom: true, content: '<div style="padding:8px">初始内容</div>' })

const miw1 = ref<MaptalksGeometryInfoWindowExposed | null>(null)
const miw2 = ref<MaptalksGeometryInfoWindowExposed | null>(null)
const miw3 = ref<MaptalksGeometryInfoWindowExposed | null>(null)
const miw4 = ref<MaptalksGeometryInfoWindowExposed | null>(null)

const count = ref(0)
const newContent = ref('')
const events3 = ref<string[]>([])

function onShowstart3() { events3.value.unshift(`showstart ${new Date().toLocaleTimeString()}`) }
function onShowend3() { events3.value.unshift(`showend ${new Date().toLocaleTimeString()}`) }
function onHide3() { events3.value.unshift(`hide ${new Date().toLocaleTimeString()}`) }
const events3Map: Record<string, MaptalksEventHandler> = {
  showstart: onShowstart3,
  showend: onShowend3,
  hide: onHide3,
}

function doUpdate4() {
  if (!newContent.value) return
  // 更新 opts.content → useMaptalksGeometryInfoWindow 的 content watcher → setContent 增量更新
  opts4.value = { ...opts4.value, content: `<div style="padding:8px">${newContent.value}</div>` }
}
</script>
