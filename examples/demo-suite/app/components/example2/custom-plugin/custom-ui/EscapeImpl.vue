<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">自定义样式的 UIMarker UI 组件（对应官网 13.2）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  const ui = (mt as any).ui
  new ui.UIMarker([121.5057, 31.2453], { content: '<div style="background:orange;color:#1a1a1a;padding:8px 14px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 2px 6px rgba(0,0,0,0.15)">Custom UI</div>', dy: -30 }).addTo(m)
  new ui.UIMarker([121.5107, 31.2453], { content: '<div style="background:#8b5cf6;color:#fff;padding:8px 14px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 2px 6px rgba(0,0,0,0.15)">Styled</div>', dy: -30 }).addTo(m)
})
</script>
