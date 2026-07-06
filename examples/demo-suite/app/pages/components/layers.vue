<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">组件单独示例 · 地图 · 瓦片图层</h1>
    <p class="text-muted mb-6">
      演示地图根组件 <code>MaptalksMap</code> 与各类图层组件。所有图层组件都必须作为
      <code>MaptalksMap</code> 的子组件（通过 provide/inject 获取地图上下文）。
    </p>

    <!-- MaptalksMap + MaptalksTileLayer：最基础的一张地图 + 栅格瓦片底图 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksMap + MaptalksTileLayer</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 1.1 / 2.1</UBadge>
        </div>
      </template>
      <!-- MaptalksMap 是地图容器，必须给显式高度；source="osm" 引用 nuxt.config 里的命名数据源 -->
      <MaptalksMap
        :center="center"
        :zoom="11"
        class="h-80 rounded border border-default"
        @ready="ready = true"
        @error="onError"
      >
        <MaptalksTileLayer source="osm" />
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">状态：{{ ready ? '地图已就绪' : '加载中…' }}{{ errMsg }}</span>
      </template>
    </UCard>

    <!-- MaptalksVectorTileLayer：矢量瓦片图层（MVT/PBF） -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksVectorTileLayer</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 2.6</UBadge>
        </div>
      </template>
      <MaptalksMap :center="center" :zoom="11" class="h-80 rounded border border-default">
        <MaptalksTileLayer source="osm" />
        <!-- 占位矢量瓦片地址：真实项目应换成有效的 MVT 服务 + style，此处仅演示组件挂载 -->
        <MaptalksVectorTileLayer
          :options="{ urlTemplate: 'https://example.com/tiles/{z}/{x}/{y}.pbf' }"
        />
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">注：占位地址不会真正渲染要素，仅演示组件用法。</span>
      </template>
    </UCard>

    <!-- MaptalksGroupGLLayer：GL 图层容器（可容纳多个 GL 图层） -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksGroupGLLayer</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 2.3</UBadge>
        </div>
      </template>
      <MaptalksMap :center="center" :zoom="11" class="h-80 rounded border border-default">
        <MaptalksTileLayer source="osm" />
        <!-- GroupGLLayer 是 GL 图层的分组容器，模块会注入默认光照/后处理 sceneConfig -->
        <MaptalksGroupGLLayer />
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">GroupGLLayer 作为 GL 图层容器，此处为空容器演示。</span>
      </template>
    </UCard>

    <!-- MaptalksGLTFLayer：3D 模型图层容器 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksGLTFLayer</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
        </div>
      </template>
      <MaptalksMap :center="center" :zoom="14" class="h-80 rounded border border-default">
        <MaptalksTileLayer source="osm" />
        <!-- GLTFLayer 用于承载 3D 模型，实际模型经其原生 API 添加 GLTFMarker，此处为空容器 -->
        <MaptalksGLTFLayer />
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">GLTFLayer 承载 3D 模型，此处为空容器演示。</span>
      </template>
    </UCard>

    <!-- MaptalksVectorLayer：矢量图形容器（承载 Marker/几何等） -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MaptalksVectorLayer</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 6.8</UBadge>
        </div>
      </template>
      <MaptalksMap :center="center" :zoom="12" class="h-80 rounded border border-default">
        <MaptalksTileLayer source="osm" />
        <!-- VectorLayer 是几何图形的容器，几何组件必须放在它内部；这里放一个 Marker 证明容器生效 -->
        <MaptalksVectorLayer>
          <MaptalksMarker :coordinates="center" />
        </MaptalksVectorLayer>
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">VectorLayer 内含一个 Marker，证明容器已生效。</span>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { MaptalksError } from '@lacqjs/nuxt-maptalks-gl';

// 上海人民广场，作为所有示例地图的中心
const center: [number, number] = [121.4737, 31.2304];
const ready = ref(false);
const errMsg = ref('');

// 地图初始化失败时展示错误信息（SSR/WebGL 不可用等）
function onError(err: MaptalksError) {
  errMsg.value = `（错误：${err.message}）`;
}
</script>
