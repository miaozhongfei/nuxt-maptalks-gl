<template>
  <!-- 2.10 用base64编码载入瓦片 -->
  <Example2DemoShell
    description="urlTemplate 用函数返回 base64 dataURL，实现无网络瓦片（对应官网 2.10）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/tilelayer/base64-tile/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/tilelayer/base64-tile/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/tilelayer/base64-tile/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/tilelayer/base64-tile/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
