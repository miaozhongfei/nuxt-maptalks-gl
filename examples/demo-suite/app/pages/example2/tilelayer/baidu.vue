<template>
  <!-- 2.15 百度投影底图 -->
  <Example2DemoShell
    description="baidu 投影空间参考 + 百度在线瓦片（对应官网 2.15；该源在部分网络下可能不可达）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/tilelayer/baidu/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/tilelayer/baidu/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/tilelayer/baidu/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/tilelayer/baidu/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
