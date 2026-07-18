<template>
  <div class="h-screen flex flex-col">
    <!-- 顶部横向一级菜单 -->
    <UHeader :ui="{ root: 'relative z-10 shrink-0' }">
      <template #left>
        <NuxtLink to="/" class="font-mono font-bold text-sm">
          nuxt-maptalks-gl
        </NuxtLink>
      </template>

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
          <template #header="{ collapsed }">
            <NuxtLink to="/" class="font-mono font-bold text-sm truncate">
                {{ collapsed ? 'MT' : 'nuxt-maptalks-gl' }}
            </NuxtLink>
          </template>
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
    { label: '首页', icon: 'i-lucide-home', to: '/' },
    { label: '自适应父容器', icon: 'i-lucide-maximize', to: '/fill-parent' },
    { label: 'IW 动画测试', icon: 'i-lucide-tv', to: '/test/iw-animation' },
    { label: 'MIW 测试', icon: 'i-lucide-tv', to: '/test/miw-test' },
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

// 菜单集合：一级菜单为一个集合，含完整侧栏菜单 后续在此追加新集合即可
const menuSets = [
  { label: '示例1', to: '/', groups: items },
];

// 顶栏横向一级菜单：由 menuSets 派生
const navItems = computed<NavigationMenuItem[][]>(() => [
  menuSets.map((s) => ({
    label: s.label,
    to: s.to,
  })),
]);
</script>
