<template>
  <div class="h-screen flex flex-col">
    <!-- 顶部横向一级菜单 -->
    <UHeader :ui="{ root: 'relative z-10 shrink-0' }">
      <template #left />
      <template #title />

      <UNavigationMenu
        orientation="horizontal"
        :items="navItems"
        :ui="{ link: 'text-sm' }"
      />
    </UHeader>

    <!-- 下方 Dashboard 布局 -->
    <div class="flex-1 relative">
      <UDashboardGroup
        :ui="{ base: '!absolute inset-0 flex overflow-hidden' }"
      >
        <UDashboardSidebar
          collapsible
          resizable
          :default-size="18"
          :min-size="14"
          :max-size="28"
        >
          <template #header />
          <UNavigationMenu orientation="vertical" :items="items" />
        </UDashboardSidebar>

        <UDashboardPanel id="main">
          <template #header>
            <UDashboardNavbar title="@lacqjs/nuxt-maptalks-gl 示例合集" />
          </template>
          <template #body>
            <slot />
          </template>
        </UDashboardPanel>
      </UDashboardGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

// 侧边栏 5 组：开始 / 组件单独 / composable 单独 / 组合 / 进阶
const items: NavigationMenuItem[][] = [
  [
    { label: '开始', type: 'label' },
    { label: '首页', icon: 'i-lucide-home', to: '/example1', exact: true },
    { label: '自适应父容器', icon: 'i-lucide-maximize', to: '/example1/fill-parent' },
    { label: 'IW 动画测试', icon: 'i-lucide-tv', to: '/example1/test/iw-animation' },
    { label: 'MIW 测试', icon: 'i-lucide-tv', to: '/example1/test/miw-test' },
  ],
  [
    { label: '组件单独', type: 'label' },
    { label: '地图·瓦片图层', to: '/example1/components/layers' },
    { label: '图形', to: '/example1/components/geometries' },
    { label: '控件', to: '/example1/components/controls' },
    { label: '工具', to: '/example1/components/tools' },
    { label: '信息框', to: '/example1/components/infowindow' },
  ],
  [
    { label: 'Composable 单独', type: 'label' },
    { label: '核心', to: '/example1/composables/core' },
    { label: '图层预设', to: '/example1/composables/layer-presets' },
    { label: '图形预设', to: '/example1/composables/geometry-presets' },
    { label: '相机·事件·坐标', to: '/example1/composables/interaction' },
    { label: '绘制·测量', to: '/example1/composables/tools' },
    { label: '状态·序列化', to: '/example1/composables/state' },
    { label: '控件', to: '/example1/composables/controls' },
    { label: '信息框', to: '/example1/composables/infowindow' },
  ],
  [
    { label: '组合示例', type: 'label' },
    { label: '组件组合', to: '/example1/combos/components-combo' },
    { label: 'composable 组合', to: '/example1/combos/composables-combo' },
    { label: '混合组合', to: '/example1/combos/mixed-combo' },
  ],
  [
    { label: '进阶·逃生舱', type: 'label' },
    { label: '3D 高度', to: '/example1/advanced/altitude-3d' },
    { label: '动画', to: '/example1/advanced/geometry-fx' },
    { label: '编辑·拖拽', to: '/example1/advanced/geometry-edit' },
    { label: '曲线·连接线', to: '/example1/advanced/curves-connector' },
    { label: 'UI 组件', to: '/example1/advanced/ui-components' },
    { label: '更多控件', to: '/example1/advanced/extra-controls' },
    { label: '图层特效', to: '/example1/advanced/layer-effects' },
    { label: '投影', to: '/example1/advanced/projections' },
    { label: '插件图层', to: '/example1/advanced/plugin-layers' },
  ],
];

// 菜单集合：一级菜单为一个集合，含完整侧栏菜单 后续在此追加新集合即可
const menuSets = [
  { label: '示例1', to: '/example1', groups: items },
];

// 顶栏横向一级菜单：由 menuSets 派生
const navItems = computed<NavigationMenuItem[][]>(() => [
  menuSets.map((s) => ({
    label: s.label,
    to: s.to,
  })),
]);
</script>
