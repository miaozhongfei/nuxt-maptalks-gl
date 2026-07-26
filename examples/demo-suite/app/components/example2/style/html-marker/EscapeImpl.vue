<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });
watch(() => toValue(map), async (m) => {
  if (!m) return;
  const mt = await import('maptalks-gl');
  const Ctor = (mt as unknown as Record<string, unknown>).ui as Record<string, unknown>;
  const UIMarker = Ctor?.UIMarker as new (c: unknown, o: Record<string, unknown>) => { addTo(t: unknown): unknown; show(): unknown; remove(): void } | undefined;
  if (typeof UIMarker !== 'function') return;
  const uim = new UIMarker([121.5057, 31.2453], {
    content: '<div style="font:30px bold sans-serif;color:#34495e;text-shadow:2px 0 #fff">HTML Marker</div>',
    draggable: true,
  });
  uim.addTo(m);
  uim.show();
}, { immediate: true });
</script>
