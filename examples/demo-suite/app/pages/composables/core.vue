<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Composable 单独示例 · 核心</h1>
    <p class="text-muted mb-6">
      演示核心 composable：命令式创建地图、通用图层原语（逃生舱）、命名数据源解析、命名实例获取与注册表枚举。
      命令式写法用 <code>ref&lt;HTMLElement&gt;</code> 承载地图容器（容器需显式高度 + <code>relative</code>）。
    </p>

    <!-- useMaptalks：命令式创建一张命名地图 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalks</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 1.1</UBadge>
        </div>
      </template>
      <div ref="elCore" class="relative h-80 rounded border border-default overflow-hidden" />
      <template #footer>
        <span class="text-sm text-muted">
          命名地图 'suite-core'：{{ coreReady ? '已就绪' : '加载中…' }}
          {{ coreError ? `（错误：${coreError.message}）` : '' }}
        </span>
      </template>
    </UCard>

    <!-- useMaptalksLayer：通用图层原语（逃生舱，直接 new 任意 maptalks 图层） -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksLayer（逃生舱）</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
        </div>
      </template>
      <div ref="elLayer" class="relative h-80 rounded border border-default overflow-hidden" />
      <template #footer>
        <span class="text-sm text-muted">用 factory 手动 new TileLayer：{{ escapeLayer ? '图层已添加' : '等待就绪…' }}</span>
      </template>
    </UCard>

    <!-- useMaptalksSource：解析命名签名数据源（密钥不进前端） -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksSource + 签名源</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
        </div>
      </template>
      <div ref="elSecure" class="relative h-80 rounded border border-default overflow-hidden" />
      <template #footer>
        <div class="text-sm text-muted break-all">
          <div>secure 源解析状态：{{ srcPending ? '解析中…' : srcError ? `失败：${srcError.message}` : '已解析' }}</div>
          <div v-if="resolvedUrl">解析出的签名 URL：<code>{{ resolvedUrl }}</code></div>
        </div>
      </template>
    </UCard>

    <!-- useMaptalksInstance + useMaptalksRegistry：获取命名实例、枚举注册表 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksInstance + useMaptalksRegistry</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
        </div>
      </template>
      <!-- 注册表在客户端才有内容，用 ClientOnly 避免 SSR 水合不一致 -->
      <ClientOnly>
        <ul class="text-sm">
          <li>useMaptalksInstance('suite-core')：{{ coreInstance ? '已获取到上面那张命名地图' : '尚未注册' }}</li>
          <li>注册表中的命名实例数：{{ registryNames.length }}</li>
          <li>实例名列表：{{ registryNames.join(', ') || '（无）' }}</li>
        </ul>
        <template #fallback>
          <span class="text-sm text-muted">注册表信息将在客户端渲染…</span>
        </template>
      </ClientOnly>
      <template #footer>
        <span class="text-sm text-muted">本卡不创建新地图，仅读取上面 useMaptalks 注册的命名实例。</span>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

// 1) useMaptalks：命令式创建命名地图 'suite-core'
const elCore = ref<HTMLElement | null>(null);
const { map: coreMap, isReady: coreReady, error: coreError } = useMaptalks(elCore, {
  center,
  zoom: 11,
  name: 'suite-core',
});
// 给命名地图加个底图，让它可见
useMaptalksTileLayer(coreMap, { source: 'osm' });

// 2) useMaptalksLayer：通用图层原语（逃生舱），factory 直接 new 任意图层
const elLayer = ref<HTMLElement | null>(null);
const { map: layerMap } = useMaptalks(elLayer, { center, zoom: 11 });
const { layer: escapeLayer } = useMaptalksLayer(layerMap, (mt) => {
  return new mt.TileLayer('escape-tile', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    attribution: '© OpenStreetMap contributors, © CARTO',
  });
});

// 3) useMaptalksSource：解析 secure 签名源（经服务端 /api/maptalks/sign 换取带 token 的 URL）
const elSecure = ref<HTMLElement | null>(null);
const { map: secureMap } = useMaptalks(elSecure, { center, zoom: 11 });
useMaptalksTileLayer(secureMap, { source: 'secure' });
const { source: secureSource, pending: srcPending, error: srcError } = useMaptalksSource('secure');
// 从解析结果里取签名 URL 展示
const resolvedUrl = computed(() => {
  const s = secureSource.value as { urlTemplate?: string } | null;
  return s?.urlTemplate ?? '';
});

// 4) useMaptalksInstance：按名获取上面注册的命名地图（不拥有其生命周期）
const coreInstance = useMaptalksInstance('suite-core');
// useMaptalksRegistry：枚举所有命名实例
const registry = useMaptalksRegistry();
const registryNames = computed(() => Array.from(registry.instances.keys()));
</script>
