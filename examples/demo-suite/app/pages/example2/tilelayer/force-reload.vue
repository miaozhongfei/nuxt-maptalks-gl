<template>
  <!-- 2.5 Tilelayer强制重载 -->
  <Example2DemoShell
    description="forceReload() 丢弃缓存强制重新拉取当前视野瓦片（对应官网 2.5）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/demos/example2/tilelayer/force-reload/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/tilelayer/force-reload/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/tilelayer/force-reload/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
