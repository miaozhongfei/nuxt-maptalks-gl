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
              {{ collapsed ? 'MT' : activeSection.label }}
            </NuxtLink>
          </template>
          <UNavigationMenu orientation="vertical" :items="sidebarItems" />
        </UDashboardSidebar>

        <UDashboardPanel id="main">
          <template #header>
            <UDashboardNavbar :title="`@lacqjs/nuxt-maptalks-gl: ${activeSection.label}`" />
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
// Nuxt auto-imports useRoute, but explicit import for clarity
import { useRoute } from 'vue-router';

// 各分区页面 children 定义
const startChildren: NavigationMenuItem[] = [
  { label: '首页', icon: 'i-lucide-home', to: '/' },
  { label: '自适应父容器', icon: 'i-lucide-maximize', to: '/fill-parent' },
  { label: 'IW 动画测试', icon: 'i-lucide-tv', to: '/test/iw-animation' },
  { label: 'MIW 测试', icon: 'i-lucide-tv', to: '/test/miw-test' },
];

const componentsChildren: NavigationMenuItem[] = [
  { label: '地图·瓦片图层', to: '/components/layers' },
  { label: '图形', to: '/components/geometries' },
  { label: '控件', to: '/components/controls' },
  { label: '工具', to: '/components/tools' },
  { label: '信息框', to: '/components/infowindow' },
];

const composablesChildren: NavigationMenuItem[] = [
  { label: '核心', to: '/composables/core' },
  { label: '图层预设', to: '/composables/layer-presets' },
  { label: '图形预设', to: '/composables/geometry-presets' },
  { label: '相机·事件·坐标', to: '/composables/interaction' },
  { label: '绘制·测量', to: '/composables/tools' },
  { label: '状态·序列化', to: '/composables/state' },
  { label: '控件', to: '/composables/controls' },
  { label: '信息框', to: '/composables/infowindow' },
];

const combosChildren: NavigationMenuItem[] = [
  { label: '组件组合', to: '/combos/components-combo' },
  { label: 'composable 组合', to: '/combos/composables-combo' },
  { label: '混合组合', to: '/combos/mixed-combo' },
];

const advancedChildren: NavigationMenuItem[] = [
  { label: '3D 高度', to: '/advanced/altitude-3d' },
  { label: '动画', to: '/advanced/geometry-fx' },
  { label: '编辑·拖拽', to: '/advanced/geometry-edit' },
  { label: '曲线·连接线', to: '/advanced/curves-connector' },
  { label: 'UI 组件', to: '/advanced/ui-components' },
  { label: '更多控件', to: '/advanced/extra-controls' },
  { label: '图层特效', to: '/advanced/layer-effects' },
  { label: '投影', to: '/advanced/projections' },
  { label: '插件图层', to: '/advanced/plugin-layers' },
];

// 单一数据源：顶栏 & 侧栏共用
const sections = [
  { label: '开始', icon: 'i-lucide-house', to: '/', prefix: '', children: startChildren },
  { label: '组件', icon: 'i-lucide-puzzle', to: '/components/layers', prefix: '/components', children: componentsChildren },
  { label: 'Composable', icon: 'i-lucide-code', to: '/composables/core', prefix: '/composables', children: composablesChildren },
  { label: '组合', icon: 'i-lucide-layers', to: '/combos/components-combo', prefix: '/combos', children: combosChildren },
  { label: '进阶', icon: 'i-lucide-rocket', to: '/advanced/altitude-3d', prefix: '/advanced', children: advancedChildren },
];

const route = useRoute();

// 按路由前缀匹配当前分区（精确 → 宽松）
const activeSection = computed(() => {
  const path = route.path;
  if (path.startsWith('/advanced')) return sections[4];
  if (path.startsWith('/combos')) return sections[3];
  if (path.startsWith('/composables')) return sections[2];
  if (path.startsWith('/components')) return sections[1];
  // 开始（兜底：'/','/fill-parent','/test/*'）
  return sections[0];
});

// 顶栏横向菜单 items：由 sections 派生
const navItems = computed<NavigationMenuItem[][]>(() => [
  sections.map((s) => ({
    label: s.label,
    icon: s.icon,
    to: s.to,
  })),
]);

// 侧边栏 items：当前分区 label 标题 + children 列表
const sidebarItems = computed<NavigationMenuItem[][]>(() => [
  [
    { label: activeSection.value.label, type: 'label' as const },
    ...activeSection.value.children,
  ],
]);
</script>
