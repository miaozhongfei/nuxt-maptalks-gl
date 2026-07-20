<template>
  <Example2DemoShell description="序列化一张地图再还原到另一张上——复制地图（对应官网 11.5）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/json/copy-map/ComposableImpl.vue'
import MixedImpl from '~/components/example2/json/copy-map/MixedImpl.vue'
import EscapeImpl from '~/components/example2/json/copy-map/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
