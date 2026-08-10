<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <!-- 四状态实时回流：拖动/缩放地图，数字跟着变 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
      <div class="rounded border border-default p-2">中心<br>{{ (cam.center.value?.x ?? 0).toFixed(4) }}, {{ (cam.center.value?.y ?? 0).toFixed(4) }}</div>
      <div class="rounded border border-default p-2">缩放<br>{{ (cam.zoom.value ?? 0).toFixed(2) }}</div>
      <div class="rounded border border-default p-2">俯仰<br>{{ (cam.pitch.value ?? 0).toFixed(1) }}°</div>
      <div class="rounded border border-default p-2">旋转<br>{{ (cam.bearing.value ?? 0).toFixed(1) }}°</div>
    </div>
    <div class="mt-3">
      <UButton size="sm" @click="read">原生 API 读取完整状态</UButton>
      <pre v-if="stateText" class="text-xs mt-2 p-3 rounded border border-default overflow-auto">{{ stateText }}</pre>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })
// 相机实时回流四状态
const cam = useMaptalksCamera(map)

const stateText = ref('')
// 逃生舱：getCenter/getZoom/getPitch/getBearing/getSize 原生读取（均已建模）
function read() {
  const m = toValue(map)
  if (!m) return
  const c = m.getCenter()
  stateText.value = JSON.stringify(
    {
      center: [Number(c.x.toFixed(5)), Number(c.y.toFixed(5))],
      zoom: m.getZoom(),
      pitch: m.getPitch(),
      bearing: m.getBearing(),
      size: m.getSize(),
    },
    null,
    2,
  )
}

const status = computed(() => (isReady.value ? '地图已创建（四状态实时回流）' : '加载中…'))
</script>
