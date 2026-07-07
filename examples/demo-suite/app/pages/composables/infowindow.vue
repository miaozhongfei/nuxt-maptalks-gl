<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Composable 单独示例 · 信息框</h1>
    <p class="text-muted mb-6">
      演示 <code>useMaptalksInfoWindow</code>：命令式创建信息框，支持响应式内容/坐标，并暴露 show/hide。
    </p>

    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksInfoWindow</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.4</UBadge>
        </div>
      </template>
      <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 384px" />
      <template #footer>
        <div class="flex gap-2 items-center flex-wrap">
          <UButton size="sm" @click="showAtCenter">在中心显示</UButton>
          <UButton size="sm" color="neutral" @click="hide">隐藏</UButton>
          <span class="text-sm text-muted">也可以点击地图，在落点显示信息框。</span>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center, zoom: 12 });
useMaptalksTileLayer(map, { source: 'osm' });

// 创建信息框：初始不显示，内容为 HTML 字符串
const { show, hide } = useMaptalksInfoWindow(map, {
  options: () => ({
    title: '信息框',
    content: '<div style="padding:4px 8px">这是 useMaptalksInfoWindow 创建的信息框</div>',
  }),
});

/** 在地图中心显示信息框 */
function showAtCenter() {
  show(center);
}

// 点击地图，在落点显示信息框
useMaptalksEvents(map, {
  click: (e) => {
    const ev = e as { coordinate?: unknown };
    if (ev.coordinate) show(ev.coordinate);
  },
});
</script>
