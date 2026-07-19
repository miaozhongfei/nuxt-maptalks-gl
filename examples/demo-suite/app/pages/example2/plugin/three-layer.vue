<template>
  <Example2DemoShell description="ThreeLayer maptalks.three 3D 图层（对应官网 12.4）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/demos/example2/plugin/three-layer/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
