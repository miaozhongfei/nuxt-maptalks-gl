<template>
  <Example2DemoShell description="自定义样式的 UIMarker UI 组件（对应官网 13.2）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/demos/example2/custom-plugin/custom-ui/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
