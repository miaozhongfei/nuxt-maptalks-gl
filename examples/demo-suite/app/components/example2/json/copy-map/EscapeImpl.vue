<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <div ref="elA" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <div ref="elB" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
    </div>
    <UButton size="sm" class="mt-3" @click="copyMap">复制地图 A - B</UButton>
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：A 原生构造 Marker，map.toJSON() 后 Map.fromJSON 静态复制到空容器 B（对应官网 11.5）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const elA = ref<HTMLElement | null>(null)
const elB = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(elA, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

let mapIns: any = null
let mapB: any = null

watch(
  () => toValue(map),
  (m) => {
    mapIns = m
    if (m) void init(m)
  },
  { immediate: true },
)

/** 地图就绪后：VectorLayer + Marker（官网原生构造） */
async function init(m: unknown): Promise<void> {
  const mt = await import('maptalks-gl')
  if (!mt.VectorLayer || !mt.Marker) return
  // 原生 VectorLayer.addTo 参数为原生 Map，与模块建模不兼容——逃生舱断言
  const layer = new mt.VectorLayer('v').addTo(m as never)
  const marker = new mt.Marker([121.5057, 31.2453], {
    symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 },
  })
  marker.addTo(layer)
}

function copyMap(): void {
  if (!mapIns || !elB.value) return
  void (async () => {
    const mt = await import('maptalks-gl')
    if (!mt.Map?.fromJSON) return
    const json = mapIns.toJSON()
    // 重复复制：销毁 B 容器上上次复制的地图实例，再静态重建（支持多次复制）
    if (mapB) mapB.remove()
    mapB = (mt as any).Map.fromJSON(elB.value, json)
  })()
}

const status = computed(() => (isReady.value ? 'A 地图已创建（可复制）' : '加载中…'))
</script>
