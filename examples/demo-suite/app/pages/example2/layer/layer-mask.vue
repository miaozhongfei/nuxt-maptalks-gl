<template>
  <Example2DemoShell
    description="setMask 跟随鼠标创建遮罩，实现手电筒效果（对应官网 6.6）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/layer/layer-mask/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/layer/layer-mask/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/layer/layer-mask/EscapeImpl.vue';
import MixedImpl from '~/components/example2/layer/layer-mask/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
