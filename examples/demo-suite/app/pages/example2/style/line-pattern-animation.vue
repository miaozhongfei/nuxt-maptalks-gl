<template>
  <Example2DemoShell
    description="线模式填充动画（linePatternAnimSpeed，对应官网 5.14；gl 版可能不支持动画）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/demos/example2/style/line-pattern-animation/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
