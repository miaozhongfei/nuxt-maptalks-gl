<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="mt-3 flex items-center gap-2">
      <UButton size="sm" @click="swapContent">替换内容</UButton>
      <span class="text-sm text-muted">当前内容: {{ text }}</span>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })
const text = ref('HTML Marker')
let uimRef: { setContent(c: string): void; on(e: string, h: () => void): void } | null = null
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  // 原生 ui.UIMarker 与模块建模不兼容（addTo 参数为原生 Map），窄类型 cast 逃生舱
  const Ctor = (mt as unknown as Record<string, unknown>).ui as Record<string, unknown>
  const UIMarker = Ctor?.UIMarker as new (c: unknown, o: Record<string, unknown>) => { setContent(c: string): void; addTo(t: unknown): unknown; show(): unknown; remove(): void; on(e: string, h: () => void): void } | undefined
  if (typeof UIMarker !== 'function') return
  const uim = new UIMarker([121.5057, 31.2453], {
    content: `<div style="font:30px bold sans-serif;color:#34495e;text-shadow:2px 0 #fff">${text.value}</div>`,
    draggable: true,
  })
  uim.addTo(m)
  uim.show()
  uim.on('click', () => alert('UIMarker 被点击了！'))
  uimRef = uim
}, { immediate: true })
function swapContent() {
  text.value = text.value === 'HTML Marker' ? '内容已替换！' : 'HTML Marker'
  if (uimRef) uimRef.setContent(`<div style="font:30px bold sans-serif;color:#34495e;text-shadow:2px 0 #fff">${text.value}</div>`)
}

const status = computed(() => (isReady.value ? '地图已创建（HTML 标注）' : '加载中…'))
</script>
