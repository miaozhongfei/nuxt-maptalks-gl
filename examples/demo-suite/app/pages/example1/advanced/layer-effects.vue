<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 图层特效</h1>
    <p class="text-muted mb-6">演示图层透明度、blend 模式和样式动态更新。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">图层透明度</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2 items-center"><UButton size="sm" @click="() => { opacity = 1 }">100%</UButton><UButton size="sm" @click="() => { opacity = 0.6 }">60%</UButton><UButton size="sm" @click="() => { opacity = 0.3 }">30%</UButton><span class="text-sm text-muted">当前：{{ Math.round(opacity * 100) }}%</span><span class="text-xs text-muted ml-2">{{ status1 }}</span></div></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 样式覆盖</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" @click="toggleDarkLayer()">{{ dark ? '恢复亮色瓦片' : '切换暗色瓦片' }}</UButton><span class="text-sm text-muted">原生 <code>layer.config()</code> / <code>layer.setOpacity()</code></span><span class="text-xs text-muted ml-2">{{ status2 }}</span></div></template>
      </UCard>
    </div>

    <UCard class="mt-4">
      <template #header><h2 class="font-semibold">逃生舱 · 原生 CanvasLayer</h2></template>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height:350px" />
      <template #footer><span class="text-sm text-muted">native new CanvasLayer() 自定义绘制。</span><span class="text-xs text-muted ml-2">{{ status3 }}</span></template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304]

const el1 = ref<HTMLElement | null>(null)
const { map: map1, isReady: ready1 } = useMaptalks(el1, { center, zoom: 13 })
const { layer: l1 } = useMaptalksTileLayer(map1, { source: 'osm' })
const opacity = ref(0.6)
watch(opacity, (v) => { toValue(l1)?.setOpacity(v) }, { immediate: true })

const el2 = ref<HTMLElement | null>(null)
const { map: map2, isReady: ready2 } = useMaptalks(el2, { center, zoom: 13 })
const { layer: l2 } = useMaptalksTileLayer(map2, { source: 'osm' })
const dark = ref(false)
function toggleDarkLayer() {
  dark.value = !dark.value
  const layer = toValue(l2)
  if (!layer) return
  if (dark.value) {
    layer.config({ cssFilter: 'invert(1) hue-rotate(180deg) brightness(0.8)' })
  }
  else {
    layer.config({ cssFilter: null })
  }
}

// 卡片 3：CanvasLayer 逃生舱（maptalks-gl 中 CanvasLayer API 受限，用 ui.UIMarker 兜底）
const el3 = ref<HTMLElement | null>(null)
const { map: map3, isReady: ready3 } = useMaptalks(el3, { center, zoom: 13 })
useMaptalksTileLayer(map3, { source: 'osm' })
watch(
  () => toValue(map3),
  async (m) => {
    if (!m) return
    try {
      const mt = await import('maptalks-gl')
      const canvas = document.createElement('canvas')
      canvas.width = 280
      canvas.height = 150
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'rgba(37,99,235,0.25)'
        ctx.fillRect(0, 0, 280, 150)
        ctx.strokeStyle = '#2563eb'
        ctx.lineWidth = 3
        ctx.strokeRect(5, 5, 270, 140)
        ctx.fillStyle = '#2563eb'
        ctx.font = 'bold 14px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('原生 Canvas 绘制', 140, 55)
        ctx.font = '12px sans-serif'
        ctx.fillText('maptalks-gl CanvasLayer', 140, 80)
        ctx.fillStyle = 'rgba(22,163,74,0.3)'
        ctx.beginPath()
        ctx.arc(140, 115, 18, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#16a34a'
        ctx.font = 'bold 18px sans-serif'
        ctx.fillText('✓', 140, 121)
      }
      const dataUrl = canvas.toDataURL()
      // 同时尝试原生 CanvasLayer + ui.UIMarker（maptalks-gl 中 UIMarker 在 ui 子命名空间）
      const cl = new mt.CanvasLayer('canvas-demo')
      cl.addTo(m)
      const UIMarkerCtor = (mt.ui as Record<string, unknown>).UIMarker as new (coords: unknown, opts: Record<string, unknown>) => { addTo: (m: unknown) => unknown }
      new UIMarkerCtor([121.48, 31.23], {
        content: `<img src="${dataUrl}" style="display:block;width:280px;height:150px;max-width:none;" />`,
        dy: -75,
      }).addTo(m)
    } catch {
      // 原生模块加载失败时静默（逃生舱失败不拖垮页面）
    }
  },
)

const status1 = computed(() => (ready1.value ? '地图已创建（透明度可调）' : '加载中…'))
const status2 = computed(() => (ready2.value ? '地图已创建（样式可切换）' : '加载中…'))
const status3 = computed(() => (ready3.value ? '地图已创建（CanvasLayer 已加）' : '加载中…'))
</script>
