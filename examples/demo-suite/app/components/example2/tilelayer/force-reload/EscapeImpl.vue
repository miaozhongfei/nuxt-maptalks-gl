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
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });

// 逃生舱：工厂 new 原生 TileLayer，保存 tileRef 引用供 forceReload 直调（工厂返回推断为 MaptalksTileLayer）
let tileRef: MaptalksTileLayer | null = null;
const count = ref(0);

useMaptalksLayer(map, (mt) => {
  const l = new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  });
  tileRef = l;
  return l;
});

// forceReload 丢缓存重拉当前视野瓦片
function reload() {
  tileRef?.forceReload();
  count.value += 1;
}

const status = computed(() => (isReady.value ? '地图已创建（可强制重载瓦片）' : '加载中…'));
</script>
