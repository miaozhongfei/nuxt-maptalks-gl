<template>
  <!-- 1.5 添加常用控件 -->
  <Example2DemoShell
    description="为地图添加 Zoom / Scale / Compass / Attribution 控件；逃生舱演示原生 Toolbar，对应官网「地图 - 添加常用控件」"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/map/controls/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/map/controls/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/map/controls/EscapeImpl.vue';
import MixedImpl from '~/components/example2/map/controls/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
