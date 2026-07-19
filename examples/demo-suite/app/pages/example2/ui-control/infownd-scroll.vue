<template>
  <Example2DemoShell description="InfoWindow 内容溢出滚动（对应官网 10.7）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/demos/example2/ui-control/infownd-scroll/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
