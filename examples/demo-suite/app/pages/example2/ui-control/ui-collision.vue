<template>
  <Example2DemoShell description="UIMarker.single 碰撞检测——重叠时仅显示一个（对应官网 10.9）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/demos/example2/ui-control/ui-collision/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
