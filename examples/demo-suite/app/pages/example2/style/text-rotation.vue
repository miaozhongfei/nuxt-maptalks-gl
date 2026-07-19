<template>
  <Example2DemoShell
    description="textRotation 旋转文字标注（对应官网 5.10）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/style/text-rotation/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/style/text-rotation/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/style/text-rotation/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/style/text-rotation/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
