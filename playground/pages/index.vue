<template>
  <div>
    <h1>@lacqjs/nuxt-maptalks-gl 功能演示</h1>
    <p style="color: #666; margin-bottom: 32px">
      Nuxt 4 的 maptalks-gl 模块：兜底 SSR / 动态加载 / CSS / 生命周期，提供通用图层原语、
      多地图命名实例与注册表、横切 composable 与类型化图层预设。
    </p>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px">
      <!-- 核心 -->
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background: #fff">
        <h3
          style="
            margin-top: 0;
            border-bottom: 2px solid #1f8ceb;
            padding-bottom: 8px;
            color: #1f8ceb;
          "
        >
          核心
        </h3>
        <p style="color: #666; font-size: 14px">
          useMaptalks 创建地图 + useMaptalksLayer 纳管任意图层
        </p>
        <NuxtLink to="/core/basic" style="display: block; margin-top: 12px; color: #1f8ceb"
          >→ 第一张地图</NuxtLink
        >
        <NuxtLink to="/core/layer" style="display: block; color: #1f8ceb">→ 通用图层原语</NuxtLink>
      </div>

      <!-- 多地图 -->
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background: #fff">
        <h3
          style="
            margin-top: 0;
            border-bottom: 2px solid #67c23a;
            padding-bottom: 8px;
            color: #67c23a;
          "
        >
          多地图
        </h3>
        <p style="color: #666; font-size: 14px">命名实例 + MapRegistry，跨组件按名获取、跨图协同</p>
        <NuxtLink to="/multi/named" style="display: block; margin-top: 12px; color: #1f8ceb"
          >→ 命名实例 + 注册表</NuxtLink
        >
      </div>

      <!-- 横切 -->
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background: #fff">
        <h3
          style="
            margin-top: 0;
            border-bottom: 2px solid #e040fb;
            padding-bottom: 8px;
            color: #e040fb;
          "
        >
          横切
        </h3>
        <p style="color: #666; font-size: 14px">相机双向同步 / 事件绑定 / 绘制工具</p>
        <NuxtLink to="/crosscutting/camera" style="display: block; margin-top: 12px; color: #1f8ceb"
          >→ useMaptalksCamera</NuxtLink
        >
        <NuxtLink to="/crosscutting/events" style="display: block; color: #1f8ceb"
          >→ useMaptalksEvents</NuxtLink
        >
        <NuxtLink to="/crosscutting/draw" style="display: block; color: #1f8ceb"
          >→ useMaptalksDrawTool</NuxtLink
        >
      </div>

      <!-- 预设与鉴权 -->
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background: #fff">
        <h3
          style="
            margin-top: 0;
            border-bottom: 2px solid #e6a23c;
            padding-bottom: 8px;
            color: #e6a23c;
          "
        >
          预设与鉴权
        </h3>
        <p style="color: #666; font-size: 14px">瓦片 / 矢量瓦片预设，public 与 signed 数据源</p>
        <NuxtLink to="/presets/tile" style="display: block; margin-top: 12px; color: #1f8ceb"
          >→ TileLayer 公开源</NuxtLink
        >
        <NuxtLink to="/presets/vector-tile" style="display: block; color: #1f8ceb"
          >→ VectorTileLayer</NuxtLink
        >
        <NuxtLink to="/presets/signed" style="display: block; color: #1f8ceb">→ 签名源</NuxtLink>
      </div>
    </div>
  </div>
</template>
