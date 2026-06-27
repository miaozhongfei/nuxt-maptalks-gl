<template>
  <div>
    <h1>多地图 · 命名实例 + 注册表</h1>
    <p style="color: #666">
      两张命名地图（'left' / 'right'），经 useMaptalksRegistry 跨图协同：把右图视图同步到左图。
    </p>
    <!-- 注册表是 client-only（避免 SSR 单例跨请求串号）；展示其状态须用 <ClientOnly> 包裹，
         否则 SSR（空）与客户端（已登记）首帧不一致，触发 Vue 水合文本不匹配 -->
    <ClientOnly>
      <p style="color: #444">当前已登记地图：{{ registeredNames.join('、') || '（暂无）' }}</p>
    </ClientOnly>
    <button style="margin-bottom: 12px" @click="syncRightToLeft">把左图视图同步到右图 →</button>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
      <div>
        <h4>left（人民广场，zoom 11）</h4>
        <div ref="elLeft" data-testid="map-left" class="map" />
      </div>
      <div>
        <h4>right（陆家嘴，zoom 14）</h4>
        <div ref="elRight" data-testid="map-right" class="map" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const elLeft = ref<HTMLElement | null>(null);
const elRight = ref<HTMLElement | null>(null);

// 两张命名地图，分别登记进 MapRegistry
const left = useMaptalks(elLeft, { name: 'left', center: [121.4737, 31.2304], zoom: 11 });
const right = useMaptalks(elRight, { name: 'right', center: [121.4997, 31.2397], zoom: 14 });

// 各自加载底图
useMaptalksTileLayer(left.map, { source: 'osm' });
useMaptalksTileLayer(right.map, { source: 'osm' });

// 注册表：枚举与按名取用
const registry = useMaptalksRegistry();
const registeredNames = computed(() => [...registry.instances.keys()]);

/** 读取左图中心/缩放并应用到右图（跨图协同示例） */
function syncRightToLeft(): void {
  const l = registry.get('left');
  const r = registry.get('right');
  if (l && r) {
    r.setCenter(l.getCenter());
    r.setZoom(l.getZoom());
  }
}
</script>

<style scoped>
.map {
  height: 360px;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
