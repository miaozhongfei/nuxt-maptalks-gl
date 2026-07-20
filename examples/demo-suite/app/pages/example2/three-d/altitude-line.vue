<template>
  <Example2DemoShell
    description="drawAltitude: true 自动绘制 Marker 到地面的垂直高度线（地图需俯仰 &gt;0）（对应官网 4.2）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/three-d/altitude-line/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/three-d/altitude-line/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/three-d/altitude-line/EscapeImpl.vue';
import MixedImpl from '~/components/example2/three-d/altitude-line/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
