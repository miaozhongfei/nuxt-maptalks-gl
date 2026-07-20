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

let tileRef: { forceReload: () => void } | null = null;
const count = ref(0);

// 逃生舱：工厂 new 原生 TileLayer，保存 tileRef 引用供 forceReload 直调
useMaptalksLayer(map, (mt) => {
  const l = new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  });
  tileRef = l as unknown as { forceReload: () => void };
  return l;
});

// forceReload 丢缓存重拉当前视野瓦片
function reload() {
  tileRef?.forceReload();
  count.value += 1;
}
</script>
