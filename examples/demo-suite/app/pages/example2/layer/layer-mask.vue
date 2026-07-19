<template>
  <Example2DemoShell
    description="setMask 用多边形裁剪图层显示（对应官网 6.6）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/demos/example2/layer/layer-mask/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/layer/layer-mask/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/layer/layer-mask/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
