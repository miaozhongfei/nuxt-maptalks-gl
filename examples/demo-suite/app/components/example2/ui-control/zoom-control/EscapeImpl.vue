<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      逃生舱——官网原生方式：mt.control.Zoom 直建 4 个官网布局（zoomLevel 开关 × 位置）（对应官网
      10.14）。
    </p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return;
    const mt = await import('maptalks-gl');
    // 官网 4 布局：左上+级别 / 右上 / 右下+级别 / 自定义位置
    new mt.control.Zoom({ position: 'top-left', zoomLevel: true }).addTo(m as any);
    new mt.control.Zoom({ position: 'top-right' }).addTo(m as any);
    new mt.control.Zoom({ position: 'bottom-right', zoomLevel: true }).addTo(m as any);
    new mt.control.Zoom({ position: { bottom: 20, left: 20 } }).addTo(m as any);
  },
  { immediate: true },
);
</script>
