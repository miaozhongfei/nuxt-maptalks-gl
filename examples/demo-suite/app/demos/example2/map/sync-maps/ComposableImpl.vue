<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <div
        ref="elA"
        class="relative rounded border border-default overflow-hidden"
        style="height: 420px"
      />
      <div
        ref="elB"
        class="relative rounded border border-default overflow-hidden"
        style="height: 420px"
      />
    </div>
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="enable()">开启同步</UButton>
      <UButton size="sm" color="neutral" @click="disable()">关闭同步</UButton>
      <UBadge :color="isEnabled ? 'success' : 'neutral'" variant="subtle">
        {{ isEnabled ? '同步中' : '未同步' }}
      </UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
// 两张命名地图（name 会登记进 MapRegistry，供 useMaptalksSync 按名引用）
const elA = ref<HTMLElement | null>(null);
const elB = ref<HTMLElement | null>(null);
const { map: mapA } = useMaptalks(elA, { name: 'sync-u-a', center: [121.5057, 31.2453], zoom: 13 });
const { map: mapB } = useMaptalks(elB, { name: 'sync-u-b', center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(mapA, { source: 'osm' });
useMaptalksTileLayer(mapB, { source: 'osm' });
// 视图同步 composable：按名同步两张地图
const { enable, disable, isEnabled } = useMaptalksSync(['sync-u-a', 'sync-u-b']);
</script>
