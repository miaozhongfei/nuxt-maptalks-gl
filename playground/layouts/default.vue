<template>
  <div style="display: flex; min-height: 100vh; font-family: sans-serif; background: #f5f5f5">
    <aside style="width: 260px; background: #fff; padding: 20px; border-right: 1px solid #e0e0e0">
      <h3 style="margin-top: 0; color: #1f8ceb">@lacqjs/nuxt-maptalks-gl</h3>

      <h4 style="margin-bottom: 8px; color: #666">核心</h4>
      <nav style="display: flex; flex-direction: column; gap: 2px; margin-bottom: 16px">
        <NuxtLink to="/core/basic" class="nav-link">useMaptalks 第一张地图</NuxtLink>
        <NuxtLink to="/core/layer" class="nav-link">useMaptalksLayer 通用原语</NuxtLink>
      </nav>

      <h4 style="margin-bottom: 8px; color: #666">多地图</h4>
      <nav style="display: flex; flex-direction: column; gap: 2px; margin-bottom: 16px">
        <NuxtLink to="/multi/named" class="nav-link">命名实例 + 注册表</NuxtLink>
      </nav>

      <h4 style="margin-bottom: 8px; color: #666">横切</h4>
      <nav style="display: flex; flex-direction: column; gap: 2px; margin-bottom: 16px">
        <NuxtLink to="/crosscutting/camera" class="nav-link">useMaptalksCamera 相机同步</NuxtLink>
        <NuxtLink to="/crosscutting/events" class="nav-link">useMaptalksEvents 事件</NuxtLink>
        <NuxtLink to="/crosscutting/draw" class="nav-link">useMaptalksDrawTool 绘制</NuxtLink>
      </nav>

      <h4 style="margin-bottom: 8px; color: #666">预设与鉴权</h4>
      <nav style="display: flex; flex-direction: column; gap: 2px; margin-bottom: 16px">
        <NuxtLink to="/presets/tile" class="nav-link">TileLayer 公开源</NuxtLink>
        <NuxtLink to="/presets/vector-tile" class="nav-link">VectorTileLayer 矢量瓦片</NuxtLink>
        <NuxtLink to="/presets/signed" class="nav-link" style="color: #e6a23c"
          >签名源 + useMaptalksSource</NuxtLink
        >
      </nav>

      <h4 style="margin-bottom: 8px; color: #666">组件</h4>
      <nav style="display: flex; flex-direction: column; gap: 2px; margin-bottom: 16px">
        <NuxtLink to="/components/basic" class="nav-link">MaptalksMap 声明式</NuxtLink>
      </nav>

      <hr />
      <NuxtLink to="/about" class="nav-link" style="color: #888; font-size: 14px"
        >关于模块</NuxtLink
      >
    </aside>

    <main style="flex: 1; padding: 24px; overflow-x: auto">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.nav-link {
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
}
.nav-link:hover {
  background: #f0f7ff;
}
.router-link-active {
  background: #e8f3ff;
  color: #1f8ceb;
}
</style>
