<template>
  <div class="min-h-screen flex">
    <!-- 侧边栏：方案 C 五组导航 -->
    <aside class="w-64 shrink-0 border-r border-default overflow-y-auto p-3">
      <NuxtLink to="/" class="block font-mono font-bold mb-3 px-2">nuxt-maptalks-gl</NuxtLink>
      <UNavigationMenu orientation="vertical" :items="items" />
    </aside>
    <main class="flex-1 overflow-y-auto p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

// 侧边栏 5 组：开始 / 组件单独 / composable 单独 / 组合 / 进阶逃生舱
const items: NavigationMenuItem[][] = [
  [
    { label: '开始', type: 'label' },
    { label: '首页', icon: 'i-lucide-home', to: '/' },
  ],
  [
    { label: '组件单独', type: 'label' },
    { label: '地图·瓦片图层', to: '/components/layers' },
    { label: '图形', to: '/components/geometries' },
    { label: '控件', to: '/components/controls' },
    { label: '工具', to: '/components/tools' },
    { label: '信息框', to: '/components/infowindow' },
  ],
  [
    { label: 'Composable 单独', type: 'label' },
    { label: '核心', to: '/composables/core' },
    { label: '图层预设', to: '/composables/layer-presets' },
    { label: '图形预设', to: '/composables/geometry-presets' },
    { label: '相机·事件·坐标', to: '/composables/interaction' },
    { label: '绘制·测量', to: '/composables/tools' },
    { label: '状态·序列化', to: '/composables/state' },
    { label: '控件', to: '/composables/controls' },
    { label: '信息框', to: '/composables/infowindow' },
  ],
  [
    { label: '组合示例', type: 'label' },
    { label: '组件组合', to: '/combos/components-combo' },
    { label: 'composable 组合', to: '/combos/composables-combo' },
    { label: '混合组合', to: '/combos/mixed-combo' },
  ],
  [
    { label: '进阶·逃生舱', type: 'label' },
    { label: '3D 高度', to: '/advanced/altitude-3d' },
    { label: '动画', to: '/advanced/geometry-fx' },
    { label: '编辑·拖拽', to: '/advanced/geometry-edit' },
    { label: '曲线·连接线', to: '/advanced/curves-connector' },
    { label: 'UI 组件', to: '/advanced/ui-components' },
    { label: '更多控件', to: '/advanced/extra-controls' },
    { label: '图层特效', to: '/advanced/layer-effects' },
    { label: '投影', to: '/advanced/projections' },
    { label: '插件图层', to: '/advanced/plugin-layers' },
  ],
];
</script>
