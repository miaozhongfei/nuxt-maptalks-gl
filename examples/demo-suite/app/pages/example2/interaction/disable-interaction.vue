<template>
  <Example2DemoShell
    description="七个交互选项全部 false 禁用地图拖拽/缩放/旋转/滚轮/触屏/双击（对应官网 8.1）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/interaction/disable-interaction/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/interaction/disable-interaction/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/interaction/disable-interaction/EscapeImpl.vue';
import MixedImpl from '~/components/example2/interaction/disable-interaction/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
