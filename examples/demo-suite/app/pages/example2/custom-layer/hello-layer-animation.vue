<template>
  <Example2DemoShell description="CanvasLayer requestAnimationFrame 动画——弹跳小球（对应官网 14.3）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/demos/example2/custom-layer/hello-layer-animation/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
