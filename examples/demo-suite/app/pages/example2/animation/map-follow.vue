<template>
  <Example2DemoShell
    description="animate 地图跟随运动点移动——相机实时跟踪动态 Marker（对应官网 9.8）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/components/example2/animation/map-follow/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
