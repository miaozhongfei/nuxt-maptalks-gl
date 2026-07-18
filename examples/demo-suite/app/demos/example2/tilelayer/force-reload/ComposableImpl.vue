<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3">
      <UButton size="sm" @click="reload">强制重载</UButton>
      <UBadge color="primary" variant="subtle">已强制重载 {{ count }} 次</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
const { layer } = useMaptalksTileLayer(map, { source: 'osm' });
const count = ref(0);

// forceReload 丢缓存重拉当前视野瓦片
function reload() {
  (toValue(layer) as unknown as { forceReload?: () => void } | null)?.forceReload?.();
  count.value += 1;
}
</script>
