<template>
  <Example2DemoShell
    description="line.animateShow() 渐进渲染路径——相机实时跟踪运动 Marker + isInteracting() 豁免（对应官网 9.8）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/animation/map-follow/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/animation/map-follow/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/animation/map-follow/EscapeImpl.vue';
import MixedImpl from '~/components/example2/animation/map-follow/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
