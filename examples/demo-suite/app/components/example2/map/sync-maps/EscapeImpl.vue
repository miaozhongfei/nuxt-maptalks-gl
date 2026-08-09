<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <div
        ref="elA"
        class="relative rounded border border-default overflow-hidden"
        style="height: 420px"
      />
      <div
        ref="elB"
        class="relative rounded border border-default overflow-hidden"
        style="height: 420px"
      />
    </div>
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton size="sm" @click="enableSync">开启同步</UButton>
      <UButton size="sm" color="neutral" @click="disableSync">关闭同步</UButton>
      <UBadge :color="syncEnabled ? 'success' : 'neutral'" variant="subtle">
        {{ syncEnabled ? '同步中' : '未同步' }}
      </UBadge>
    </div>
    <div class="flex items-center gap-3 mt-2 flex-wrap">
      <div class="flex items-center gap-2">
        <span class="text-sm">双向</span>
        <USwitch v-model="isDualMode" />
        <span class="text-sm">单向（主→从）</span>
      </div>
      <div class="flex items-center gap-2">
        <UButton size="sm" color="neutral" variant="outline" @click="lockSlave">{{ slaveLocked ? '解锁从图交互' : '禁用从图交互' }}</UButton>
      </div>
    </div>
    <p class="text-sm text-muted mt-2">原生事件镜像，单向模式下仅主图（左）驱动从图（右）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import type { MaptalksMap as MtMap } from '@lacqjs/nuxt-maptalks-gl'

const elA = ref<HTMLElement | null>(null)
const elB = ref<HTMLElement | null>(null)
const { map: mapA, isReady } = useMaptalks(elA, { center: [121.5057, 31.2453], zoom: 13 })
const { map: mapB } = useMaptalks(elB, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(mapA, { source: 'osm' })
useMaptalksTileLayer(mapB, { source: 'osm' })

const syncEnabled = ref(true)
const isDualMode = ref(true)
function enableSync() { syncEnabled.value = true }
function disableSync() { syncEnabled.value = false }

let lock = false
function bind(src: MtMap, dst: MtMap) {
  src.on('moving moveend zooming zoomend rotate pitch', () => {
    // 单向模式下跳过从图→主图的同步（即 src 为从图时不做任何事）
    if (!isDualMode.value && src !== toValue(mapA)) return
    if (lock || !syncEnabled.value) return
    lock = true
    dst.setCenter(src.getCenter())
    dst.setZoom(src.getZoom(), { animation: false })
    dst.setPitch(src.getPitch())
    dst.setBearing(src.getBearing())
    lock = false
  })
}
// 两张地图都就绪后双向绑定，单向模式通过 handler 内 isDualMode 判断过滤从→主
watch(
  [() => toValue(mapA), () => toValue(mapB)],
  ([a, b]) => {
    if (!a || !b) return
    bind(a, b)
    bind(b, a)
  },
)

// 从图交互开关（config 已建模）
const slaveLocked = ref(false)
function lockSlave() {
  slaveLocked.value = !slaveLocked.value
  mapB.value?.config({ draggable: !slaveLocked.value, scrollWheelZoom: !slaveLocked.value })
}

const status = computed(() => (isReady.value ? '地图已创建（原生事件镜像同步）' : '加载中…'))
</script>
