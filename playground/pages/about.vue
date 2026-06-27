<template>
  <div>
    <h1>关于 @lacqjs/nuxt-maptalks-gl</h1>
    <p style="color: #666">
      统一抽走各 Nuxt 4 项目重复编写的 maptalks-gl 脏活与胶水：SSR 守卫、动态加载、CSS、 map/layer
      生命周期、事件桥接、相机同步、图层装配与 dispose。
    </p>

    <h3>核心 composable</h3>
    <ul style="color: #444; line-height: 1.9">
      <li><code>useMaptalks(target, options)</code> — 创建并响应式纳管地图（client-only）</li>
      <li><code>useMaptalksLayer(map, factory, options)</code> — 通用图层原语，纳管任意图层</li>
    </ul>

    <h3>多地图</h3>
    <ul style="color: #444; line-height: 1.9">
      <li><code>useMaptalksInstance(name)</code> — 按名获取已登记地图（不拥有生命周期）</li>
      <li><code>useMaptalksRegistry()</code> — 枚举 / 跨图协同</li>
    </ul>

    <h3>横切</h3>
    <ul style="color: #444; line-height: 1.9">
      <li>
        <code>useMaptalksEvents</code> / <code>useMaptalksCamera</code> /
        <code>useMaptalksCoordinate</code>
      </li>
      <li><code>useMaptalksDrawTool</code> / <code>useMaptalksSource</code></li>
    </ul>

    <h3>类型化预设</h3>
    <ul style="color: #444; line-height: 1.9">
      <li><code>useMaptalksTileLayer</code> / <code>useMaptalksVectorTileLayer</code></li>
      <li><code>useMaptalksGroupGLLayer</code> / <code>useMaptalksGLTFLayer</code></li>
    </ul>

    <p style="color: #888; font-size: 14px; margin-top: 24px">
      逃生舱口：始终暴露原始 <code>map</code> / <code>layer</code> 实例，未覆盖能力直接走
      maptalks-gl 原生 API。
    </p>
  </div>
</template>
