<template>
  <Example2DemoShell
    description="ParticleLayer 粒子图层构造（对应官网 6.15；完全初始化需额外粒子配置）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/components/example2/layer/particle-layer/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
