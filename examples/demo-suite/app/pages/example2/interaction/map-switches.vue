<template>
  <Example2DemoShell
    description="USwitch 实时开关地图 5 项交互：拖拽/缩放/滚轮/触屏/双击（对应官网 8.2）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/interaction/map-switches/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/interaction/map-switches/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/interaction/map-switches/EscapeImpl.vue';
import MixedImpl from '~/components/example2/interaction/map-switches/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
