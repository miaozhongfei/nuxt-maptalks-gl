<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">两个 UIMarker 同位置但 single:true，碰撞时只显示一个（对应官网 10.9）。</p>
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
  new ui.UIMarker([121.5057, 31.2453], { content: '<div style="background:#dc2626;color:#fff;padding:4px 8px;border-radius:4px">Marker A</div>', single: true, dy: -30 }).addTo(m)
  new ui.UIMarker([121.5057, 31.2453], { content: '<div style="background:#2563eb;color:#fff;padding:4px 8px;border-radius:4px">Marker B</div>', single: true, dy: 0 }).addTo(m)
  new ui.UIMarker([121.5157, 31.2553], { content: '<div style="background:#10b981;color:#fff;padding:4px 8px;border-radius:4px">Marker C</div>', single: true }).addTo(m)
})
</script>
