<template>
  <Example2DemoShell
    description="通过 config/setOptions 运行时热更新地图配置——模块 options 在构造后不可变，走逃生舱直调（对应官网 7.1）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/components/example2/util/proxy-options/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
