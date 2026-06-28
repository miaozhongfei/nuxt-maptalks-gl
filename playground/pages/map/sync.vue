<template>
  <div>
    <h1>地图能力 · 双图同步</h1>
    <div style="margin-bottom: 12px">
      <button data-testid="toggle-mode" @click="toggleMode">
        当前模式：{{ mode }}（点击切换）
      </button>
    </div>
    <div style="display: flex; gap: 12px">
      <div ref="leftEl" data-testid="map-left" class="map" />
      <div ref="rightEl" data-testid="map-right" class="map" />
    </div>
  </div>
</template>

<script setup lang="ts">
const leftEl = ref<HTMLElement | null>(null);
const rightEl = ref<HTMLElement | null>(null);
const { map: left } = useMaptalks(leftEl, { name: 'sync-left', center: [121.47, 31.23], zoom: 11 });
const { map: right } = useMaptalks(rightEl, { name: 'sync-right', center: [121.47, 31.23], zoom: 11 });
useMaptalksTileLayer(left, { source: 'osm' });
useMaptalksTileLayer(right, { source: 'osm' });

const mode = ref<'mutual' | 'master-slave'>('mutual');
// 以名字方式纳入同步
const sync = useMaptalksSync(['sync-left', 'sync-right'], { mode: mode.value, master: 'sync-left' });

/** 在双向与主从之间切换显示（重启同步以重新绑定） */
function toggleMode(): void {
  mode.value = mode.value === 'mutual' ? 'master-slave' : 'mutual';
  sync.disable();
  sync.enable();
}
</script>

<style scoped>
.map {
  height: 360px;
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
